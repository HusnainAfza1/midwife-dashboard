import { connect } from "@/dbConfig/dbConfig"
import e1ClassesModel from "@/models/e1ClassesModel"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Check if classes document for this midwife already exists
        const existingClasses = await e1ClassesModel.findOne({
            midwifeId: body.midwifeId
        })

        if (existingClasses) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Classes document for this midwife already exists. Use PUT to update existing classes.",
                },
                { status: 400 }
            )
        }

        // Validate required fields
        if (!body.midwifeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "midwifeId is required",
                },
                { status: 400 }
            )
        }

        // Handle classes data - can be empty object, populated object, or undefined
        let classesData = new Map() // Default to empty Map
        
        if (body.classes && typeof body.classes === 'object') {
            // Check if classes object is empty
            const classesKeys = Object.keys(body.classes)
            
            if (classesKeys.length === 0) {
                // Empty classes object - keep as empty Map
                classesData = new Map()
            } else {
                // Convert nested objects to Maps for MongoDB
                const convertedClasses = new Map()
                
                classesKeys.forEach(year => {
                    const yearData = body.classes[year]
                    if (yearData && typeof yearData === 'object') {
                        const yearClasses = new Map()
                        Object.keys(yearData).forEach(className => {
                            yearClasses.set(className, yearData[className])
                        })
                        convertedClasses.set(year, yearClasses)
                    }
                })
                
                classesData = convertedClasses
            }
        }

        // Create new classes document
        const newClasses = await e1ClassesModel.create({
            midwifeId: body.midwifeId,
            classes: classesData
        })

        return NextResponse.json(
            {
                success: true,
                message: "Classes created successfully",
                data: newClasses,
            },
            { status: 201 }
        )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating classes:", error)
        
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

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A classes document for this midwife already exists",
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create classes",
            },
            { status: 500 }
        )
    }
}