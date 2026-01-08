import { supabase } from "@/lib/supabaseClient"

import type { ValidateCouponResult } from "@/features/checkout/types"

export async function validateCoupon(rawCode: string, subtotal: number): Promise<ValidateCouponResult> {
    const code = String(rawCode || "").trim()
    if (!code) {
        return { descuento: 0, codigo: null }
    }

    const { data, error } = await supabase
        .from("cupones")
        .select("*")
        .ilike("codigo", code)
        .limit(1)
        .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) throw new Error("Cupón inválido")
    if (!data.activo) throw new Error("Cupón inactivo")
    if (Number(subtotal) < Number(data.min_total || 0)) throw new Error("El cupón no aplica para este total")

    const now = new Date()
    if (data.starts_at) {
        const starts = new Date(data.starts_at)
        if (now < starts) throw new Error("El cupón aún no está disponible")
    }
    if (data.expires_at) {
        const expires = new Date(data.expires_at)
        if (now > expires) throw new Error("El cupón expiró")
    }
    if (data.max_usos != null && data.usos != null && Number(data.usos) >= Number(data.max_usos)) {
        throw new Error("El cupón ya alcanzó el máximo de usos")
    }

    let descuento = 0
    const valor = Number(data.valor) || 0

    if (data.tipo === "porcentaje") {
        descuento = subtotal * (valor / 100)
    } else {
        descuento = valor
    }

    descuento = Math.max(0, Math.min(subtotal, Math.round(descuento * 100) / 100))

    return { descuento, codigo: data.codigo as string }
}

export function isCouponRelatedError(message: string) {
    const m = String(message || "").toLowerCase()
    return (
        m.includes("cupón") ||
        m.includes("cupon") ||
        m.includes("agotado") ||
        m.includes("expir") ||
        m.includes("inval") ||
        m.includes("no aplica") ||
        m.includes("aún no")
    )
}
