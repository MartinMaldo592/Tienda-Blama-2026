import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { triggerOrderConfirmationEmail } from "@/lib/email-service"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs"

import { validateAndCalculateTotals } from "@/lib/checkout-utils"

function getEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { url, service }
}

// ── Zod Schemas ──

const CheckoutItemSchema = z.object({
  id: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  precio: z.coerce.number().optional(),
  nombre: z.string().optional(),
  producto_variante_id: z.coerce.number().nullable().optional(),
  variante_nombre: z.string().nullable().optional(),
})

import { identitySchema, checkoutBaseFields } from "@/lib/validations/checkout.schema"

const CheckoutBodySchema = z.object({
  name: identitySchema.name,
  phone: identitySchema.phone,
  dni: identitySchema.document,
  address: checkoutBaseFields.address,
  reference: checkoutBaseFields.reference,
  locationLink: z.string().url("Link de ubicación inválido").optional().or(z.literal("")),
  shippingMethod: checkoutBaseFields.shippingMethod,
  couponCode: checkoutBaseFields.couponCode,
  discountAmount: z.coerce.number().min(0).optional(),
  email: z.string().email().optional().or(z.literal("")),
  items: z.array(CheckoutItemSchema).min(1, "El carrito está vacío"),

  // Location fields
  department: z.string().optional(),
  province: z.string().optional(),
  provinceName: z.string().optional(), // compatibility
  district: z.string().optional(),
  street: z.string().optional(),
})

export async function GET() {
  const { url, service } = getEnv()
  const missing: string[] = []
  if (!url) missing.push("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
  if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY")

  if (missing.length > 0) {
    return NextResponse.json({ ok: false, error: "Server env not configured", missing }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  try {
    // ── Rate Limiting: 5 pedidos/minuto por IP ──
    const clientIP = getClientIP(req)
    const rateCheck = checkRateLimit(clientIP, {
      maxRequests: 5,
      windowSeconds: 60,
      prefix: "checkout",
    })

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor espera un momento antes de intentar de nuevo." },
        { status: 429, headers: rateCheck.headers }
      )
    }

    const { url, service } = getEnv()
    if (!url || !service) {
      const missing: string[] = []
      if (!url) missing.push("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
      if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY")
      return NextResponse.json({ error: "Server env not configured", missing }, { status: 500 })
    }

    const bodyRaw = await req.json()

    // ── Validation ──
    const validation = CheckoutBodySchema.safeParse(bodyRaw)

    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Datos inválidos"
      return NextResponse.json({ error: errorMsg, details: validation.error.format() }, { status: 400 })
    }

    const body = validation.data



    const name = body.name.trim()
    const phone = body.phone.trim()
    const dni = body.dni
    const email = body.email?.trim() || null
    const address = body.address.trim()
    const reference = body.reference?.trim() || ""
    const couponCode = body.couponCode?.trim() || null
    let locationLink = body.locationLink?.trim() || null

    // 🛡️ Fallback: Si no llega link (por defecto del front), generarlo con la dirección
    if (!locationLink && address) {
      const encoded = encodeURIComponent(address)
      locationLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`
    }


    const discountAmount = body.discountAmount || 0
    const items = body.items
    const shippingMethod = body.shippingMethod?.trim() || null

    const supabaseAdmin = createClient(url, service)

    let subtotal, appliedDiscount, total, validCouponCode, getUnitPrice;
    try {
      const result = await validateAndCalculateTotals(supabaseAdmin, items, couponCode);
      subtotal = result.subtotal;
      appliedDiscount = result.discountAmount;
      total = result.total;
      validCouponCode = result.validCouponCode;
      getUnitPrice = result.getUnitPrice;
    } catch (e: any) {
      if (e.message.includes("catálogo de productos") || e.message.includes("variantes de productos")) {
        return NextResponse.json({ error: e.message }, { status: 500 })
      }
      return NextResponse.json({ error: e.message }, { status: 400 })
    }

    const district = body.district?.trim() || null
    const provincia = body.province?.trim() || body.provinceName?.trim() || null
    const department = body.department?.trim() || null
    const street = body.street?.trim() || null

    const direccionCompleta = `${address} ${reference ? `(Ref: ${reference})` : ""} ${locationLink ? `[Link: ${locationLink}]` : ""}`.trim()

    // A. Cliente (Almacenar como único por pedido)
    const { data: newClient, error: clientError } = await supabaseAdmin
      .from("clientes")
      .insert({
        nombre: name,
        telefono: phone,
        dni,
        direccion: direccionCompleta,
        referencia: reference,
        link_ubicacion: locationLink,
        departamento: department,
        provincia: provincia,
        distrito: district,
        email: email
      })
      .select()
      .single()

    if (clientError) {
      return NextResponse.json({ error: clientError.message }, { status: 400 })
    }

    const clienteId: number | null = Number((newClient as any)?.id) || null

    if (!clienteId) {
      return NextResponse.json({ error: "No se pudo crear cliente para el pedido" }, { status: 500 })
    }

    // B. Pedido
    const commonPedidoData = {
      cliente_id: clienteId,
      nombre_contacto: name,
      dni_contacto: dni,
      telefono_contacto: phone,
      departamento: department,
      provincia: provincia,
      distrito: district,
      direccion_calle: street || address, // Fallback to full address if street not separated
      referencia_direccion: reference,
      link_ubicacion: locationLink,
      email_contacto: email,
      status: "Pendiente",
      pago_status: "Pendiente",
      metodo_envio: shippingMethod,
    }

    const insertPedidoFull = async () => {
      return supabaseAdmin
        .from("pedidos")
        .insert({
          ...commonPedidoData,
          subtotal,
          descuento: appliedDiscount,
          cupon_codigo: validCouponCode,
          total,
        })
        .select()
        .single()
    }

    const insertPedidoFallback = async () => {
      return supabaseAdmin
        .from("pedidos")
        .insert({
          ...commonPedidoData,
          total,
        })
        .select()
        .single()
    }

    const { data: pedidoFull, error: pedidoFullErr } = await insertPedidoFull()

    let pedido = pedidoFull as any

    if (pedidoFullErr) {
      if ((validCouponCode && validCouponCode.length > 0) || appliedDiscount > 0) {
        return NextResponse.json({ error: pedidoFullErr.message }, { status: 400 })
      }

      const { data: pedidoFallback, error: pedidoFallbackErr } = await insertPedidoFallback()
      if (pedidoFallbackErr) {
        return NextResponse.json({ error: pedidoFallbackErr.message }, { status: 400 })
      }
      pedido = pedidoFallback as any
    }

    const pedidoId = Number(pedido?.id ?? 0)
    if (!pedidoId) {
      return NextResponse.json({ error: "No se pudo crear pedido" }, { status: 500 })
    }

    // C. Items
    const orderItems = items.map((item) => ({
      pedido_id: pedidoId,
      producto_id: item.id,
      producto_variante_id: item.producto_variante_id ?? null,
      precio_unitario: getUnitPrice(item.id, item.producto_variante_id),
      producto_nombre: item.nombre || null,
      variante_nombre: item.variante_nombre || null,
      cantidad: item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin.from("pedido_items").insert(orderItems)
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    // ── TRIGGER EMAIL CONFIRMATION (RELIABILITY FIX FOR MOBILE) ──
    // We await it here to ensure the function doesn't shut down before completion.
    if (email) {
      try {
        await triggerOrderConfirmationEmail(pedidoId, "whatsapp")
      } catch (err) {
        console.error("⚠️ Background email trigger failed:", err)
      }
    }

    return NextResponse.json({
      ok: true,
      orderId: pedidoId,
      subtotal,
      descuento: appliedDiscount,
      total,
    }, { headers: rateCheck.headers })
  } catch (e: any) {
    console.error("Checkout Error:", e)
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}

