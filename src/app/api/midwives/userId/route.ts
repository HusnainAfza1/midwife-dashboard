import { connect } from "@/dbConfig/dbConfig"
import Midwife from "@/models/midwifeModel"
import { type NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic';

// Connect to the database
connect()

// GET midwife by userId
export async function GET(request: NextRequest) {
    try {
        // Get URL parameters
        const url = new URL(request.url)
        const userId = url.searchParams.get('userId')

        // Check if userId is provided
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "userId parameter is required",
                },
                { status: 400 }
            )
        }

        // Query for midwife with the specific userId
        const midwife = await Midwife.findOne({ userId: userId })

        // Check if midwife exists
        if (!midwife) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Midwife not found with the provided userId",
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Midwife fetched successfully",
            data: midwife
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching midwife:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch midwife",
            },
            { status: 500 }
        )
    }
}