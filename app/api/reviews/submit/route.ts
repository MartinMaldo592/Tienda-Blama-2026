import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

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

export async function POST(req: Request) {
  try {
    const { url, service } = getEnv()
    if (!url || !service) {
      return NextResponse.json({ error: "Server env not configured" }, { status: 500 })
    }

    const contentType = req.headers.get("content-type") || ""
    const isForm = contentType.toLowerCase().includes("multipart/form-data")

    const supabaseAdmin = createClient(url, service)

    let productId = 0
    let rating = 0
    let title = ""
    let body = ""
    let customerName = ""
    let customerCity = ""
    let orderIdRaw = ""
    let dni = ""
    let phone = ""
    let files: File[] = []

    if (isForm) {
      const form = await req.formData()
      productId = Number(form.get("productId") ?? 0)
      rating = Number(form.get("rating") ?? 0)
      title = normalizeText(form.get("title"))
      body = normalizeText(form.get("body"))
      customerName = normalizeText(form.get("customerName"))
      customerCity = normalizeText(form.get("customerCity"))
      orderIdRaw = normalizeText(form.get("orderId"))
      dni = normalizeDigits(form.get("dni"))
      phone = normalizeDigits(form.get("phone"))
      files = form.getAll("photos").filter((x) => x instanceof File) as File[]
    } else {
      const json = await req.json()
      productId = Number(json?.productId ?? 0)
      rating = Number(json?.rating ?? 0)
      title = normalizeText(json?.title)
      body = normalizeText(json?.body)
      customerName = normalizeText(json?.customerName)
      customerCity = normalizeText(json?.customerCity)
      orderIdRaw = normalizeText(json?.orderId)
      dni = normalizeDigits(json?.dni)
      phone = normalizeDigits(json?.phone)
      files = []
    }

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json({ error: "productId inválido" }, { status: 400 })
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating inválido" }, { status: 400 })
    }

    if (!body || body.length < 10) {
      return NextResponse.json({ error: "Escribe una reseña más larga" }, { status: 400 })
    }

    const orderId = orderIdRaw ? Number(orderIdRaw) : null

    let verified = false
    let safeOrderId: number | null = null

    if (orderId && Number.isFinite(orderId) && orderId > 0 && dni && phone) {
      const { data: order, error: orderErr } = await supabaseAdmin
        .from("pedidos")
        .select(
          `id,
           clientes!inner (dni, telefono)`
        )
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

    let photoUrls: string[] = []

    if (files.length > 0) {
      const limited = files.slice(0, 3)

      for (const f of limited) {
        if (!f || typeof f.arrayBuffer !== "function") continue
        if (f.size > 3 * 1024 * 1024) {
          return NextResponse.json({ error: "Una imagen supera 3MB" }, { status: 400 })
        }

        const extRaw = String(f.name || "").split(".").pop() || "jpg"
        const ext = extRaw.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
        const path = `reviews/${productId}/${fileName}`

        const buf = Buffer.from(await f.arrayBuffer())

        const { error: upErr } = await supabaseAdmin.storage
          .from("review_photos")
          .upload(path, buf, { contentType: f.type || "image/jpeg", upsert: false })

        if (upErr) {
          return NextResponse.json({ error: upErr.message }, { status: 400 })
        }

        const { data } = supabaseAdmin.storage.from("review_photos").getPublicUrl(path)
        const publicUrl = String(data?.publicUrl || "")
        if (publicUrl) photoUrls.push(publicUrl)
      }
    }

    const payload = {
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
    }

    const { data: created, error: insErr } = await supabaseAdmin
      .from("product_reviews")
      .insert(payload)
      .select("id")
      .single()

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, reviewId: created?.id ?? null, verified })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
