import { connect } from "@/dbConfig/dbConfig"
import { sendEmail } from "@/helper/mailer"
import { authorize } from "@/middleware/authorize"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import mongoose from "mongoose"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Create a new salesperson (Super User only)
export async function POST(request: NextRequest) {
    try {
        // Authorize request - only superusers can create salespersons
        const auth = await authorize(request, ["superuser"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const reqBody = await request.json()
        const { username, email, password } = reqBody

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        await sendEmail({
            receiver: email,
            subject: "Your Dashboard Credentials",
            message: `Hi ${username}, your credentails are as follows:\nEmail: ${email}\nPassword:${password}`,
        })

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const managedById = new mongoose.Types.ObjectId(auth.user.id);

        const newSalesperson = new User({
            username,
            email,
            password: hashedPassword,
            role: "salesperson",
            managedBy: managedById,
        })

        const savedUser = await newSalesperson.save()

        return NextResponse.json({
            message: "Salesperson created successfully",
            success: true,
            salesperson: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Get all salespersons managed by the authenticated super user
export async function GET(request: NextRequest) {
    try {
        const auth = await authorize(request, ["superuser"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
        }

        const managedById = new mongoose.Types.ObjectId(auth.user.id);

        const salespersons = await User.find({
            role: "salesperson",
            managedBy: managedById,
        }).select("_id username email createdAt")

        return NextResponse.json({
            success: true,
            salespersons,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching salespersons:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

