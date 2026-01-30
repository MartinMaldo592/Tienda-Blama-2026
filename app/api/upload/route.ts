import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/r2"

export async function POST(req: NextRequest) {
    try {
        const { filename, contentType } = await req.json()

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 })
        }

        const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, "-")}`

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            ContentType: contentType,
        })

        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

        // Construct public URL. If R2_PUBLIC_DOMAIN is set, use it. Otherwise fallback to a standard R2 dev URL structure (though Custom Domain is highly recommended)
        const publicUrl = R2_PUBLIC_DOMAIN
            ? `${R2_PUBLIC_DOMAIN}/${uniqueFilename}`
            : `https://${process.env.R2_ACCOUNT_ID}.r2.dev/${uniqueFilename}`

        return NextResponse.json({ uploadUrl, publicUrl, uniqueFilename })
    } catch (error) {
        console.error("Presigned URL Error:", error)
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 })
    }
}
