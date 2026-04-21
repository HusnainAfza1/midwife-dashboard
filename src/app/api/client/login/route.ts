import { connect } from "@/dbConfig/dbConfig"
import { signJwtToken } from '@/lib/jwt'
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody

        console.log(reqBody)

        // Check if user exists
        const user = await User.findOne({ email })

        if (!user) {
            console.log("User does not exist")
            return NextResponse.json({ error: "User does not exist" }, { status: 400 })
        }
        console.log("user exists")

        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            console.log("Your Password is Wrong")
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 })
        }

        console.log(user)
        if (user.role !== "client") {
            return NextResponse.json({ error: `You are register as a ${user.role} this is client Dashboard` })
        }



        // Create token data with role information
        const tokenData = {
            id: user._id.toString(),
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            managedBy: user.managedBy ? user.managedBy.toString() : null,
        }

        // Create token
        const token = await signJwtToken(tokenData);

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            token: token,
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        })

        // response.cookies.set("token", token, {
        //     httpOnly: true,
        // })
        return response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

