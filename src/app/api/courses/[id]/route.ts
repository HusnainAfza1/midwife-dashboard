import mongoose from "mongoose"
import Course from "@/models/courseModel"
import { connect } from "@/dbConfig/dbConfig"
import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Get a specific course by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authorize request
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const courseId = params.id;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ error: "Invalid course ID" }, { status: 400 })
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            course
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Update a specific course by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authorize request
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const courseId = params.id;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ error: "Invalid course ID" }, { status: 400 })
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

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
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

        if (!updatedCourse) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Course updated successfully",
            success: true,
            course: updatedCourse
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Delete a specific course by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authorize request
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const courseId = params.id;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ error: "Invalid course ID" }, { status: 400 })
        }

        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Course deleted successfully",
            success: true
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}