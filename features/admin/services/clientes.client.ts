import { createClient } from "@/lib/supabase.client"

export async function fetchAdminClientes() {
  const supabase = createClient()
  const { data, error } = await supabase.from("clientes").select("*").order("id", { ascending: false })
  if (error) throw error
  return (data as any[]) || []
}
