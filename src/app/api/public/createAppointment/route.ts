import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import { connect } from "@/dbConfig/dbConfig"
// import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'

export const dynamic = 'force-dynamic';

connect()

// Constants
const ALLOWED_SERVICE_CODES: string[] = ["B1", "B2", "C1", "C2", "D1", "D2"];

const SERVICES_DURATIONS: { id: string; duration: number }[] = [
    { id: "A1/A2", duration: 50 },
    { id: "B1", duration: 60 },
    { id: "B2", duration: 50 },
    { id: "C1", duration: 60 },
    { id: "C2", duration: 25 },
    { id: "D1", duration: 60 },
    { id: "D2", duration: 25 },
    { id: "E1", duration: 140 },
    { id: "F1", duration: 75 },
];

// Helper function to generate unique ID
const generateUniqueId = (): string => {
    return crypto.randomBytes(12).toString('hex')
}

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

// Add single appointment (POST method)
export async function POST(request: NextRequest) {
    try {
        // Authorize request - adjust roles as needed
        // const auth = await authorize(request, ["superuser", "midwife", "admin"])
        // if (!auth.success) {
        //     return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        // }

        const reqBody = await request.json()
        const {
            serviceCode,
            clientId,
            midwifeId,
            appointmentDate,
            startTime,
            endTime
        }: {
            serviceCode?: string;
            clientId?: string;
            midwifeId?: string;
            appointmentDate?: string;
            startTime?: string;
            endTime?: string;
        } = reqBody

        // Validate service code
        if (!serviceCode || !ALLOWED_SERVICE_CODES.includes(serviceCode)) {
            return NextResponse.json({
                error: "Invalid service code",
                details: `Service code must be one of: ${ALLOWED_SERVICE_CODES.join(', ')}`
            }, { status: 400 })
        }

        // Validate required fields
        if (!clientId || !midwifeId || !appointmentDate || !startTime || !endTime) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "serviceCode, clientId, midwifeId, appointmentDate, startTime, and endTime are required"
            }, { status: 400 })
        }

        // Validate date format
        if (!validateDateFormat(appointmentDate)) {
            return NextResponse.json({
                error: "Invalid date format",
                details: "Date must be in DD/MM/YYYY format"
            }, { status: 400 })
        }

        // Calculate duration
        const calculatedDuration = calculateDuration(startTime, endTime);

        // Validate duration matches service code
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

        // Create appointment object
        const newAppointment = {
            appointmentId: generateUniqueId(),
            appointmentDate: appointmentDate,
            startTime: startTime,
            endTime: endTime,
            duration: calculatedDuration,
            status: "pending"
        }

        // Handle PreBirth appointments (B1, B2)
        if (["B1", "B2"].includes(serviceCode)) {
            // eslint-disable-next-line prefer-const
            let preBirthRecord = await PreBirthAppointments.findOne({
                clientId,
                midwifeId
            })

            // If record doesn't exist, create it
            if (!preBirthRecord) {
                return NextResponse.json({
                    error: "PreBirth record not found",
                    details: "No PreBirth appointment record exists for this client and midwife. Please create the record first."
                }, { status: 404 })
            }

            // Add appointment to the service array
            if (!preBirthRecord.appointments[serviceCode]) {
                preBirthRecord.appointments[serviceCode] = []
            }

            preBirthRecord.appointments[serviceCode].push(newAppointment)
            preBirthRecord.markModified('appointments')
            await preBirthRecord.save()

            return NextResponse.json({
                message: `${serviceCode} appointment added successfully`,
                success: true,
                appointment: {
                    appointmentId: newAppointment.appointmentId,
                    appointmentDate: newAppointment.appointmentDate,
                    startTime: newAppointment.startTime,
                    endTime: newAppointment.endTime,
                    duration: newAppointment.duration,
                    serviceCode: serviceCode,
                    totalAppointments: preBirthRecord.appointments[serviceCode].length
                }
            })
        }

        // Handle PostBirth appointments (C1, C2, D1, D2)
        if (["C1", "C2", "D1", "D2"].includes(serviceCode)) {
            // eslint-disable-next-line prefer-const
            let postBirthRecord = await PostBirthAppointments.findOne({
                clientId,
                midwifeId
            })

            // If record doesn't exist, return error
            if (!postBirthRecord) {
                return NextResponse.json({
                    error: "PostBirth record not found",
                    details: "No PostBirth appointment record exists for this client and midwife. Please create the record first."
                }, { status: 404 })
            }

            // Add appointment to the service array
            if (!postBirthRecord.appointments[serviceCode]) {
                postBirthRecord.appointments[serviceCode] = []
            }

            postBirthRecord.appointments[serviceCode].push(newAppointment)
            postBirthRecord.markModified('appointments')
            await postBirthRecord.save()

            return NextResponse.json({
                message: `${serviceCode} appointment added successfully`,
                success: true,
                appointment: {
                    appointmentId: newAppointment.appointmentId,
                    appointmentDate: newAppointment.appointmentDate,
                    startTime: newAppointment.startTime,
                    endTime: newAppointment.endTime,
                    duration: newAppointment.duration,
                    serviceCode: serviceCode,
                    totalAppointments: postBirthRecord.appointments[serviceCode].length
                }
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Add appointment error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}