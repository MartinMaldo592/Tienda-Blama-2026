import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnv, requireAdmin } from "@/features/admin/services/admin.server"

export const runtime = "nodejs"

export async function PUT(req: Request) {
    try {
        const auth = await requireAdmin(req)
        if (!auth.ok) return auth.res

        const { url, service } = getSupabaseEnv()
        if (!url || !service) {
            return NextResponse.json({ error: "Server env not configured" }, { status: 500 })
        }

        const body = await req.json()
        const { userId, nombre } = body

        if (!userId || typeof nombre !== 'string') {
            return NextResponse.json({ error: "Missing userId or nombre" }, { status: 400 })
        }

        const supabaseAdmin = createClient(url, service)

        const { error } = await supabaseAdmin
            .from("usuarios")
            .update({ nombre })
            .eq("id", userId)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true })

    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
    }
}
