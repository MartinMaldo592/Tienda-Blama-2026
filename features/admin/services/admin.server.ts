import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const ADMIN_RUNTIME = "nodejs" as const

export function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { url, anon, service }
}

export async function requireAdmin(req: Request) {
  const { url, anon, service } = getSupabaseEnv()
  if (!url || !anon || !service) {
    const missing: string[] = []
    if (!url) missing.push("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
    if (!anon) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY")
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Server env not configured", missing }, { status: 500 }),
    }
  }

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : ""
  if (!token) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Missing Authorization token" }, { status: 401 }),
    }
  }

  const supabaseAuth = createClient(url, anon)
  const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token)
  if (userErr || !userData?.user) {
    return { ok: false as const, res: NextResponse.json({ error: "Invalid session" }, { status: 401 }) }
  }

  const { data: userRecord, error: profileErr } = await supabaseAuth
    .from("usuarios")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileErr) {
    return { ok: false as const, res: NextResponse.json({ error: profileErr.message }, { status: 500 }) }
  }

  if (String((userRecord as any)?.role || "").toLowerCase() !== "admin") {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  const supabaseAdmin = createClient(url, service)
  return { ok: true as const, supabaseAdmin }
}
