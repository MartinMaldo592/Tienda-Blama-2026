import { supabase } from "@/lib/supabaseClient"

export async function fetchAdminClientes() {
  const { data, error } = await supabase.from("clientes").select("*").order("id", { ascending: false })
  if (error) throw error
  return (data as any[]) || []
}
