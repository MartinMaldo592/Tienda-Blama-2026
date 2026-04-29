import { createClient } from "@supabase/supabase-js"
import { sendOrderConfirmationEmail } from "./email"

export async function triggerOrderConfirmationEmail(orderId: number, transactionId: string) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !service) {
        console.error("❌ Error de configuración para envío de correo (Server env missing)")
        return { success: false, error: "Configuración incompleta" }
    }

    const supabase = createClient(url, service)

    // 1. ATOMIC UPDATE: Try to "claim" the email sending task
    // This prevents double emails even if triggered from multiple places simultaneously.
    const { data: updatedPedido, error: updateError } = await supabase
        .from("pedidos")
        .update({ email_confirmacion_enviado: true })
        .eq("id", Number(orderId))
        .eq("email_confirmacion_enviado", false) // Only if not already claimed
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
            email_contacto,
            clientes ( email )
        `)
        .single()

    if (updateError || !updatedPedido) {
        // If it fails because the row wasn't found (already true), that's fine.
        console.log(`ℹ️ [EmailService] Email para #${orderId} ya está en proceso o fue enviado.`)
        return { success: true, alreadyClaimed: true }
    }

    const pedido = updatedPedido

    // 2. Security / Validation
    const storedCulqiId = pedido.culqi_charge_id || ""
    if (storedCulqiId && transactionId && transactionId !== "whatsapp" && transactionId !== storedCulqiId) {
        // Rollback claim if unauthorized (optional, but safer)
        await supabase.from("pedidos").update({ email_confirmacion_enviado: false }).eq("id", pedido.id)
        console.warn(`🔒 [EmailService] Unautorized trigger for #${orderId}`)
        return { success: false, error: "No autorizado" }
    }

    // 3. Check status
    const isContraentrega = !storedCulqiId || transactionId === "whatsapp"
    const statusLower = String(pedido.pago_status || "").toLowerCase()
    const isPending = statusLower === "pendiente"
    const pagosConfirmados = ["pagado", "pagado anticipado", "pago contraentrega", "pagado al recibir", "confirmado"]

    if (!pagosConfirmados.includes(statusLower) && !(isContraentrega && isPending)) {
        // Rollback claim if status is not ready
        await supabase.from("pedidos").update({ email_confirmacion_enviado: false }).eq("id", pedido.id)
        console.warn(`⚠️ [EmailService] Pago no listo para #${orderId}. Status: ${pedido.pago_status}`)
        return { success: false, error: `Pago no confirmado (${pedido.pago_status})` }
    }

    const recipientEmail = (pedido.email_contacto?.trim()) || (pedido.clientes as any)?.email?.trim()

    if (!recipientEmail) {
        console.log(`ℹ️ [EmailService] Pedido #${orderId} sin correo.`)
        return { success: true, noEmail: true }
    }

    // 4. Get items
    const { data: items } = await supabase
        .from("pedido_items")
        .select("producto_nombre, variante_nombre, cantidad, precio_unitario")
        .eq("pedido_id", Number(orderId))

    // 5. Send
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
        subtotal: pedido.subtotal,
        descuento: pedido.descuento,
        total: pedido.total,
        metodoPago: isContraentrega ? "Contraentrega" : "Tarjeta",
        transactionId: storedCulqiId || transactionId,
        direccion: pedido.direccion_calle || undefined,
        metodoEnvio: pedido.metodo_envio || undefined,
    })

    if (result.success) {
        return { success: true }
    }

    // Rollback claim if sending failed so it can be retried
    await supabase.from("pedidos").update({ email_confirmacion_enviado: false }).eq("id", pedido.id)
    return { success: false, error: result.error }
}
