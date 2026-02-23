import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"
import { z } from "zod"

export const runtime = "nodejs" // Necesario para hacer fetch a APIs externas sin problemas de timeout en Edge

// ── Tipos y Esquemas ──

const CheckoutItemSchema = z.object({
    id: z.coerce.number().positive(),
    quantity: z.coerce.number().positive(),
    precio: z.coerce.number().optional(),
    nombre: z.string().optional(),
    producto_variante_id: z.coerce.number().nullable().optional(),
    variante_nombre: z.string().nullable().optional(),
})

const CulqiCheckoutSchema = z.object({
    // Datos del Cliente
    name: z.string().min(2, "Nombre requerido"),
    phone: z.string().min(9, "Teléfono inválido"),
    dni: z.string().length(8, "DNI debe tener 8 dígitos"),
    email: z.string().email("Email inválido"), // Culqi requiere email
    address: z.string().min(5, "Dirección requerida"),
    reference: z.string().nullable().optional(),
    locationLink: z.string().nullable().optional().or(z.literal("")),

    // Ubicación
    department: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    district: z.string().nullable().optional(),

    // Datos del Pedido
    shippingMethod: z.string().nullable().optional(),
    couponCode: z.string().nullable().optional(),
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
    try {
        // 1. Rate Limiting (Seguridad básica)
        const clientIP = getClientIP(req)
        const rateCheck = checkRateLimit(clientIP, { maxRequests: 5, windowSeconds: 60, prefix: "checkout_culqi" })

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

        // 3. Obtener Precios Oficiales (Validación de backend crítica)
        const productIds = data.items.map(it => it.id)
        if (productIds.length === 0) {
            return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
        }

        const { data: dbProducts, error: dbError } = await supabase
            .from("productos")
            .select("id, precio")
            .in("id", productIds)

        if (dbError) {
            console.error("Error obteniendo precios de la base de datos:", dbError)
            return NextResponse.json({ error: "Error interno verificando catálogo." }, { status: 500 })
        }

        const preciosOficiales = new Map<number, number>()
        dbProducts?.forEach((p: any) => preciosOficiales.set(p.id, Number(p.precio) || 0))

        // Calcular subtotal con precios oficiales
        let hasInvalidProducts = false
        const subtotal = Math.max(0, Math.round(data.items.reduce((acc, it) => {
            const unit = preciosOficiales.get(it.id)
            if (unit === undefined) {
                hasInvalidProducts = true;
                return acc;
            }
            return acc + (unit * it.quantity)
        }, 0) * 100) / 100)

        if (hasInvalidProducts) {
            return NextResponse.json({ error: "Algunos productos en el carrito ya no están disponibles." }, { status: 400 })
        }

        const appliedDiscount = Math.max(0, Math.min(subtotal, data.discountAmount || 0))
        const total = Math.max(0, Math.round((subtotal - appliedDiscount) * 100) / 100)

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
            metodo_envio: data.shippingMethod,
            subtotal: subtotal,
            descuento: appliedDiscount,
            cupon_codigo: data.couponCode || null,
            total: total,
            status: "Pendiente", // Nace como pendiente
            pago_status: "Pendiente", // Pendiente de pago
        }).select().single()

        if (pedidoError || !pedido) {
            console.error("🔴 ERROR CRÍTICO INSERTANDO PRE-PEDIDO SUPABASE:", pedidoError)
            throw new Error(`Error creando el pre-pedido en base de datos. Detalles: ${pedidoError?.message || "Desconocido"}. Intente nuevamente.`)
        }

        // C. Guardar Items
        const itemsToInsert = data.items.map(it => ({
            pedido_id: pedido.id,
            producto_id: it.id,
            producto_variante_id: it.producto_variante_id,
            cantidad: it.quantity,
            precio_unitario: preciosOficiales.get(it.id) || 0,
            producto_nombre: it.nombre,
            variante_nombre: it.variante_nombre
        }))

        await supabase.from("pedido_items").insert(itemsToInsert)

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
            // Marcar pedido como fallido para tener trazabilidad
            await supabase.from("pedidos").update({
                status: "Fallido",
                pago_status: "Fallido"
            }).eq("id", pedido.id)

            const userMsg = culqiData.user_message || culqiData.merchant_message || "No se pudo procesar el pago."
            return NextResponse.json({ error: userMsg, code: culqiData.code }, { status: 400 })
        }

        console.log("✅ Pago exitoso ID:", culqiData.id)

        // 6. Actualizar Pedido a Pagado (bloqueante — necesario antes de los pasos paralelos)
        await supabase.from("pedidos").update({
            status: "Confirmado",
            pago_status: "Pagado Anticipado",
            culqi_charge_id: culqiData.id
        }).eq("id", pedido.id)

        // ── Función auxiliar: descuenta stock de todos los items en PARALELO ──────
        const deductStock = async (): Promise<void> => {
            const { data: itemsForStock } = await supabase
                .from("pedido_items")
                .select("producto_id, producto_variante_id, cantidad")
                .eq("pedido_id", pedido.id)

            const safeItems = (itemsForStock || []).filter(
                (it): it is { producto_id: number; producto_variante_id: number | null; cantidad: number } =>
                    Boolean(it.producto_id)
            )

            // Cada producto se actualiza en paralelo (no secuencial)
            await Promise.all(safeItems.map(async (it) => {
                const productoId = Number(it.producto_id)
                const varianteId = it.producto_variante_id != null ? Number(it.producto_variante_id) : null
                const qty = Number(it.cantidad || 0)
                if (!productoId || qty <= 0) return

                if (varianteId) {
                    const { data: variante } = await supabase
                        .from("producto_variantes").select("stock").eq("id", varianteId).single()
                    const newStock = Math.max(0, Number((variante as any)?.stock ?? 0) - qty)
                    await supabase.from("producto_variantes").update({ stock: newStock }).eq("id", varianteId)
                } else {
                    const { data: producto } = await supabase
                        .from("productos").select("stock").eq("id", productoId).single()
                    const newStock = Math.max(0, Number((producto as any)?.stock ?? 0) - qty)
                    await supabase.from("productos").update({ stock: newStock }).eq("id", productoId)
                }
            }))

            await supabase.from("pedidos").update({ stock_descontado: true }).eq("id", pedido.id)
            console.log(`📦 Stock descontado automáticamente para el pedido #${pedido.id}`)
        }
        // ──────────────────────────────────────────────────────────────────────────

        // D + E + F: registrar pago, descontar stock y agregar nota en PARALELO
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

            // E. Descuento de stock en paralelo por producto
            deductStock().catch((err: any) =>
                console.error(`⚠️ Error al descontar stock del pedido #${pedido.id}:`, err?.message || err)
            ),

            // F. Nota de auditoría en el panel admin
            supabase.from("pedido_notas").insert({
                pedido_id: pedido.id,
                autor_id: "00000000-0000-0000-0000-000000000000",
                autor_nombre: "Sistema Inteligente",
                contenido: `Pago aprobado por Culqi. ID: ${culqiData.id}. Tarjeta: ${culqiData.source?.iin?.card_brand || 'Desconocida'}.`,
                tipo: "info"
            }),
        ])

        return NextResponse.json({
            ok: true,
            orderId: pedido.id,
            transactionId: culqiData.id
        })

    } catch (error: any) {
        console.error("Error General Checkout:", error)
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
    }
}
