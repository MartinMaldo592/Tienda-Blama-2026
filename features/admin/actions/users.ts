"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { getSupabaseEnv, validateAdminAction } from "@/features/admin/services/admin.server"
import { revalidatePath } from "next/cache"

export async function createWorkerAction(args: {
  email: string
  nombre: string
  password?: string | null
  role?: string
  origin: string
}) {
  try {
    const { supabaseAdmin } = await validateAdminAction()

    const { url, service } = getSupabaseEnv()
    if (!url || !service) throw new Error("Server env not configured")

    const email = String(args.email || "").trim()
    const nombre = String(args.nombre || "").trim()
    const passwordRaw = args.password ? String(args.password) : ""
    const role = String(args.role || "worker").toLowerCase()

    const validRoles = ["admin", "worker", "user"]
    const finalRole = validRoles.includes(role) ? role : "worker"

    if (!email) return { error: "Falta el correo electrónico" }

    let created: any = null
    let error: any = null
    let isInvite = false

    if (passwordRaw) {
      const res = await supabaseAdmin.auth.admin.createUser({
        email,
        password: passwordRaw,
        email_confirm: true,
        user_metadata: nombre ? { nombre } : undefined,
      })
      created = res.data
      error = res.error
    } else {
      isInvite = true
      const res = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: nombre ? { nombre } : undefined,
        redirectTo: `${args.origin}/auth/update-password`,
      })
      created = res.data
      error = res.error
    }

    if (error || !created?.user) {
      return { error: error?.message || "Error al crear usuario" }
    }

    const userId = created.user.id

    const { error: upsertErr } = await supabaseAdmin.from("usuarios").upsert({
      id: userId,
      email,
      role: finalRole,
      ...(nombre ? { nombre } : {}),
    })

    if (upsertErr) {
      return { error: upsertErr.message }
    }

    revalidatePath("/admin/usuarios")
    return {
      ok: true,
      user: { id: userId, email },
      isInvite,
    }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}

export async function updateUserProfile(userId: string, nombre: string) {
  try {
    const { supabaseAdmin } = await validateAdminAction()

    if (!userId || typeof nombre !== 'string') {
      return { error: "ID de usuario o nombre inválido" }
    }

    const { error } = await supabaseAdmin
      .from("usuarios")
      .update({ nombre })
      .eq("id", userId)

    if (error) throw error

    revalidatePath("/admin/usuarios")
    return { ok: true }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const { supabaseAdmin } = await validateAdminAction()

    if (!userId || !role) {
      return { error: "ID de usuario o rol inválido" }
    }

    const { error } = await supabaseAdmin
      .from("usuarios")
      .update({ role })
      .eq("id", userId)

    if (error) throw error

    revalidatePath("/admin/usuarios")
    return { ok: true }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}
