import { connect } from "@/dbConfig/dbConfig"
import PreBirthAppointments from "@/models/preBirthAppointments"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Check if appointment document for same midwife-client pair already exists
        const existingAppointment = await PreBirthAppointments.findOne({
            midwifeId: body.midwifeId,
            clientId: body.clientId
        })

        if (existingAppointment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Appointment document for this midwife-client pair already exists",
                },
                { status: 400 },
            )
        }

        // Create new pre-birth appointments document
        const newAppointment = await PreBirthAppointments.create(body)

        return NextResponse.json(
            {
                success: true,
                message: "Pre-birth appointments created successfully",
                data: newAppointment,
            },
            { status: 201 },
        )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating pre-birth appointments:", error)
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validationErrors = Object.values(error.errors).map((err: any) => err.message)
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                },
                { status: 400 },
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create pre-birth appointments",
            },
            { status: 500 },
        )
    }
}