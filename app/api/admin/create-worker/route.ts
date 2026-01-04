import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anon || !service) {
      return NextResponse.json({ error: "Server env not configured" }, { status: 500 })
    }

    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : ""
    if (!token) {
      return NextResponse.json({ error: "Missing Authorization token" }, { status: 401 })
    }

    const supabaseAuth = createClient(url, anon)
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token)
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const { data: profile, error: profileErr } = await supabaseAuth
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle()

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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
      return supabaseAdmin.from("profiles").upsert({
        ...profilePayloadBase,
        ...(nombre ? { nombre } : {}),
      })
    }

    const { error: upsertErr } = await tryUpsertWithNombre()

    if (upsertErr) {
      if (upsertErr.message?.toLowerCase().includes("nombre")) {
        const { error: fallbackErr } = await supabaseAdmin.from("profiles").upsert(profilePayloadBase)
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
