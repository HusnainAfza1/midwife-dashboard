import { connect } from "@/dbConfig/dbConfig"
import MidwifeA1Booking from "@/models/midwifeA1Booking";
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()
        const { userId, midwifeId, plan } = body

        // Validate required fields
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "userId is required",
                },
                { status: 400 },
            )
        }

        if (!midwifeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId is required",
                },
                { status: 400 },
            )
        }

        if (!plan) {
            return NextResponse.json(
                {
                    success: false,
                    message: "plan is required",
                },
                { status: 400 },
            )
        }

        // Validate plan value
        if (plan !== "Prebirth" && plan !== "Postbirth") {
            return NextResponse.json(
                {
                    success: false,
                    message: "plan must be either 'Prebirth' or 'Postbirth'",
                },
                { status: 400 },
            )
        }

        // Find and update the booking
        const updatedBooking = await MidwifeA1Booking.findOneAndUpdate(
            {
                userId: userId,
                midwifeId: midwifeId
            },
            {
                CurrentPlan: plan
            },
            {
                new: true
            }
        )

        if (!updatedBooking) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Booking not found for the given userId and midwifeId",
                },
                { status: 404 },
            )
        }

        return NextResponse.json({
            success: true,
            message: "Current plan updated successfully",
            data: updatedBooking,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 },
        )
    }
}