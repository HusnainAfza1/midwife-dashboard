import { connect } from "@/dbConfig/dbConfig";
import { parseLocaleDate } from "@/utils/date";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Define interfaces for our data structure
interface BookedSlot {
    startTime: string;
    endTime: string;
    date: Date;
    by: string;
}

interface DayBookings {
    day: string;
    bookedSlots: BookedSlot[];
}

// Helper function to get day name from date
function getDayName(date: Date): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[date.getDay()]
}

export async function GET(request: NextRequest) {
    try {
        // Ensure database connection is established
        await connect();

        const AppointmentSchema = new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            selectedDate: String,
            startTime: String,
            endTime: String,
            timezone: String,
            name: String,
            email: String,
            phone: String,
            location: String,
            challengeOptions: String,
            challengeDescription: String,
            meetingLink: String,
            status: String,
            createdAt: Date,
        });

        const UserSchema = new mongoose.Schema({
            username: String,
            email: String,
            password: String,
            role: String,
            managedBy: mongoose.Schema.Types.ObjectId,
            createdAt: Date,
            updatedAt: Date,
        });

        const Appointment =
            mongoose.models.Appointments ||
            mongoose.model("Appointments", AppointmentSchema);
        const User = mongoose.models.Users || mongoose.model("Users", UserSchema);

        // Get query parameters
        const url = new URL(request.url)
        const startDateParam = url.searchParams.get("startDate")
        const endDateParam = url.searchParams.get("endDate")

        // Default to current week if no dates provided
        const today = new Date()
        const startDate = startDateParam
            ? parseLocaleDate(startDateParam)
            : new Date(today.setDate(today.getDate() - today.getDay())) // Start of current week (Sunday)

        const endDate = endDateParam
            ? parseLocaleDate(endDateParam)
            : new Date(new Date(startDate).setDate(startDate.getDate() + 6)) // End of week (Saturday)

        // Set time to beginning and end of day
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)

        const allAppointments = await Appointment.find({
            status: { $ne: "cancelled" }
        });

        const appointments = allAppointments.filter(app => {
            const parsedDate = parseLocaleDate(app.selectedDate); // parses "dd/mm/yyyy" to Date
            return parsedDate >= startDate && parsedDate <= endDate;
        });


        // Get all unique userIds from appointments
        const userIdMap: Record<string, boolean> = {};
        const userIds = appointments
            .map((app) => app.userId.toString())
            .filter((id) => {
                if (!userIdMap[id]) {
                    userIdMap[id] = true;
                    return true;
                }
                return false;
            });

        // Fetch all users in one query
        const users = await User.find({ _id: { $in: userIds } });

        // Create a map of userId to username for quick lookup
        const userMap = new Map();
        users.forEach((user) => {
            userMap.set(user._id.toString(), user.username);
        });

        // Initialize result structure with all days of the week
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const result: DayBookings[] = days.map(day => ({
            day,
            bookedSlots: []
        }))

        // Group appointments by day and format
        for (const appointment of appointments) {
            const parsedDate = parseLocaleDate(appointment.selectedDate);
            const dayName = getDayName(parsedDate);
            const dayIndex = days.indexOf(dayName)

            if (dayIndex !== -1) {
                // Get the username from our map, or use a fallback
                const username = userMap.get(appointment.userId.toString()) || "Salesperson";

                // Add to booked slots
                result[dayIndex].bookedSlots.push({
                    startTime: appointment.startTime,
                    endTime: appointment.endTime,
                    date: appointment.selectedDate,
                    by: username,
                })
            }
        }

        return NextResponse.json({
            message: "Booked slots retrieved successfully",
            success: true,
            data: result
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching booked slots:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}