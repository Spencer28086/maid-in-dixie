import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { ok: false, message: "No files uploaded" },
                { status: 400 }
            );
        }

        const uploadDir = path.resolve("public/uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const savedFiles: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // ✅ GUARANTEED UNIQUE NAME
            const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const fileName = `${uniqueId}-${file.name}`;

            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, buffer);

            savedFiles.push(`/uploads/${fileName}`);
        }

        return NextResponse.json({
            ok: true,
            files: savedFiles,
        });
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { ok: false, message: "Upload failed" },
            { status: 500 }
        );
    }
}