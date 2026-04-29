"use server"

import { createClient } from "@supabase/supabase-js"

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { url, service }
}

function normalizeDigits(v: unknown) {
  return String(v ?? "").replace(/\D/g, "")
}

function normalizeText(v: unknown) {
  return String(v ?? "").trim()
}

export async function submitReviewAction(formData: FormData) {
  try {
    const { url, service } = getEnv()
    if (!url || !service) throw new Error("Server env not configured")

    const supabaseAdmin = createClient(url, service)

    const productId = Number(formData.get("productId") ?? 0)
    const rating = Number(formData.get("rating") ?? 0)
    const title = normalizeText(formData.get("title"))
    const body = normalizeText(formData.get("body"))
    const customerName = normalizeText(formData.get("customerName"))
    const customerCity = normalizeText(formData.get("customerCity"))
    const orderIdRaw = normalizeText(formData.get("orderId"))
    const dni = normalizeDigits(formData.get("dni"))
    const phone = normalizeDigits(formData.get("phone"))
    const files = formData.getAll("photos").filter((x) => x instanceof File) as File[]

    if (!Number.isFinite(productId) || productId <= 0) {
      return { error: "productId inválido" }
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return { error: "rating inválido" }
    }

    if (!body || body.length < 10) {
      return { error: "Escribe una reseña más larga (mínimo 10 caracteres)" }
    }

    const orderId = orderIdRaw ? Number(orderIdRaw) : null
    let verified = false
    let safeOrderId: number | null = null

    if (orderId && Number.isFinite(orderId) && orderId > 0 && dni && phone) {
      const { data: order, error: orderErr } = await supabaseAdmin
        .from("pedidos")
        .select(`id, clientes!inner (dni, telefono)`)
        .eq("id", orderId)
        .single()

      if (!orderErr && order) {
        const dbDni = normalizeDigits((order as any)?.clientes?.dni)
        const dbPhone = normalizeDigits((order as any)?.clientes?.telefono)

        if (dbDni === dni && dbPhone === phone) {
          const { data: item, error: itemErr } = await supabaseAdmin
            .from("pedido_items")
            .select("id")
            .eq("pedido_id", orderId)
            .eq("producto_id", productId)
            .limit(1)

          if (!itemErr && Array.isArray(item) && item.length > 0) {
            verified = true
            safeOrderId = orderId
          }
        }
      }
    }

    const photoUrls: string[] = []
    if (files.length > 0) {
      const limited = files.slice(0, 3)
      for (const f of limited) {
        if (!f || f.size === 0) continue
        if (f.size > 3 * 1024 * 1024) {
          return { error: "Una imagen supera los 3MB" }
        }

        const extRaw = String(f.name || "").split(".").pop() || "jpg"
        const ext = extRaw.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
        const path = `reviews/${productId}/${fileName}`

        const arrayBuffer = await f.arrayBuffer()
        const { error: upErr } = await supabaseAdmin.storage
          .from("review_photos")
          .upload(path, arrayBuffer, { contentType: f.type || "image/jpeg", upsert: false })

        if (upErr) throw upErr

        const { data } = supabaseAdmin.storage.from("review_photos").getPublicUrl(path)
        if (data?.publicUrl) photoUrls.push(data.publicUrl)
      }
    }

    const { data: created, error: insErr } = await supabaseAdmin
      .from("product_reviews")
      .insert({
        product_id: productId,
        rating,
        title: title || null,
        body,
        customer_name: customerName || null,
        customer_city: customerCity || null,
        photo_urls: photoUrls.length > 0 ? photoUrls : null,
        order_id: safeOrderId,
        verified,
        approved: false,
      })
      .select("id")
      .single()

    if (insErr) throw insErr

    return { ok: true, reviewId: created?.id ?? null, verified }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}
