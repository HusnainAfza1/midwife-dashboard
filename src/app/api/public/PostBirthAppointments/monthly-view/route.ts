import { connect } from "@/dbConfig/dbConfig"
import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import MidwifeA1Booking from "@/models/midwifeA1Booking"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { midwifeId, clientET } = body

        // Validation
        if (!midwifeId || !clientET) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId and clientET are required",
                },
                { status: 400 },
            )
        }

        // Convert clientET to Date object
        const clientETDate = new Date(clientET)

        // Calculate 9 months before clientET
        const nineMonthsBefore = new Date(clientETDate)
        nineMonthsBefore.setMonth(nineMonthsBefore.getMonth() - 9)

        // Calculate 9 months after clientET
        const nineMonthsAfter = new Date(clientETDate)
        nineMonthsAfter.setMonth(nineMonthsAfter.getMonth() + 9)

        console.log("Date Range:")
        console.log("Client ET:", clientETDate)
        console.log("9 months before:", nineMonthsBefore)
        console.log("9 months after:", nineMonthsAfter)

        // Helper function to parse DD/MM/YYYY to Date object
        const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split('/')
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        }

        // Find A1/A2 bookings, pre-birth and post-birth appointments
        const [a1Bookings, preBirthAppointments, postBirthAppointments] = await Promise.all([
            MidwifeA1Booking.find({
                midwifeId: midwifeId
            }),
            PreBirthAppointments.find({
                midwifeId: midwifeId,
                clientET: {
                    $gte: nineMonthsBefore,
                    $lte: nineMonthsAfter
                }
            }),
            PostBirthAppointments.find({
                midwifeId: midwifeId,
                clientET: {
                    $gte: nineMonthsBefore,
                    $lte: nineMonthsAfter
                }
            })
        ])

        // Filter A1 bookings by expectedDeliveryDate range
        const filteredA1Bookings = a1Bookings.filter(booking => {
            const expectedDate = parseDate(booking.expectedDeliveryDate)
            return expectedDate >= nineMonthsBefore && expectedDate <= nineMonthsAfter
        })

        // Transform appointments into month-grouped format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const monthlyAppointments: any = {}

        // Helper function to process appointments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const processAppointments = (appointments: any[], appointmentTypes: string[]) => {
            appointments.forEach((appointmentDoc) => {

                const { midwifeId, clientId } = appointmentDoc;
                // Process each appointment type
                Object.keys(appointmentDoc.appointments).forEach((appointmentType) => {
                    const appointmentList = appointmentDoc.appointments[appointmentType]

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentList.forEach((appointment: any) => {
                        // Parse appointmentDate from DD/MM/YYYY string format
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const [day, month, year] = appointment.appointmentDate.split('/')

                        // Create month key in M/YYYY format
                        const monthKey = `${parseInt(month)}/${year}`

                        // Initialize month object if it doesn't exist
                        if (!monthlyAppointments[monthKey]) {
                            monthlyAppointments[monthKey] = {
                                // A1/A2 at the top
                                "A1/A2": [],
                                // Pre-birth appointment types
                                B1: [],
                                B2: [],
                                E1: [],
                                // Post-birth appointment types
                                C1: [],
                                C2: [],
                                D1: [],
                                D2: [],
                                F1: []
                            }
                        }

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const plainAppointment: any = {
                            midwifeId: midwifeId,
                            clientId: clientId,
                            appointmentId: appointment.appointmentId,
                            appointmentDate: appointment.appointmentDate,
                            startTime: appointment.startTime,
                            endTime: appointment.endTime,
                            duration: appointment.duration,
                            status: appointment.status,
                            serviceCode: appointmentType
                        }

                        // Add classId and classNo for E1 and F1 types
                        if (appointmentType === 'E1' || appointmentType === 'F1') {
                            plainAppointment.classId = appointment.classId
                            plainAppointment.classNo = appointment.classNo
                        }

                        // Add appointment to the correct month and type
                        monthlyAppointments[monthKey][appointmentType].push(plainAppointment)
                        // monthlyAppointments[monthKey][appointmentType].push({
                        //     midwifeId: midwifeId,
                        //     clientId: clientId,
                        //     ...appointment // Spread the existing appointment properties
                        // })
                    })
                })
            })
        }

        // Process A1/A2 bookings
        filteredA1Bookings.forEach((booking) => {
            // Parse date from DD/MM/YYYY string format
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [day, month, year] = booking.date.split('/')

            // Create month key in M/YYYY format
            const monthKey = `${parseInt(month)}/${year}`

            // Initialize month object if it doesn't exist
            if (!monthlyAppointments[monthKey]) {
                monthlyAppointments[monthKey] = {
                    "A1/A2": [],
                    B1: [],
                    B2: [],
                    E1: [],
                    C1: [],
                    C2: [],
                    D1: [],
                    D2: [],
                    F1: []
                }
            }

            // Extract start time, end time, and calculate duration from selectedSlot
            const [startTime, endTime] = booking.selectedSlot.split('-')

            // Calculate duration in minutes
            const [startHour, startMinute] = startTime.split(':').map(Number)
            const [endHour, endMinute] = endTime.split(':').map(Number)
            const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)

            // Transform and add A1/A2 booking to monthly appointments
            monthlyAppointments[monthKey]["A1/A2"].push({
                midwifeId: booking.midwifeId,
                clientId: booking.userId,
                appointmentId: booking._id,
                appointmentDate: booking.date,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                status: booking.status
            })
        })

        // Process pre-birth appointments (B1, B2, E1)
        processAppointments(preBirthAppointments, ['B1', 'B2', 'E1'])

        // Process post-birth appointments (C1, C2, D1, D2, F1)
        processAppointments(postBirthAppointments, ['C1', 'C2', 'D1', 'D2', 'F1'])

        return NextResponse.json(
            {
                success: true,
                message: "All appointments found and grouped successfully",
                data: monthlyAppointments,
                meta: {
                    searchCriteria: {
                        midwifeId,
                        clientET: clientETDate,
                        dateRange: {
                            from: nineMonthsBefore,
                            to: nineMonthsAfter
                        }
                    },
                    totalA1Bookings: filteredA1Bookings.length,
                    totalPreBirthDocuments: preBirthAppointments.length,
                    totalPostBirthDocuments: postBirthAppointments.length,
                    totalDocuments: filteredA1Bookings.length + preBirthAppointments.length + postBirthAppointments.length,
                    monthsFound: Object.keys(monthlyAppointments).length
                }
            },
            { status: 200 },
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error finding appointments:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to find appointments",
            },
            { status: 500 },
        )
    }
}