import type { NextRequest } from "next/server"
import { verifyJwtToken, type JwtPayload } from "@/lib/jwt"

type AuthResult = { success: true; user: JwtPayload; error?: never } | { success: false; error: string; user?: never }

export async function authorize(request: NextRequest, allowedRoles: string[] = []): Promise<AuthResult> {
    try {
        const token = request.cookies.get("token")?.value ||
            request.headers.get("Authorization")?.replace("Bearer ", "") ||
            "";

        if (!token) {
            return {
                success: false,
                error: "Unauthorized - No token provided",
            }
        }

        const decodedToken = await verifyJwtToken(token)

        // Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
            return {
                success: false,
                error: "Forbidden - Insufficient permissions",
            }
        }

        return {
            success: true,
            user: decodedToken,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Authorization error:", error);
        return {
            success: false,
            error: error.message || "Unauthorized",
        }
    }
}

