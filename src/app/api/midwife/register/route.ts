import { connect } from "@/dbConfig/dbConfig"
// import { signJwtToken } from '@/lib/jwt'  
import { authorize } from "@/middleware/authorize"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"  
import mongoose from "mongoose"

connect()

export async function POST(request: NextRequest) {
    try {
        const auth = await authorize(request, ["superuser"]);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }


        const reqBody = await request.json()
        const { username, email, password } = reqBody

        console.log(reqBody)

        // Check if user already exists
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)  
        const managedById = new mongoose.Types.ObjectId(auth.user.id);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "midwife", // Set role to client  
            managedBy :managedById
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        // AUTO LOGIN: Create token data with role information
        // const tokenData = {
        //     id: savedUser._id.toString(),
        //     username: savedUser.username,
        //     email: savedUser.email,
        //     role: savedUser.role,
        //     managedBy: savedUser.managedBy ? savedUser.managedBy.toString() : null,
        // }

        // Create token
        // const token = await signJwtToken(tokenData);

        const response = NextResponse.json({
            message: "Midwife is Created  Successfully",
            success: true,
            // token: token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
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
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}