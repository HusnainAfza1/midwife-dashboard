import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Assuming your token is stored under the name 'token'
    const token = request.cookies.get("token")?.value || '';
    if (token) {
        // Validate the token and ensure it's active
        // For demonstration, we'll assume it's valid if present
        return NextResponse.json({ isLoggedIn: true });
    } else {
        return NextResponse.json({ isLoggedIn: false });
    }
}