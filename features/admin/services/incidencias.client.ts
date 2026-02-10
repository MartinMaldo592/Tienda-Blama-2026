import { createClient } from "@/lib/supabase.client"

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
  const supabase = createClient()
  const pedidoId = String(args.pedidoId || "").trim()
  const files = Array.isArray(args.files) ? args.files : []

  const uploadedUrls: string[] = []

  for (const file of files) {
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`
    const folder = pedidoId ? `incidencias/${pedidoId}` : "incidencias"
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("productos").upload(filePath, file)
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("productos").getPublicUrl(filePath)
    if (data?.publicUrl) uploadedUrls.push(data.publicUrl)
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
