import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import e1ClassesModel from "@/models/e1ClassesModel"
import f1ClassesModel from "@/models/f1ClassesModel"
import { connect } from "@/dbConfig/dbConfig"
// import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { format, addDays, getDay, isWeekend } from 'date-fns'

export const dynamic = 'force-dynamic';

connect()

// Helper function to check if date is German holiday
// const isGermanHoliday = (date: Date): boolean => {
//     // Simplified - add full German holiday logic here
//     const year = date.getFullYear()
//     const month = date.getMonth()
//     const day = date.getDate()

//     // New Year's Day
//     if (month === 0 && day === 1) return true
//     // Christmas
//     if (month === 11 && (day === 25 || day === 26)) return true
//     // Add more holidays as needed

//     return false
// }

// Helper to check if date is valid for scheduling
const isValidSchedulingDate = (date: Date): boolean => {
    // return !isWeekend(date) && !isGermanHoliday(date)
    return !isWeekend(date)
}

// Helper to calculate duration
const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    return (endHour * 60 + endMin) - (startHour * 60 + startMin)
}

// Generate unique ID
const generateUniqueId = (): string => {
    return crypto.randomBytes(12).toString('hex')
}

// Parse DD/MM/YYYY to Date
const parseAppointmentDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
}

// Map class to months
const getClassMonths = (classKey: string): { start: number; end: number } | null => {
    const mapping: { [key: string]: { start: number; end: number } } = {
        "class1": { start: 1, end: 2 },
        "class2": { start: 3, end: 4 },
        "class3": { start: 5, end: 6 },
        "class4": { start: 7, end: 8 },
        "class5": { start: 9, end: 10 },
        "class6": { start: 11, end: 12 }
    }
    return mapping[classKey] || null
}

// Add client to E1/F1 class and generate appointments
export async function POST(request: NextRequest) {
    try {
        // Authorize request
        // const auth = await authorize(request, ["superuser", "midwife", "admin"])
        // if (!auth.success) {
        //     return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        // }

        const reqBody = await request.json()
        const {
            serviceCode,
            midwifeId,
            clientId,
            year,
            class: classKey,  //class1
            timetable
        }: {
            serviceCode?: string
            midwifeId?: string
            clientId?: string
            year?: string
            class?: string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timetable?: any
        } = reqBody

        // Validate service code
        if (!serviceCode || (serviceCode !== "E1" && serviceCode !== "F1")) {
            return NextResponse.json({
                error: "Invalid service code",
                details: "Service code must be either 'E1' or 'F1'"
            }, { status: 400 })
        }

        // Validate required fields
        if (!midwifeId || !clientId || !year || !classKey || !timetable) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "midwifeId, clientId, year, class, and timetable are required"
            }, { status: 400 })
        }

        // Validate class key
        const classMonths = getClassMonths(classKey)
        if (!classMonths) {
            return NextResponse.json({
                error: "Invalid class",
                details: "Class must be one of: class1, class2, class3, class4, class5, class6"
            }, { status: 400 })
        }

        const isE1 = serviceCode === "E1"
        const ClassModel = isE1 ? e1ClassesModel : f1ClassesModel

        // Fetch or create classes document
        let classesDoc = await ClassModel.findOne({ midwifeId })

        if (!classesDoc) {
            // Create new document with empty classes
            classesDoc = new ClassModel({
                midwifeId,
                classes: new Map()
            })
        }

        // Ensure year exists
        if (!classesDoc.classes.get(year)) {
            classesDoc.classes.set(year, new Map())
        }

        // Get year map
        const yearMap = classesDoc.classes.get(year)

        // Check if class exists
        let targetClass = yearMap?.get(classKey)

        if (targetClass) {
            // Class exists - check if client already in it
            if (targetClass.clients.includes(clientId)) {
                return NextResponse.json({
                    error: "Client already assigned",
                    details: `Client is already assigned to ${classKey} in year ${year}`
                }, { status: 400 })
            }

            // Check if class is full
            if (targetClass.clients.length >= 10) {
                return NextResponse.json({
                    error: "Class is full",
                    details: `${classKey} has reached maximum capacity (10 clients)`
                }, { status: 400 })
            }

            // Add client to existing class
            targetClass.clients.push(clientId)

            // Update the class in the year map
            yearMap.set(classKey, targetClass)
        } else {
            // Create new class
            // Find first valid day in the month with slots
            const monthStart = new Date(parseInt(year), classMonths.start - 1, 1)
            let currentDate = monthStart
            let foundDate = null
            let foundSlot = null

            for (let attempt = 0; attempt < 60; attempt++) {
                if (currentDate.getMonth() >= classMonths.end) break

                const dayName = format(currentDate, 'EEEE')
                const daySlots = timetable[dayName]?.slots?.[serviceCode]

                if (isValidSchedulingDate(currentDate) && daySlots && daySlots.length > 0) {
                    foundDate = currentDate
                    foundSlot = daySlots[0]
                    break
                }

                currentDate = addDays(currentDate, 1)
            }

            if (!foundDate || !foundSlot) {
                return NextResponse.json({
                    error: "No valid slots found",
                    details: `Could not find valid ${serviceCode} slots in timetable for ${classKey} period`
                }, { status: 400 })
            }

            const duration = calculateDuration(foundSlot.startTime, foundSlot.endTime)

            // Create new class
            targetClass = {
                id: generateUniqueId(),
                startDate: format(foundDate, 'dd/MM/yyyy'),
                startTime: foundSlot.startTime,
                endTime: foundSlot.endTime,
                duration: duration,
                clients: [clientId],
                exceptional: []
            }

            // Add to year map
            yearMap.set(classKey, targetClass)
        }

        // Save classes document
        classesDoc.markModified('classes')
        await classesDoc.save()

        // Generate appointments
        const numSessions = isE1 ? 6 : 8
        const appointments = []
        const startDate = parseAppointmentDate(targetClass.startDate)

        for (let session = 0; session < numSessions; session++) {
            const sessionDate = addDays(startDate, session * 7)
            const classNo = `${targetClass.id}-${session + 1}`

            // Check for exception
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exception = targetClass.exceptional?.find((ex: any) => ex.classNo === classNo)

            if (exception) {
                appointments.push({
                    appointmentId: generateUniqueId(),
                    appointmentDate: exception.startDate,
                    startTime: exception.startTime,
                    endTime: exception.endTime,
                    duration: exception.duration,
                    status: "pending",
                    classId: targetClass.id,
                    classNo: classNo
                })
            } else {
                appointments.push({
                    appointmentId: generateUniqueId(),
                    appointmentDate: format(sessionDate, 'dd/MM/yyyy'),
                    startTime: targetClass.startTime,
                    endTime: targetClass.endTime,
                    duration: targetClass.duration,
                    status: "pending",
                    classId: targetClass.id,
                    classNo: classNo
                })
            }
        }

        // Save appointments to PreBirth or PostBirth
        if (isE1) {
            const preBirthRecord = await PreBirthAppointments.findOne({ clientId, midwifeId })

            if (!preBirthRecord) {
                return NextResponse.json({
                    error: "PreBirth record not found",
                    details: "No PreBirth appointment record exists for this client"
                }, { status: 404 })
            }

            // Only add if E1 array is empty
            if (!preBirthRecord.appointments.E1 || preBirthRecord.appointments.E1.length === 0) {
                preBirthRecord.appointments.E1 = appointments
                preBirthRecord.markModified('appointments')
                await preBirthRecord.save()
            }
        } else {
            const postBirthRecord = await PostBirthAppointments.findOne({ clientId, midwifeId })

            if (!postBirthRecord) {
                return NextResponse.json({
                    error: "PostBirth record not found",
                    details: "No PostBirth appointment record exists for this client"
                }, { status: 404 })
            }

            // Only add if F1 array is empty
            if (!postBirthRecord.appointments.F1 || postBirthRecord.appointments.F1.length === 0) {
                postBirthRecord.appointments.F1 = appointments
                postBirthRecord.markModified('appointments')
                await postBirthRecord.save()
            }
        }

        return NextResponse.json({
            message: `Client successfully added to ${serviceCode} ${classKey}`,
            success: true,
            data: {
                serviceCode: serviceCode,
                year: year,
                class: classKey,
                classId: targetClass.id,
                clientId: clientId,
                appointmentsGenerated: appointments.length,
                appointments: appointments,
                classDetails: {
                    startDate: targetClass.startDate,
                    startTime: targetClass.startTime,
                    endTime: targetClass.endTime,
                    totalClients: targetClass.clients.length
                }
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Add client to class error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}