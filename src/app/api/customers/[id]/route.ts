import { connect } from "@/dbConfig/dbConfig"
import Customer from "@/models/customerModel"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const customer = await Customer.findById(params.id)
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Customer fetched successfully",
            success: true,
            customer,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const reqBody = await request.json()
        const updatedCustomer = await Customer.findByIdAndUpdate(params.id, reqBody, { new: true })

        if (!updatedCustomer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Customer updated successfully",
            success: true,
            customer: updatedCustomer,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(params.id)
        if (!deletedCustomer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Customer deleted successfully",
            success: true,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
