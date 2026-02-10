import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/r2"
import { createClient } from "@/lib/supabase.server"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"

// Tipos de archivo permitidos para subida
const ALLOWED_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "video/mp4",
    "video/webm",
]

// Tamaño máximo del nombre de archivo
const MAX_FILENAME_LENGTH = 255

export async function POST(req: NextRequest) {
    try {
        // ── Rate Limiting: 30 uploads/minuto por IP ──
        const clientIP = getClientIP(req)
        const rateCheck = checkRateLimit(clientIP, {
            maxRequests: 30,
            windowSeconds: 60,
            prefix: "upload",
        })

        if (!rateCheck.success) {
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
                { status: 429, headers: rateCheck.headers }
            )
        }

        // ── Autenticación: solo staff puede subir archivos ──
        const supabase = await createClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "No autorizado. Inicia sesión para subir archivos." },
                { status: 401 }
            )
        }

        // Verificar rol de staff (admin o worker)
        const { data: usuario } = await supabase
            .from("usuarios")
            .select("role")
            .eq("id", user.id)
            .single()

        if (!usuario || !["admin", "worker"].includes(usuario.role)) {
            return NextResponse.json(
                { error: "Acceso denegado. Solo el personal puede subir archivos." },
                { status: 403 }
            )
        }

        const { filename, contentType } = await req.json()

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 })
        }

        // Validar tipo de archivo
        if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
            return NextResponse.json(
                { error: `Tipo de archivo no permitido: ${contentType}` },
                { status: 400 }
            )
        }

        // Validar largo del nombre
        if (filename.length > MAX_FILENAME_LENGTH) {
            return NextResponse.json(
                { error: "El nombre del archivo es demasiado largo" },
                { status: 400 }
            )
        }

        if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            console.error("Missing R2 Environment Variables")
            return NextResponse.json({ error: "Server Configuration Error: Missing R2 Credentials (Check Vercel Env Vars)" }, { status: 500 })
        }

        const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, "-")}`

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            ContentType: contentType,
        })

        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

        // Construct public URL
        const publicUrl = R2_PUBLIC_DOMAIN
            ? `${R2_PUBLIC_DOMAIN}/${uniqueFilename}`
            : `https://${process.env.R2_ACCOUNT_ID}.r2.dev/${uniqueFilename}`

        return NextResponse.json(
            { uploadUrl, publicUrl, uniqueFilename },
            { headers: rateCheck.headers }
        )
    } catch (error) {
        console.error("Presigned URL Error:", error)
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 })
    }
}
