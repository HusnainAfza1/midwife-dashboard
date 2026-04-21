import { connect } from "@/dbConfig/dbConfig"
import PostBirthAppointments from "@/models/postBirthAppointments"
import { type NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic';
// Connect to the database
connect()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const midwifeId = searchParams.get('midwifeId')
        const clientId = searchParams.get('clientId')

        // Validate required parameters
        if (!midwifeId || !clientId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Both midwifeId and clientId are required",
                },
                { status: 400 },
            )
        }

        // Find appointment for the midwife-client pair
        const appointment = await PostBirthAppointments.findOne({
            midwifeId: midwifeId,
            clientId: clientId
        })

        if (!appointment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No post-birth appointment found for this midwife-client pair",
                },
                { status: 404 },
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Post-birth appointment retrieved successfully",
                data: appointment,
            },
            { status: 200 },
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error retrieving post-birth appointment:", error)

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to retrieve post-birth appointment",
            },
            { status: 500 },
        )
    }
}