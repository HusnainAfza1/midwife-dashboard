import User from "@/models/userModel"
import { connect } from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

export async function GET(request: NextRequest) {
    try {
        const username = request?.nextUrl?.searchParams.get('username')
        const email = request?.nextUrl?.searchParams.get('email')

        // Check if at least one parameter is provided
        if (!username && !email) {
            return NextResponse.json({
                error: "Missing username or email"
            }, { status: 400 })
        }

        // Build query based on provided parameter
        const query = username ? { username: username } : { email: email }

        // Find the user by username or email
        const user = await User.findOne(query)

        // If user not found, return a 404 response
        if (!user) {
            return NextResponse.json({
                error: "User not found"
            },)
        }

        // Return user details on success
        return NextResponse.json({
            success: true,
            username: user.username,
            role: user.role,
            email: user.email,  
            data : user
        }) 
    } catch (err) {
        return NextResponse.json({
            success: false,
            error: 'Error fetching user:', err
        }, { status: 500 })
    }
}