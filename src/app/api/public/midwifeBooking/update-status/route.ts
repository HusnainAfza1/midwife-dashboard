import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();

    // 1) Required fields validation
    if (!body.bookingId || !body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: bookingId and status are required"
        },
        { status: 400 }
      );
    }

    // 2) Validate bookingId format (MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(body.bookingId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID format"
        },
        { status: 400 }
      );
    }

    // 3) Validate status value
    const validStatuses = ["pending", "converted", "cancelled"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        },
        { status: 400 }
      );
    }

    // 4) Check if booking exists
    const existingBooking = await MidwifeA1Booking.findById(body.bookingId);

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found"
        },
        { status: 404 }
      );
    }

    // 5) Check if status is actually changing
    if (existingBooking.clientStatus === body.status) {
      return NextResponse.json(
        {
          success: false,
          message: `Booking is already ${body.status}`
        },
        { status: 400 }
      );
    }

    // 6) Update the booking status
    const updatedBooking = await MidwifeA1Booking.findByIdAndUpdate(
      body.bookingId,
      {
        clientStatus: body.status,
        updatedAt: new Date()
      },
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Booking status updated to ${body.status} successfully`,
        data: {
          id: updatedBooking._id,
          clientStatus: updatedBooking.clientStatus,
          previousStatus: existingBooking.clientStatus,
          updatedAt: updatedBooking.updatedAt,
          fullName: updatedBooking.fullName,
          date: updatedBooking.date,
          selectedSlot: updatedBooking.selectedSlot
        }
      },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error updating booking status:", err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validationErrors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json(
        {
          success: false,
          message: `Validation error: ${validationErrors.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID format"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to update booking status"
      },
      { status: 500 }
    );
  }
}