import User from "@/models/userModel"
import { connect } from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { ids } = body

        // Check if ids array is provided
        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({
                success: false,
                error: "Missing or invalid ids array"
            }, { status: 400 })
        }

        // Find users by IDs
        const users = await User.find({ _id: { $in: ids } })

        // Create a mapping of user ID to user details (name, email, role)
        const userDetails = users.reduce((acc: { [key: string]: { name: string, email: string, role: string } }, user) => {
            acc[user._id.toString()] = {
                name: user.username,
                email: user.email,
                role: user.role
            }
            return acc
        }, {})

        // Return user details mapping
        return NextResponse.json({
            success: true,
            data: userDetails
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: 'Error fetching user details: ' + err.message
        }, { status: 500 })
    }
}