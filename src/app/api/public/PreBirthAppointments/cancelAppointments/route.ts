import PreBirthAppointments from "@/models/preBirthAppointments"
import { connect } from "@/dbConfig/dbConfig"
// import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Helper function to convert DD/MM/YYYY to Date object
const parseAppointmentDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
}

// Helper function to parse time HH:MM to minutes
const parseTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
}

// Cancel prebirth appointments based on date and time
export async function PATCH(request: NextRequest) {
    try {
        // Authorize request - adjust roles as needed
        // const auth = await authorize(request, ["superuser", "midwife", "admin"])
        // if (!auth.success) {
        //     return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        // }

        const reqBody = await request.json()
        const {
            midwifeId,
            clientId,
            date
        }: {
            midwifeId?: string;
            clientId?: string;
            date?: string;
        } = reqBody

        // Validate required fields
        if (!midwifeId || !clientId || !date) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "midwifeId, clientId, and date are required"
            }, { status: 400 })
        }

        // Validate date format
        const currentDateTime = new Date(date)
        if (isNaN(currentDateTime.getTime())) {
            return NextResponse.json({
                error: "Invalid date format",
                details: "Date must be in ISO format (e.g., 2025-09-23T00:00:00.000+00:00)"
            }, { status: 400 })
        }

        // Find prebirth appointment record
        const preBirthRecord = await PreBirthAppointments.findOne({
            midwifeId,
            clientId
        })

        if (!preBirthRecord) {
            return NextResponse.json({
                error: "No appointment found",
                details: "PreBirth appointment record not found for provided midwifeId and clientId"
            }, { status: 404 })
        }

        let cancelledCount = 0
        const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate())
        const currentTimeInMinutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes()

        // Process B1 appointments
        if (preBirthRecord.appointments.B1 && preBirthRecord.appointments.B1.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            preBirthRecord.appointments.B1.forEach((apt: any) => {
                const appointmentDate = parseAppointmentDate(apt.appointmentDate)
                const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate())

                // Check if appointment date is in the future
                if (appointmentDateOnly > currentDate) {
                    if (apt.status !== "cancelled") {
                        apt.status = "cancelled"
                        cancelledCount++
                    }
                }
                // Check if appointment date is today
                else if (appointmentDateOnly.getTime() === currentDate.getTime()) {
                    const appointmentTimeInMinutes = parseTimeToMinutes(apt.startTime)
                    if (appointmentTimeInMinutes > currentTimeInMinutes) {
                        if (apt.status !== "cancelled") {
                            apt.status = "cancelled"
                            cancelledCount++
                        }
                    }
                }
                // If appointment date is in the past, do nothing
            })
        }

        // Process B2 appointments
        if (preBirthRecord.appointments.B2 && preBirthRecord.appointments.B2.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            preBirthRecord.appointments.B2.forEach((apt: any) => {
                const appointmentDate = parseAppointmentDate(apt.appointmentDate)
                const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate())

                if (appointmentDateOnly > currentDate) {
                    if (apt.status !== "cancelled") {
                        apt.status = "cancelled"
                        cancelledCount++
                    }
                }
                else if (appointmentDateOnly.getTime() === currentDate.getTime()) {
                    const appointmentTimeInMinutes = parseTimeToMinutes(apt.startTime)
                    if (appointmentTimeInMinutes > currentTimeInMinutes) {
                        if (apt.status !== "cancelled") {
                            apt.status = "cancelled"
                            cancelledCount++
                        }
                    }
                }
            })
        }

        // Process E1 appointments
        if (preBirthRecord.appointments.E1 && preBirthRecord.appointments.E1.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            preBirthRecord.appointments.E1.forEach((apt: any) => {
                const appointmentDate = parseAppointmentDate(apt.appointmentDate)
                const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate())

                if (appointmentDateOnly > currentDate) {
                    if (apt.status !== "cancelled") {
                        apt.status = "cancelled"
                        cancelledCount++
                    }
                }
                else if (appointmentDateOnly.getTime() === currentDate.getTime()) {
                    const appointmentTimeInMinutes = parseTimeToMinutes(apt.startTime)
                    if (appointmentTimeInMinutes > currentTimeInMinutes) {
                        if (apt.status !== "cancelled") {
                            apt.status = "cancelled"
                            cancelledCount++
                        }
                    }
                }
            })
        }

        // Mark appointments as modified and save
        preBirthRecord.markModified('appointments')
        await preBirthRecord.save()

        return NextResponse.json({
            message: "PreBirth appointments processed successfully",
            success: true,
            data: {
                _id: preBirthRecord._id,
                appointmentsCancelled: cancelledCount,
                appointments: preBirthRecord.appointments
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}