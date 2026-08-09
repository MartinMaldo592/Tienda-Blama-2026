import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { triggerOrderConfirmationEmail } from "@/features/emails"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs" // Necesario para hacer fetch a APIs externas sin problemas de timeout en Edge

import { validateAndCalculateTotals, CheckoutEngine } from "@/features/checkout"

// ── Tipos y Esquemas ──

const CheckoutItemSchema = z.object({
    id: z.coerce.number().positive(),
    quantity: z.coerce.number().positive(),
    precio: z.coerce.number().optional(),
    nombre: z.string().optional(),
    producto_variante_id: z.coerce.number().nullable().optional(),
    variante_nombre: z.string().nullable().optional(),
})

import { identitySchema, checkoutBaseFields } from "@/features/checkout"

const CulqiCheckoutSchema = z.object({
    // Datos del Cliente
    name: identitySchema.name,
    phone: identitySchema.phone,
    dni: identitySchema.document,
    email: z.string().email("Email inválido"), // Culqi requiere email obligatorio
    address: checkoutBaseFields.address,
    reference: checkoutBaseFields.reference,
    locationLink: z.string().nullable().optional().or(z.literal("")),

    // Ubicación
    department: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    district: z.string().nullable().optional(),

    // Datos del Pedido
    shippingMethod: checkoutBaseFields.shippingMethod,
    couponCode: checkoutBaseFields.couponCode,
    discountAmount: z.coerce.number().nullable().optional(),
    items: z.array(CheckoutItemSchema).min(1, "El carrito está vacío"),

    // Datos de Culqi
    token: z.string().min(1, "Token de pago no recibido"),
    deviceId: z.string().optional(), // Opcional para ciberseguridad avanzada
})

// ── Helpers ──

function getEnv() {
    return {
        url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
        service: process.env.SUPABASE_SERVICE_ROLE_KEY,
        culqiSecret: process.env.CULQI_SECRET_KEY,
    }
}

export async function POST(req: Request) {
    let wasStockDeducted = false
    let createdPedidoId: number | null = null

    try {
        // 1. Rate Limiting (Seguridad básica)
        const clientIP = getClientIP(req)
        const rateCheck = await checkRateLimit(clientIP, { maxRequests: 5, windowSeconds: 60, prefix: "checkout_culqi" })

        if (!rateCheck.success) {
            return NextResponse.json(
                { error: "Demasiados intentos. Por favor espera un minuto." },
                { status: 429, headers: rateCheck.headers }
            )
        }

        // 2. Verificar Entorno
        const { url, service, culqiSecret } = getEnv()
        if (!url || !service || !culqiSecret) {
            console.error("Faltan variables de entorno para Culqi/Supabase")
            return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 })
        }

        const bodyRaw = await req.json()
        const validation = CulqiCheckoutSchema.safeParse(bodyRaw)

        if (!validation.success) {
            return NextResponse.json({ error: "Datos inválidos", details: validation.error.format() }, { status: 400 })
        }

        const data = validation.data
        const supabase = createClient(url, service)

        const result = await CheckoutEngine.processOrder(supabase, {
          channel: "culqi",
          payload: data,
          culqiToken: data.token,
          culqiSecret,
        } as any)

        return NextResponse.json({
          ok: true,
          orderId: result.orderId,
          transactionId: result.orderId.toString(),
        })

    } catch (error: any) {
        console.error("Error General Checkout Culqi:", error)
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
    }
}
