"use server"

import { createClient } from "@supabase/supabase-js"

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

export async function submitQuestionAction(args: {
  productId: number
  question: string
  askerName?: string
  askerPhone?: string
}) {
  try {
    const { url, service } = getEnv()
    if (!url || !service) throw new Error("Server env not configured")

    const supabaseAdmin = createClient(url, service)

    const productId = Number(args.productId ?? 0)
    const question = normalizeText(args.question)
    const askerName = normalizeText(args.askerName)
    const askerPhone = normalizePhone(args.askerPhone)

    if (!Number.isFinite(productId) || productId <= 0) {
      return { error: "productId inválido" }
    }

    if (!question || question.length < 8) {
      return { error: "Escribe una pregunta más específica (mínimo 8 caracteres)" }
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

    if (error) throw error

    return { ok: true, questionId: created?.id ?? null }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}
