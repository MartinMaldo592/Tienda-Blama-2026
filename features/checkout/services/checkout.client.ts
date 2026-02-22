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

    // Debug: log full response for easier diagnosis
    if (!res.ok) {
        console.error("❌ Checkout API Error:", {
            status: res.status,
            response: json,
        })
    }

    if (!res.ok || !json || (json as any)?.ok !== true) {
        const baseMsg = String((json as any)?.error || "No se pudo crear el pedido")
        const missing = Array.isArray((json as any)?.missing) ? ((json as any).missing as string[]) : null
        // If there are Zod validation details, format them
        const details = (json as any)?.details
        let validationMsg = ""
        if (details && typeof details === "object") {
            const fields = Object.entries(details)
                .filter(([key]) => key !== "_errors")
                .map(([key, val]: [string, any]) => {
                    const errs = val?._errors
                    return errs?.length ? `${key}: ${errs[0]}` : null
                })
                .filter(Boolean)
            if (fields.length > 0) validationMsg = ` (${fields.join(" | ")})`
        }
        const msg = missing && missing.length > 0
            ? `${baseMsg}. Falta configurar: ${missing.join(", ")}`
            : baseMsg + validationMsg
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
