"use server"
import { sendEmail } from "@/helper/mailer"
import { getCurrentUser } from "@/lib/auth"
import { createSalespersonDTO } from "@/lib/dto"
import Appointment from "@/models/appointmentModel"
import Schedule from "@/models/scheduleModel"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { revalidatePath } from "next/cache"

// Create a new salesperson
export async function createSalesperson(formData: FormData) {
    try {
        const user = await getCurrentUser()

        // Check if user is authorized
        if (!user || user.role !== "superuser") {
            return {
                success: false,
                error: "Unauthorized - Only super users can create salespersons",
            }
        }

        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        if (!username || !email || !password) {
            return {
                success: false,
                error: "All fields are required",
            }
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return {
                success: false,
                error: "User with this email already exists",
            }
        }

        await sendEmail({
            receiver: email,
            subject: "Your Dashboard Credentials",
            message: `Hi ${username}, your credentails are as follows:\nEmail: ${email}\nPassword:${password}`,
        })

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create new salesperson
        const newSalesperson = new User({
            username,
            email,
            password: hashedPassword,
            role: "salesperson",
            managedBy: user.id,
        })

        const savedUser = await newSalesperson.save()

        revalidatePath("/dashboard/salespersons")

        return {
            success: true,
            message: "Salesperson created successfully",
            salesperson: createSalespersonDTO(savedUser),
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to create salesperson",
        }
    }
}

// Get all salespersons for a super user
export async function getSalespersons() {
    try {
        const user = await getCurrentUser()

        // Check if user is authorized
        if (!user || user.role !== "superuser") {
            return {
                success: false,
                error: "Unauthorized - Only super users can view salespersons",
            }
        }

        // Find all salespersons managed by this super user
        const salespersons = await User.find({
            role: "salesperson",
            managedBy: user.id,
        })

        return {
            success: true,
            salespersons: salespersons.map((sp) => createSalespersonDTO(sp)),
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to fetch salespersons",
        }
    }
}

// Update a salesperson
export async function updateSalesperson(id: string, formData: FormData) {
    try {
        const user = await getCurrentUser()

        // Check if user is authorized
        if (!user || user.role !== "superuser") {
            return {
                success: false,
                error: "Unauthorized - Only super users can update salespersons",
            }
        }

        // Find the salesperson
        const salesperson = await User.findById(id)

        if (!salesperson) {
            return {
                success: false,
                error: "Salesperson not found",
            }
        }

        // Check if the super user manages this salesperson
        if (salesperson.managedBy.toString() !== user.id) {
            return {
                success: false,
                error: "You don't have permission to update this salesperson",
            }
        }

        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        // Update fields
        if (username) salesperson.username = username
        if (email) salesperson.email = email

        // Update password if provided
        if (password) {
            const salt = await bcryptjs.genSalt(10)
            salesperson.password = await bcryptjs.hash(password, salt)
        }

        salesperson.updatedAt = new Date()

        await salesperson.save()
        // trigger Email
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

        revalidatePath("/dashboard/salespersons")

        return {
            success: true,
            message: "Salesperson updated successfully",
            salesperson: createSalespersonDTO(salesperson),
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to update salesperson",
        }
    }
}

// Delete a salesperson
export async function deleteSalesperson(id: string) {
    try {
        const user = await getCurrentUser()

        // Check if user is authorized
        if (!user || user.role !== "superuser") {
            return {
                success: false,
                error: "Unauthorized - Only super users can delete salespersons",
            }
        }

        // Find the salesperson
        const salesperson = await User.findById(id)

        if (!salesperson) {
            return {
                success: false,
                error: "Salesperson not found",
            }
        }

        // Check if the super user manages this salesperson
        if (salesperson.managedBy.toString() !== user.id) {
            return {
                success: false,
                error: "You don't have permission to delete this salesperson",
            }
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
        await Appointment.deleteMany({ userId: id })

        // Delete all schedules associated with this salesperson
        await Schedule.deleteMany({ userId: id })

        // Delete the salesperson
        await User.findByIdAndDelete(id)

        revalidatePath("/dashboard/salespersons")

        return {
            success: true,
            message: "Salesperson deleted successfully",
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to delete salesperson",
        }
    }
}
