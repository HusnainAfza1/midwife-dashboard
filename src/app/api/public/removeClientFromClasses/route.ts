import PreBirthAppointments from "@/models/preBirthAppointments"
import PostBirthAppointments from "@/models/postBirthAppointments"
import e1ClassesModel from "@/models/e1ClassesModel"
import f1ClassesModel from "@/models/f1ClassesModel"
import { connect } from "@/dbConfig/dbConfig"
// import { authorize } from "@/middleware/authorize"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Remove client from E1/F1 class
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
            clientId,
            midwifeId,
            classId
        }: {
            serviceCode?: string;
            clientId?: string;
            midwifeId?: string;
            classId?: string;
        } = reqBody

        // Validate service code - must be E1 or F1
        if (!serviceCode || (serviceCode !== "E1" && serviceCode !== "F1")) {
            return NextResponse.json({
                error: "Invalid service code",
                details: "Service code must be either 'E1' or 'F1'"
            }, { status: 400 })
        }

        // Validate required fields
        if (!clientId || !midwifeId || !classId) {
            return NextResponse.json({
                error: "Missing required fields",
                details: "clientId, midwifeId, and classId are required"
            }, { status: 400 })
        }

        // Handle E1 removal
        if (serviceCode === "E1") {
            // Step 1: Remove all E1 appointments from PreBirth record
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

            // Clear all E1 appointments
            const removedAppointmentsCount = preBirthRecord.appointments.E1?.length || 0
            preBirthRecord.appointments.E1 = []
            preBirthRecord.markModified('appointments')
            await preBirthRecord.save()

            // Step 2: Remove client from e1Classes
            const e1ClassRecord = await e1ClassesModel.findOne({ midwifeId })

            if (!e1ClassRecord) {
                return NextResponse.json({
                    error: "E1 class record not found",
                    details: "No E1 classes found for provided midwifeId"
                }, { status: 404 })
            }

            // Find the class in nested structure
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let targetClass: any = null
            let targetYear: string = ""
            let targetClassName: string = ""
            let clientFound = false

            for (const [year, yearClasses] of e1ClassRecord.classes) {
                for (const [className, classDetail] of yearClasses) {
                    if (classDetail.id.toString() === classId) {
                        targetClass = classDetail
                        targetYear = year
                        targetClassName = className
                        break
                    }
                }
                if (targetClass) break
            }

            if (!targetClass) {
                return NextResponse.json({
                    error: "Class not found",
                    details: "No class found with provided classId"
                }, { status: 404 })
            }

            // Remove client from clients array
            if (targetClass.clients && Array.isArray(targetClass.clients)) {
                const clientIndex = targetClass.clients.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (id: any) => id.toString() === clientId
                )

                if (clientIndex !== -1) {
                    targetClass.clients.splice(clientIndex, 1)
                    clientFound = true
                }
            }

            if (!clientFound) {
                return NextResponse.json({
                    error: "Client not found in class",
                    details: "Client ID not found in the specified class's clients array"
                }, { status: 404 })
            }

            // Update the class in Map
            const yearMap = e1ClassRecord.classes.get(targetYear)
            if (yearMap) {
                yearMap.set(targetClassName, targetClass)
                e1ClassRecord.classes.set(targetYear, yearMap)
            }

            e1ClassRecord.markModified('classes')
            await e1ClassRecord.save()

            return NextResponse.json({
                message: "Client removed from E1 class successfully",
                success: true,
                data: {
                    serviceCode: "E1",
                    clientId: clientId,
                    classId: classId,
                    removedAppointments: removedAppointmentsCount,
                    remainingClientsInClass: targetClass.clients.length
                }
            })
        }

        // Handle F1 removal
        if (serviceCode === "F1") {
            // Step 1: Remove all F1 appointments from PostBirth record
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

            // Clear all F1 appointments
            const removedAppointmentsCount = postBirthRecord.appointments.F1?.length || 0
            postBirthRecord.appointments.F1 = []
            postBirthRecord.markModified('appointments')
            await postBirthRecord.save()

            // Step 2: Remove client from f1Classes
            const f1ClassRecord = await f1ClassesModel.findOne({ midwifeId })

            if (!f1ClassRecord) {
                return NextResponse.json({
                    error: "F1 class record not found",
                    details: "No F1 classes found for provided midwifeId"
                }, { status: 404 })
            }

            // Find the class in nested structure
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let targetClass: any = null
            let targetYear: string = ""
            let targetClassName: string = ""
            let clientFound = false

            for (const [year, yearClasses] of f1ClassRecord.classes) {
                for (const [className, classDetail] of yearClasses) {
                    if (classDetail.id.toString() === classId) {
                        targetClass = classDetail
                        targetYear = year
                        targetClassName = className
                        break
                    }
                }
                if (targetClass) break
            }

            if (!targetClass) {
                return NextResponse.json({
                    error: "Class not found",
                    details: "No class found with provided classId"
                }, { status: 404 })
            }

            // Remove client from clients array
            if (targetClass.clients && Array.isArray(targetClass.clients)) {
                const clientIndex = targetClass.clients.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (id: any) => id.toString() === clientId
                )

                if (clientIndex !== -1) {
                    targetClass.clients.splice(clientIndex, 1)
                    clientFound = true
                }
            }

            if (!clientFound) {
                return NextResponse.json({
                    error: "Client not found in class",
                    details: "Client ID not found in the specified class's clients array"
                }, { status: 404 })
            }

            // Update the class in Map
            const yearMap = f1ClassRecord.classes.get(targetYear)
            if (yearMap) {
                yearMap.set(targetClassName, targetClass)
                f1ClassRecord.classes.set(targetYear, yearMap)
            }

            f1ClassRecord.markModified('classes')
            await f1ClassRecord.save()

            return NextResponse.json({
                message: "Client removed from F1 class successfully",
                success: true,
                data: {
                    serviceCode: "F1",
                    clientId: clientId,
                    classId: classId,
                    removedAppointments: removedAppointmentsCount,
                    remainingClientsInClass: targetClass.clients.length
                }
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Remove client from class error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}