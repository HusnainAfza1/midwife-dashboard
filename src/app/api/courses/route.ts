import Course from "@/models/courseModel"
import { connect } from "@/dbConfig/dbConfig"
import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Create a new course (superuser or salesperson)
export async function POST(request: NextRequest) {
    try {
        // Authorize request - only superusers or salespersons can create courses
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
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

        const newCourse = new Course({
            name,
            tagline,
            type,
            duration,
            appointments: appointments || "",
            turnover: turnover || "",
        })

        const savedCourse = await newCourse.save()

        return NextResponse.json({
            message: "Course created successfully",
            success: true,
            course: {
                id: savedCourse._id,
                name: savedCourse.name,
                tagline: savedCourse.tagline,
                type: savedCourse.type,
                duration: savedCourse.duration,
                appointments: savedCourse.appointments,
                turnover: savedCourse.turnover,
                createdAt: savedCourse.createdAt
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Get all courses
export async function GET(request: NextRequest) {
    try {
        // Authorize request - only superusers or salespersons can view courses
        const auth = await authorize(request, ["superuser", "salesperson"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        // Get all courses, sorted by creation date (newest first)
        const courses = await Course.find()
            .sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            courses
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}