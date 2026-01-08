import type { CreateOrderPayload, CreateOrderResponse } from "@/features/checkout/types"

export async function createCheckoutOrder(payload: CreateOrderPayload) {
    const res = await fetch("/api/checkout/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    let json: CreateOrderResponse | null = null
    try {
        json = (await res.json()) as CreateOrderResponse
    } catch (err) {
        json = null
    }

    if (!res.ok || !json || (json as any)?.ok !== true) {
        const baseMsg = String((json as any)?.error || "No se pudo crear el pedido")
        const missing = Array.isArray((json as any)?.missing) ? ((json as any).missing as string[]) : null
        const msg = missing && missing.length > 0 ? `${baseMsg}. Falta configurar: ${missing.join(", ")}` : baseMsg
        throw new Error(msg)
    }

    const orderId = Number((json as any)?.orderId ?? 0)
    if (!orderId) {
        throw new Error("No se pudo crear el pedido")
    }

    return {
        orderId,
        subtotal: Number((json as any)?.subtotal ?? 0),
        descuento: Number((json as any)?.descuento ?? 0),
        total: Number((json as any)?.total ?? 0),
    }
}
