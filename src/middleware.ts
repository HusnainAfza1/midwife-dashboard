import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "./lib/jwt";

// Define protected routes and their allowed roles
const protectedRoutes = [
    {
        path: "/api/salespersons",
        roles: ["superuser"],
    },
    {
        path: "/api/schedules",
        roles: ["superuser", "salesperson"],
    },
    {
        path: "/api/appointments",
        roles: ["superuser", "salesperson"],
    },
]

const protectedPaths = ["/"];

// public pages should NOT be accessible when authenticated
const authPages = ["/login"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    // const isPublicPath = path.startsWith("/api/public/");     /api/midwife
    const isPublicPath = path.startsWith("/api/public/") || path.startsWith("/api/places/") || path.startsWith("/api/client/") || path.startsWith("/api/midwife/") || path.startsWith("/api/getMidwifebyId/") || path.startsWith("/api/midwives/");

    // Define protected paths that require authentication
    const isProtectedApiPath = protectedRoutes.some((route) => path.startsWith(route.path));

    // Check if it's a protected page
    const isProtectedPage = protectedPaths.some((route) => path.startsWith(route));

    // Check if it's an authentication page 
    const isAuthPage = authPages.includes(path);

    if (!isProtectedApiPath && !isPublicPath && !isProtectedPage && !isAuthPage) {
        return NextResponse.next();
    }

    // Extracting token from cookies or headers
    const token = request.cookies.get("token")?.value ||
        request.headers.get("Authorization")?.replace("Bearer ", "") ||
        "";

    // If user is authenticated and tries to access login, redirect to home (or dashboard)
    if (token && isAuthPage) {
        try {
            await verifyJwtToken(token);
            return NextResponse.redirect(new URL("/", request.url)); // Redirect to home or dashboard
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Token invalid, let them proceed to login
        }
    }

    // If there is no token and the user is on a protected page (but NOT on login)
    if (!token) {
        if (isProtectedApiPath) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        if (isProtectedPage && !isAuthPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    try {
        // Verify the token
        const decodedToken = await verifyJwtToken(token);

        // Check if user has required role for this route
        const matchedRoute = protectedRoutes.find((route) => path.startsWith(route.path));

        if (matchedRoute && decodedToken.role && !matchedRoute.roles.includes(decodedToken.role)) {
            return NextResponse.json({ error: "Forbidden - Insufficient permissions" }, { status: 403 });
        }

        // Add user info to request headers for use in API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("user", JSON.stringify(decodedToken));

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        if (isProtectedApiPath) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Redirect only if the user is not already on login page
        if (isProtectedPage && !isAuthPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}


// Configure the middleware to run on specific paths
export const config = {
    matcher: ["/api/schedules/:path*", "/api/appointments/:path*", "/api/salespersons/:path*", "/", "/login"],
}

