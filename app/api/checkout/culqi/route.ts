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

        // 3. Calcular Totales (Validación de backend importante)
        const subtotal = Math.max(0, Math.round(data.items.reduce((acc, it) => {
            const unit = Number(it.precio ?? 0) || 0
            return acc + (unit * it.quantity)
        }, 0) * 100) / 100)

        const appliedDiscount = Math.max(0, Math.min(subtotal, data.discountAmount || 0))
        const total = Math.max(0, Math.round((subtotal - appliedDiscount) * 100) / 100)

        // El monto para Culqi debe ser en CÉNTIMOS (enteros)
        const culqiAmount = Math.round(total * 100)

        // 4. Procesar el cargo con Culqi
        console.log(`🔌 Procesando pago Culqi para: ${data.email} por S/ ${total}`)

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
                description: `Pedido Tienda Blama - ${data.dni}`, // Descripción en estado de cuenta
                antifraud_details: {
                    phone_number: data.phone,
                }
            })
        })

        const culqiData = await culqiRes.json()

        if (!culqiRes.ok) {
            // Error en el pago (Tarjeta denegada, fondos insuficientes, etc.)
            console.error("❌ Error Culqi:", culqiData)
            const userMsg = culqiData.user_message || culqiData.merchant_message || "No se pudo procesar el pago."
            return NextResponse.json({ error: userMsg, code: culqiData.code }, { status: 400 })
        }

        // ✅ ¡PAGO EXITOSO!
        console.log("✅ Pago exitoso ID:", culqiData.id)

        // 5. Guardar en Base de Datos (Supabase)
        const supabase = createClient(url, service)

        // A. Gestión Cliente (Buscar o Crear)
        let clienteId: number | null = null
        const direccionCompleta = data.address // Simplificamos, ya que address suele ser completa o agregamos detalles si quieres

        // Intentar buscar por DNI o Teléfono (prioridad a DNI que es identificador legal)
        const { data: existingClients, error: searchError } = await supabase
            .from("clientes")
            .select("id")
            .or(`dni.eq.${data.dni},telefono.eq.${data.phone}`)
            .limit(1)

        if (searchError) {
            console.error("Error buscando cliente:", searchError)
            throw new Error(`Error buscando cliente: ${searchError.message}`)
        }

        const clientData = {
            nombre: data.name,
            dni: data.dni,
            telefono: data.phone,
            // email: data.email, // Eliminado temporalmente por falta de columna en DB
            direccion: direccionCompleta,
            referencia: data.reference,
            link_ubicacion: data.locationLink,
            departamento: data.department,
            provincia: data.province,
            distrito: data.district,
            updated_at: new Date().toISOString()
        }

        if (existingClients && existingClients.length > 0) {
            // ACTUALIZAR
            clienteId = existingClients[0].id
            const { error: updateError } = await supabase
                .from("clientes")
                .update(clientData)
                .eq("id", clienteId)

            if (updateError) {
                console.error("Error actualizando cliente:", updateError)
                throw new Error(`Error actualizando cliente: ${updateError.message}`)
            }
        } else {
            // CREAR NUEVO
            const { data: newClient, error: insertError } = await supabase
                .from("clientes")
                .insert(clientData)
                .select("id")
                .single()

            if (insertError) {
                console.error("Error creando cliente:", insertError)
                throw new Error(`Error creando cliente: ${insertError.message}`)
            }
            clienteId = newClient?.id || null
        }

        if (!clienteId) throw new Error("No se pudo obtener el ID del cliente tras la operación")

        // B. Crear Pedido
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

            // Totales
            subtotal: subtotal,
            descuento: appliedDiscount,
            cupon_codigo: data.couponCode || null,
            total: total,

            // ESTADOS IMPORTANTES
            status: "Confirmado", // Ya está pagado, nace confirmado
            pago_status: "Pagado", // ✅ PAGADO
            metodo_pago: "Tarjeta" // O el valor que uses en tu DB
        }).select().single()

        if (pedidoError || !pedido) {
            console.error("Error creando pedido DB:", pedidoError)
            // NOTA CRÍTICA: El pago ya se hizo pero falló la DB. 
            // En un sistema avanzado aquí haríamos un reembolso automático o alerta crítica.
            throw new Error("El pago se procesó pero hubo un error guardando el pedido. Contáctanos con tu comprobante.")
        }

        // C. Guardar Items
        const itemsToInsert = data.items.map(it => ({
            pedido_id: pedido.id,
            producto_id: it.id,
            producto_variante_id: it.producto_variante_id,
            cantidad: it.quantity,
            precio_unitario: Number(it.precio || 0),
            producto_nombre: it.nombre,
            variante_nombre: it.variante_nombre
        }))

        await supabase.from("pedido_items").insert(itemsToInsert)

        // D. Registrar el Pago en la tabla financiera
        await supabase.from("pedido_pagos").insert({
            pedido_id: pedido.id,
            monto: total,
            metodo_pago: "Otro", // O 'Tarjeta' si actualizas tu enum
            tipo_pago: "Pago Final",
            nota: `Culqi ID: ${culqiData.id} - Tarjeta ${culqiData.source?.iin?.card_brand || 'Desconocida'}`,
            registrado_por: "Sistema (Web)",
        })

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
