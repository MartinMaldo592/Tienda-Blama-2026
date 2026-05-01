import { createClient } from "@/lib/supabase.client"
import type { ProfileRow } from "@/features/admin/types"

export async function fetchAdminProfiles() {
  const supabase = createClient()
  const { data, error } = await supabase.from("usuarios").select("id, email, nombre, role, created_at, activo").order("created_at", { ascending: false })
  if (error) throw error
  return ((data as any[]) || []) as ProfileRow[]
}
