import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import MidwifeA1Booking from "@/models/midwifeA1Booking"
import e1ClassesModel from "@/models/e1ClassesModel"
import f1ClassesModel from "@/models/f1ClassesModel"
import { connect } from "@/dbConfig/dbConfig"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Helper function to validate date format (DD/MM/YYYY)
const validateDateFormat = (dateString: string): boolean => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(dateString);
};

// Helper function to validate time format (HH:MM)
const validateTimeFormat = (timeString: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
};

// Helper function to compare times (returns true if time1 >= time2)
const isTimeGreaterOrEqual = (time1: string, time2: string): boolean => {
    const [hour1, min1] = time1.split(':').map(Number);
    const [hour2, min2] = time2.split(':').map(Number);
    
    const minutes1 = hour1 * 60 + min1;
    const minutes2 = hour2 * 60 + min2;
    
    return minutes1 >= minutes2;
};

// Bulk cancel appointments (PUT method)
export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {
            midwifeId,
            date,
            time
        }: {
            midwifeId?: string;
            date?: string;
            time?: string;
        } = reqBody

        // Validate required fields
        if (!midwifeId || !date) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "midwifeId and date are required"
            }, { status: 400 })
        }

        // Validate date format
        if (!validateDateFormat(date)) {
            return NextResponse.json({
                error: "Invalid date format",
                details: "Date must be in DD/MM/YYYY format"
            }, { status: 400 })
        }

        // Validate time format if provided
        if (time && !validateTimeFormat(time)) {
            return NextResponse.json({
                error: "Invalid time format",
                details: "Time must be in HH:MM format"
            }, { status: 400 })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cancelledAppointments: any[] = [];
        let totalCancelled = 0;

        // Helper function to check if appointment should be cancelled
        const shouldCancel = (appointmentDate: string, appointmentStartTime: string): boolean => {
            if (appointmentDate !== date) return false;
            
            // If no time specified, cancel all appointments on that date
            if (!time) return true;
            
            // If time specified, cancel only appointments starting at or after that time
            return isTimeGreaterOrEqual(appointmentStartTime, time);
        };

        // ===== Handle A1/A2 Appointments =====
        const a1Bookings = await MidwifeA1Booking.find({ 
            midwifeId,
            status: { $ne: "cancelled" } // Only get non-cancelled appointments
        });

        for (const booking of a1Bookings) {
            if (booking.date === date) {
                // Extract time from selectedSlot (format: "HH:MM-HH:MM")
                const startTime = booking.selectedSlot.split('-')[0];
                
                if (shouldCancel(booking.date, startTime)) {
                    booking.status = "cancelled";
                    await booking.save();
                    
                    cancelledAppointments.push({
                        serviceCode: "A1/A2",
                        clientId: booking.userId,
                        appointmentId: booking._id,
                        appointmentDate: booking.date,
                        startTime: startTime,
                        clientName: booking.fullName,
                        clientEmail: booking.email
                    });
                    totalCancelled++;
                }
            }
        }

        // ===== Handle Pre-Birth Appointments (B1, B2, E1) =====
        const preBirthRecords = await PreBirthAppointments.find({ midwifeId });

        // Track E1 classes that need to be added to cancelExceptional
        const e1ClassesToCancel = new Map<string, string[]>(); // classId -> [classNo, classNo, ...]

        for (const record of preBirthRecords) {
            // Handle B1
            if (record.appointments.B1 && record.appointments.B1.length > 0) {
                for (let i = 0; i < record.appointments.B1.length; i++) {
                    const apt = record.appointments.B1[i];
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        record.appointments.B1[i].status = "cancelled";
                        
                        cancelledAppointments.push({
                            serviceCode: "B1",
                            clientId: record.clientId,
                            appointmentId: apt.appointmentId,
                            appointmentDate: apt.appointmentDate,
                            startTime: apt.startTime,
                            endTime: apt.endTime
                        });
                        totalCancelled++;
                    }
                }
            }

            // Handle B2
            if (record.appointments.B2 && record.appointments.B2.length > 0) {
                for (let i = 0; i < record.appointments.B2.length; i++) {
                    const apt = record.appointments.B2[i];
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        record.appointments.B2[i].status = "cancelled";
                        
                        cancelledAppointments.push({
                            serviceCode: "B2",
                            clientId: record.clientId,
                            appointmentId: apt.appointmentId,
                            appointmentDate: apt.appointmentDate,
                            startTime: apt.startTime,
                            endTime: apt.endTime
                        });
                        totalCancelled++;
                    }
                }
            }

            // Handle E1 - Collect classes to cancel
            if (record.appointments.E1 && record.appointments.E1.length > 0) {
                for (const apt of record.appointments.E1) {
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        const classId = apt.classId.toString();
                        if (!e1ClassesToCancel.has(classId)) {
                            e1ClassesToCancel.set(classId, []);
                        }
                        if (!e1ClassesToCancel.get(classId)!.includes(apt.classNo)) {
                            e1ClassesToCancel.get(classId)!.push(apt.classNo);
                        }
                    }
                }
            }

            record.markModified('appointments');
            await record.save();
        }

        // Process E1 class cancellations - FIXED VERSION
        if (e1ClassesToCancel.size > 0) {
            const e1ClassRecord = await e1ClassesModel.findOne({ midwifeId });

            if (e1ClassRecord) {
                // Convert Map keys to Array to avoid TypeScript iteration error
                for (const classId of Array.from(e1ClassesToCancel.keys())) {
                    const classNos = e1ClassesToCancel.get(classId)!;
                    
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
                        // Add to cancelExceptional array
                        if (!targetClass.cancelExceptional) {
                            targetClass.cancelExceptional = [];
                        }

                        for (const classNo of classNos) {
                            if (!targetClass.cancelExceptional.includes(classNo)) {
                                targetClass.cancelExceptional.push(classNo);
                            }
                        }

                        // Update the class in Map
                        const yearMap = e1ClassRecord.classes.get(targetYear);
                        if (yearMap) {
                            yearMap.set(targetClassName, targetClass);
                            e1ClassRecord.classes.set(targetYear, yearMap);
                        }

                        // Cancel for all clients in this class
                        const clients = targetClass.clients || [];
                        
                        for (const clientId of clients) {
                            const clientPreBirthRecord = await PreBirthAppointments.findOne({
                                clientId: clientId,
                                midwifeId: midwifeId
                            });

                            if (clientPreBirthRecord && clientPreBirthRecord.appointments.E1) {
                                for (let i = 0; i < clientPreBirthRecord.appointments.E1.length; i++) {
                                    const apt = clientPreBirthRecord.appointments.E1[i];
                                    if (classNos.includes(apt.classNo) && apt.status !== "cancelled") {
                                        clientPreBirthRecord.appointments.E1[i].status = "cancelled";
                                        
                                        cancelledAppointments.push({
                                            serviceCode: "E1",
                                            clientId: clientId,
                                            appointmentId: apt.appointmentId,
                                            appointmentDate: apt.appointmentDate,
                                            startTime: apt.startTime,
                                            endTime: apt.endTime,
                                            classNo: apt.classNo
                                        });
                                        totalCancelled++;
                                    }
                                }

                                clientPreBirthRecord.markModified('appointments');
                                await clientPreBirthRecord.save();
                            }
                        }
                    }
                }

                e1ClassRecord.markModified('classes');
                await e1ClassRecord.save();
            }
        }

        // ===== Handle Post-Birth Appointments (C1, C2, D1, D2, F1) =====
        const postBirthRecords = await PostBirthAppointments.find({ midwifeId });

        // Track F1 classes that need to be added to cancelExceptional
        const f1ClassesToCancel = new Map<string, string[]>(); // classId -> [classNo, classNo, ...]

        for (const record of postBirthRecords) {
            // Handle C1
            if (record.appointments.C1 && record.appointments.C1.length > 0) {
                for (let i = 0; i < record.appointments.C1.length; i++) {
                    const apt = record.appointments.C1[i];
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        record.appointments.C1[i].status = "cancelled";
                        
                        cancelledAppointments.push({
                            serviceCode: "C1",
                            clientId: record.clientId,
                            appointmentId: apt.appointmentId,
                            appointmentDate: apt.appointmentDate,
                            startTime: apt.startTime,
                            endTime: apt.endTime
                        });
                        totalCancelled++;
                    }
                }
            }

            // Handle C2
            if (record.appointments.C2 && record.appointments.C2.length > 0) {
                for (let i = 0; i < record.appointments.C2.length; i++) {
                    const apt = record.appointments.C2[i];
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        record.appointments.C2[i].status = "cancelled";
                        
                        cancelledAppointments.push({
                            serviceCode: "C2",
                            clientId: record.clientId,
                            appointmentId: apt.appointmentId,
                            appointmentDate: apt.appointmentDate,
                            startTime: apt.startTime,
                            endTime: apt.endTime
                        });
                        totalCancelled++;
                    }
                }
            }

            // Handle D1
            if (record.appointments.D1 && record.appointments.D1.length > 0) {
                for (let i = 0; i < record.appointments.D1.length; i++) {
                    const apt = record.appointments.D1[i];
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        record.appointments.D1[i].status = "cancelled";
                        
                        cancelledAppointments.push({
                            serviceCode: "D1",
                            clientId: record.clientId,
                            appointmentId: apt.appointmentId,
                            appointmentDate: apt.appointmentDate,
                            startTime: apt.startTime,
                            endTime: apt.endTime
                        });
                        totalCancelled++;
                    }
                }
            }

            // Handle D2
            if (record.appointments.D2 && record.appointments.D2.length > 0) {
                for (let i = 0; i < record.appointments.D2.length; i++) {
                    const apt = record.appointments.D2[i];
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        record.appointments.D2[i].status = "cancelled";
                        
                        cancelledAppointments.push({
                            serviceCode: "D2",
                            clientId: record.clientId,
                            appointmentId: apt.appointmentId,
                            appointmentDate: apt.appointmentDate,
                            startTime: apt.startTime,
                            endTime: apt.endTime
                        });
                        totalCancelled++;
                    }
                }
            }

            // Handle F1 - Collect classes to cancel
            if (record.appointments.F1 && record.appointments.F1.length > 0) {
                for (const apt of record.appointments.F1) {
                    if (apt.status !== "cancelled" && shouldCancel(apt.appointmentDate, apt.startTime)) {
                        const classId = apt.classId.toString();
                        if (!f1ClassesToCancel.has(classId)) {
                            f1ClassesToCancel.set(classId, []);
                        }
                        if (!f1ClassesToCancel.get(classId)!.includes(apt.classNo)) {
                            f1ClassesToCancel.get(classId)!.push(apt.classNo);
                        }
                    }
                }
            }

            record.markModified('appointments');
            await record.save();
        }

        // Process F1 class cancellations - FIXED VERSION
        if (f1ClassesToCancel.size > 0) {
            const f1ClassRecord = await f1ClassesModel.findOne({ midwifeId });

            if (f1ClassRecord) {
                // Convert Map keys to Array to avoid TypeScript iteration error
                for (const classId of Array.from(f1ClassesToCancel.keys())) {
                    const classNos = f1ClassesToCancel.get(classId)!;
                    
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
                        // Add to cancelExceptional array
                        if (!targetClass.cancelExceptional) {
                            targetClass.cancelExceptional = [];
                        }

                        for (const classNo of classNos) {
                            if (!targetClass.cancelExceptional.includes(classNo)) {
                                targetClass.cancelExceptional.push(classNo);
                            }
                        }

                        // Update the class in Map
                        const yearMap = f1ClassRecord.classes.get(targetYear);
                        if (yearMap) {
                            yearMap.set(targetClassName, targetClass);
                            f1ClassRecord.classes.set(targetYear, yearMap);
                        }

                        // Cancel for all clients in this class
                        const clients = targetClass.clients || [];
                        
                        for (const clientId of clients) {
                            const clientPostBirthRecord = await PostBirthAppointments.findOne({
                                clientId: clientId,
                                midwifeId: midwifeId
                            });

                            if (clientPostBirthRecord && clientPostBirthRecord.appointments.F1) {
                                for (let i = 0; i < clientPostBirthRecord.appointments.F1.length; i++) {
                                    const apt = clientPostBirthRecord.appointments.F1[i];
                                    if (classNos.includes(apt.classNo) && apt.status !== "cancelled") {
                                        clientPostBirthRecord.appointments.F1[i].status = "cancelled";
                                        
                                        cancelledAppointments.push({
                                            serviceCode: "F1",
                                            clientId: clientId,
                                            appointmentId: apt.appointmentId,
                                            appointmentDate: apt.appointmentDate,
                                            startTime: apt.startTime,
                                            endTime: apt.endTime,
                                            classNo: apt.classNo
                                        });
                                        totalCancelled++;
                                    }
                                }

                                clientPostBirthRecord.markModified('appointments');
                                await clientPostBirthRecord.save();
                            }
                        }
                    }
                }

                f1ClassRecord.markModified('classes');
                await f1ClassRecord.save();
            }
        }

        // Return response
        return NextResponse.json({
            message: time 
                ? `Successfully cancelled ${totalCancelled} appointments on ${date} starting from ${time}`
                : `Successfully cancelled ${totalCancelled} appointments on ${date}`,
            success: true,
            summary: {
                date: date,
                time: time || "All day",
                totalCancelled: totalCancelled,
                midwifeId: midwifeId
            },
            cancelledAppointments: cancelledAppointments
        })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}