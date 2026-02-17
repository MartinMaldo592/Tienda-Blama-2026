import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs"

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

const CheckoutBodySchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  phone: z.string().min(9, "Teléfono inválido").regex(/^\d+$/, "Solo números"),
  dni: z.string().length(8, "DNI debe tener 8 dígitos").regex(/^\d+$/, "Solo números"),
  address: z.string().min(5, "Dirección requerida"),
  reference: z.string().optional(),
  locationLink: z.string().url("Link de ubicación inválido").optional().or(z.literal("")),
  shippingMethod: z.string().optional(),
  couponCode: z.string().optional(),
  discountAmount: z.coerce.number().min(0).optional(),
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

    console.log("🐛 DEBUG CHECKOUT API:", {
      receivedLocationLink: body.locationLink,
      address: body.address,
      reference: body.reference
    })

    const name = body.name.trim()
    const phone = body.phone.trim() // Already validated as digits by regex in schema? No, regex allows digits but string might have spaces if not trimmed. Zod regex applies to string.
    const dni = body.dni
    const address = body.address.trim()
    const reference = body.reference?.trim() || ""
    const locationLink = body.locationLink?.trim() || null
    const shippingMethod = body.shippingMethod?.trim() || null
    const couponCode = body.couponCode?.trim() || null
    const discountAmount = body.discountAmount || 0
    const items = body.items

    // Calculate totals
    const subtotal = Math.max(
      0,
      Math.round(
        items.reduce((acc, it) => {
          const unit = Number(it.precio ?? 0) || 0
          return acc + unit * it.quantity
        }, 0) * 100
      ) / 100
    )

    const appliedDiscount = Math.max(0, Math.min(subtotal, discountAmount))
    const total = Math.max(0, Math.round((subtotal - appliedDiscount) * 100) / 100)

    const district = body.district?.trim() || null
    const provincia = body.provinceName?.trim() || null
    const department = body.department?.trim() || body.province?.trim() || null
    const street = body.street?.trim() || null

    const direccionCompleta = `${address} ${reference ? `(Ref: ${reference})` : ""} ${locationLink ? `[Link: ${locationLink}]` : ""}`.trim()

    const supabaseAdmin = createClient(url, service)

    // A. Cliente
    let clienteId: number | null = null
    const { data: existingClients, error: existingClientsError } = await supabaseAdmin
      .from("clientes")
      .select("id")
      .eq("telefono", phone)
      .limit(1)

    if (existingClientsError) {
      return NextResponse.json({ error: existingClientsError.message }, { status: 400 })
    }

    if (existingClients && existingClients.length > 0) {
      clienteId = Number((existingClients as any)[0]?.id)
      const { error: updErr } = await supabaseAdmin
        .from("clientes")
        .update({
          nombre: name,
          dni,
          direccion: direccionCompleta,
          referencia: reference,
          link_ubicacion: locationLink,
          departamento: department,
          provincia: provincia,
          distrito: district
        })
        .eq("id", clienteId)
        .select()

      if (updErr) {
        return NextResponse.json({ error: updErr.message }, { status: 400 })
      }
    } else {
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
          distrito: district
        })
        .select()
        .single()

      if (clientError) {
        return NextResponse.json({ error: clientError.message }, { status: 400 })
      }

      clienteId = Number((newClient as any)?.id)
    }

    if (!clienteId) {
      return NextResponse.json({ error: "No se pudo crear cliente" }, { status: 500 })
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
      status: "Pendiente",
      pago_status: "Pago Contraentrega",
      metodo_envio: shippingMethod,
    }

    const insertPedidoFull = async () => {
      return supabaseAdmin
        .from("pedidos")
        .insert({
          ...commonPedidoData,
          subtotal,
          descuento: appliedDiscount,
          cupon_codigo: couponCode,
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
      if ((couponCode && couponCode.length > 0) || appliedDiscount > 0) {
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
      precio_unitario: Number(item.precio ?? 0) || 0,
      producto_nombre: item.nombre || null,
      variante_nombre: item.variante_nombre || null,
      cantidad: item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin.from("pedido_items").insert(orderItems)
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
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

