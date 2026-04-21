import { connect } from "@/dbConfig/dbConfig"
import Midwife from "@/models/midwifeModel"
import { type NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic';
// Connect to the database
connect()

// GET all slogans from midwives
export async function GET(request: NextRequest) {
    try {
        // Get URL parameters
        const url = new URL(request.url)
        const uniqueParam = url.searchParams.get('unique')
        const isUnique = uniqueParam === 'true' || uniqueParam === '1'

        // Query for midwives with non-empty slogans
        const query = {
            "personalInfo.slogan": { $exists: true, $ne: "" }
        }

        // If looking for unique slogans, use aggregation
        if (isUnique) {
            const uniqueSlogans = await Midwife.aggregate([
                { $match: query },
                { $group: { _id: "$personalInfo.slogan" } },
                { $project: { _id: 0, slogan: "$_id" } }
            ])

            const sloganArray = uniqueSlogans.map(item => item.slogan)

            return NextResponse.json({
                success: true,
                message: "Unique slogans fetched successfully",
                count: sloganArray.length,
                data: sloganArray
            })
        } 
        // Otherwise, get all slogans (including duplicates)
        else {
            const midwives = await Midwife.find(query).select("personalInfo.slogan -_id")
            const sloganArray = midwives.map(midwife => midwife.personalInfo.slogan)

            return NextResponse.json({
                success: true,
                message: "All slogans fetched successfully",
                count: sloganArray.length,
                data: sloganArray
            })
        }    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching slogans:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch slogans",
            },
            { status: 500 }
        )
    }
}