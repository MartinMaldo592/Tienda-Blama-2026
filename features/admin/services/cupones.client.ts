import { createClient } from "@/lib/supabase.client"

export async function fetchAdminCupones() {
  const supabase = createClient()
  const { data, error } = await supabase.from("cupones").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data as any[]) || []
}

export async function createAdminCupon(payload: any) {
  const supabase = createClient()
  const { error } = await supabase.from("cupones").insert(payload)
  if (error) throw error
}

export async function updateAdminCupon(id: number, payload: any) {
  const supabase = createClient()
  const { error } = await supabase.from("cupones").update(payload).eq("id", id)
  if (error) throw error
}

export async function deleteAdminCupon(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from("cupones").delete().eq("id", id)
  if (error) throw error
}
