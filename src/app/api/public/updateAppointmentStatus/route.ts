import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import { connect } from "@/dbConfig/dbConfig"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Activate appointments - change status from pending to active
export async function PATCH(request: NextRequest) {
    try {
        // console.log("=== API CALLED ===")
        const reqBody = await request.json()
        console.log("Request body:", reqBody)
        
        const {
            _id,
            type
        }: {
            _id?: string;
            type?: string;
        } = reqBody

        console.log("Parsed values:", { _id, type })

        // Validate type
        if (!type || (type !== "prebirth" && type !== "postbirth")) {
            return NextResponse.json({
                error: "Invalid type",
                details: "Type must be either 'prebirth' or 'postbirth'"
            }, { status: 400 })
        }

        // Validate _id
        if (!_id) {
            return NextResponse.json({
                error: "Missing required field",
                details: "_id is required"
            }, { status: 400 })
        }

        // Handle prebirth appointments
        if (type === "prebirth") {
            try {
                const preBirthRecord = await PreBirthAppointments.findById(_id)

                if (!preBirthRecord) {
                    return NextResponse.json({
                        error: "Record not found",
                        details: "Pre-birth appointment record not found with provided _id"
                    }, { status: 404 })
                }

                console.log("Found prebirth record:", preBirthRecord._id)

                let updatedCount = 0

                // Convert to plain object to work with it easier
                const appointmentsObj = preBirthRecord.appointments.toObject()

                // Update B1
                if (appointmentsObj.B1) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.B1 = appointmentsObj.B1.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update B2
                if (appointmentsObj.B2) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.B2 = appointmentsObj.B2.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update E1
                if (appointmentsObj.E1) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.E1 = appointmentsObj.E1.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update the record
                preBirthRecord.appointments = appointmentsObj

                // Update bookingStatus
                if (preBirthRecord.bookingStatus === "pending") {
                    preBirthRecord.bookingStatus = "active"
                }

                await preBirthRecord.save()

                console.log("Updated prebirth record successfully")

                return NextResponse.json({
                    message: "Pre-birth appointments activated successfully",
                    success: true,
                    data: {
                        _id: preBirthRecord._id,
                        bookingStatus: preBirthRecord.bookingStatus,
                        appointmentsUpdated: updatedCount,
                        appointments: preBirthRecord.appointments
                    }
                })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error in prebirth update:", error)
                return NextResponse.json({ 
                    error: "Prebirth update failed", 
                    details: error.message 
                }, { status: 500 })
            }
        }

        // Handle postbirth appointments
        if (type === "postbirth") {
            try {
                const postBirthRecord = await PostBirthAppointments.findById(_id)

                if (!postBirthRecord) {
                    return NextResponse.json({
                        error: "Record not found",
                        details: "Post-birth appointment record not found with provided _id"
                    }, { status: 404 })
                }

                console.log("Found postbirth record:", postBirthRecord._id)

                let updatedCount = 0

                // Convert to plain object to work with it easier
                const appointmentsObj = postBirthRecord.appointments.toObject()

                // Update C1
                if (appointmentsObj.C1) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.C1 = appointmentsObj.C1.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update C2
                if (appointmentsObj.C2) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.C2 = appointmentsObj.C2.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update D1
                if (appointmentsObj.D1) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.D1 = appointmentsObj.D1.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update D2
                if (appointmentsObj.D2) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.D2 = appointmentsObj.D2.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update F1
                if (appointmentsObj.F1) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointmentsObj.F1 = appointmentsObj.F1.map((apt: any) => {
                        if (apt.status === "pending") {
                            updatedCount++
                            return { ...apt, status: "active" }
                        }
                        return apt
                    })
                }

                // Update the record
                postBirthRecord.appointments = appointmentsObj

                // Update bookingStatus
                if (postBirthRecord.bookingStatus === "pending") {
                    postBirthRecord.bookingStatus = "active"
                }

                await postBirthRecord.save()

                console.log("Updated postbirth record successfully")

                return NextResponse.json({
                    message: "Post-birth appointments activated successfully",
                    success: true,
                    data: {
                        _id: postBirthRecord._id,
                        bookingStatus: postBirthRecord.bookingStatus,
                        appointmentsUpdated: updatedCount,
                        appointments: postBirthRecord.appointments
                    }
                })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error in postbirth update:", error)
                return NextResponse.json({ 
                    error: "Postbirth update failed", 
                    details: error.message 
                }, { status: 500 })
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("=== GENERAL ERROR ===")
        console.error("Error name:", error.name)
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
        console.error("Full error:", error)
        
        return NextResponse.json({ 
            error: "Internal server error", 
            details: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}