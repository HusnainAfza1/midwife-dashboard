import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import MidwifeA1Booking from "@/models/midwifeA1Booking"
import { connect } from "@/dbConfig/dbConfig"
// import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Constants
const VALID_SERVICE_CODES: string[] = ["A1/A2", "B1", "B2", "E1", "C1", "C2", "D1", "D2", "F1"];

// Delete appointment
export async function DELETE(request: NextRequest) {
    try {
        // Authorize request - adjust roles as needed
        // const auth = await authorize(request, ["superuser", "midwife", "admin"])
        // if (!auth.success) {
        //     return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        // }

        const reqBody = await request.json()
        const {
            serviceCode,
            appointmentId,
            clientId,
            midwifeId
        }: {
            serviceCode?: string;
            appointmentId?: string;
            clientId?: string;
            midwifeId?: string;
        } = reqBody

        // Validate service code
        if (!serviceCode || !VALID_SERVICE_CODES.includes(serviceCode)) {
            return NextResponse.json({
                error: "Invalid service code",
                details: `Service code must be one of: ${VALID_SERVICE_CODES.join(', ')}`
            }, { status: 400 })
        }

        // Validate appointmentId
        if (!appointmentId) {
            return NextResponse.json({
                error: "Missing required field",
                details: "appointmentId is required"
            }, { status: 400 })
        }

        // Handle A1/A2 deletion - delete entire document
        if (serviceCode === "A1/A2") {
            const deletedAppointment = await MidwifeA1Booking.findByIdAndDelete(appointmentId)

            if (!deletedAppointment) {
                return NextResponse.json({
                    error: "Appointment not found",
                    details: "A1/A2 appointment with provided ID does not exist"
                }, { status: 404 })
            }

            return NextResponse.json({
                message: "A1/A2 appointment deleted successfully",
                success: true,
                data: {
                    appointmentId: appointmentId,
                    serviceCode: serviceCode
                }
            })
        }

        // Validate clientId and midwifeId for other service codes
        if (!clientId || !midwifeId) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "clientId and midwifeId are required for this service code"
            }, { status: 400 })
        }

        // Handle PreBirth deletions (B1, B2, E1)
        if (["B1", "B2", "E1"].includes(serviceCode)) {
            const preBirthRecord = await PreBirthAppointments.findOne({
                clientId,
                midwifeId
            })

            if (!preBirthRecord) {
                return NextResponse.json({
                    error: "Record not found",
                    details: "Pre-birth appointment record not found for provided clientId and midwifeId"
                }, { status: 404 })
            }

            const serviceAppointments = preBirthRecord.appointments[serviceCode]
            if (!serviceAppointments || serviceAppointments.length === 0) {
                return NextResponse.json({
                    error: "Appointments not found",
                    details: `No appointments found for service code ${serviceCode}`
                }, { status: 404 })
            }

            // Find the appointment index
            const appointmentIndex: number = serviceAppointments.findIndex(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (apt: any) => apt.appointmentId.toString() === appointmentId
            )

            if (appointmentIndex === -1) {
                return NextResponse.json({
                    error: "Appointment not found",
                    details: `Appointment with ID ${appointmentId} not found in ${serviceCode}`
                }, { status: 404 })
            }

            // Remove the appointment from array
            preBirthRecord.appointments[serviceCode].splice(appointmentIndex, 1)

            // Mark as modified and save
            preBirthRecord.markModified('appointments')
            await preBirthRecord.save()

            return NextResponse.json({
                message: `${serviceCode} appointment deleted successfully`,
                success: true,
                data: {
                    appointmentId: appointmentId,
                    serviceCode: serviceCode,
                    clientId: clientId,
                    remainingAppointments: preBirthRecord.appointments[serviceCode].length
                }
            })
        }

        // Handle PostBirth deletions (C1, C2, D1, D2, F1)
        if (["C1", "C2", "D1", "D2", "F1"].includes(serviceCode)) {
            const postBirthRecord = await PostBirthAppointments.findOne({
                clientId,
                midwifeId
            })

            if (!postBirthRecord) {
                return NextResponse.json({
                    error: "Record not found",
                    details: "Post-birth appointment record not found for provided clientId and midwifeId"
                }, { status: 404 })
            }

            const serviceAppointments = postBirthRecord.appointments[serviceCode]
            if (!serviceAppointments || serviceAppointments.length === 0) {
                return NextResponse.json({
                    error: "Appointments not found",
                    details: `No appointments found for service code ${serviceCode}`
                }, { status: 404 })
            }

            // Find the appointment index
            const appointmentIndex: number = serviceAppointments.findIndex(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (apt: any) => apt.appointmentId.toString() === appointmentId
            )

            if (appointmentIndex === -1) {
                return NextResponse.json({
                    error: "Appointment not found",
                    details: `Appointment with ID ${appointmentId} not found in ${serviceCode}`
                }, { status: 404 })
            }

            // Remove the appointment from array
            postBirthRecord.appointments[serviceCode].splice(appointmentIndex, 1)

            // Mark as modified and save
            postBirthRecord.markModified('appointments')
            await postBirthRecord.save()

            return NextResponse.json({
                message: `${serviceCode} appointment deleted successfully`,
                success: true,
                data: {
                    appointmentId: appointmentId,
                    serviceCode: serviceCode,
                    clientId: clientId,
                    remainingAppointments: postBirthRecord.appointments[serviceCode].length
                }
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Delete appointment error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}