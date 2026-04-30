import { NextResponse } from "next/server";

const ADMIN_PASSWORD = "maidadmin123"; // 🔥 CHANGE THIS

export async function POST(req: Request) {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
        const response = NextResponse.json({ success: true });

        response.cookies.set("admin-auth", "true", {
            httpOnly: true,
            path: "/",
        });

        return response;
    }

    return NextResponse.json(
        { success: false },
        { status: 401 }
    );
}