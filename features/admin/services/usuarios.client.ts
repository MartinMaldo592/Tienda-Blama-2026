import { supabase } from "@/lib/supabaseClient"

import type { ProfileRow } from "@/features/admin/types"

export async function fetchAdminProfiles() {
  const { data, error } = await supabase.from("usuarios").select("id, email, nombre, role, created_at").order("created_at", { ascending: false })
  if (error) throw error
  return ((data as any[]) || []) as ProfileRow[]
}

export async function createWorkerViaApi(args: { accessToken: string; email: string; nombre: string; password: string | null }) {
  const res = await fetch("/api/admin/create-worker", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.accessToken}`,
    },
    body: JSON.stringify({
      email: args.email,
      nombre: args.nombre,
      password: args.password,
    }),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(String(json?.error || "Error"))
  }

  return json as any
}

export async function updateUserRoleViaApi(args: { accessToken: string; userId: string; role: string }) {
  const res = await fetch("/api/admin/users/update-role", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.accessToken}`,
    },
    body: JSON.stringify({
      userId: args.userId,
      role: args.role,
    }),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(String(json?.error || "Error al actualizar rol"))
  }

  return json
}
