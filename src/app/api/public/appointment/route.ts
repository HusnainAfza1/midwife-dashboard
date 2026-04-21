import { connect } from "@/dbConfig/dbConfig"
import Appointment from "@/models/appointmentModel"
import User from "@/models/userModel"
import { NextResponse } from "next/server"
import { sendEmail } from "@/helper/mailer"
import { generateAppointmentEmail } from "./confirmationTemplate"
import { generateAppointmentEmailForSalesperson } from "./confirmationTemplateSalesperson"

export const dynamic = 'force-dynamic';

connect()

export async function GET() {
    const data = {
        selectedDate: "01/06/2025",
        name: "Usama Mehmood",
        startTime: "10:00",
        meetingLink: "https://zoom.us/j/123456789",
    }

    try {

        await sendEmail({
            // receiver: "usamamehmood443@gmail.com",
            receiver: "usman.akhtar031@gmail.com",
            // receiver: "it@xn--hebammenbro-1hb.de",
            // receiver: "it@hebammenbüro.de",
            // receiver: "mehti@xn--hebammenbro-1hb.de",
            subject: `Terminbestätigung & Meeting Link`,
            // message: "Testing email",
            message: generateAppointmentEmail(data)
        });

        return NextResponse.json({ message: "Email sent" })
    } catch (error) {
        console.error("Error sending email:", error)
        return NextResponse.json({ message: "Error while sending email" })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Validate required fields
        const requiredFields = ['selectedDate', 'startTime', 'endTime', 'name', 'email', 'phone', 'assignedTo']
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json({
                    error: `Missing required field: ${field}`
                }, { status: 400 })
            }
        }

        // Find the salesperson by username
        const salesperson = await User.findOne({
            username: data.assignedTo,
            role: { $in: ["salesperson", "superuser"] }
        })

        if (!salesperson) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 422 })
        }

        console.log("=====data=====")
        console.log(data)

        // Create the appointment
        const appointment = new Appointment({
            userId: salesperson._id,
            selectedDate: data.selectedDate,
            startTime: data.startTime,
            endTime: data.endTime,
            timezone: data.timezone || "UTC",
            name: data.name,
            email: data.email,
            phone: data.phone,
            location: data.location || "",
            challengeOptions: data.challengeOptions || "",
            challengeDescription: data.challengeDescription || "",
            meetingLink: data.meetingLink || "",
            createdAt: new Date(),
        })

        await appointment.save()


        await sendEmail({
            receiver: data.email,
            subject: `Terminbestätigung & Meeting Link`,
            message: generateAppointmentEmail(data)
        });

        await sendEmail({
            receiver: salesperson.email,
            subject: `Terminbestätigung & Meeting Link`,
            message: generateAppointmentEmailForSalesperson(data)
        });

        // Return success response
        return NextResponse.json({
            message: "Appointment registered successfully",
            success: true,
            data: {
                id: appointment._id,
                selectedDate: appointment.selectedDate,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                name: appointment.name,
                email: appointment.email,
                challengeOptions: data.challengeOptions || "",
                challengeDescription: data.challengeDescription || "",
                assignedTo: data.assignedTo
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error registering appointment:", error)
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}