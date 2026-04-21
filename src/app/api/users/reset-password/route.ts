import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { type NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token, newPassword } = reqBody

        console.log("Password reset attempt received")

        // Validate inputs
        if (!token || !newPassword) {
            return NextResponse.json(
                { error: "Token and new password are required" },
                { status: 400 }
            )
        }

        // Validate password strength (optional but recommended)
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            )
        }

        // Find all users with non-expired tokens
        const users = await User.find({
            forgotPasswordToken: { $exists: true, $ne: null },
            forgotPasswordTokenExpiry: { $gt: new Date() },
        })

        if (users.length === 0) {
            console.log("No valid reset tokens found")
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        // Find the user whose hashed token matches
        let matchedUser = null
        for (const user of users) {
            const isValidToken = await bcryptjs.compare(token, user.forgotPasswordToken)
            if (isValidToken) {
                matchedUser = user
                break
            }
        }

        if (!matchedUser) {
            console.log("Token does not match any user")
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        console.log(`Valid token found for user: ${matchedUser.username}`)

        // Hash the new password (same method as registration)
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        // Update password and clear reset token fields
        matchedUser.password = hashedPassword
        matchedUser.forgotPasswordToken = undefined
        matchedUser.forgotPasswordTokenExpiry = undefined
        matchedUser.updatedAt = new Date()

        await matchedUser.save()

        console.log(`Password successfully reset for user: ${matchedUser.username}`)

        return NextResponse.json({
            message: "Password reset successful. You can now login with your new password.",
            success: true,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Reset password error:", error)
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        )
    }
}