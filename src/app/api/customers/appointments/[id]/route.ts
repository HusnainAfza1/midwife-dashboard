import { connect } from "@/dbConfig/dbConfig"
import Appointment from "@/models/appointmentModel"
import { type NextRequest, NextResponse } from "next/server"

connect()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const appointments = await Appointment.find({ customerId: params.id }).sort({ date: 1, startTime: 1 })

        return NextResponse.json({
            message: "Customer appointments fetched successfully",
            success: true,
            appointments,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
