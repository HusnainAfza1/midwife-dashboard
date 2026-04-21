import { connect } from "@/dbConfig/dbConfig"
import Midwife from "@/models/midwifeModel"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function GET(request: NextRequest) {
    try {
        // Get the URL object from the request
        const url = new URL(request.url)
        
        // Extract the id from query parameters
        const id = url.searchParams.get("id")
        
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID parameter is required",
                },
                { status: 400 },
            )
        }
        
        // Find midwife by ID
        const midwife = await Midwife.findById(id)
            .select("-personalInfo.profileImage.data -personalInfo.logo.data")
        
        if (!midwife) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Midwife not found",
                },
                { status: 404 },
            )
        }
        
        return NextResponse.json({
            success: true,
            message: "Midwife fetched successfully",
            data: midwife,
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