import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendNewsletterWelcomeEmail } from "@/features/emails"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs"

const SubscribeBodySchema = z.object({
  email: z.string().email("Por favor ingresa un correo electrónico válido.").transform(val => val.toLowerCase().trim()),
})

function getEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { url, service }
}

function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `WELCOME-${code}`
}

export async function POST(req: Request) {
  try {
    const clientIP = getClientIP(req)
    const rateCheck = await checkRateLimit(clientIP, {
      maxRequests: 5,
      windowSeconds: 60,
      prefix: "newsletter",
    })

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor espera un momento." },
        { status: 429, headers: rateCheck.headers }
      )
    }

    const { url, service } = getEnv()
    if (!url || !service) {
      return NextResponse.json({ error: "Configuración de servidor incompleta." }, { status: 500 })
    }

    const bodyRaw = await req.json()
    const validation = SubscribeBodySchema.safeParse(bodyRaw)

    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Correo inválido."
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    const { email } = validation.data
    const supabaseAdmin = createClient(url, service)

    const { data: existingSub, error: selectSubError } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (selectSubError) {
      console.error("Error consultando newsletter_subscriptions:", selectSubError)
      return NextResponse.json({ error: "Error en el servidor al verificar suscripción." }, { status: 500 })
    }

    if (existingSub) {
      return NextResponse.json(
        { error: "Este correo electrónico ya está registrado en nuestro newsletter." },
        { status: 400 }
      )
    }

    const cuponCodigo = generateCouponCode()
    const now = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(now.getDate() + 30)

    const { error: insertCouponError } = await supabaseAdmin
      .from("cupones")
      .insert({
        codigo: cuponCodigo,
        tipo: "porcentaje",
        valor: 10,
        activo: true,
        min_total: 0,
        max_usos: 1,
        usos: 0,
        starts_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })

    if (insertCouponError) {
      console.error("Error insertando cupón:", insertCouponError)
      return NextResponse.json({ error: "Error al generar el cupón de bienvenida." }, { status: 500 })
    }

    const { error: insertSubError } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .insert({
        email,
        cupon_codigo: cuponCodigo,
      })

    if (insertSubError) {
      console.error("Error registrando suscripción:", insertSubError)
      await supabaseAdmin.from("cupones").delete().eq("codigo", cuponCodigo)
      return NextResponse.json({ error: "Error al registrar la suscripción." }, { status: 500 })
    }

    try {
      const emailResult = await sendNewsletterWelcomeEmail({
        to: email,
        cuponCodigo,
      })
      if (!emailResult.success) {
        console.error("No se pudo enviar el correo:", emailResult.error)
      }
    } catch (emailErr) {
      console.error("Excepción enviando correo de newsletter:", emailErr)
    }

    return NextResponse.json(
      { ok: true, message: "¡Gracias por suscribirte! Revisa tu bandeja de entrada para obtener tu cupón de descuento." },
      { headers: rateCheck.headers }
    )
  } catch (err: any) {
    console.error("Newsletter Subscribe Endpoint Error:", err)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
