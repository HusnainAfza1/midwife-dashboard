// app/api/midwife-bookings/booked-dates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const midwifeId = searchParams.get('midwifeId');
        const year = searchParams.get('year');
        const month = searchParams.get('month');

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

        if (!year) {
            return NextResponse.json(
                {
                    success: false,
                    message: "year parameter is required",
                },
                { status: 400 }
            );
        }

        if (!month) {
            return NextResponse.json(
                {
                    success: false,
                    message: "month parameter is required (1-12)",
                },
                { status: 400 }
            );
        }

        // Validate year and month
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 3000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid year format",
                },
                { status: 400 }
            );
        }

        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid month. Must be between 1-12",
                },
                { status: 400 }
            );
        }

        // Format month to always have 2 digits (01, 02, etc.)
        const formattedMonth = monthNum.toString().padStart(2, '0');

        // Create regex pattern to match dates in the format DD/MM/YYYY for the specific month and year
        // This will match any day in the specified month/year
        const datePattern = new RegExp(`^\\d{2}/${formattedMonth}/${yearNum}$`);

        // Find all bookings for the specific midwife in the specified month/year
        const bookings = await MidwifeA1Booking.find({
            midwifeId: midwifeId,
            date: { $regex: datePattern }
        }).select('date');

        // Extract unique dates (remove duplicates if multiple appointments on same date)
        const allDates = bookings.map(booking => booking.date);
        const bookedDates = Array.from(new Set(allDates));

        // Sort dates for better readability
        bookedDates.sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('/').map(Number);
            const [dayB, monthB, yearB] = b.split('/').map(Number);

            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);

            return dateA.getTime() - dateB.getTime();
        });

        return NextResponse.json({
            success: true,
            data: {
                bookedDates: bookedDates,
                totalBookedDates: bookedDates.length,
                month: monthNum,
                year: yearNum
            },
            message: "Booked dates retrieved successfully"
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching booked dates:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch booked dates",
            },
            { status: 500 }
        );
    }
}