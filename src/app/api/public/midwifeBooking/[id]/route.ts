// app/api/midwife-bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        
        const midwifeId = params.id;
        
        // Find all bookings for the specific midwife
        const bookings = await MidwifeA1Booking.find({ midwifeId: midwifeId })
            .sort({ createdAt: -1 });
        
        if (!bookings || bookings.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No bookings found for this midwife",
                },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings,
        });
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching midwife bookings:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch bookings",
            },
            { status: 500 }
        );
    }
}