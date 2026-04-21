import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const midwifeId = searchParams.get('midwifeId');
        const expectedDeliveryDate = searchParams.get('expectedDeliveryDate');

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

        if (!expectedDeliveryDate) {
            return NextResponse.json(
                {
                    success: false,
                    message: "expectedDeliveryDate parameter is required (DD/MM/YYYY format)",
                },
                { status: 400 }
            );
        }

        // Validate expectedDeliveryDate format
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!datePattern.test(expectedDeliveryDate)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "expectedDeliveryDate must be in DD/MM/YYYY format",
                },
                { status: 400 }
            );
        }

        // Extract month and year from expectedDeliveryDate
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [day, month, year] = expectedDeliveryDate.split('/');
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        // Validate extracted month and year
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid month in expectedDeliveryDate",
                },
                { status: 400 }
            );
        }

        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 3000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid year in expectedDeliveryDate",
                },
                { status: 400 }
            );
        }

        // Format month to always have 2 digits (01, 02, etc.)
        const formattedMonth = monthNum.toString().padStart(2, '0');

        // Create regex pattern to match expectedDeliveryDate in the same month/year
        // This will match any day in the specified month/year for expectedDeliveryDate field
        const deliveryDatePattern = new RegExp(`^\\d{2}/${formattedMonth}/${yearNum}$`);

        // Find appointments for the midwife where:
        // 1. expectedDeliveryDate is in the same month/year
        // 2. clientStatus is either "pending" or "converted"
        const appointments = await MidwifeA1Booking.find({
            midwifeId: midwifeId,
            expectedDeliveryDate: { $regex: deliveryDatePattern },
            clientStatus: { $in: ["pending", "converted"] }
        }).select('clientStatus expectedDeliveryDate');

        // Count appointments by clientStatus
        const pendingCount = appointments.filter(apt => apt.clientStatus === "pending").length;
        const convertedCount = appointments.filter(apt => apt.clientStatus === "converted").length;
        const totalCount = pendingCount + convertedCount;

        return NextResponse.json({
            success: true,
            data: {
                month: monthNum,
                year: yearNum,
                pendingCount: pendingCount,
                convertedCount: convertedCount,
                totalCount: totalCount,
                inputDeliveryDate: expectedDeliveryDate
            },
            message: "Appointments count retrieved successfully"
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching appointments count:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch appointments count",
            },
            { status: 500 }
        );
    }
}