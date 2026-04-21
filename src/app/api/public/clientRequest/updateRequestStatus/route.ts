import { connect } from "@/dbConfig/dbConfig"
import Request from "@/models/requestModel"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()

        // 1) Validate required fields
        if (!body.requestId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "requestId is required"
                },
                { status: 400 }
            )
        }

        if (!body.status) {
            return NextResponse.json(
                {
                    success: false,
                    message: "status is required"
                },
                { status: 400 }
            )
        }

        // 2) Validate status value
        if (!["pending", "approved", "rejected"].includes(body.status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid status. Must be 'pending', 'approved', or 'rejected'"
                },
                { status: 400 }
            )
        }

        // 3) Find the request
        const existingRequest = await Request.findById(body.requestId)

        if (!existingRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Request not found"
                },
                { status: 404 }
            )
        }

        // 4) Update the status
        existingRequest.status = body.status
        existingRequest.updatedAt = new Date()
        await existingRequest.save()

        return NextResponse.json(
            {
                success: true,
                message: "Request status updated successfully",
                data: existingRequest
            },
            { status: 200 }
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating request status:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to update request status"
            },
            { status: 500 }
        )
    }
}