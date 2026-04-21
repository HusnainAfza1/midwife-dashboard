import { connect } from "@/dbConfig/dbConfig";
import Schedule from "@/models/scheduleModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

connect()

// Check if user has permission to access a schedule
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function hasPermission(user: any, scheduleId: any) {
    // Find the schedule
    const schedule = await Schedule.findById(scheduleId)

    if (!schedule) {
        return { hasAccess: false, error: "Schedule not found", status: 404 }
    }

    // If user is the owner of the schedule
    if (schedule.userId.toString() === user.id) {
        return { hasAccess: true, schedule }
    }

    // If user is a superuser
    if (user.role === "superuser") {
        // Check if the schedule belongs to a salesperson managed by this superuser
        const scheduleOwner = await User.findById(schedule.userId)

        if (scheduleOwner &&
            scheduleOwner.role === "salesperson" &&
            scheduleOwner.managedBy &&
            scheduleOwner.managedBy.toString() === user.id) {
            return { hasAccess: true, schedule }
        }
    }

    return {
        hasAccess: false,
        error: "You don't have permission to access this schedule",
        status: 403
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

// Get a specific schedule
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const scheduleId = params.id

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
            return NextResponse.json({ error: "Invalid schedule ID" }, { status: 400 })
        }

        // Get user from request headers (set by middleware)
        const userJson = request.headers.get("user")
        if (!userJson) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = JSON.parse(userJson)

        // Check permission
        const { hasAccess, error, status, schedule } = await hasPermission(user, scheduleId)

        if (!hasAccess) {
            return NextResponse.json({ error }, { status })
        }

        // Format response to match frontend expectations
        const formattedSchedule = {
            id: schedule._id,
            userId: schedule.userId,
            day: schedule.day,
            startHour: schedule.isOffDay ? null : schedule.startHour,
            endHour: schedule.isOffDay ? null : schedule.endHour,
            repeats: schedule.repeat.charAt(0).toUpperCase() + schedule.repeat.slice(1),
            offDay: schedule.isOffDay,
            unavailableSlots: schedule.unavailableSlots || []
        }

        return NextResponse.json({
            message: "Schedule retrieved successfully",
            success: true,
            data: formattedSchedule,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching schedule:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Update a schedule
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const scheduleId = params.id
        const reqBody = await request.json()
        const { day, offDay, startHour, endHour, repeats, unavailableSlots } = reqBody

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
            return NextResponse.json({ error: "Invalid schedule ID" }, { status: 400 })
        }

        // Get user from request headers (set by middleware)
        const userJson = request.headers.get("user")
        if (!userJson) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = JSON.parse(userJson)

        // Check permission
        const { hasAccess, error, status, schedule } = await hasPermission(user, scheduleId)

        if (!hasAccess) {
            return NextResponse.json({ error }, { status })
        }

        // Validate input
        if (offDay === false && (!startHour || !endHour)) {
            return NextResponse.json({ error: "Start hour and end hour are required for working days" }, { status: 400 })
        }

        // Convert times if needed
        let processedStartHour = startHour
        let processedEndHour = endHour

        if (!offDay && startHour && typeof startHour === "string" && (startHour.includes("AM") || startHour.includes("PM"))) {
            processedStartHour = convert12To24Hour(startHour)
        }

        if (!offDay && endHour && typeof endHour === "string" && (endHour.includes("AM") || endHour.includes("PM"))) {
            processedEndHour = convert12To24Hour(endHour)
        }

        // Process unavailableSlots
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let processedUnavailableSlots: any = []

        if (!offDay && unavailableSlots && Array.isArray(unavailableSlots)) {
            processedUnavailableSlots = unavailableSlots.map(slot => {
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

        // Update schedule
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            {
                day: day || schedule.day,
                isOffDay: offDay !== undefined ? offDay : schedule.isOffDay,
                startHour: offDay ? null : processedStartHour || schedule.startHour,
                endHour: offDay ? null : processedEndHour || schedule.endHour,
                repeat: (repeats || schedule.repeat).toLowerCase(),
                unavailableSlots: offDay ? [] : processedUnavailableSlots,
                updatedAt: Date.now(),
            },
            { new: true },
        )

        // Format response
        const formattedSchedule = {
            id: updatedSchedule._id,
            userId: updatedSchedule.userId,
            day: updatedSchedule.day,
            startHour: updatedSchedule.isOffDay ? null : updatedSchedule.startHour,
            endHour: updatedSchedule.isOffDay ? null : updatedSchedule.endHour,
            repeats: updatedSchedule.repeat.charAt(0).toUpperCase() + updatedSchedule.repeat.slice(1),
            offDay: updatedSchedule.isOffDay,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unavailableSlots: updatedSchedule.unavailableSlots.map((slot: any) => ({
                from: slot.from,
                to: slot.to
            }))
        }

        return NextResponse.json({
            message: "Schedule updated successfully",
            success: true,
            data: formattedSchedule,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating schedule:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Delete a schedule
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const scheduleId = params.id

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
            return NextResponse.json({ error: "Invalid schedule ID" }, { status: 400 })
        }

        // Get user from request headers (set by middleware)
        const userJson = request.headers.get("user")
        if (!userJson) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = JSON.parse(userJson)

        // Check permission
        const { hasAccess, error, status } = await hasPermission(user, scheduleId)

        if (!hasAccess) {
            return NextResponse.json({ error }, { status })
        }

        // Delete schedule
        await Schedule.findByIdAndDelete(scheduleId)

        return NextResponse.json({
            message: "Schedule deleted successfully",
            success: true,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting schedule:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}