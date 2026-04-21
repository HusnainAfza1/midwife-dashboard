import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";
// import MidwifeA1Booking from "@/models/midwifeA1Booking";
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    try {
        await connect();

        // Get query parameters from URL
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const midwifeId = searchParams.get('midwifeId');

        // Validate required parameters
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "userId is required as query parameter",
                },
                { status: 400 }
            );
        }

        if (!midwifeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId is required as query parameter",
                },
                { status: 400 }
            );
        }

        // Find all bookings for the specific user with the specific midwife
        const bookings = await MidwifeA1Booking.find({
            userId: userId,
            midwifeId: midwifeId
        }).sort({ createdAt: -1 });

        if (!bookings || bookings.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No bookings found for this user with this midwife",
                    data: [],
                    count: bookings.length
                },

            );
        }

        return NextResponse.json({
            success: true,
            message: "User bookings with midwife fetched successfully",
            data: bookings,
            count: bookings.length
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching user bookings:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch user bookings",
            },
            { status: 500 }
        );
    }
}