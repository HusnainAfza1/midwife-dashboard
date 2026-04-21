import { connect } from "@/dbConfig/dbConfig"
import { signJwtToken } from '@/lib/jwt'
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password, fullName } = reqBody

        console.log(reqBody)

        // Check if user already exists
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
            role: "client", // Set role to client
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        // AUTO LOGIN: Create token data with role information
        const tokenData = {
            id: savedUser._id.toString(),
            username: savedUser.username,
            fullName: savedUser.fullName,
            email: savedUser.email,
            role: savedUser.role,
            managedBy: savedUser.managedBy ? savedUser.managedBy.toString() : null,
        }

        // Create token
        const token = await signJwtToken(tokenData);

        const response = NextResponse.json({
            message: "Client Created and Logged in Successfully",
            success: true,
            token: token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                fullName: savedUser.fullName,
                email: savedUser.email,
                role: savedUser.role,
            },
        })

        // // Set cookie for auto login
        // response.cookies.set("token", token, {
        //     httpOnly: true,
        // })

        return response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("error in register client::", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}