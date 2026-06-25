import { createClient } from "@/lib/supabase.client"
import { uploadToR2 } from "@/features/admin/services/storage.client"

export async function fetchPedidosForIncidencias() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, status, created_at, clientes (nombre, telefono)")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return (data as any[]) || []
}

export async function fetchIncidencias() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("incidencias")
    .select("*, pedidos (id, status, created_at, clientes (nombre, telefono))")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as any[]) || []
}

export async function uploadIncidenciaImages(args: { pedidoId: string; files: File[] }) {
  const files = Array.isArray(args.files) ? args.files : []
  const uploadedUrls: string[] = []

  for (const file of files) {
    const publicUrl = await uploadToR2(file)
    if (publicUrl) uploadedUrls.push(publicUrl)
  }

  return uploadedUrls
}

export async function createIncidencia(payload: any) {
  const supabase = createClient()
  async function save(withFotos: boolean) {
    const p: any = { ...payload }
    if (!withFotos) delete p.fotos
    return supabase.from("incidencias").insert(p)
  }

  const first = await save(true)
  let error = first.error
  if (error && typeof (error as any).message === "string" && (error as any).message.toLowerCase().includes("fotos")) {
    const second = await save(false)
    error = second.error
  }

  if (error) throw new Error((error as any).message)
}

export async function deleteIncidencia(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from("incidencias").delete().eq("id", id)
  if (error) throw error
}
