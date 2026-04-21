import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout successfull",
                success: true,
            }
        )
        response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        response.cookies.delete("token");
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.mesaage }, { status: 500 });

    }
}