import { connect } from "@/dbConfig/dbConfig"
import Schedule from "@/models/scheduleModel"
import User from "@/models/userModel"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Helper function to convert 24-hour format to 12-hour format
function formatTo12Hour(time: string): string {
    if (!time) return "08:00 AM" // Default value instead of null

    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12

    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${suffix}`
}

// Helper function to ensure all days of the week are included
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ensureAllDays(schedules: any[]) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const result = []

    for (const day of days) {
        const existingSchedule = schedules.find(s => s.day === day)

        if (existingSchedule) {
            // Format the unavailable slots
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedSlots = existingSchedule.unavailableSlots.map((slot: any) => ({
                startTime: formatTo12Hour(slot.from || slot.startTime),
                endTime: formatTo12Hour(slot.to || slot.endTime)
            }))

            result.push({
                day,
                startHour: formatTo12Hour(existingSchedule.startHour),
                endHour: formatTo12Hour(existingSchedule.endHour),
                repeats: existingSchedule.repeats || "Weekly",
                offDay: existingSchedule.offDay || existingSchedule.isOffDay || false,
                unavailableSlots: formattedSlots
            })
        } else {
            // Add default schedule for missing days
            result.push({
                day,
                startHour: "08:00 AM",
                endHour: "05:00 PM",
                repeats: "Weekly",
                offDay: false,
                unavailableSlots: []
            })
        }
    }

    return result
}

export async function GET() {
    try {
        // Find all superusers in the system
        const superusers = await User.find({ role: "superuser" })

        if (superusers.length === 0) {
            return NextResponse.json({ error: "No superusers found in the system" }, { status: 404 })
        }

        // Get all superuser IDs
        const superuserIds = superusers.map(su => su._id)

        // Find all salespersons managed by any of these superusers
        const salespersons = await User.find({
            role: "salesperson",
            managedBy: { $in: superuserIds }
        })

        // Initialize combined result object for all users
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const combinedData: Record<string, any[]> = {}

        // Get superusers' schedules
        const superuserSchedules = await Schedule.find({
            userId: { $in: superuserIds }
        }).populate('userId', 'username')

        // Add superuser schedules to the combined data
        for (const superuser of superusers) {
            const userSchedules = superuserSchedules.filter(
                schedule => schedule.userId._id.toString() === superuser._id.toString()
            )

            // Add to combined data with username as key
            combinedData[superuser.username] = ensureAllDays(userSchedules)
        }

        if (salespersons.length > 0) {
            // Get all schedules for these salespersons
            const allSalespersonSchedules = await Schedule.find({
                userId: { $in: salespersons.map(sp => sp._id) }
            }).populate('userId', 'username')

            // Add salesperson schedules to the combined data
            for (const salesperson of salespersons) {
                const salespersonSchedules = allSalespersonSchedules.filter(
                    schedule => schedule.userId._id.toString() === salesperson._id.toString()
                )

                // Add to combined data with username as key
                combinedData[salesperson.username] = ensureAllDays(salespersonSchedules)
            }
        }

        // Return the combined data with the updated message
        return NextResponse.json({
            message: "Salesperson schedules retrieved successfully",
            success: true,
            data: combinedData
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching schedules:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}