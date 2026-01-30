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

    const password = passwordRaw || undefined // Undefined tells us to use Invite flow if desired, or we generate one?
    // User requested "Option B": if no password, send invite.

    const supabaseAdmin = createClient(url, service)

    let created: any = null
    let error: any = null
    let isInvite = false

    if (password) {
      // Manual password provided -> Create User directly
      const res = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: nombre ? { nombre } : undefined,
      })
      created = res.data
      error = res.error
    } else {
      // No password -> Send Invitation Email (Professional Flow)
      isInvite = true
      const res = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: nombre ? { nombre } : undefined,
        // We redirect to the root (or specific setup page)
        redirectTo: `${new URL(req.url).origin}/auth/update-password`,
      })
      created = res.data
      error = res.error
    }

    if (error || !created?.user) {
      return NextResponse.json({ error: error?.message || "Failed to create user" }, { status: 400 })
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
      isInvite,
      generatedPassword: null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
