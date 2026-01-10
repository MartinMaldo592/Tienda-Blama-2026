import { NextResponse } from "next/server"
import { requireAdmin } from "@/features/admin/services/admin.server"

export const runtime = "nodejs"

type AnnouncementBarRow = {
  id: number
  enabled: boolean
  interval_ms: number
  messages: string[]
}

function normalizeBool(v: unknown) {
  return Boolean(v)
}

function normalizeInterval(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 3500
  return Math.min(30000, Math.max(500, Math.round(n)))
}

function normalizeMessages(v: unknown) {
  const arr = Array.isArray(v) ? v : []
  const out: string[] = []
  for (const raw of arr) {
    const s = String(raw ?? "").trim()
    if (!s) continue
    out.push(s)
    if (out.length >= 10) break
  }
  return out
}

async function getConfig(supabaseAdmin: any): Promise<AnnouncementBarRow> {
  const { data, error } = await supabaseAdmin.from("announcement_bar").select("*").eq("id", 1).maybeSingle()
  if (error) throw error

  if (data) {
    return {
      id: Number((data as any).id),
      enabled: Boolean((data as any).enabled),
      interval_ms: Number((data as any).interval_ms) || 3500,
      messages: Array.isArray((data as any).messages) ? ((data as any).messages as string[]) : [],
    }
  }

  const fallback: AnnouncementBarRow = {
    id: 1,
    enabled: true,
    interval_ms: 3500,
    messages: [
      "📦🚚 Envío GRATIS para todos los pedidos",
      "⚡🏷️ Descuentos en productos destacados",
      "⏱️📍 Entrega rápida + contraentrega en 24 horas (solo Lima Metropolitana)",
    ],
  }

  const { error: upsertErr } = await supabaseAdmin
    .from("announcement_bar")
    .upsert(fallback, { onConflict: "id" })
  if (upsertErr) throw upsertErr

  return fallback
}

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.res

  try {
    const cfg = await getConfig(auth.supabaseAdmin)
    return NextResponse.json({ ok: true, data: cfg })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.res

  try {
    const body = await req.json()

    const payload = {
      id: 1,
      enabled: normalizeBool(body?.enabled),
      interval_ms: normalizeInterval(body?.interval_ms),
      messages: normalizeMessages(body?.messages),
      updated_at: new Date().toISOString(),
    }

    const { error } = await auth.supabaseAdmin
      .from("announcement_bar")
      .upsert(payload, { onConflict: "id" })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
