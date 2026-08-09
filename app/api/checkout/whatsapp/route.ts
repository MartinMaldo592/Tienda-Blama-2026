import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { triggerOrderConfirmationEmail } from "@/features/emails"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs"

import { validateAndCalculateTotals, CheckoutEngine } from "@/features/checkout"

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

import { identitySchema, checkoutBaseFields } from "@/features/checkout"

const CheckoutBodySchema = z.object({
  name: identitySchema.name,
  phone: identitySchema.phone,
  dni: identitySchema.document.optional().or(z.literal("")).or(z.null()),
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
  isQuickCheckout: z.boolean().optional(),
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
    const rateCheck = await checkRateLimit(clientIP, {
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
    const supabaseAdmin = createClient(url, service)

    const result = await CheckoutEngine.processOrder(supabaseAdmin, {
      channel: "whatsapp",
      payload: body,
    })

    return NextResponse.json({
      ok: result.ok,
      orderId: result.orderId,
      subtotal: result.subtotal,
      descuento: result.descuento,
      total: result.total,
    }, { headers: rateCheck.headers })
  } catch (e: any) {
    console.error("Checkout Error:", e)
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}

