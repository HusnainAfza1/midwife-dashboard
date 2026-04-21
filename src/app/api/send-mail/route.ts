import { sendEmail } from "@/helper/mailer"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { receiver, subject, message } = reqBody

        // Validate inputs
        if (!receiver || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Send email
        await sendEmail({
            receiver,
            subject,
            message,
        })

        return NextResponse.json({
            message: "Email sent successfully",
            success: true,
        })
    } catch (error) {
        console.error("Email sending error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to send email" },
            { status: 500 },
        )
    }
}

