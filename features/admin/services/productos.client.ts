import { createClient } from "@/lib/supabase.client"
import { uploadToR2 } from "@/features/admin/services/storage.client"
import { Categoria, Producto, ProductoEspecificacion, ProductoVariante } from "../types"

export async function fetchAdminProductos(): Promise<Producto[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("productos").select("*").order("id", { ascending: true })
  if (error) throw error
  return (data as Producto[]) || []
}

export async function fetchAdminProductoById(id: number): Promise<Producto | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).maybeSingle()
  if (error) throw error
  return data as Producto | null
}

export async function fetchAdminCategorias(): Promise<Categoria[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("categorias").select("*")
  if (error) throw error
  return (data as Categoria[]) || []
}

export async function createAdminCategoria(args: { nombre: string }): Promise<Categoria> {
  const supabase = createClient()
  const nombre = String(args.nombre || "").trim()
  const slug = nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
  const { data, error } = await supabase.from("categorias").insert({ nombre, slug }).select().single()
  if (error) throw error
  return data as Categoria
}

export async function fetchProductoSpecsAndVariants(productId: number) {
  const supabase = createClient()
  const [specRes, varRes] = await Promise.all([
    supabase.from("producto_especificaciones").select("*").eq("producto_id", productId).order("orden", { ascending: true }).order("id", { ascending: true }),
    supabase.from("producto_variantes").select("*").eq("producto_id", productId).order("id", { ascending: true }),
  ])

  return {
    specs: (specRes.data as ProductoEspecificacion[]) || [],
    variants: (varRes.data as ProductoVariante[]) || [],
  }
}

export async function uploadProductImages(args: { files: File[] }) {
  const files = Array.isArray(args.files) ? args.files : []
  const uploadedUrls: string[] = []

  for (const file of files) {
    const publicUrl = await uploadToR2(file)
    if (publicUrl) uploadedUrls.push(publicUrl)
  }

  return uploadedUrls
}

export async function uploadProductVideos(args: { files: File[] }) {
  const files = Array.isArray(args.files) ? args.files : []
  const uploadedUrls: string[] = []

  for (const file of files) {
    const publicUrl = await uploadToR2(file)
    if (publicUrl) uploadedUrls.push(publicUrl)
  }

  return uploadedUrls
}

export async function fetchAdminProductosPaginated(args: { page: number; limit: number; search?: string }): Promise<{ productos: Producto[]; totalCount: number }> {
  const supabase = createClient()
  const from = (args.page - 1) * args.limit
  const to = from + args.limit - 1

  let query = supabase.from("productos").select("*", { count: "exact" })

  if (args.search && args.search.trim()) {
    query = query.ilike("nombre", `%${args.search.trim()}%`)
  }

  const { data, error, count } = await query
    .order("id", { ascending: true })
    .range(from, to)

  if (error) throw error

  return {
    productos: (data as Producto[]) || [],
    totalCount: count || 0
  }
}
