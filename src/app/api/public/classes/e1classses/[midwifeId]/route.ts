import { connect } from "@/dbConfig/dbConfig"
import e1ClassesModel from "@/models/e1ClassesModel"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

// GET request - Get classes by midwifeId
export async function GET(
    request: NextRequest,
    { params }: { params: { midwifeId: string } }
) {
    try {
        const { midwifeId } = params

        // Validate midwifeId
        if (!midwifeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId is required",
                },
                { status: 400 }
            )
        }

        // Find classes for the specific midwife
        const midwifeClasses = await e1ClassesModel.findOne({
            midwifeId: midwifeId
        })

        if (!midwifeClasses) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No classes found for this midwife",
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Classes retrieved successfully",
                data: midwifeClasses,
            },
            { status: 200 }
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error retrieving classes:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to retrieve classes",
            },
            { status: 500 }
        )
    }
}

// PUT request - Update classes by midwifeId
export async function PUT(
    request: NextRequest,
    { params }: { params: { midwifeId: string } }
) {
    try {
        const { midwifeId } = params
        const body = await request.json()

        // Validate midwifeId
        if (!midwifeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId is required",
                },
                { status: 400 }
            )
        }

        // Find existing classes document
        const existingClasses = await e1ClassesModel.findOne({
            midwifeId: midwifeId
        })

        if (!existingClasses) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No classes document found for this midwife. Create one first using POST.",
                },
                { status: 404 }
            )
        }

        // Handle classes data update
        let updatedClassesData = existingClasses.classes

        if (body.classes && typeof body.classes === 'object') {
            // Check if it's a complete replacement or partial update
            const classesKeys = Object.keys(body.classes)

            if (classesKeys.length === 0) {
                // Empty object - clear all classes
                updatedClassesData = new Map()
            } else {
                // Convert to Map structure
                updatedClassesData = new Map()

                classesKeys.forEach(year => {
                    const yearData = body.classes[year]
                    if (yearData && typeof yearData === 'object') {
                        const yearClasses = new Map()
                        Object.keys(yearData).forEach(className => {
                            yearClasses.set(className, yearData[className])
                        })
                        updatedClassesData.set(year, yearClasses)
                    }
                })
            }
        }

        // Update the document
        const updatedClasses = await e1ClassesModel.findOneAndUpdate(
            { midwifeId: midwifeId },
            {
                classes: updatedClassesData,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        )

        return NextResponse.json(
            {
                success: true,
                message: "Classes updated successfully",
                data: updatedClasses,
            },
            { status: 200 }
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating classes:", error)

        // Handle validation errors
        if (error.name === 'ValidationError') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validationErrors = Object.values(error.errors).map((err: any) => err.message)
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors,
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to update classes",
            },
            { status: 500 }
        )
    }
}