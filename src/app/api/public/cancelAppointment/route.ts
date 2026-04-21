import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import MidwifeA1Booking from "@/models/midwifeA1Booking"
import e1ClassesModel from "@/models/e1ClassesModel"
import f1ClassesModel from "@/models/f1ClassesModel"
import { connect } from "@/dbConfig/dbConfig"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Constants
const VALID_SERVICE_CODES: string[] = ["A1/A2", "B1", "B2", "E1", "C1", "C2", "D1", "D2", "F1"];

// Cancel appointment (PUT method)
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

            // Special handling for E1
            if (serviceCode === "E1") {
                const e1Appointment = preBirthRecord.appointments.E1[appointmentIndex]
                const classId = e1Appointment.classId.toString()
                const classNo = e1Appointment.classNo

                // Find e1Classes record
                const e1ClassRecord = await e1ClassesModel.findOne({ midwifeId })

                if (e1ClassRecord) {
                    // Find the class in nested structure
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let targetClass: any = null;
                    let targetYear: string = "";
                    let targetClassName: string = "";

                    for (const [year, yearClasses] of e1ClassRecord.classes) {
                        for (const [className, classDetail] of yearClasses) {
                            if (classDetail.id.toString() === classId) {
                                targetClass = classDetail;
                                targetYear = year;
                                targetClassName = className;
                                break;
                            }
                        }
                        if (targetClass) break;
                    }

                    if (targetClass) {
                        // Add to cancelExceptional array if not already present
                        if (!targetClass.cancelExceptional) {
                            targetClass.cancelExceptional = [];
                        }

                        if (!targetClass.cancelExceptional.includes(classNo)) {
                            targetClass.cancelExceptional.push(classNo);
                        }

                        // Update the class in Map
                        const yearMap = e1ClassRecord.classes.get(targetYear);
                        if (yearMap) {
                            yearMap.set(targetClassName, targetClass);
                            e1ClassRecord.classes.set(targetYear, yearMap);
                        }

                        e1ClassRecord.markModified('classes');
                        await e1ClassRecord.save();

                        // Cancel all clients' E1 appointments for this class
                        const clients = targetClass.clients || [];

                        for (const otherClientId of clients) {
                            const otherPreBirthRecord = await PreBirthAppointments.findOne({
                                clientId: otherClientId,
                                midwifeId: midwifeId
                            });

                            if (otherPreBirthRecord && otherPreBirthRecord.appointments.E1) {
                                const e1Appointments = otherPreBirthRecord.appointments.E1;

                                for (let i = 0; i < e1Appointments.length; i++) {
                                    if (e1Appointments[i].classNo === classNo) {
                                        e1Appointments[i].status = "cancelled";
                                    }
                                }

                                otherPreBirthRecord.markModified('appointments');
                                await otherPreBirthRecord.save();
                            }
                        }

                        return NextResponse.json({
                            message: `E1 appointment cancelled successfully for all clients in class ${classNo}`,
                            success: true,
                            classNo: classNo,
                            totalClientsAffected: clients.length
                        })
                    }
                }
            } else {
                // For B1, B2 - normal cancel
                preBirthRecord.appointments[serviceCode][appointmentIndex].status = "cancelled"
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

            // Special handling for F1
            if (serviceCode === "F1") {
                const f1Appointment = postBirthRecord.appointments.F1[appointmentIndex]
                const classId = f1Appointment.classId.toString()
                const classNo = f1Appointment.classNo

                // Find f1Classes record
                const f1ClassRecord = await f1ClassesModel.findOne({ midwifeId })

                if (f1ClassRecord) {
                    // Find the class in nested structure
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let targetClass: any = null;
                    let targetYear: string = "";
                    let targetClassName: string = "";

                    for (const [year, yearClasses] of f1ClassRecord.classes) {
                        for (const [className, classDetail] of yearClasses) {
                            if (classDetail.id.toString() === classId) {
                                targetClass = classDetail;
                                targetYear = year;
                                targetClassName = className;
                                break;
                            }
                        }
                        if (targetClass) break;
                    }

                    if (targetClass) {
                        // Add to cancelExceptional array if not already present
                        if (!targetClass.cancelExceptional) {
                            targetClass.cancelExceptional = [];
                        }

                        if (!targetClass.cancelExceptional.includes(classNo)) {
                            targetClass.cancelExceptional.push(classNo);
                        }

                        // Update the class in Map
                        const yearMap = f1ClassRecord.classes.get(targetYear);
                        if (yearMap) {
                            yearMap.set(targetClassName, targetClass);
                            f1ClassRecord.classes.set(targetYear, yearMap);
                        }

                        f1ClassRecord.markModified('classes');
                        await f1ClassRecord.save();

                        // Cancel all clients' F1 appointments for this class
                        const clients = targetClass.clients || [];

                        for (const otherClientId of clients) {
                            const otherPostBirthRecord = await PostBirthAppointments.findOne({
                                clientId: otherClientId,
                                midwifeId: midwifeId
                            });

                            if (otherPostBirthRecord && otherPostBirthRecord.appointments.F1) {
                                const f1Appointments = otherPostBirthRecord.appointments.F1;

                                for (let i = 0; i < f1Appointments.length; i++) {
                                    if (f1Appointments[i].classNo === classNo) {
                                        f1Appointments[i].status = "cancelled";
                                    }
                                }

                                otherPostBirthRecord.markModified('appointments');
                                await otherPostBirthRecord.save();
                            }
                        }

                        return NextResponse.json({
                            message: `F1 appointment cancelled successfully for all clients in class ${classNo}`,
                            success: true,
                            classNo: classNo,
                            totalClientsAffected: clients.length
                        })
                    }
                }
            } else {
                // For C1, C2, D1, D2 - normal cancel
                postBirthRecord.appointments[serviceCode][appointmentIndex].status = "cancelled"
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
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}