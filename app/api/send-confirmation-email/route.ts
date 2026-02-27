import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderConfirmationEmail } from "@/lib/email"

export const runtime = "nodejs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { orderId, transactionId } = body

        if (!orderId) {
            return NextResponse.json({ error: "Falta el ID del pedido" }, { status: 400 })
        }

        // Connect with service role to access full order data
        const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        const service = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!url || !service) {
            return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 500 })
        }

        const supabase = createClient(url, service)

        console.log(`🔍 Buscando pedido #${orderId} para enviar confirmación...`)

        // 1. Fetch order data with client email as fallback
        const { data: pedido, error: pedidoError } = await supabase
            .from("pedidos")
            .select(`
                id, 
                nombre_contacto, 
                telefono_contacto, 
                total, 
                subtotal, 
                descuento, 
                metodo_envio, 
                direccion_calle, 
                pago_status, 
                culqi_charge_id, 
                cliente_id, 
                email_confirmacion_enviado, 
                email_contacto,
                clientes ( email )
            `)
            .eq("id", Number(orderId))
            .single()

        if (pedidoError || !pedido) {
            console.error(`❌ Pedido #${orderId} no encontrado en Supabase:`, pedidoError)
            return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
        }

        // ── IDEMPOTENCY CHECK ──
        if (pedido.email_confirmacion_enviado) {
            console.log(`ℹ️ Email para pedido #${orderId} ya fue enviado anteriormente. Ignorando.`)
            return NextResponse.json({ ok: true, status: "already_sent" })
        }

        // 2. Security: Validate transaction ID
        // Note: For WhatsApp orders, transactionId from URL is "whatsapp"
        const storedCulqiId = pedido.culqi_charge_id || ""
        if (storedCulqiId && transactionId && transactionId !== "whatsapp" && transactionId !== storedCulqiId) {
            console.warn(`🔒 Intento de envío no autorizado para pedido #${orderId}. mismatch: ${transactionId} vs ${storedCulqiId}`)
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // 3. Check payment status
        const isContraentrega = !storedCulqiId || transactionId === "whatsapp"
        const pagosConfirmados = ["Pagado", "Pagado Anticipado", "Pago Contraentrega", "Pagado al Recibir", "Confirmado"]

        const statusLower = String(pedido.pago_status || "").toLowerCase()
        const isPending = statusLower === "pendiente"

        if (!pagosConfirmados.some(s => s.toLowerCase() === statusLower) && !(isContraentrega && isPending)) {
            console.warn(`⚠️ Pago no confirmado para pedido #${orderId}. Status: ${pedido.pago_status}`)
            return NextResponse.json({ error: `El pago aún no está confirmado (${pedido.pago_status})` }, { status: 400 })
        }

        // 4. Get recipient email
        // Priority: 1. email_contacto (from form) 2. clientes.email (from profile)
        const recipientEmail = (pedido.email_contacto?.trim()) || (pedido.clientes as any)?.email?.trim()

        if (!recipientEmail) {
            console.log(`ℹ️ Pedido #${orderId} no tiene ningún correo asociado. Saltando envío.`)
            return NextResponse.json({ ok: true, status: "no_email_provided" })
        }

        console.log(`📧 Preparando envío para #${orderId} a ${recipientEmail} (Método: ${isContraentrega ? 'Contraentrega' : 'Tarjeta'})`)

        // 5. Get order items
        const { data: items } = await supabase
            .from("pedido_items")
            .select("producto_nombre, variante_nombre, cantidad, precio_unitario")
            .eq("pedido_id", Number(orderId))

        // 6. Send email via Resend
        const result = await sendOrderConfirmationEmail({
            to: recipientEmail,
            clienteNombre: pedido.nombre_contacto || "Cliente",
            pedidoId: pedido.id,
            items: (items || []).map(it => ({
                producto_nombre: it.producto_nombre || "Producto",
                variante_nombre: it.variante_nombre,
                cantidad: it.cantidad,
                precio_unitario: it.precio_unitario,
            })),
            subtotal: pedido.subtotal || pedido.total,
            descuento: pedido.descuento || 0,
            total: pedido.total,
            metodoPago: pedido.culqi_charge_id ? "Tarjeta" : "Contraentrega",
            transactionId: pedido.culqi_charge_id || undefined,
            direccion: pedido.direccion_calle || undefined,
            metodoEnvio: pedido.metodo_envio || undefined,
        })

        if (!result.success) {
            console.error("❌ Error enviando email:", result.error)
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        // 7. Update database to mark email as SENT
        await supabase
            .from("pedidos")
            .update({ email_confirmacion_enviado: true })
            .eq("id", pedido.id)

        return NextResponse.json({ ok: true, emailId: result.emailId })

    } catch (error: any) {
        console.error("Error en API send-confirmation-email:", error)
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
    }
}
