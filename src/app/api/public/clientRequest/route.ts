import { connect } from "@/dbConfig/dbConfig"
import Request from "@/models/requestModel" // Adjust the path based on where you save the model
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // 1) Validate required fields (including new current fields)
        const required = [
            "requestType", 
            "midwifeId", 
            "clientId", 
            "serviceCode", 
            "appointmentId",
            "currentDate",
            "currentStartTime",
            "currentEndTime"
        ]
        const missing = required.filter((field) => !body[field])

        if (missing.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Missing required fields: ${missing.join(", ")}`
                },
                { status: 400 }
            )
        }

        // 2) Validate requestType
        if (!["edit", "cancelled"].includes(body.requestType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid requestType. Must be 'edit' or 'cancelled'"
                },
                { status: 400 }
            )
        }

        // 3) If requestType is "edit", validate suggested fields are present
        if (body.requestType === "edit") {
            const editRequired = ["suggestedDate", "suggestedStartTime", "suggestedEndTime"]
            const editMissing = editRequired.filter((field) => !body[field])

            if (editMissing.length > 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `For edit requests, these fields are required: ${editMissing.join(", ")}`
                    },
                    { status: 400 }
                )
            }
        }

        // 4) If requestType is "cancelled", set suggested fields to null
        if (body.requestType === "cancelled") {
            body.suggestedDate = null
            body.suggestedStartTime = null
            body.suggestedEndTime = null
        }

        // 5) Check for duplicate pending request (same appointment + same requestType + pending status)
        const existingRequest = await Request.findOne({
            appointmentId: body.appointmentId,
            requestType: body.requestType,
            status: "pending"
        })

        if (existingRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message: `A pending ${body.requestType} request already exists for this appointment`
                },
                { status: 409 }
            )
        }

        // 6) Create the request (including new current fields)
        const newRequest = await Request.create({
            requestType: body.requestType,
            midwifeId: body.midwifeId,
            clientId: body.clientId,
            serviceCode: body.serviceCode,
            appointmentId: body.appointmentId,
            currentDate: body.currentDate,
            currentStartTime: body.currentStartTime,
            currentEndTime: body.currentEndTime,
            suggestedDate: body.suggestedDate || null,
            suggestedStartTime: body.suggestedStartTime || null,
            suggestedEndTime: body.suggestedEndTime || null,
            note: body.note || "",
            status: body.status || "pending"
        })

        return NextResponse.json(
            {
                success: true,
                message: "Request created successfully",
                data: newRequest
            },
            { status: 201 }
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating request:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create request"
            },
            { status: 500 }
        )
    }
}




export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const midwifeId = searchParams.get("midwifeId")
        const clientId = searchParams.get("clientId")

        // 1) Check if at least one parameter is provided
        if (!midwifeId && !clientId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please provide at least midwifeId or clientId"
                },
                { status: 400 }
            )
        }

        // 2) Build query based on provided parameters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}

        if (midwifeId) {
            query.midwifeId = midwifeId
        }

        if (clientId) {
            query.clientId = clientId
        }

        // 3) Fetch requests from database
        const requests = await Request.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first

        // 4) Return the requests
        return NextResponse.json(
            {
                success: true,
                message: "Requests fetched successfully",
                count: requests.length,
                data: requests
            },
            { status: 200 }
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching requests:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch requests"
            },
            { status: 500 }
        )
    }
}