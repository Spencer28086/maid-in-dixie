import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith("/admin")) {
        // Allow login page
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }

        const isAuthenticated =
            request.cookies.get("admin-auth")?.value === "true";

        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};