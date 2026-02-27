import { NextResponse } from "next/server"
import { triggerOrderConfirmationEmail } from "@/lib/email-service"

export const runtime = "nodejs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { orderId, transactionId } = body

        if (!orderId) {
            return NextResponse.json({ error: "Falta el ID del pedido" }, { status: 400 })
        }

        const result = await triggerOrderConfirmationEmail(Number(orderId), transactionId)

        if (result.success) {
            return NextResponse.json({ ok: true, status: result.alreadySent ? "already_sent" : "sent" })
        }

        return NextResponse.json({ error: result.error }, { status: result.error === "Pedido no encontrado" ? 404 : 400 })

    } catch (error: any) {
        console.error("Error General API Email:", error)
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
    }
}
