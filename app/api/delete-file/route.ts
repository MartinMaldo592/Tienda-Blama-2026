
import { NextRequest, NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2"

export async function POST(req: NextRequest) {
    try {
        const { fileUrl } = await req.json()

        if (!fileUrl) {
            return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 })
        }

        if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 })
        }

        // Extract Key from URL
        // Example URL: https://tienda-blama-assets.xxxxx.r2.dev/1738222-image.jpg
        // or https://custom-domain.com/1738222-image.jpg
        const key = fileUrl.split('/').pop()

        if (!key) {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
        }

        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        })

        await r2Client.send(command)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Delete Error:", error)
        return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 })
    }
}
