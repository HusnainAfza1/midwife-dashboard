// app/api/duration/route.js
import { connect } from "@/dbConfig/dbConfig";
import Duration from "@/models/durationModel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

connect();

export async function GET() {
    try {
        const settings = await Duration.findOne();

        if (!settings) {
            return NextResponse.json({ error: "No duration set" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            duration: settings.duration,
        });
        // eslint-disable-next-line
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { duration } = reqBody;

        const existingSetting = await Duration.findOne();
        if (existingSetting) {
            existingSetting.duration = duration;
            await existingSetting.save();
        } else {
            const newDuration = new Duration({ duration });
            await newDuration.save();
        }

        return NextResponse.json({
            message: "Duration updated successfully",
            success: true,
        });
        // eslint-disable-next-line
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}