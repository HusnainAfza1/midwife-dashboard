import { connect } from "@/dbConfig/dbConfig"
import Customer from "@/models/customerModel"
import Midwife from "@/models/midwifeModel"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function GET() {
    try {
        const customers = await Customer.find({}).sort({ createdAt: -1 })
        return NextResponse.json({
            message: "Customers fetched successfully",
            success: true,
            customers,
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { customerName, email, phone, dateOfBirth, address, midwifeId, et, status } = reqBody

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email })
        if (existingCustomer) {
            return NextResponse.json({ error: "Customer already exists" }, { status: 400 })
        }

        // Get midwife details
        const midwife = await Midwife.findById(midwifeId)
        if (!midwife) {
            return NextResponse.json({ error: "Midwife not found" }, { status: 400 })
        }

        // Generate customer ID
        const customerCount = await Customer.countDocuments()
        const customerId = `CUS${String(customerCount + 1).padStart(5, "0")}`

        const newCustomer = new Customer({
            customerId,
            customerName,
            email,
            phone,
            dateOfBirth,
            address,
            midwifeId,
            midwifeName: `${midwife.personalInfo.firstName} ${midwife.personalInfo.lastName}`,
            et,
            status: status || "Active",
        })

        const savedCustomer = await newCustomer.save()

        return NextResponse.json({
            message: "Customer created successfully",
            success: true,
            customer: savedCustomer,
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
