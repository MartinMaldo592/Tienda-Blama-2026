import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { triggerOrderConfirmationEmail } from "@/features/emails"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs" // Necesario para hacer fetch a APIs externas sin problemas de timeout en Edge

import { validateAndCalculateTotals } from "@/features/checkout"

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

        // Crear cliente Supabase temprano para validar precios
        const supabase = createClient(url, service)

        let subtotal, appliedDiscount, total, validCouponCode, getUnitPrice;
        try {
            const result = await validateAndCalculateTotals(supabase, data.items, data.couponCode);
            subtotal = result.subtotal;
            appliedDiscount = result.discountAmount;
            total = result.total;
            validCouponCode = result.validCouponCode;
            getUnitPrice = result.getUnitPrice;
        } catch (e: any) {
            if (e.message.includes("catálogo de productos") || e.message.includes("variantes de productos")) {
                console.error("Error obteniendo precios de la base de datos:", e)
                return NextResponse.json({ error: "Error interno verificando catálogo." }, { status: 500 })
            }
            return NextResponse.json({ error: e.message }, { status: 400 })
        }

        // El monto para Culqi debe ser en CÉNTIMOS (enteros)
        const culqiAmount = Math.round(total * 100)

        // 4. Crear Pre-Pedido en Base de Datos (Idempotencia)
        // A. Gestión Cliente (Almacenar como único por pedido)
        const direccionCompleta = data.address

        const clientData = {
            nombre: data.name,
            dni: data.dni,
            telefono: data.phone,
            email: data.email,
            direccion: direccionCompleta,
            referencia: data.reference,
            link_ubicacion: data.locationLink,
            departamento: data.department,
            provincia: data.province,
            distrito: data.district,
            updated_at: new Date().toISOString()
        }

        const { data: newClient, error: insertError } = await supabase.from("clientes").insert(clientData).select("id").single()
        if (insertError) throw new Error(`Error creando cliente: ${insertError.message}`)

        const clienteId: number | null = newClient?.id || null

        if (!clienteId) throw new Error("No se pudo obtener el ID del cliente tras la operación")

        // Generar un PIN aleatorio único de 4 dígitos por defecto para envíos de Shalom / Provincia
        const generatedShalomPin = (
            data.shippingMethod?.toLowerCase() === "provincia" ||
            data.shippingMethod?.toLowerCase().includes("provincia") ||
            data.shippingMethod?.toLowerCase().includes("shalom")
        )
            ? Math.floor(1000 + Math.random() * 9000).toString()
            : null

        // B. Crear Pedido Pendiente
        const { data: pedido, error: pedidoError } = await supabase.from("pedidos").insert({
            cliente_id: clienteId,
            nombre_contacto: data.name,
            dni_contacto: data.dni,
            telefono_contacto: data.phone,
            direccion_calle: data.address,
            referencia_direccion: data.reference,
            link_ubicacion: data.locationLink,
            departamento: data.department,
            provincia: data.province,
            distrito: data.district,
            email_contacto: data.email,
            metodo_envio: data.shippingMethod,
            subtotal: subtotal,
            descuento: appliedDiscount,
            cupon_codigo: validCouponCode || null,
            total: total,
            status: "Pendiente", // Nace como pendiente
            pago_status: "Pendiente", // Pendiente de pago
            shalom_pin: generatedShalomPin,
        }).select().single()

        if (pedidoError || !pedido) {
            console.error("🔴 ERROR CRÍTICO INSERTANDO PRE-PEDIDO SUPABASE:", pedidoError)
            throw new Error(`Error creando el pre-pedido en base de datos. Detalles: ${pedidoError?.message || "Desconocido"}. Intente nuevamente.`)
        }

        createdPedidoId = pedido.id

        // C. Guardar Items
        const itemsToInsert = data.items.map(it => ({
            pedido_id: pedido.id,
            producto_id: it.id,
            producto_variante_id: it.producto_variante_id,
            cantidad: it.quantity,
            precio_unitario: getUnitPrice(it.id, it.producto_variante_id),
            producto_nombre: it.nombre,
            variante_nombre: it.variante_nombre
        }))

        await supabase.from("pedido_items").insert(itemsToInsert)

        // --- 📦 RESERVAR STOCK (DESCUENTO PREVIO) ---
        // Descontamos stock antes de la transacción de pago para garantizar la existencia de stock.
        const { data: stockDeductedRes, error: stockDeductedError } = await supabase.rpc('admin_procesar_descuento_stock', {
            p_pedido_id: pedido.id,
            p_revertir: false
        })

        if (stockDeductedError || !stockDeductedRes) {
            console.error("❌ Error al reservar stock en base de datos:", stockDeductedError)
            // Marcar pedido como fallido por falta de stock
            await supabase.from("pedidos").update({
                status: "Fallido",
                pago_status: "Fallido"
            }).eq("id", pedido.id)
            
            await supabase.from("pedido_notas").insert({
                pedido_id: pedido.id,
                autor_id: "00000000-0000-0000-0000-000000000000",
                autor_nombre: "Sistema Inteligente",
                contenido: `Reserva de stock fallida: ${stockDeductedError?.message || "Stock insuficiente en base de datos"}`,
                tipo: "alerta"
            })
            
            return NextResponse.json({ error: "No hay stock suficiente para procesar tu pedido." }, { status: 400 })
        }
        wasStockDeducted = true

        // 5. Procesar el cargo con Culqi
        console.log(`🔌 Procesando pago Culqi para: ${data.email} por S/ ${total} (Pedido ID: ${pedido.id})`)

        // --- Enriquecer Datos para el Anti-Fraude y Panel de Culqi ---
        const nameParts = data.name.trim().split(" ");
        const firstName = nameParts[0] || "Cliente";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Blama";

        const culqiRes = await fetch("https://api.culqi.com/v2/charges", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${culqiSecret}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: culqiAmount,
                currency_code: "PEN",
                email: data.email,
                source_id: data.token,
                description: `Pedido ${pedido.id} Tienda Blama - ${data.dni}`,
                antifraud_details: {
                    first_name: firstName.substring(0, 50),
                    last_name: lastName.substring(0, 100),
                    phone_number: data.phone,
                    address: direccionCompleta ? direccionCompleta.substring(0, 100) : "No indicada",
                    address_city: data.province ? data.province.substring(0, 50) : "Lima",
                    country_code: "PE",
                },
                metadata: {
                    pedido_id: pedido.id
                }
            })
        })

        const culqiData = await culqiRes.json()

        if (!culqiRes.ok) {
            console.error("❌ Error Culqi:", culqiData)
            
            // Revertir el stock de forma inmediata
            try {
                await supabase.rpc('admin_procesar_descuento_stock', {
                    p_pedido_id: pedido.id,
                    p_revertir: true
                })
                wasStockDeducted = false
                console.log(`📦 Stock revertido con éxito para el pedido fallido #${pedido.id}`)
            } catch (revertErr) {
                console.error("🚨 Error grave al revertir stock tras fallo de Culqi:", revertErr)
            }

            // Marcar pedido como fallido para tener trazabilidad
            await supabase.from("pedidos").update({
                status: "Fallido",
                pago_status: "Fallido"
            }).eq("id", pedido.id)

            const userMsg = culqiData.user_message || culqiData.merchant_message || "No se pudo procesar el pago."

            // Guardar nota de error para el administrador
            await supabase.from("pedido_notas").insert({
                pedido_id: pedido.id,
                autor_id: "00000000-0000-0000-0000-000000000000",
                autor_nombre: "Sistema Inteligente",
                contenido: `Pago Fallido (Culqi Error ${culqiData.code || 'Desconocido'}): ${userMsg} | Detalle Interno: ${culqiData.merchant_message || 'N/A'}`,
                tipo: "alerta"
            })

            return NextResponse.json({ error: userMsg, code: culqiData.code }, { status: 400 })
        }

        console.log("✅ Pago exitoso ID:", culqiData.id)

        // 6. Actualizar Pedido a Pagado (bloqueante — necesario antes de los pasos paralelos)
        await supabase.from("pedidos").update({
            status: "Confirmado",
            pago_status: "Pagado Anticipado",
            culqi_charge_id: culqiData.id
        }).eq("id", pedido.id)

        // D + F: registrar pago y agregar nota en PARALELO
        // Errores en stock/nota no bloquean la respuesta — el pago ya fue procesado.
        await Promise.allSettled([
            // D. Registrar pago financiero
            supabase.from("pedido_pagos").insert({
                pedido_id: pedido.id,
                monto: total,
                metodo_pago: "Tarjeta",
                tipo_pago: "Pago Final",
                nota: `Culqi ID: ${culqiData.id} - Tarjeta ${culqiData.source?.iin?.card_brand || 'Desconocida'}`,
                registrado_por: "Sistema (Web)",
            }),

            // F. Nota de auditoría en el panel admin
            supabase.from("pedido_notas").insert({
                pedido_id: pedido.id,
                autor_id: "00000000-0000-0000-0000-000000000000",
                autor_nombre: "Sistema Inteligente",
                contenido: `Pago aprobado por Culqi. ID: ${culqiData.id}. Tarjeta: ${culqiData.source?.iin?.card_brand || 'Desconocida'}.`,
                tipo: "info"
            }),
        ])

        // ── TRIGGER EMAIL CONFIRMATION (RELIABILITY FIX FOR MOBILE) ──
        // Await here to ensure delivery on mobile/serverless.
        try {
            await triggerOrderConfirmationEmail(pedido.id, culqiData.id)
        } catch (err) {
            console.error("⚠️ Background email trigger failed (Culqi):", err)
        }

        return NextResponse.json({
            ok: true,
            orderId: pedido.id,
            transactionId: culqiData.id
        })

    } catch (error: any) {
        console.error("Error General Checkout:", error)
        if (wasStockDeducted && createdPedidoId) {
            try {
                const { url, service } = getEnv()
                if (url && service) {
                    const supabase = createClient(url, service)
                    await supabase.rpc('admin_procesar_descuento_stock', {
                        p_pedido_id: createdPedidoId,
                        p_revertir: true
                    })
                    console.log(`📦 Stock revertido con éxito tras excepción general para el pedido #${createdPedidoId}`)
                }
            } catch (revertErr) {
                console.error("🚨 Error crítico al intentar revertir stock tras excepción:", revertErr)
            }
        }
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
    }
}
