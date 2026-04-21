
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await connect();
        
        const userId = params.userId;
        
        // Find all bookings for the specific user
        const bookings = await MidwifeA1Booking.find({ userId: userId })
            .sort({ createdAt: -1 });
        
        if (!bookings || bookings.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No bookings found for this user",
                },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "User bookings fetched successfully",
            data: bookings,
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