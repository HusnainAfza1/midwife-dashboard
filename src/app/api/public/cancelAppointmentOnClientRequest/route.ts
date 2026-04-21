import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import MidwifeA1Booking from "@/models/midwifeA1Booking"
import { connect } from "@/dbConfig/dbConfig"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Constants
const VALID_SERVICE_CODES: string[] = ["A1/A2", "B1", "B2", "E1", "C1", "C2", "D1", "D2", "F1"];

// Cancel individual appointment (PUT method)
export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {
            midwifeId,
            clientId,
            serviceCode,
            appointmentId
        }: {
            midwifeId?: string;
            clientId?: string;
            serviceCode?: string;
            appointmentId?: string;
        } = reqBody

        // Validate service code
        if (!serviceCode || !VALID_SERVICE_CODES.includes(serviceCode)) {
            return NextResponse.json({
                error: "Invalid service code",
                details: `Service code must be one of: ${VALID_SERVICE_CODES.join(', ')}`
            }, { status: 400 })
        }

        // Validate required fields
        if (!appointmentId) {
            return NextResponse.json({
                error: "Missing required field",
                details: "appointmentId is required"
            }, { status: 400 })
        }

        // Handle A1/A2 service code
        if (serviceCode === "A1/A2") {
            const updatedAppointment = await MidwifeA1Booking.findByIdAndUpdate(
                appointmentId,
                { status: "cancelled" },
                { new: true }
            )

            if (!updatedAppointment) {
                return NextResponse.json({
                    error: "Appointment not found",
                    details: "A1/A2 appointment with provided ID does not exist"
                }, { status: 404 })
            }

            return NextResponse.json({
                message: "A1/A2 appointment cancelled successfully",
                success: true,
                appointment: {
                    id: updatedAppointment._id,
                    status: updatedAppointment.status,
                    updatedAt: new Date()
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

        // Handle Pre-birth service codes (B1, B2, E1)
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

            // Find the specific appointment
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

            // Cancel the individual appointment (including E1)
            preBirthRecord.appointments[serviceCode][appointmentIndex].status = "cancelled"
            preBirthRecord.markModified('appointments')
            await preBirthRecord.save()

            return NextResponse.json({
                message: `${serviceCode} appointment cancelled successfully`,
                success: true,
                appointment: {
                    appointmentId: preBirthRecord.appointments[serviceCode][appointmentIndex].appointmentId,
                    status: "cancelled",
                    serviceCode: serviceCode
                }
            })
        }

        // Handle Post-birth service codes (C1, C2, D1, D2, F1)
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

            // Find the specific appointment
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

            // Cancel the individual appointment (including F1)
            postBirthRecord.appointments[serviceCode][appointmentIndex].status = "cancelled"
            postBirthRecord.markModified('appointments')
            await postBirthRecord.save()

            return NextResponse.json({
                message: `${serviceCode} appointment cancelled successfully`,
                success: true,
                appointment: {
                    appointmentId: postBirthRecord.appointments[serviceCode][appointmentIndex].appointmentId,
                    status: "cancelled",
                    serviceCode: serviceCode
                }
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}