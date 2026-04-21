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

        // Calculate 3 months before clientET
        const threeMonthsBefore = new Date(clientETDate)
        threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3)

        // Calculate 6 months after clientET
        const sixMonthsAfter = new Date(clientETDate)
        sixMonthsAfter.setMonth(sixMonthsAfter.getMonth() + 6)

        console.log("Date Range:")
        console.log("Client ET:", clientETDate)
        console.log("3 months before:", threeMonthsBefore)
        console.log("6 months after:", sixMonthsAfter)

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
                    $gte: threeMonthsBefore,
                    $lte: sixMonthsAfter
                }
            }),
            PostBirthAppointments.find({
                midwifeId: midwifeId,
                clientET: {
                    $gte: threeMonthsBefore,
                    $lte: sixMonthsAfter
                }
            })
        ])

        // Filter A1 bookings by expectedDeliveryDate range
        const filteredA1Bookings = a1Bookings.filter(booking => {
            const expectedDate = parseDate(booking.expectedDeliveryDate)
            return expectedDate >= threeMonthsBefore && expectedDate <= sixMonthsAfter
        })

        // Transform appointments into month-grouped format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const monthlyAppointments: any = {}

        // Helper function to process appointments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const processAppointments = (appointments: any[], appointmentTypes: string[]) => {
            appointments.forEach((appointmentDoc) => {
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

                        // Add appointment to the correct month and type
                        monthlyAppointments[monthKey][appointmentType].push(appointment)
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

        // Get the ET month key from clientET date
        const etMonth = clientETDate.getMonth() + 1 // getMonth() returns 0-11, so add 1
        const etYear = clientETDate.getFullYear()
        const etDay = clientETDate.getDate()
        const etMonthKey = `${etMonth}/${etYear}`

        // Format clientET to DD/MM/YYYY for comparison
        const formattedClientET = `${String(etDay).padStart(2, '0')}/${String(etMonth).padStart(2, '0')}/${etYear}`

        // Filter appointments for the specific ET date
        const etDayAppointments = {
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

        // Check if ET month exists in monthly appointments
        if (monthlyAppointments[etMonthKey]) {
            const etMonthData = monthlyAppointments[etMonthKey]

            // Filter each appointment type for the exact ET date
            Object.keys(etMonthData).forEach((appointmentType) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                etDayAppointments[appointmentType as keyof typeof etDayAppointments] = etMonthData[appointmentType].filter((appointment: any) =>
                    appointment.appointmentDate === formattedClientET
                )
            })
        }

        // Create bookedSlots array from all appointments on ET day
        const bookedSlots: string[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(etDayAppointments).flat().forEach((appointment: any) => {
            bookedSlots.push(`${appointment.startTime}-${appointment.endTime}`)
        })

        return NextResponse.json(
            {
                success: true,
                message: "Appointments for ET date found successfully",
                data: etDayAppointments,
                bookedSlots: bookedSlots,
                meta: {
                    searchCriteria: {
                        midwifeId,
                        clientET: formattedClientET,
                        clientETDate: clientETDate,
                        dateRange: {
                            from: threeMonthsBefore,
                            to: sixMonthsAfter
                        }
                    },
                    etMonth: etMonthKey,
                    totalA1Bookings: filteredA1Bookings.length,
                    totalPreBirthDocuments: preBirthAppointments.length,
                    totalPostBirthDocuments: postBirthAppointments.length,
                    totalDocumentsInRange: filteredA1Bookings.length + preBirthAppointments.length + postBirthAppointments.length,
                    appointmentsOnETDate: Object.values(etDayAppointments).flat().length
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