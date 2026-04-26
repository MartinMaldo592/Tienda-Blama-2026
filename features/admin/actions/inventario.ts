"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase.server"
import { getSupabaseEnv } from "@/features/admin/services/admin.server"
import { revalidateTag, revalidatePath } from "next/cache"

export type MovimientoInventarioPayload = {
  producto_id: number
  variante_id?: number | null
  almacen_id?: number
  tipo_movimiento: 'ENTRADA_COMPRA' | 'SALIDA_VENTA' | 'AJUSTE' | 'DEVOLUCION' | 'TRASLADO' | 'AJUSTE_INICIAL'
  cantidad: number
  costo_unitario?: number
  referencia?: string | null
  notas?: string | null
}

async function validateAdmin() {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) throw new Error("No autenticado")

    const { url, service } = getSupabaseEnv()
    if (!url || !service) throw new Error("Error de configuración del servidor")

    const supabaseAdmin = createAdminClient(url, service)
    const { data: profile } = await supabaseAdmin
        .from("usuarios")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

    if (String(profile?.role || "").toLowerCase() !== "admin") {
        throw new Error("No tienes permisos de administrador")
    }

    return { supabaseAdmin, user }
}

export async function registrarMovimientoAction(payload: MovimientoInventarioPayload) {
  try {
    const { supabaseAdmin, user } = await validateAdmin()

    // Validate
    if (!payload.producto_id) throw new Error("ID de producto requerido")
    if (payload.cantidad === 0) throw new Error("La cantidad no puede ser 0")

    const dbPayload = {
        producto_id: payload.producto_id,
        variante_id: payload.variante_id || null,
        almacen_id: payload.almacen_id || 1, // Default warehouse
        tipo_movimiento: payload.tipo_movimiento,
        cantidad: payload.cantidad,
        costo_unitario: payload.costo_unitario || 0,
        referencia: payload.referencia || null,
        notas: payload.notas || null,
        created_by: user.id
    }

    const { data, error } = await supabaseAdmin
        .from("inventario_movimientos")
        .insert(dbPayload)
        .select()
        .single()

    if (error) {
        console.error("Error inserting inventory movement:", error)
        throw new Error("Error al registrar el movimiento en la base de datos")
    }

    // Revalidate paths
    revalidateTag('products', { expire: 0 } as any)
    revalidatePath('/admin/inventario')
    revalidatePath('/admin/productos')

    return { ok: true, data }
  } catch (error: any) {
    return { ok: false, error: error.message || "Error desconocido al registrar movimiento" }
  }
}
