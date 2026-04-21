// app/api/midwife-bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import MidwifeA1Booking from "@/models/midwifeA1Booking";

// Utility function to parse DD/MM/YYYY string to Date object
function parseStringToDate(dateString: string): Date | null {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return new Date(year, month, day);
}

// Utility function to validate DD/MM/YYYY format
function isValidDateString(dateString: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateString)) return false;

  const parsedDate = parseStringToDate(dateString);
  if (!parsedDate) return false;

  // Check if the parsed date matches the input (catches invalid dates like 31/02/2025)
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  return parsedDate.getDate() === day &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getFullYear() === year;
}

// Function to create day range for duplicate checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dayRangeUTC(dateString: string) {
  const parsedDate = parseStringToDate(dateString);
  if (!parsedDate) {
    throw new Error('Invalid date string for day range calculation');
  }

  const start = new Date(Date.UTC(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
    0, 0, 0, 0
  ));

  const end = new Date(Date.UTC(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate() + 1,
    0, 0, 0, 0
  ));

  return { start, end };
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();

    // 1) Required fields validation
    const required = [
      "userId",
      "midwifeId",
      "fullName",
      "email",
      "phoneNumber",
      "insuranceNumber",
      "insuranceCompany",
      "insuranceType",
      "date",
      "expectedDeliveryDate",
      "selectedAddressDetails",
      "selectedSlot",
    ];

    const missing = required.filter((k) =>
      body[k] === undefined ||
      body[k] === "" ||
      (typeof body[k] === 'string' && body[k].trim() === "")
    );

    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`
        },
        { status: 400 }
      );
    }

    // 2) Date format validation
    if (!isValidDateString(body.date)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date format. Expected DD/MM/YYYY format with valid date."
        },
        { status: 400 }
      );
    }

    if (!isValidDateString(body.expectedDeliveryDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expected delivery date format. Expected DD/MM/YYYY format with valid date."
        },
        { status: 400 }
      );
    }

    // 3) Business logic validation
    const bookingDate = parseStringToDate(body.date);
    const expectedDate = parseStringToDate(body.expectedDeliveryDate);

    if (!bookingDate || !expectedDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to parse dates"
        },
        { status: 400 }
      );
    }

    // Allow yesterday's date or future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (bookingDate < yesterday) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking date cannot be more than one day in the past"
        },
        { status: 400 }
      );
    }

    // Check if expected delivery date is reasonable (should be in the future)
    if (expectedDate < today) {
      return NextResponse.json(
        {
          success: false,
          message: "Expected delivery date should be in the future"
        },
        { status: 400 }
      );
    }

    // 4) Duplicate booking check (same midwife + same day + same slot)
    // Skip this check if the new booking is being created with cancelled status
    if (body.status  !== "cancelled") {
      const existingBooking = await MidwifeA1Booking.findOne({
        midwifeId: body.midwifeId,
        date: body.date,
        selectedSlot: body.selectedSlot,
      });

      if (existingBooking) {
        return NextResponse.json(
          {
            success: false,
            message: "This time slot is already booked for this midwife on that day."
          },
          { status: 409 }
        );
      }
    }

    // 5) Insurance type validation
    if (!["government", "private"].includes(body.insuranceType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Insurance type must be either 'government' or 'private'"
        },
        { status: 400 }
      );
    }

    // 6) Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format"
        },
        { status: 400 }
      );
    }

    // 7) Phone number validation (basic)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(body.phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must contain at least 10 digits"
        },
        { status: 400 }
      );
    }

    // 8) Create the booking with string dates
    const booking = await MidwifeA1Booking.create({
      userId: body.userId,
      midwifeId: body.midwifeId,
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phoneNumber: body.phoneNumber.trim(),
      insuranceNumber: body.insuranceNumber.trim(),
      insuranceCompany: body.insuranceCompany.trim(),
      insuranceType: body.insuranceType,
      date: body.date, // Store as string in DD/MM/YYYY format
      expectedDeliveryDate: body.expectedDeliveryDate, // Store as string in DD/MM/YYYY format
      selectedAddressDetails: body.selectedAddressDetails,
      selectedSlot: body.selectedSlot,
      status: body.status || "active",
      clientStatus: body.clientStatus || "pending"
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        data: {
          id: booking._id,
          date: booking.date,
          expectedDeliveryDate: booking.expectedDeliveryDate,
          selectedSlot: booking.selectedSlot,
          status: booking.status,
          createdAt: booking.createdAt
        }
      },
      { status: 201 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error creating booking:", err);

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

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to create booking"
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve bookings (optional - for fetching existing bookings)
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const midwifeId = searchParams.get('midwifeId');
    const date = searchParams.get('date'); // Expected in DD/MM/YYYY format
    const userId = searchParams.get('userId');
    const clientStatus = searchParams.get('clientStatus'); // Changed from 'status' to 'clientStatus'

    // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
    let query: any = {};

    if (midwifeId) query.midwifeId = midwifeId;
    if (date) query.date = date;
    if (userId) query.userId = userId;

    // Handle clientStatus filter - supports multiple statuses
    if (clientStatus) {
      const statuses = clientStatus.split(',').map(s => s.trim());
      // If multiple statuses, use $in operator; if single, direct match
      query.clientStatus = statuses.length > 1 ? { $in: statuses } : statuses[0];
    }

    const bookings = await MidwifeA1Booking.find(query)
      .populate('userId', 'username email')
      .populate('midwifeId', 'username email')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: bookings
      },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to fetch bookings"
      },
      { status: 500 }
    );
  }
}