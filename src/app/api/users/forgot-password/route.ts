import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { sendEmail } from "@/helper/mailer"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import bcryptjs from "bcryptjs"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email } = reqBody

        // Validate email
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        console.log(`Password reset requested for: ${email}`)

        // Find user by email
        const user = await User.findOne({ email })

        // SECURITY: Always return success even if user doesn't exist
        // This prevents email enumeration attacks
        if (!user) {
            console.log("User not found, but returning success to prevent enumeration")
            return NextResponse.json({
                message: "If an account exists with this email, you will receive a password reset link",
                success: true,
            })
        }

        // Generate a secure random token (32 bytes = 64 hex characters)
        const resetToken = crypto.randomBytes(32).toString("hex")

        // Hash the token before storing (security best practice)
        const hashedToken = await bcryptjs.hash(resetToken, 10)

        // Set token and expiry (5 minutes from now)
        user.forgotPasswordToken = hashedToken
        user.forgotPasswordTokenExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        user.updatedAt = new Date()

        await user.save()

        console.log(`Reset token generated for user: ${user.username}`)

        // Create reset link with the UNHASHED token
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

        // Send email
        await sendEmail({
            receiver: user.email,
            subject: "Password Reset Request - Hebammenbüro",
            message: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${user.username},</p>
                    <p>You requested to reset your password. Click the button below to reset it:</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                    <p><strong>This link will expire in 5 minutes.</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px;">
                        Hebammenbüro<br>
                        hello@hebammenbüro.de
                    </p>
                </div>
            `,
        })

        console.log(`Reset email sent to: ${user.email}`)

        return NextResponse.json({
            message: "If an account exists with this email, you will receive a password reset link",
            success: true,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Forgot password error:", error)
        return NextResponse.json(
            { error: "Failed to process password reset request" },
            { status: 500 }
        )
    }
}