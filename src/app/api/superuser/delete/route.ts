import { connect } from "@/dbConfig/dbConfig"
import { verifyJwtToken } from "@/lib/jwt"
import Appointment from "@/models/appointmentModel"
import Schedule from "@/models/scheduleModel"
import User from "@/models/userModel"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

connect()

export async function DELETE(request: NextRequest) {
    try {
        // Get token from cookies
        const token = request.cookies.get("token")?.value || ""

        if (!token) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        // Verify token and get user
        const decodedToken = await verifyJwtToken(token)

        // Only allow superusers to perform this operation
        if (decodedToken.role !== "superuser") {
            return NextResponse.json({ error: "Only superusers can delete their account" }, { status: 403 })
        }

        // Get confirmation from request body
        const { confirmation } = await request.json()

        if (confirmation !== "DELETE_MY_ACCOUNT_AND_ALL_DATA") {
            return NextResponse.json({
                error: "Confirmation phrase does not match. Please provide the exact confirmation phrase."
            }, { status: 400 })
        }

        // Start a session for transaction
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            // 1. Find all salespersons managed by this superuser
            const salespersons = await User.find({
                managedBy: new mongoose.Types.ObjectId(decodedToken.id),
                role: "salesperson"
            }).session(session)

            const salespersonIds = salespersons.map(sp => sp._id)

            // 2. Delete all schedules for the superuser and their salespersons
            await Schedule.deleteMany({
                userId: { $in: [...salespersonIds, new mongoose.Types.ObjectId(decodedToken.id)] }
            }).session(session)

            // 3. Delete all appointments for the superuser and their salespersons
            await Appointment.deleteMany({
                userId: { $in: [...salespersonIds, new mongoose.Types.ObjectId(decodedToken.id)] }
            }).session(session)

            // 4. Delete all salespersons managed by this superuser
            await User.deleteMany({
                _id: { $in: salespersonIds }
            }).session(session)

            // 5. Finally, delete the superuser
            await User.findByIdAndDelete(decodedToken.id).session(session)

            // Commit the transaction
            await session.commitTransaction()
            session.endSession()

            // Clear the authentication cookie
            const response = NextResponse.json({
                message: "Superuser account and all associated data deleted successfully",
                success: true
            })

            response.cookies.delete("token")
            return response

        } catch (error) {
            // If anything fails, abort the transaction
            await session.abortTransaction()
            session.endSession()
            throw error
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting superuser account:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}