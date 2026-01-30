import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnv, requireAdmin } from "@/features/admin/services/admin.server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin(req)
    if (!auth.ok) return auth.res

    const { url, service } = getSupabaseEnv()
    if (!url || !service) {
      return NextResponse.json({ error: "Server env not configured" }, { status: 500 })
    }

    const body = await req.json()
    const email = String(body?.email || "").trim()
    const nombre = String(body?.nombre || "").trim()
    const passwordRaw = body?.password ? String(body.password) : ""

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }

    const password = passwordRaw || `Wk-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 8)}`

    const supabaseAdmin = createClient(url, service)

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: nombre ? { nombre } : undefined,
    })

    if (createErr || !created?.user) {
      return NextResponse.json({ error: createErr?.message || "Failed to create user" }, { status: 400 })
    }

    const userId = created.user.id

    const profilePayloadBase = {
      id: userId,
      email,
      role: "worker",
    }

    const tryUpsertWithNombre = async () => {
      return supabaseAdmin.from("usuarios").upsert({
        ...profilePayloadBase,
        ...(nombre ? { nombre } : {}),
      })
    }

    const { error: upsertErr } = await tryUpsertWithNombre()

    if (upsertErr) {
      if (upsertErr.message?.toLowerCase().includes("nombre")) {
        const { error: fallbackErr } = await supabaseAdmin.from("usuarios").upsert(profilePayloadBase)
        if (fallbackErr) {
          return NextResponse.json({ error: fallbackErr.message }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: upsertErr.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      ok: true,
      user: { id: userId, email },
      generatedPassword: passwordRaw ? null : password,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
