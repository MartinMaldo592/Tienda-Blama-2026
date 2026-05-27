import { Resend } from "resend"
import { render } from "@react-email/components"
import { OrderConfirmationEmail } from "../components/order-confirmation"
import { OrderStatusEmail } from "../components/order-status"

function getResend() {
    return new Resend(process.env.RESEND_API_KEY)
}

interface OrderItem {
    producto_nombre: string
    variante_nombre?: string | null
    cantidad: number
    precio_unitario: number
}

interface SendOrderConfirmationParams {
    to: string
    clienteNombre: string
    pedidoId: number
    items: OrderItem[]
    subtotal: number
    descuento: number
    total: number
    metodoPago: string
    transactionId?: string
    direccion?: string
    metodoEnvio?: string
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationParams) {
    const pedidoFormateado = `#${params.pedidoId.toString().padStart(6, "0")}`

    try {
        const isContraentrega = params.metodoPago === "Contraentrega"
        const subjectPrefix = isContraentrega ? "Confirmación de Pedido" : "Confirmación de Compra"

        const emailHtml = await render(
            OrderConfirmationEmail({
                clienteNombre: params.clienteNombre,
                pedidoId: params.pedidoId,
                items: params.items,
                subtotal: params.subtotal,
                descuento: params.descuento,
                total: params.total,
                metodoPago: params.metodoPago,
                transactionId: params.transactionId,
                direccion: params.direccion,
                metodoEnvio: params.metodoEnvio,
                whatsappTienda: process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "+51958279604",
            })
        )

        const { data, error } = await getResend().emails.send({
            from: "Tienda Blama Shop <pedidos@blama.shop>",
            to: params.to,
            subject: `${subjectPrefix} ${pedidoFormateado} - Blama Shop ✓`,
            html: emailHtml,
        })

        if (error) {
            console.error("❌ Error enviando correo de confirmación:", error)
            return { success: false, error: error.message }
        }

        console.log(`📧 Correo de confirmación enviado para pedido ${pedidoFormateado} (ID: ${data?.id})`)
        return { success: true, emailId: data?.id }
    } catch (err: any) {
        console.error("❌ Error crítico en servicio de correo:", err)
        return { success: false, error: err.message }
    }
}

interface SendOrderStatusParams {
    to: string
    clienteNombre: string
    pedidoId: number
    status: string
    trackingCode?: string | null
    keyRecojo?: string | null
    metodoEnvio?: string | null
    direccion?: string | null
    estaPagado?: boolean // <-- Nuevo parámetro!
}

export async function sendOrderStatusEmail(params: SendOrderStatusParams) {
    const pedidoFormateado = `#${params.pedidoId.toString().padStart(6, "0")}`

    try {
        const emailHtml = await render(
            OrderStatusEmail({
                clienteNombre: params.clienteNombre,
                pedidoId: params.pedidoId,
                status: params.status,
                trackingCode: params.trackingCode,
                keyRecojo: params.keyRecojo,
                metodoEnvio: params.metodoEnvio,
                direccion: params.direccion,
                estaPagado: params.estaPagado, // <-- Pasar parámetro!
                whatsappTienda: process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "+51958279604",
            })
        )

        const { data, error } = await getResend().emails.send({
            from: "Tienda Blama Shop <pedidos@blama.shop>",
            to: params.to,
            subject: `Actualización de tu pedido ${pedidoFormateado} - Blama Shop ✓`,
            html: emailHtml,
        })

        if (error) {
            console.error("❌ Error enviando correo de estado:", error)
            return { success: false, error: error.message }
        }

        console.log(`📧 Correo de estado (${params.status}) enviado para pedido ${pedidoFormateado} (ID: ${data?.id})`)
        return { success: true, emailId: data?.id }
    } catch (err: any) {
        console.error("❌ Error crítico en servicio de correo de estado:", err)
        return { success: false, error: err.message }
    }
}
