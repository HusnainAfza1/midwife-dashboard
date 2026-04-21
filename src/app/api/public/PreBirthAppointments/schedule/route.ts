import { connect } from "@/dbConfig/dbConfig"
import PreBirthAppointments from "@/models/preBirthAppointments"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { status, midwifeId } = body

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}

        // Filter by status (required parameter)
        query.bookingStatus = status

        // Optional: filter by specific midwife if provided
        if (midwifeId) {
            query.midwifeId = midwifeId
        }

        // Find all appointments matching the criteria
        const appointments = await PreBirthAppointments.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean() // Return plain JavaScript objects for better performance  
        // Check if no appointments found
        if (appointments.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: "No appointments found",
                    data: [],
                    count: 0
                },
                { status: 200 }
            )
        }

        // Transform data to include computed fields
        const transformedAppointments = appointments.map(appointment => {
            // Calculate total appointments count
            const totalAppointments = Object.values(appointment.appointments || {})
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0)

            return {
                ...appointment,
                totalAppointments,
                // Note: clientName and midwifeName will be populated on frontend
                // by fetching midwife names and client details separately
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: "Appointments fetched successfully",
                data: transformedAppointments,
                count: transformedAppointments.length
            },
            { status: 200 },
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching appointments:", error)

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch appointments",
            },
            { status: 500 },
        )
    }
}