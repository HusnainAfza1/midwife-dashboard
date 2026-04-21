import { connect } from "@/dbConfig/dbConfig"
import { sendEmail } from "@/helper/mailer"
import { authorize } from "@/middleware/authorize"
import Appointment from "@/models/appointmentModel"
import Schedule from "@/models/scheduleModel"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

connect()

// Get a specific salesperson
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const salespersonId = params.id

        const auth = await authorize(request)
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 401 })
        }

        const salesperson = await User.findById(salespersonId).select("_id username email createdAt")

        if (!salesperson) {
            return NextResponse.json({ error: "Salesperson not found" }, { status: 404 })
        }

        // Check if the user has permission to view this salesperson
        if (
            auth.user.role !== "superuser" ||
            (auth.user.role === "superuser" && salesperson.managedBy.toString() !== auth.user.id)
        ) {
            return NextResponse.json({ error: "You don't have permission to view this salesperson" }, { status: 403 })
        }

        return NextResponse.json({
            success: true,
            salesperson,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Update a salesperson
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const salespersonId = params.id
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        // Authorize request - only superusers can update salespersons
        const auth = await authorize(request, ["superuser"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 401 })
        }

        // Find the salesperson
        const salesperson = await User.findById(salespersonId)

        if (!salesperson) {
            return NextResponse.json({ error: "Salesperson not found" }, { status: 404 })
        }

        // Check if the super user manages this salesperson
        if (salesperson.managedBy.toString() !== auth.user.id) {
            return NextResponse.json({ error: "You don't have permission to update this salesperson" }, { status: 403 })
        }

        // fields update
        if (username) salesperson.username = username
        if (email) salesperson.email = email

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            salesperson.password = await bcryptjs.hash(password, salt)
        }

        salesperson.updatedAt = new Date()

        await salesperson.save()
        // trigger Email  of updation
        const changes = []
        if (username) changes.push(`Username: ${username}`)
        if (email) changes.push(`Email: ${email}`)
        if (password) changes.push(`Password: ${password}`)

        await sendEmail({
            receiver: salesperson.email,
            subject: `Your Account Has Been Updated - ${salesperson.username}`,
            message: `Hi ${salesperson.username},
        
        Your salesperson account details have been updated:
        
        ${changes.join("\n")}
        
        ${password ? "\nPlease use these new credentials to access your dashboard." : ""}
        
        `,
        })

        return NextResponse.json({
            message: "Salesperson updated successfully",
            success: true,
            salesperson: {
                id: salesperson._id,
                username: salesperson.username,
                email: salesperson.email,
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Delete a salesperson
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const salespersonId = params.id

        const auth = await authorize(request, ["superuser"])
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 401 })
        }

        // Find the salesperson
        const salesperson = await User.findById(salespersonId)

        if (!salesperson) {
            return NextResponse.json({ error: "Salesperson not found" }, { status: 404 })
        }

        // Check if the super user manages this salesperson
        if (salesperson.managedBy.toString() !== auth.user.id) {
            return NextResponse.json({ error: "You don't have permission to delete this salesperson" }, { status: 403 })
        }

        // sending Email before Deleting
        await sendEmail({
            receiver: salesperson.email,
            subject: "Account Deletion Notification",
            message: `Dear ${salesperson.username},
                
                This is to inform you that your salesperson account has been permanently deleted from our system as of ${new Date().toLocaleString()}.
                
                All associated data and access privileges have been removed. 
                
                If this was done in error or you have any questions, please contact your administrator.
                
                Thank you for your previous contributions.`,
        })

        // Delete all appointments associated with this salesperson
        await Appointment.deleteMany({ userId: salespersonId })

        // Delete all schedules associated with this salesperson
        await Schedule.deleteMany({ userId: salespersonId })

        await User.findByIdAndDelete(salespersonId)

        return NextResponse.json({
            message: "Salesperson deleted successfully",
            success: true,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}