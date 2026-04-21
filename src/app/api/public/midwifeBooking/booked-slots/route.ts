// app/api/midwife-bookings/booked-slots/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const midwifeId = searchParams.get('midwifeId');
        const date = searchParams.get('date'); // Expected in DD/MM/YYYY format

        // Validate required parameters
        if (!midwifeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId parameter is required",
                },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Date parameter is required in DD/MM/YYYY format",
                },
                { status: 400 }
            );
        }

        // Validate date format
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid date format. Expected DD/MM/YYYY format",
                },
                { status: 400 }
            );
        }

        // Find all bookings for the specific midwife on the specific date
        const bookings = await MidwifeA1Booking.find({
            midwifeId: midwifeId,
            date: date
        }).select('selectedSlot');

        // Extract only the booked slots
        const bookedSlots = bookings.map(booking => booking.selectedSlot);

        return NextResponse.json({
            success: true,
            data: {
                bookedSlots: bookedSlots
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching booked slots:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch booked slots",
            },
            { status: 500 }
        );
    }
}