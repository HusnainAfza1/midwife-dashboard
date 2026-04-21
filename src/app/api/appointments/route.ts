import { connect } from "@/dbConfig/dbConfig"
import Appointment from "@/models/appointmentModel"
import User from "@/models/userModel"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

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
        const status = url.searchParams.get("status")
        const startDate = url.searchParams.get("startDate")
        const endDate = url.searchParams.get("endDate")

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}

        // Add status filter if provided
        if (status) {
            query.status = status
        }

        // Add date range filter if provided
        if (startDate || endDate) {
            query.selectedDate = {}
            if (startDate) {
                query.selectedDate.$gte = new Date(startDate)
            }
            if (endDate) {
                query.selectedDate.$lte = new Date(endDate)
            }
        }

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
                    // Get appointments for the specific salesperson
                    query.userId = new mongoose.Types.ObjectId(userIdParam)
                } else {
                    return NextResponse.json({
                        error: "You don't have permission to view this user's appointments"
                    }, { status: 403 })
                }
            } else {
                // Get all appointments for the superuser and their managed salespersons
                const managedUsers = await User.find({
                    managedBy: new mongoose.Types.ObjectId(user.id),
                    role: "salesperson"
                })

                const userIds = [user.id, ...managedUsers.map(u => u._id.toString())]
                query.userId = { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) }
            }
        } else {
            // For salesperson, only get their own appointments
            query.userId = new mongoose.Types.ObjectId(user.id)
        }

        // Get appointments
        const appointments = await Appointment.find(query)
            .populate('userId', 'username email')
            .sort({ selectedDate: 1, startTime: 1 })

        // Format the response
        const formattedAppointments = appointments.map(appointment => ({
            id: appointment._id,
            userId: appointment.userId._id,
            username: appointment.userId.username,
            selectedDate: appointment.selectedDate,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            timezone: appointment.timezone,
            name: appointment.name,
            email: appointment.email,
            phone: appointment.phone,
            location: appointment.location,
            challengeOptions: appointment.challengeOptions,
            challengeDescription: appointment.challengeDescription,
            meetingLink: appointment.meetingLink,
            status: appointment.status,
            createdAt: appointment.createdAt
        }))

        return NextResponse.json({
            message: "Appointments retrieved successfully",
            success: true,
            data: formattedAppointments
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching appointments:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}