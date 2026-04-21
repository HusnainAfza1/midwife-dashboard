// File: app/api/schedules/user/[userId]/route.ts
import { connect } from "@/dbConfig/dbConfig"
import Schedule from "@/models/scheduleModel"
import User from "@/models/userModel"
import mongoose from "mongoose"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Get schedules for a specific user (for superusers)
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const targetUserId = params.userId

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
        }

        // Get user from request headers (set by middleware)
        const userJson = request.headers.get("user")
        if (!userJson) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = JSON.parse(userJson)

        // Only superusers can access this endpoint
        if (user.role !== "superuser") {
            return NextResponse.json({
                error: "You don't have permission to access this resource"
            }, { status: 403 })
        }

        // Check if the target user exists and is managed by this superuser
        const targetUser = await User.findById(targetUserId)

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // If target user is a salesperson, check if they're managed by this superuser
        if (targetUser.role === "salesperson" &&
            targetUser.managedBy &&
            targetUser.managedBy.toString() !== user.id) {
            return NextResponse.json({
                error: "You don't have permission to view this user's schedules"
            }, { status: 403 })
        }

        // Find all schedules for the target user
        const schedules = await Schedule.find({ userId: targetUserId })

        // Format the response to match the expected frontend format
        const formattedSchedules = schedules.map((schedule) => ({
            id: schedule._id, // Make sure to include the ID
            userId: schedule.userId,
            day: schedule.day,
            startHour: schedule.isOffDay ? null : schedule.startHour,
            endHour: schedule.isOffDay ? null : schedule.endHour,
            repeats: schedule.repeat.charAt(0).toUpperCase() + schedule.repeat.slice(1), // Capitalize first letter
            offDay: schedule.isOffDay,
            unavailableSlots: schedule.unavailableSlots || []
        }))

        // Ensure all days of the week are included
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const weeklySchedule = days.map((day) => {
            const existingSchedule = formattedSchedules.find((s) => s.day === day)
            if (existingSchedule) {
                return existingSchedule
            }

            // For days without a schedule, create a placeholder with a temporary ID
            // This ensures consistent format with the POST response
            return {
                id: `temp_${day.toLowerCase()}`, // Add a temporary ID for consistency
                day,
                startHour: null,
                endHour: null,
                repeats: "Weekly",
                offDay: true,
                userId: targetUserId,
                unavailableSlots: []
            }
        })

        return NextResponse.json({
            message: "Schedules retrieved successfully",
            success: true,
            data: weeklySchedule,
            user: {
                id: targetUser._id,
                username: targetUser.username,
                email: targetUser.email,
                role: targetUser.role
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching user schedules:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}