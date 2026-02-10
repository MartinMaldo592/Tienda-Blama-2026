import { createClient } from "@/lib/supabase.client"
import { uploadToR2 } from "@/features/admin/services/storage.client"
import { Categoria, Producto, ProductoEspecificacion, ProductoVariante } from "../types"

export async function fetchAdminProductos(): Promise<Producto[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("productos").select("*").order("id", { ascending: true })
  if (error) throw error
  return (data as Producto[]) || []
}

export async function fetchAdminProductoById(id: number): Promise<Producto> {
  const supabase = createClient()
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).single()
  if (error) throw error
  return data as Producto
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

export async function saveAdminProductoViaApi(args: { accessToken: string; method: "POST" | "PUT"; body: unknown }) {
  const res = await fetch("/api/admin/productos", {
    method: args.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.accessToken}`,
    },
    body: JSON.stringify(args.body),
  })

  let json: { ok: boolean; error?: string; data?: any } | null = null
  try {
    json = await res.json()
  } catch (err) {
    json = null
  }

  if (!res.ok || !json?.ok) {
    throw new Error(String(json?.error || "No se pudo guardar el producto"))
  }

  return json
}

export async function deleteAdminProductoViaApi(args: { accessToken: string; id: number }) {
  const res = await fetch("/api/admin/productos", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.accessToken}`,
    },
    body: JSON.stringify({ id: args.id }),
  })

  let json: { ok: boolean; error?: string } | null = null
  try {
    json = await res.json()
  } catch (err) {
    json = null
  }

  if (!res.ok || !json?.ok) {
    throw new Error(String(json?.error || "No se pudo eliminar"))
  }

  return json
}
