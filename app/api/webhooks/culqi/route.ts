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

        if (eventData.object !== "event") {
            return NextResponse.json({ ok: true, message: "No es un evento procesable." })
        }

        // 2. Extraer Variables de Entorno
        const culqiSecret = process.env.CULQI_SECRET_KEY
        const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!culqiSecret || !url || !serviceRole) {
            console.error("❌ Webhook Culqi: Faltan variables de entorno.")
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 })
        }

        const supabase = createClient(url, serviceRole)
        const tipoEvento = eventData.type
        const payloadData = eventData.data

        console.log(`🔔 Webhook Culqi Recibido: ${tipoEvento}`, payloadData?.id)

        // ==========================================
        // CASO A: PAGO CON TARJETA / CARGO INMEDIATO (charge.creation.succeeded)
        // ==========================================
        if (tipoEvento === "charge.creation.succeeded") {
            const pedidoIdStr = payloadData?.metadata?.pedido_id
            if (!pedidoIdStr) {
                console.warn("⚠️ Webhook Culqi: El Metadato del Cargo no incluye 'pedido_id'. Ignorando.")
                return NextResponse.json({ ok: true, message: "Falta Pedido ID." })
            }

            const pedidoId = parseInt(pedidoIdStr.toString(), 10)

            // Verificación Anti-Spoofing contra la API de Culqi
            const verifyRes = await fetch(`https://api.culqi.com/v2/charges/${payloadData.id}`, {
                headers: {
                    "Authorization": `Bearer ${culqiSecret}`,
                    "Content-Type": "application/json"
                }
            })

            if (!verifyRes.ok) {
                console.error(`🚨 Webhook Culqi: Intento de suplantación para Cargo ${payloadData.id}`)
                return NextResponse.json({ error: "Verificación Fallida." }, { status: 401 })
            }

            const cargoOficial = await verifyRes.json()
            if (cargoOficial.id !== payloadData.id) {
                return NextResponse.json({ error: "Discrepancia de datos." }, { status: 400 })
            }

            await procesarPedidoPagado(supabase, pedidoId, cargoOficial.amount / 100, `Culqi Cargo ID: ${cargoOficial.id}`, "Tarjeta")
        }

        // ==========================================
        // CASO B: PAGO CON BILLETERA MÓVIL / QR (order.status.changed)
        // ==========================================
        else if (tipoEvento === "order.status.changed") {
            const orderId = payloadData?.id
            if (!orderId) {
                return NextResponse.json({ ok: true, message: "ID de Orden faltante." })
            }

            // Verificación de la Orden contra la API de Culqi
            const verifyRes = await fetch(`https://api.culqi.com/v2/orders/${orderId}`, {
                headers: {
                    "Authorization": `Bearer ${culqiSecret}`,
                    "Content-Type": "application/json"
                }
            })

            if (!verifyRes.ok) {
                console.error(`🚨 Webhook Culqi: No se pudo verificar la Orden ${orderId}`)
                return NextResponse.json({ error: "Verificación de orden fallida." }, { status: 401 })
            }

            const ordenOficial = await verifyRes.json()
            console.log(`📌 Estado oficial de Orden Culqi ${orderId}:`, ordenOficial.state)

            if (ordenOficial.state === "paid") {
                // Intentar obtener el pedido_id desde metadata u order_number
                let pedidoId: number | null = null

                if (ordenOficial.metadata?.pedido_id) {
                    pedidoId = parseInt(ordenOficial.metadata.pedido_id.toString(), 10)
                } else if (ordenOficial.order_number) {
                    const cleanNum = ordenOficial.order_number.replace(/\D/g, '')
                    if (cleanNum) pedidoId = parseInt(cleanNum, 10)
                }

                if (pedidoId && !isNaN(pedidoId)) {
                    console.log(`✅ Webhook Culqi: Confirmando pago por Billetera Móvil (QR) para Pedido #${pedidoId}`)
                    await procesarPedidoPagado(supabase, pedidoId, ordenOficial.amount / 100, `Culqi Order QR ID: ${orderId}`, "Billetera Móvil (QR)")
                } else {
                    console.warn("⚠️ Webhook Culqi: No se encontró pedido_id asociado a la orden pagada:", orderId)
                }
            }
        }
        else if (tipoEvento === "charge.creation.failed") {
            const pedidoIdStr = payloadData?.metadata?.pedido_id
            if (pedidoIdStr) {
                const pedidoId = parseInt(pedidoIdStr.toString(), 10)
                await supabase.from("pedidos").update({
                    status: "Fallido",
                    pago_status: "Fallido"
                }).eq("id", pedidoId).eq("status", "Pendiente")
            }
        }

        return NextResponse.json({ ok: true, message: "Evento Webhook Procesado" })

    } catch (error: any) {
        console.error("🔥 Error General Procesando Webhook Culqi:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

// Helper reusable para marcar pedidos pagados y descontar stock de forma idéntica y segura
async function procesarPedidoPagado(supabase: any, pedidoId: number, monto: number, notaTransaccion: string, metodo: string) {
    // 1. Obtener estado del pedido y stock
    const { data: currentPedido } = await supabase.from("pedidos")
        .select("stock_descontado")
        .eq("id", pedidoId)
        .maybeSingle()

    // 2. Actualizar estado del pedido
    await supabase.from("pedidos").update({
        status: "Confirmado",
        pago_status: "Pagado Anticipado"
    }).eq("id", pedidoId)

    // 3. Descontar stock si aún no se había hecho
    if (!currentPedido?.stock_descontado) {
        console.log(`📦 Webhook Culqi: Descontando stock para el pedido #${pedidoId}...`)
        const { error: rpcError } = await supabase.rpc('admin_procesar_descuento_stock', {
            p_pedido_id: pedidoId,
            p_revertir: false
        })
        if (rpcError) {
            console.error(`⚠️ Webhook Culqi: Error descontando stock del pedido #${pedidoId}:`, rpcError.message)
        } else {
            console.log(`📦 Webhook Culqi: Stock descontado exitosamente para el pedido #${pedidoId}`)
        }
    }

    // 4. Registrar en Finanzas / Pagos
    const { data: existingPayment } = await supabase.from("pedido_pagos")
        .select("id")
        .eq("pedido_id", pedidoId)
        .ilike("nota", `%${notaTransaccion}%`)
        .maybeSingle()

    if (!existingPayment) {
        await Promise.allSettled([
            supabase.from("pedido_pagos").insert({
                pedido_id: pedidoId,
                monto: monto,
                metodo_pago: metodo,
                tipo_pago: "Pago Final",
                nota: `[Webhook Culqi] ${notaTransaccion}`,
                registrado_por: "Sistema (Webhook Culqi)",
            }),
            supabase.from("pedido_notas").insert({
                pedido_id: pedidoId,
                autor_id: "00000000-0000-0000-0000-000000000000",
                autor_nombre: "Sistema Culqi",
                contenido: `Pago por ${metodo} verificado exitosamente vía Webhook Culqi. ${notaTransaccion}`,
                tipo: "info"
            })
        ])
    }
}
