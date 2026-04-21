import { connect } from "@/dbConfig/dbConfig"
import Schedule from "@/models/scheduleModel"
import User from "@/models/userModel"
import mongoose from "mongoose"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Get schedules based on user role
export async function GET(request: NextRequest) {
    try {
        // Get user from request headers (set by middleware)
        const userJson = request.headers.get("user")
        if (!userJson) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = JSON.parse(userJson)

        // Get query parameters
        const url = new URL(request.url)
        const userIdParam = url.searchParams.get("userId")
        const includeAll = url.searchParams.get("includeAll") === "true"

        let schedules = []

        // If the user is a superuser
        if (user.role === "superuser") {
            if (userIdParam) {
                // Check if the requested user is managed by this superuser
                const requestedUser = await User.findById(userIdParam)

                if (!requestedUser) {
                    return NextResponse.json({ error: "User not found" }, { status: 404 })
                }

                // Check if the superuser manages this salesperson
                if (requestedUser.role === "salesperson" &&
                    requestedUser.managedBy &&
                    requestedUser.managedBy.toString() === user.id) {
                    // Get schedules for the specific salesperson
                    schedules = await Schedule.find({ userId: userIdParam })
                        .populate('userId', 'username email') // Add populate here
                } else {
                    return NextResponse.json({
                        error: "You don't have permission to view this user's schedules"
                    }, { status: 403 })
                }
            } else if (includeAll) {
                // Only if includeAll=true, get schedules for all managed salespersons and the superuser
                const managedUsers = await User.find({
                    managedBy: new mongoose.Types.ObjectId(user.id),
                    role: "salesperson"
                })

                const managedUserIds = managedUsers.map(u => u._id)

                // Get schedules for all managed salespersons and the superuser's own schedules
                schedules = await Schedule.find({
                    userId: { $in: [...managedUserIds, user.id] }
                }).populate('userId', 'username email')
            } else {
                // By default, only get the superuser's own schedules
                schedules = await Schedule.find({ userId: user.id })
                    .populate('userId', 'username email') // Add populate here
            }
        } else {
            // For salesperson, only get their own schedules
            schedules = await Schedule.find({ userId: user.id })
                .populate('userId', 'username email') // Add populate here
        }

        // Format the response to match the expected frontend format
        const formattedSchedules = schedules.map((schedule) => ({
            id: schedule._id,
            userId: schedule.userId._id || schedule.userId,
            username: schedule.userId.username || null,
            day: schedule.day,
            startHour: schedule.isOffDay ? null : schedule.startHour,
            endHour: schedule.isOffDay ? null : schedule.endHour,
            repeats: schedule.repeat.charAt(0).toUpperCase() + schedule.repeat.slice(1),
            offDay: schedule.isOffDay,
            unavailableSlots: schedule.unavailableSlots || []
        }))

        // For a single user, ensure all days of the week are included
        if (userIdParam || user.role === "salesperson" || !includeAll) {
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            const weeklySchedule = days.map((day) => {
                const existingSchedule = formattedSchedules.find((s) => s.day === day)
                if (existingSchedule) {
                    return existingSchedule
                }

                // For days without a schedule, create a placeholder with the user's info
                return {
                    id: `temp_${day.toLowerCase()}`,
                    day,
                    startHour: null,
                    endHour: null,
                    repeats: "Weekly",
                    offDay: true,
                    userId: userIdParam || user.id,
                    username: user.username, // Add the username for placeholder days
                    unavailableSlots: []
                }
            })

            return NextResponse.json({
                message: "Schedules retrieved successfully",
                success: true,
                data: weeklySchedule,
            })
        }

        return NextResponse.json({
            message: "Schedules retrieved successfully",
            success: true,
            data: formattedSchedules,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching schedules:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Create or update weekly schedule
export async function POST(request: NextRequest) {
    try {
        const weeklySchedule = await request.json()

        // Get user from request headers (set by middleware)
        const userJson = request.headers.get("user")
        if (!userJson) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = JSON.parse(userJson)

        // Get the target user ID (either from request or the current user)
        const targetUserId = weeklySchedule?.userId || user.id

        // If the user is trying to update someone else's schedule
        if (targetUserId !== user.id) {
            // Only superusers can update other users' schedules
            if (user.role !== "superuser") {
                return NextResponse.json({
                    error: "You don't have permission to update this user's schedule"
                }, { status: 403 })
            }

            // Check if the target user is managed by this superuser
            const targetUser = await User.findById(targetUserId)

            if (!targetUser) {
                return NextResponse.json({ error: "Target user not found" }, { status: 404 })
            }

            if (targetUser.role === "salesperson" &&
                targetUser.managedBy &&
                targetUser.managedBy.toString() !== user.id) {
                return NextResponse.json({
                    error: "You don't have permission to update this user's schedule"
                }, { status: 403 })
            }
        }

        // Validate input
        if (!Array.isArray(weeklySchedule?.weeklySchedule) || weeklySchedule.weeklySchedule.length !== 7) {
            return NextResponse.json(
                {
                    error: "Weekly schedule must be an array with 7 days",
                },
                { status: 400 },
            )
        }

        // Validate each day's schedule
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for (const schedule of weeklySchedule.weeklySchedule) {
            if (!schedule.day || !days.includes(schedule.day)) {
                return NextResponse.json(
                    {
                        error: `Invalid day: ${schedule.day}. Must be one of ${days.join(", ")}`,
                    },
                    { status: 400 },
                )
            }

            if (schedule.offDay === undefined) {
                return NextResponse.json(
                    {
                        error: `offDay field is required for ${schedule.day}`,
                    },
                    { status: 400 },
                )
            }

            if (!schedule.offDay && (!schedule.startHour || !schedule.endHour)) {
                return NextResponse.json(
                    {
                        error: `startHour and endHour are required for working days (${schedule.day})`,
                    },
                    { status: 400 },
                )
            }

            // Validate unavailableSlots if provided
            if (schedule.unavailableSlots && !Array.isArray(schedule.unavailableSlots)) {
                return NextResponse.json(
                    {
                        error: `unavailableSlots must be an array for ${schedule.day}`,
                    },
                    { status: 400 },
                )
            }

            // Validate each unavailableSlot
            if (schedule.unavailableSlots && Array.isArray(schedule.unavailableSlots)) {
                for (const slot of schedule.unavailableSlots) {
                    if (!slot.from || !slot.to) {
                        return NextResponse.json(
                            {
                                error: `Each unavailableSlot must have 'from' and 'to' properties for ${schedule.day}`,
                            },
                            { status: 400 },
                        )
                    }
                }
            }
        }

        // Delete existing schedules for the target user
        await Schedule.deleteMany({ userId: targetUserId })

        // Create new schedules
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const schedulePromises = weeklySchedule.weeklySchedule.map((schedule: any) => {
            // Convert 12-hour format to 24-hour format if needed
            let startHour = schedule.startHour
            let endHour = schedule.endHour

            if (!schedule.offDay && startHour && endHour) {
                // Check if time is in 12-hour format (contains AM/PM)
                if (typeof startHour === "string" && (startHour.includes("AM") || startHour.includes("PM"))) {
                    startHour = convert12To24Hour(startHour)
                }

                if (typeof endHour === "string" && (endHour.includes("AM") || endHour.includes("PM"))) {
                    endHour = convert12To24Hour(endHour)
                }
            }

            // Process unavailableSlots if they exist
            let unavailableSlots = []
            if (schedule.unavailableSlots && Array.isArray(schedule.unavailableSlots)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                unavailableSlots = schedule.unavailableSlots.map((slot: any) => {
                    // Convert times to 24-hour format if needed
                    let from = slot.from
                    let to = slot.to

                    if (typeof from === "string" && (from.includes("AM") || from.includes("PM"))) {
                        from = convert12To24Hour(from)
                    }

                    if (typeof to === "string" && (to.includes("AM") || to.includes("PM"))) {
                        to = convert12To24Hour(to)
                    }

                    return { from, to }
                })
            }

            const newSchedule = new Schedule({
                userId: targetUserId,
                day: schedule.day,
                isOffDay: schedule.offDay,
                startHour: schedule.offDay ? null : startHour,
                endHour: schedule.offDay ? null : endHour,
                repeat: (schedule.repeats || "Weekly").toLowerCase(),
                unavailableSlots: schedule.offDay ? [] : unavailableSlots
            })

            return newSchedule.save()
        })

        const savedSchedules = await Promise.all(schedulePromises)

        // Format the response to match the expected frontend format
        const formattedSchedules = savedSchedules.map((schedule) => ({
            id: schedule._id,
            userId: schedule.userId,
            day: schedule.day,
            startHour: schedule.isOffDay ? null : schedule.startHour,
            endHour: schedule.isOffDay ? null : schedule.endHour,
            repeats: schedule.repeat.charAt(0).toUpperCase() + schedule.repeat.slice(1), // Capitalize first letter
            offDay: schedule.isOffDay,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unavailableSlots: schedule.unavailableSlots.map((slot: any) => ({
                from: slot.from,
                to: slot.to
            }))
        }))

        return NextResponse.json({
            message: "Weekly schedule updated successfully",
            success: true,
            data: formattedSchedules,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating schedule:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Helper function to convert 12-hour time format to 24-hour format
function convert12To24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(" ")
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(":")

    if (hours === "12") {
        hours = "00"
    }

    if (modifier === "PM") {
        hours = (Number.parseInt(hours, 10) + 12).toString()
    }

    return `${hours}:${minutes}`
}