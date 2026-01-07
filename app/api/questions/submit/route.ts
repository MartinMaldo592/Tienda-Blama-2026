import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { url, service }
}

function normalizeText(v: unknown) {
  return String(v ?? "").trim()
}

function normalizePhone(v: unknown) {
  return String(v ?? "").replace(/\D/g, "")
}

export async function POST(req: Request) {
  try {
    const { url, service } = getEnv()
    if (!url || !service) {
      return NextResponse.json({ error: "Server env not configured" }, { status: 500 })
    }

    const supabaseAdmin = createClient(url, service)

    const body = await req.json()

    const productId = Number(body?.productId ?? 0)
    const question = normalizeText(body?.question)
    const askerName = normalizeText(body?.askerName)
    const askerPhone = normalizePhone(body?.askerPhone)

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json({ error: "productId inválido" }, { status: 400 })
    }

    if (!question || question.length < 8) {
      return NextResponse.json({ error: "Escribe una pregunta más específica" }, { status: 400 })
    }

    const { data: created, error } = await supabaseAdmin
      .from("product_questions")
      .insert({
        product_id: productId,
        question,
        asker_name: askerName || null,
        asker_phone: askerPhone || null,
        published: false,
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, questionId: created?.id ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
