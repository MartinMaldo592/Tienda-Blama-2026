import { S3Client } from "@aws-sdk/client-s3"

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

if (!accountId || !accessKeyId || !secretAccessKey) {
    // Only warn if we are on the server side to avoid noise in client builds implies usage check
}

export const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
    },
})

export const R2_BUCKET_NAME = process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "tienda-blama-assets"
export const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || ""
