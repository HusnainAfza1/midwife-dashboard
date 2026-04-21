import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email } = reqBody

        // Validate input
        if (!email && !username) {
            return NextResponse.json(
                { error: "Please provide either email or username" },
                { status: 400 }
            )
        }

        // Build query to check for existing user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}
        if (email) query.email = email
        if (username) query.username = username

        // Check if user exists with email OR username
        const existingUser = await User.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(username ? [{ username }] : [])
            ]
        })

        if (existingUser) {
            // Determine which field matched
            const matchedField = 
                existingUser.email === email ? "email" : "username"
            
            return NextResponse.json({
                exists: true,
                message: `User with this ${matchedField} already exists`,
                matchedField
            }, { status: 200 })
        }

        return NextResponse.json({
            exists: false,
            message: "User does not exist"
        }, { status: 200 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}