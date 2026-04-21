import { connect } from "@/dbConfig/dbConfig"
import PreBirthAppointments from "@/models/preBirthAppointments"
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

        // Find appointments with matching midwifeId and clientET within the date range
        const appointments = await PreBirthAppointments.find({
            midwifeId: midwifeId,
            clientET: {
                $gte: nineMonthsBefore,  // Greater than or equal to 9 months before
                $lte: nineMonthsAfter    // Less than or equal to 9 months after
            }
        })

        // Transform appointments into month-grouped format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const monthlyAppointments: any = {}

        appointments.forEach((appointmentDoc) => {
            // Process each appointment type (B1, B2, E1)
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
                            B1: [],
                            B2: [],
                            E1: []
                        }
                    }

                    // Add appointment to the correct month and type
                    monthlyAppointments[monthKey][appointmentType].push(appointment)
                })
            })
        })

        return NextResponse.json(
            {
                success: true,
                message: "Appointments found and grouped successfully",
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
                    totalDocuments: appointments.length,
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