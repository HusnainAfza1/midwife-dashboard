import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import MidwifeA1Booking from "@/models/midwifeA1Booking"
import e1ClassesModel from "@/models/e1ClassesModel"
import f1ClassesModel from "@/models/f1ClassesModel"
import { connect } from "@/dbConfig/dbConfig"
// import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Constants
const VALID_SERVICE_CODES: string[] = ["A1/A2", "B1", "B2", "E1", "C1", "C2", "D1", "D2", "F1"];

const SERVICES_DURATIONS: { id: string; duration: number }[] = [
    { id: "A1/A2", duration: 50 },
    { id: "B1", duration: 60 },
    { id: "B2", duration: 50 },
    { id: "C1", duration: 60 },
    { id: "C2", duration: 25 },
    { id: "D1", duration: 60 },
    { id: "D2", duration: 25 },
    { id: "E1", duration: 140 },
    { id: "E2", duration: 140 },
    { id: "F1", duration: 75 },
    { id: "F2", duration: 75 },
    { id: "G", duration: 25 },
    { id: "H", duration: 60 },
    { id: "I", duration: 60 },
];

// Helper function to validate date format (DD/MM/YYYY)
const validateDateFormat = (dateString: string): boolean => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(dateString);
};

// Helper function to calculate duration in minutes
const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
};

// Helper function to get service duration
const getServiceDuration = (serviceCode: string): number | null => {
    const service = SERVICES_DURATIONS.find(s => s.id === serviceCode);
    return service ? service.duration : null;
};

// Update appointment (PUT method)
export async function PUT(request: NextRequest) {
    try {
        // Authorize request - adjust roles as needed
        // const auth = await authorize(request, ["superuser", "midwife", "admin"])
        // if (!auth.success) {
        //     return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        // }

        const reqBody = await request.json()
        const {
            midwifeId,
            clientId,
            serviceCode,
            appointmentId,
            updatedDate,
            updatedStartTime,
            updatedEndTime
        }: {
            midwifeId?: string;
            clientId?: string;
            serviceCode?: string;
            appointmentId?: string;
            updatedDate?: string;
            updatedStartTime?: string;
            updatedEndTime?: string;
        } = reqBody

        // Validate service code
        if (!serviceCode || !VALID_SERVICE_CODES.includes(serviceCode)) {
            return NextResponse.json({
                error: "Invalid service code",
                details: `Service code must be one of: ${VALID_SERVICE_CODES.join(', ')}`
            }, { status: 400 })
        }

        // Validate required fields
        if (!updatedDate || !updatedStartTime || !updatedEndTime) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "updatedDate, updatedStartTime, and updatedEndTime are required"
            }, { status: 400 })
        }

        // Validate date format
        if (!validateDateFormat(updatedDate)) {
            return NextResponse.json({
                error: "Invalid date format",
                details: "Date must be in DD/MM/YYYY format"
            }, { status: 400 })
        }

        // Calculate and validate duration
        const calculatedDuration = calculateDuration(updatedStartTime, updatedEndTime);
        const expectedDuration = getServiceDuration(serviceCode);

        if (!expectedDuration) {
            return NextResponse.json({
                error: "Invalid service code duration",
                details: "Service code not found in duration configuration"
            }, { status: 400 })
        }

        if (calculatedDuration !== expectedDuration) {
            return NextResponse.json({
                error: "Duration mismatch",
                details: `Expected ${expectedDuration} minutes for ${serviceCode}, but got ${calculatedDuration} minutes`
            }, { status: 400 })
        }

        // Handle A1/A2 service code
        if (serviceCode === "A1/A2") {
            if (!appointmentId) {
                return NextResponse.json({
                    error: "Missing required field",
                    details: "appointmentId is required for A1/A2 service"
                }, { status: 400 })
            }

            const updatedAppointment = await MidwifeA1Booking.findByIdAndUpdate(
                appointmentId,
                {
                    selectedSlot: `${updatedStartTime}-${updatedEndTime}`,
                    date: updatedDate
                },
                { new: true }
            )

            if (!updatedAppointment) {
                return NextResponse.json({
                    error: "Appointment not found",
                    details: "A1/A2 appointment with provided ID does not exist"
                }, { status: 404 })
            }

            return NextResponse.json({
                message: "A1/A2 appointment updated successfully",
                success: true,
                appointment: {
                    id: updatedAppointment._id,
                    selectedSlot: updatedAppointment.selectedSlot,
                    date: updatedAppointment.date,
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

        if (!appointmentId) {
            return NextResponse.json({
                error: "Missing required field",
                details: "appointmentId is required"
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
                        // Handle exceptional array
                        if (!targetClass.exceptional) {
                            targetClass.exceptional = [];
                        }

                        const exceptionalIndex = targetClass.exceptional.findIndex(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (item: any) => item.classNo === classNo
                        );

                        if (exceptionalIndex !== -1) {
                            targetClass.exceptional[exceptionalIndex].startDate = updatedDate;
                            targetClass.exceptional[exceptionalIndex].startTime = updatedStartTime;
                            targetClass.exceptional[exceptionalIndex].endTime = updatedEndTime;
                            targetClass.exceptional[exceptionalIndex].duration = calculatedDuration;
                        } else {
                            targetClass.exceptional.push({
                                classNo: classNo,
                                startDate: updatedDate,
                                startTime: updatedStartTime,
                                endTime: updatedEndTime,
                                duration: calculatedDuration
                            });
                        }

                        // Update the class in Map
                        const yearMap = e1ClassRecord.classes.get(targetYear);
                        if (yearMap) {
                            yearMap.set(targetClassName, targetClass);
                            e1ClassRecord.classes.set(targetYear, yearMap);
                        }

                        e1ClassRecord.markModified('classes');
                        await e1ClassRecord.save();

                        // Update all clients' E1 appointments for this class
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
                                        e1Appointments[i].appointmentDate = updatedDate;
                                        e1Appointments[i].startTime = updatedStartTime;
                                        e1Appointments[i].endTime = updatedEndTime;
                                        e1Appointments[i].duration = calculatedDuration;
                                    }
                                }

                                otherPreBirthRecord.markModified('appointments');
                                await otherPreBirthRecord.save();
                            }
                        }
                    }
                }
            } else {
                // For B1, B2 - normal update
                preBirthRecord.appointments[serviceCode][appointmentIndex].appointmentDate = updatedDate
                preBirthRecord.appointments[serviceCode][appointmentIndex].startTime = updatedStartTime
                preBirthRecord.appointments[serviceCode][appointmentIndex].endTime = updatedEndTime
                preBirthRecord.appointments[serviceCode][appointmentIndex].duration = calculatedDuration

                await preBirthRecord.save()
            }

            return NextResponse.json({
                message: `${serviceCode} appointment updated successfully`,
                success: true,
                appointment: {
                    appointmentId: preBirthRecord.appointments[serviceCode][appointmentIndex].appointmentId,
                    appointmentDate: preBirthRecord.appointments[serviceCode][appointmentIndex].appointmentDate,
                    startTime: preBirthRecord.appointments[serviceCode][appointmentIndex].startTime,
                    endTime: preBirthRecord.appointments[serviceCode][appointmentIndex].endTime,
                    duration: preBirthRecord.appointments[serviceCode][appointmentIndex].duration,
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
                        // Handle exceptional array
                        if (!targetClass.exceptional) {
                            targetClass.exceptional = [];
                        }

                        const exceptionalIndex = targetClass.exceptional.findIndex(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (item: any) => item.classNo === classNo
                        );

                        if (exceptionalIndex !== -1) {
                            targetClass.exceptional[exceptionalIndex].startDate = updatedDate;
                            targetClass.exceptional[exceptionalIndex].startTime = updatedStartTime;
                            targetClass.exceptional[exceptionalIndex].endTime = updatedEndTime;
                            targetClass.exceptional[exceptionalIndex].duration = calculatedDuration;
                        } else {
                            targetClass.exceptional.push({
                                classNo: classNo,
                                startDate: updatedDate,
                                startTime: updatedStartTime,
                                endTime: updatedEndTime,
                                duration: calculatedDuration
                            });
                        }

                        // Update the class in Map
                        const yearMap = f1ClassRecord.classes.get(targetYear);
                        if (yearMap) {
                            yearMap.set(targetClassName, targetClass);
                            f1ClassRecord.classes.set(targetYear, yearMap);
                        }

                        f1ClassRecord.markModified('classes');
                        await f1ClassRecord.save();

                        // Update all clients' F1 appointments for this class
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
                                        f1Appointments[i].appointmentDate = updatedDate;
                                        f1Appointments[i].startTime = updatedStartTime;
                                        f1Appointments[i].endTime = updatedEndTime;
                                        f1Appointments[i].duration = calculatedDuration;
                                    }
                                }

                                otherPostBirthRecord.markModified('appointments');
                                await otherPostBirthRecord.save();
                            }
                        }
                    }
                }
            } else {
                // For C1, C2, D1, D2 - normal update
                postBirthRecord.appointments[serviceCode][appointmentIndex].appointmentDate = updatedDate
                postBirthRecord.appointments[serviceCode][appointmentIndex].startTime = updatedStartTime
                postBirthRecord.appointments[serviceCode][appointmentIndex].endTime = updatedEndTime
                postBirthRecord.appointments[serviceCode][appointmentIndex].duration = calculatedDuration

                await postBirthRecord.save()
            }

            return NextResponse.json({
                message: `${serviceCode} appointment updated successfully`,
                success: true,
                appointment: {
                    appointmentId: postBirthRecord.appointments[serviceCode][appointmentIndex].appointmentId,
                    appointmentDate: postBirthRecord.appointments[serviceCode][appointmentIndex].appointmentDate,
                    startTime: postBirthRecord.appointments[serviceCode][appointmentIndex].startTime,
                    endTime: postBirthRecord.appointments[serviceCode][appointmentIndex].endTime,
                    duration: postBirthRecord.appointments[serviceCode][appointmentIndex].duration,
                    serviceCode: serviceCode
                }
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}