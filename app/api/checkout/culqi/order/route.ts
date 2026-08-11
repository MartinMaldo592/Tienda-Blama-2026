import { NextResponse } from "next/server"
import { z } from "zod"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"

export const runtime = "nodejs"

const CreateOrderSchema = z.object({
    amount: z.number().positive("El monto debe ser positivo"),
    description: z.string().optional().default("Pedido BLAMA Fitness"),
    order_number: z.string().optional(),
    client_details: z.object({
        first_name: z.string().min(1, "Nombre requerido"),
        last_name: z.string().optional().default(""),
        email: z.string().email("Email inválido"),
        phone_number: z.string().optional().default("900000000"),
    }),
})

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting
        const clientIP = getClientIP(req)
        const rateCheck = await checkRateLimit(clientIP, { maxRequests: 10, windowSeconds: 60, prefix: "culqi_order" })
        if (!rateCheck.success) {
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Por favor intente en un minuto." },
                { status: 429, headers: rateCheck.headers }
            )
        }

        // 2. Secret Key Check
        const culqiSecret = process.env.CULQI_SECRET_KEY
        if (!culqiSecret) {
            console.error("❌ Falta CULQI_SECRET_KEY en el servidor")
            return NextResponse.json({ error: "Error de configuración de la pasarela" }, { status: 500 })
        }

        const body = await req.json()
        const validation = CreateOrderSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Datos inválidos", details: validation.error.format() }, { status: 400 })
        }

        const { amount, description, order_number, client_details } = validation.data
        const amountInCents = Math.round(amount * 100)

        // Expiración por defecto en 24 horas (Timestamp UNIX)
        const expirationDate = Math.floor(Date.now() / 1000) + (24 * 60 * 60)

        const culqiPayload = {
            amount: amountInCents,
            currency_code: "PEN",
            description: description,
            order_number: order_number || `ORD-${Date.now()}`,
            client_details: {
                first_name: client_details.first_name,
                last_name: client_details.last_name || "Cliente",
                email: client_details.email,
                phone_number: client_details.phone_number || "900000000",
            },
            expiration_date: expirationDate,
        }

        console.log("🚀 Enviando solicitud de orden a Culqi /v2/orders:", culqiPayload)

        const response = await fetch("https://api.culqi.com/v2/orders", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${culqiSecret}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(culqiPayload),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("❌ Error de la API de Culqi en /v2/orders:", data)
            const errorMessage = data.user_message || data.merchant_message || "No se pudo generar la orden de pago"
            return NextResponse.json({ error: errorMessage, details: data }, { status: response.status })
        }

        console.log("✅ Orden Culqi creada exitosamente:", data.id)

        return NextResponse.json({
            ok: true,
            orderId: data.id,
            qr: data.qr || null,
        })
    } catch (error: any) {
        console.error("🔥 Error interno generando orden Culqi:", error)
        return NextResponse.json({ error: error.message || "Error interno al crear orden de Culqi" }, { status: 500 })
    }
}
