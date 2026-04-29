"use server"

import { validateAdminAction } from "@/features/admin/services/admin.server"
import { revalidatePath } from "next/cache"

type AnnouncementBarConfig = {
  enabled: boolean
  interval_ms: number
  messages: string[]
}

export async function getAnnouncementBarConfigAction() {
  try {
    const { supabaseAdmin } = await validateAdminAction()
    
    const { data, error } = await supabaseAdmin
      .from("announcement_bar")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
    
    if (error) throw error

    if (data) {
      return {
        ok: true,
        data: {
          enabled: Boolean(data.enabled),
          interval_ms: Number(data.interval_ms) || 3500,
          messages: Array.isArray(data.messages) ? (data.messages as string[]) : [],
        }
      }
    }

    // Fallback if not found
    return {
      ok: true,
      data: {
        enabled: true,
        interval_ms: 3500,
        messages: [
          "📦🚚 Envío GRATIS para todos los pedidos",
          "⚡🏷️ Descuentos en productos destacados",
          "⏱️📍 Entrega rápida + contraentrega en 24 horas (solo Lima Metropolitana)",
        ],
      }
    }
  } catch (e: any) {
    return { error: e.message || "Error al obtener configuración" }
  }
}

export async function updateAnnouncementBarConfigAction(config: AnnouncementBarConfig) {
  try {
    const { supabaseAdmin } = await validateAdminAction()

    const payload = {
      id: 1,
      enabled: config.enabled,
      interval_ms: config.interval_ms,
      messages: config.messages,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin
      .from("announcement_bar")
      .upsert(payload, { onConflict: "id" })
    
    if (error) throw error

    revalidatePath("/")
    return { ok: true }
  } catch (e: any) {
    return { error: e.message || "Error al guardar configuración" }
  }
}
