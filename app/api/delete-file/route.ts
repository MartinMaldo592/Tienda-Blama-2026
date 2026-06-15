
import { NextRequest, NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2"
import { createClient } from "@/lib/supabase.server"

export async function POST(req: NextRequest) {
    try {
        // Validar sesión y permisos del usuario (staff o admin)
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión." }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from("usuarios")
            .select("role")
            .eq("id", user.id)
            .maybeSingle()

        if (!profile || !["admin", "superadmin", "worker"].includes(profile.role)) {
            return NextResponse.json({ error: "Acceso denegado. Rol no autorizado." }, { status: 403 })
        }

        const { fileUrl } = await req.json()

        if (!fileUrl) {
            return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 })
        }

        if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 })
        }

        // Extract Key from URL safely
        let key = ""
        try {
            const urlObj = new URL(fileUrl)
            key = decodeURIComponent(urlObj.pathname.substring(1))
        } catch {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
        }

        if (!key) {
            return NextResponse.json({ error: "Invalid URL format: key is empty" }, { status: 400 })
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
