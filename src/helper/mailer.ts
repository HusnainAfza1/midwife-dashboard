import nodemailer from "nodemailer"

interface EmailPayload {
    receiver: string
    subject: string
    message: string
}

export const sendEmail = async ({ receiver, subject, message }: EmailPayload) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.MAILER_USERNAME,
                pass: process.env.MAILER_PASS,
            },
        })

        const mailOptions = {
            from: `"Hebammenbüro - hello@hebammenbüro.de" <${process.env.MAILER_USERNAME}>`,
            to: receiver,
            subject: subject,
            html: message,
        }

        const mailResponse = await transporter.sendMail(mailOptions)
        console.log(`Email sent: ${mailResponse.response}`)
        return mailResponse
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to send email: ${error.message}`)
        }
        throw new Error("Failed to send email")
    }
}

