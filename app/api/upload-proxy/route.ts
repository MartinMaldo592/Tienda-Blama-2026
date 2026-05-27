
import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/r2"
import sharp from "sharp"

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

        let buffer: any = Buffer.from(await file.arrayBuffer())
        let finalFilename = file.name
        let finalContentType = file.type

        const isImage = file.type.startsWith("image/") && 
                        !file.type.includes("gif") && 
                        !file.type.includes("svg") && 
                        !file.type.includes("webp") // Omit webp if already optimized

        if (isImage) {
            try {
                // Comprimir, redimensionar a un máx de 1200px y convertir a WebP (calidad 80)
                const processed = await sharp(buffer)
                    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer()
                
                buffer = processed
                finalContentType = "image/webp"
                
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
                finalFilename = `${nameWithoutExt}.webp`
            } catch (err) {
                console.error("Sharp processing failed, falling back to original upload:", err)
            }
        }

        const cleanName = finalFilename.replace(/\s+/g, "-").replace(/[^\w.-]+/g, "")
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${cleanName}`

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            Body: buffer,
            ContentType: finalContentType,
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
