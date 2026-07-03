"use server"

import { validateAdminAction } from "@/features/admin/services/admin.server"
import { revalidatePath, revalidateTag } from "next/cache"

export type MarketingPixel = {
    id: number
    nombre: string
    clave: string
    pixel_id: string
    enabled: boolean
    created_at: string
    updated_at: string
}

export async function getMarketingPixelsAction() {
    try {
        const { supabaseAdmin } = await validateAdminAction()
        const { data, error } = await supabaseAdmin
            .from("marketing_pixels")
            .select("*")
            .order("id", { ascending: true })

        if (error) throw error

        return {
            ok: true,
            data: (data as MarketingPixel[]) || []
        }
    } catch (e: any) {
        return { error: e.message || "Error al obtener píxeles" }
    }
}

export async function updateMarketingPixelAction(
    id: number,
    payload: { pixel_id: string; enabled: boolean }
) {
    try {
        const { supabaseAdmin } = await validateAdminAction()
        const { error } = await supabaseAdmin
            .from("marketing_pixels")
            .update({
                pixel_id: payload.pixel_id,
                enabled: payload.enabled,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)

        if (error) throw error

        // Revalidamos la caché del frontend
        revalidateTag("marketing-pixels", { expire: 0 } as any)
        revalidatePath("/")

        return { ok: true }
    } catch (e: any) {
        return { error: e.message || "Error al actualizar píxel" }
    }
}
