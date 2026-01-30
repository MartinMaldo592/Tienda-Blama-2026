
import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/r2"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            return NextResponse.json({ error: "Configuration Error: Missing R2 Credentials" }, { status: 500 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const fileExt = file.name.split('.').pop()
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            Body: buffer,
            ContentType: file.type,
        })

        await r2Client.send(command)

        const publicUrl = R2_PUBLIC_DOMAIN
            ? `${R2_PUBLIC_DOMAIN}/${uniqueFilename}`
            : `https://${process.env.R2_ACCOUNT_ID}.r2.dev/${uniqueFilename}`

        return NextResponse.json({ success: true, publicUrl })
    } catch (error: any) {
        console.error("Proxy Upload Error:", error)
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
    }
}
