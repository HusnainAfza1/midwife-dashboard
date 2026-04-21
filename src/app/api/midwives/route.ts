import { connect } from "@/dbConfig/dbConfig"
import Midwife from "@/models/midwifeModel"
import { type NextRequest, NextResponse } from "next/server"

// Connect to the database
connect()

// GET all midwives
export async function GET() {
    try {
        const midwives = await Midwife.find({}).select("-personalInfo.profileImage.data -personalInfo.logo.data")
        return NextResponse.json({
            success: true,
            message: "Midwives fetched successfully",
            data: midwives,
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

// POST create a new midwife
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Check if midwife with same email or username already exists     

        const existingMidwife = await Midwife.findOne({
            $or: [
                { "personalInfo.email": body.personalInfo.email },
                { "personalInfo.username": body.personalInfo.username },
                // Add slogan check here
                { "personalInfo.slogan": body.personalInfo.slogan }
            ],
        })

        if (existingMidwife) {
            // Determine which field caused the conflict for a more specific error message
            let conflictField = "email or username";

            if (existingMidwife.personalInfo.email === body.personalInfo.email) {
                conflictField = "email";
            } else if (existingMidwife.personalInfo.username === body.personalInfo.username) {
                conflictField = "username";
            } else if (existingMidwife.personalInfo.slogan === body.personalInfo.slogan) {
                conflictField = "slogan";
            }

            return NextResponse.json(
                {
                    success: false,
                    message: `A midwife with this ${conflictField} already exists`,
                },
                { status: 400 },
            )
        }


        // const existingMidwife = await Midwife.findOne({
        //     $or: [{ "personalInfo.email": body.personalInfo.email }, { "personalInfo.username": body.personalInfo.username }],
        // })

        // if (existingMidwife) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "A midwife with this email or username already exists",
        //         },
        //         { status: 400 },
        //     )
        // }

        // Create new midwife
        const newMidwife = await Midwife.create(body)

        // Return the created midwife without the image data to reduce response size
        const midwifeResponse = newMidwife.toObject()
        if (midwifeResponse.personalInfo.profileImage) {
            delete midwifeResponse.personalInfo.profileImage.data
        }
        if (midwifeResponse.personalInfo.logo) {
            delete midwifeResponse.personalInfo.logo.data
        }
        if (midwifeResponse.testimonials && midwifeResponse.testimonials.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            midwifeResponse.testimonials.forEach((testimonial: { profileImage?: { data?: any } }) => {
                if (testimonial.profileImage) {
                    delete testimonial.profileImage.data
                }
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Midwife created successfully",
                data: midwifeResponse,
            },
            { status: 201 },
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating midwife:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create midwife",
            },
            { status: 500 },
        )
    }
}
