"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase.server"
import { getSupabaseEnv } from "@/features/admin/services/admin.server"
import { revalidatePath } from "next/cache"

/**
 * Server Action to check if the current user is an admin
 */
async function validateAdmin() {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("No autenticado")
    }

    const { url, service } = getSupabaseEnv()
    if (!url || !service) {
        throw new Error("Error de configuración del servidor")
    }

    const supabaseAdmin = createAdminClient(url, service)
    const { data: profile, error: profileError } = await supabaseAdmin
        .from("usuarios")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

    if (profileError || String(profile?.role || "").toLowerCase() !== "admin") {
        throw new Error("No tienes permisos de administrador")
    }

    return { supabaseAdmin, user }
}

export async function updateUserProfile(userId: string, nombre: string) {
    try {
        const { supabaseAdmin } = await validateAdmin()

        if (!userId || typeof nombre !== 'string') {
            return { error: "ID de usuario o nombre inválido" }
        }

        const { error } = await supabaseAdmin
            .from("usuarios")
            .update({ nombre })
            .eq("id", userId)

        if (error) {
            return { error: error.message }
        }

        revalidatePath("/admin/users")
        return { ok: true }

    } catch (e: any) {
        return { error: e.message || "Error desconocido" }
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        const { supabaseAdmin } = await validateAdmin()

        if (!userId || !role) {
            return { error: "ID de usuario o rol inválido" }
        }

        const { error } = await supabaseAdmin
            .from("usuarios")
            .update({ role })
            .eq("id", userId)

        if (error) {
            return { error: error.message }
        }

        revalidatePath("/admin/users")
        return { ok: true }

    } catch (e: any) {
        return { error: e.message || "Error desconocido" }
    }
}
