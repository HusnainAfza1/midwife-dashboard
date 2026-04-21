import { verifyJwtToken, type JwtPayload } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function getCurrentUser(): Promise<JwtPayload | null> {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return null
        }

        const user = await verifyJwtToken(token)
        return user
    } catch (error) {
        console.error("Error getting current user:", error)
        return null
    }
}

export async function isAuthorized(allowedRoles: string[] = []): Promise<boolean> {
    const user = await getCurrentUser()

    if (!user) {
        return false
    }

    if (allowedRoles.length === 0) {
        return true
    }

    return allowedRoles.includes(user.role)
}

