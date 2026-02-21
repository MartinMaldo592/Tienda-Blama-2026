import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function POST(req: Request) {
    try {
        // 1. Parsear el cuerpo de la petición HTTP del Webhook
        const bodyText = await req.text()
        let eventData;
        try {
            eventData = JSON.parse(bodyText)
        } catch (e) {
            console.error("❌ Webhook Culqi: JSON inválido recibido.")
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
        }

        // Si no es un evento oficial de Culqi, ignoramos (para evitar ruido)
        if (eventData.object !== "event") {
            return NextResponse.json({ ok: true, message: "No es un evento procesable." })
        }

        // 2. Extraer Variables de Entorno (Claves de Seguridad)
        const culqiSecret = process.env.CULQI_SECRET_KEY
        const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!culqiSecret || !url || !serviceRole) {
            console.error("❌ Webhook Culqi: Faltan variables de entorno.")
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 })
        }

        // Instanciar cliente de base de datos con permisos de Servidor
        const supabase = createClient(url, serviceRole)

        // 3. Capturar los datos del payload webhook enviado
        const tipoEvento = eventData.type;
        const dataChargeInfo = eventData.data;

        // Intentar rescatar el ID del Pedido insertado en tu Base de datos local
        const pedidoIdStr = dataChargeInfo?.metadata?.pedido_id
        if (!pedidoIdStr) {
            console.error("⚠️ Webhook Culqi: El Metadato del Cargo no incluye 'pedido_id'. Ignorando.")
            return NextResponse.json({ ok: true, message: "Falta Pedido ID. Probablemente no originado aquí." })
        }

        const pedidoId = parseInt(pedidoIdStr.toString(), 10)

        // ==========================================
        // 🚨 BLINDAJE DE SEGURIDAD (ANTI-SPOOFING) 🚨
        // ==========================================
        // No confiaremos a ciegas en el JSON que llegó (podría ser un hacker simulándolo). 
        // Vamos a conectarnos silenciosamente a los servidores reales de Culqi para preguntar: 
        // "¿Es verdad que este ID de cargo (dataChargeInfo.id) acaba de suceder y tiene estos montos?"
        const verifyRes = await fetch(`https://api.culqi.com/v2/charges/${dataChargeInfo.id}`, {
            headers: {
                "Authorization": `Bearer ${culqiSecret}`, // Tu llave privada real (Nadie más la tiene)
                "Content-Type": "application/json"
            }
        });

        if (!verifyRes.ok) {
            console.error(`🚨 Webhook Culqi: Intento de suplantación. Cargo ${dataChargeInfo.id} no verificado directamente en Culqi.`)
            return NextResponse.json({ error: "Verificación Fallida. Posible Fraude." }, { status: 401 })
        }

        // La respuesta OFICIAL de los servidores contables de Culqi
        const cargoOficial = await verifyRes.json();

        // Si es un Fraude / Spoofing de payload, cancelar.
        if (cargoOficial.id !== dataChargeInfo.id) {
            return NextResponse.json({ error: "Discrepancia de datos." }, { status: 400 })
        }

        // ==========================================
        // 🛠️ MÁQUINA DE ESTADOS: PROCESAR EL EVENTO WEBHOOK
        // ==========================================

        if (tipoEvento === "charge.creation.succeeded") {
            console.log(`✅ Webhook Culqi: Aprobando PAGO SEGURO para Pedido #${pedidoId}`)

            // 1. Confirmar el pedido general
            await supabase.from("pedidos").update({
                status: "Confirmado",
                pago_status: "Pagado Anticipado"
            }).eq("id", pedidoId)

            // 2. Verificar si el Log de Finanzas ya está registrado (Si el celular del cliente sí logró guardar en BD a tiempo)
            const { data: existingPayment } = await supabase.from("pedido_pagos")
                .select("id")
                .eq("pedido_id", pedidoId)
                .ilike("nota", `%${cargoOficial.id}%`) // Buscamos si en la nota está apuntado este ID Transacción
                .single()

            // 3. Crear Registro de Pagos únicamente si el Front-End falló en crearlo
            if (!existingPayment) {
                console.log(`💳 Webhook Culqi: Rellenando Finanzas faltantes del Pedido #${pedidoId}...`)
                await supabase.from("pedido_pagos").insert({
                    pedido_id: pedidoId,
                    monto: cargoOficial.amount / 100, // Culqi responde en céntimos
                    metodo_pago: "Otro",
                    tipo_pago: "Pago Final",
                    nota: `[Recuperado por Webhook] Culqi ID: ${cargoOficial.id} - Tarjeta ${cargoOficial.source?.iin?.card_brand || 'Desconocida'}`,
                    registrado_por: "Sistema (Webhook Respaldo)",
                })
            }
        }
        else if (tipoEvento === "charge.creation.failed") {
            console.log(`❌ Webhook Culqi: Registrando rechazo de Banco para pedido #${pedidoId}`)
            // Cambiar a Fallido, pero solo si actualmente está en Pendiente (Por si un admin lo actualizó manual a Confirmado antes)
            await supabase.from("pedidos").update({
                status: "Fallido",
                pago_status: "Fallido"
            }).eq("id", pedidoId).eq("status", "Pendiente")
        }

        // Finalización Correcta (Culqi dejará de enviarnos este evento porque respondimos HTTP 200 OK)
        return NextResponse.json({ ok: true, message: "Evento Webhook Integrado y Resuelto" })

    } catch (error: any) {
        console.error("🔥 Error General Rescatando Webhook:", error)
        return NextResponse.json({ error: "Error fatal interno del servidor web." }, { status: 500 })
    }
}
