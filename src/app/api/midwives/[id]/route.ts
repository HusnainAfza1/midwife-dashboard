import { connect } from "@/dbConfig/dbConfig"
import Midwife from "@/models/midwifeModel"
import { type NextRequest, NextResponse } from "next/server"

connect()

// GET a single midwife by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const midwifeId = params.id

        const midwife = await Midwife.findById(midwifeId).select("-personalInfo.profileImage.data -personalInfo.logo.data")

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

// PUT update a midwife
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const midwifeId = params.id
        const body = await request.json()

        // Check if midwife exists
        const existingMidwife = await Midwife.findById(midwifeId)
        if (!existingMidwife) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Midwife not found",
                },
                { status: 404 },
            )
        }

        // Check if email or username is being changed and if it conflicts with another midwife    
        if (body.personalInfo?.email || body.personalInfo?.username || body.personalInfo?.slogan) {
            // Check for conflicts in email, username, or slogan
            const emailConflict = body.personalInfo?.email && body.personalInfo.email !== existingMidwife.personalInfo.email
            const usernameConflict =
                body.personalInfo?.username && body.personalInfo.username !== existingMidwife.personalInfo.username
            const sloganConflict =
                body.personalInfo?.slogan && body.personalInfo.slogan !== existingMidwife.personalInfo.slogan

            if (emailConflict || usernameConflict || sloganConflict) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const conflictQuery: any = { _id: { $ne: midwifeId } }

                if (emailConflict) {
                    conflictQuery["personalInfo.email"] = body.personalInfo.email
                }

                if (usernameConflict) {
                    conflictQuery["personalInfo.username"] = body.personalInfo.username
                }

                if (sloganConflict) {
                    conflictQuery["personalInfo.slogan"] = body.personalInfo.slogan
                }

                const conflictingMidwife = await Midwife.findOne(conflictQuery)

                if (conflictingMidwife) {
                    // Determine which field caused the conflict for a more specific error message
                    let conflictField = "field";

                    if (emailConflict && conflictingMidwife.personalInfo.email === body.personalInfo.email) {
                        conflictField = "Email";
                    } else if (usernameConflict && conflictingMidwife.personalInfo.username === body.personalInfo.username) {
                        conflictField = "Username";
                    } else if (sloganConflict && conflictingMidwife.personalInfo.slogan === body.personalInfo.slogan) {
                        conflictField = "Slogan";
                    }

                    return NextResponse.json(
                        {
                            success: false,
                            message: `${conflictField} already in use by another midwife`,
                        },
                        { status: 400 },
                    )
                }
            }
        }





        // if (body.personalInfo?.email || body.personalInfo?.username) {
        //     const emailConflict = body.personalInfo?.email && body.personalInfo.email !== existingMidwife.personalInfo.email
        //     const usernameConflict =
        //         body.personalInfo?.username && body.personalInfo.username !== existingMidwife.personalInfo.username

        //     if (emailConflict || usernameConflict) {
        //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //         const conflictQuery: any = { _id: { $ne: midwifeId } }

        //         if (emailConflict) {
        //             conflictQuery["personalInfo.email"] = body.personalInfo.email
        //         }

        //         if (usernameConflict) {
        //             conflictQuery["personalInfo.username"] = body.personalInfo.username
        //         }

        //         const conflictingMidwife = await Midwife.findOne(conflictQuery)

        //         if (conflictingMidwife) {
        //             return NextResponse.json(
        //                 {
        //                     success: false,
        //                     message: "Email or username already in use by another midwife",
        //                 },
        //                 { status: 400 },
        //             )
        //         }
        //     }
        // }

        // Update the midwife
        const updatedMidwife = await Midwife.findByIdAndUpdate(
            midwifeId,
            { $set: body },
            { new: true, runValidators: true },
        ).select("-personalInfo.profileImage.data -personalInfo.logo.data")

        return NextResponse.json({
            success: true,
            message: "Midwife updated successfully",
            data: updatedMidwife,
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

// DELETE a midwife
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const midwifeId = params.id

        const deletedMidwife = await Midwife.findByIdAndDelete(midwifeId)

        if (!deletedMidwife) {
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
            message: "Midwife deleted successfully",
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
