import mongoose from "mongoose"
import { connect } from "@/dbConfig/dbConfig"
import { authorize } from "@/middleware/authorize"
import PrivateService from "@/models/privateServiceModel"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Get a specific private service by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authorize request
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const serviceId = params.id;
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return NextResponse.json({ error: "Invalid private service ID" }, { status: 400 })
        }

        const service = await PrivateService.findById(serviceId);

        if (!service) {
            return NextResponse.json({ error: "Private service not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            privateService: service
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching private service:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Update a specific private service by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authorize request
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const serviceId = params.id;
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return NextResponse.json({ error: "Invalid private service ID" }, { status: 400 })
        }

        const reqBody = await request.json()
        const { name, tagline, type, duration, appointments, turnover } = reqBody

        // Validate required fields
        if (!name || !tagline || !type || !duration) {
            return NextResponse.json({ 
                error: "Missing required fields", 
                details: "Name, tagline, type and duration are required" 
            }, { status: 400 })
        }

        // Validate type
        if (type !== "In persona" && type !== "Videocall") {
            return NextResponse.json({ 
                error: "Invalid type", 
                details: "Type must be either 'In persona' or 'Videocall'" 
            }, { status: 400 })
        }

        // Validate duration
        const validDurations = ["20", "30", "40", "50", "60"]
        if (!validDurations.includes(duration)) {
            return NextResponse.json({ 
                error: "Invalid duration", 
                details: "Duration must be one of: 20, 30, 40, 50, or 60 minutes" 
            }, { status: 400 })
        }

        // Update the private service
        const updatedService = await PrivateService.findByIdAndUpdate(
            serviceId,
            {
                name,
                tagline,
                type,
                duration,
                appointments: appointments || "",
                turnover: turnover || "",
            },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return NextResponse.json({ error: "Private service not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Private service updated successfully",
            success: true,
            privateService: updatedService
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating private service:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Delete a specific private service by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authorize request
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const serviceId = params.id;
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return NextResponse.json({ error: "Invalid private service ID" }, { status: 400 })
        }

        const deletedService = await PrivateService.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return NextResponse.json({ error: "Private service not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Private service deleted successfully",
            success: true
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting private service:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}