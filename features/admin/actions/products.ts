"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase.server"
import { getSupabaseEnv } from "@/features/admin/services/admin.server"
import { revalidateTag, revalidatePath } from "next/cache"

/**
 * Types & Utils
 */

type ProductPayload = {
  nombre: string
  precio: number
  precio_antes: number | null
  stock: number
  imagen_url: string | null
  imagenes?: string[]
  videos?: string[]
  descripcion: string | null
  materiales: string | null
  tamano: string | null
  color: string | null
  cuidados: string | null
  uso: string | null
  categoria_id: number | null
  calificacion?: number
}

type SpecInput = {
  clave: string
  valor?: string | null
  orden?: number
}

type VariantInput = {
  etiqueta: string
  precio?: number | null
  precio_antes?: number | null
  stock?: number
  activo?: boolean
}

function normalizeText(v: unknown) {
  return String(v ?? "").trim()
}

function normalizeNumber(v: unknown) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function normalizeImages(input: unknown) {
  const arr = Array.isArray(input) ? input : []
  const unique: string[] = []
  for (const raw of arr) {
    const v = String(raw || "").trim()
    if (!v) continue
    const lower = v.toLowerCase()
    if (
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".m4v") ||
      lower.endsWith(".avi") ||
      lower.endsWith(".mkv")
    ) {
      continue
    }
    if (!unique.includes(v)) unique.push(v)
    if (unique.length >= 10) break
  }
  return unique
}

function normalizeVideos(input: unknown) {
  const arr = Array.isArray(input) ? input : []
  const unique: string[] = []
  for (const raw of arr) {
    const v = String(raw || "").trim()
    if (!v) continue
    if (!unique.includes(v)) unique.push(v)
    if (unique.length >= 6) break
  }
  return unique
}

/**
 * Private helpers
 */

async function validateAdmin() {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) throw new Error("No autenticado")

    const { url, service } = getSupabaseEnv()
    if (!url || !service) throw new Error("Error de configuración del servidor")

    const supabaseAdmin = createAdminClient(url, service)
    const { data: profile } = await supabaseAdmin
        .from("usuarios")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

    if (String(profile?.role || "").toLowerCase() !== "admin") {
        throw new Error("No tienes permisos de administrador")
    }

    return { supabaseAdmin, user }
}

async function internalUpsertProduct(args: {
  supabaseAdmin: any
  id?: number
  product: ProductPayload
}) {
  const { supabaseAdmin, id, product } = args

  const basePayload: any = {
    nombre: normalizeText(product.nombre),
    precio: Number(product.precio),
    precio_antes: product.precio_antes != null ? Number(product.precio_antes) : null,
    stock: Number(product.stock),
    imagen_url: product.imagen_url ? String(product.imagen_url) : null,
    imagenes: normalizeImages(product.imagenes),
    videos: normalizeVideos(product.videos),
    descripcion: product.descripcion ? normalizeText(product.descripcion) : null,
    materiales: product.materiales ? normalizeText(product.materiales) : null,
    tamano: product.tamano ? normalizeText(product.tamano) : null,
    color: product.color ? normalizeText(product.color) : null,
    cuidados: product.cuidados ? normalizeText(product.cuidados) : null,
    uso: product.uso ? normalizeText(product.uso) : null,
    categoria_id: (product.categoria_id != null && !Number.isNaN(Number(product.categoria_id))) ? Number(product.categoria_id) : null,
    calificacion: product.calificacion ? Number(product.calificacion) : 5.0,
  }

  const save = async (withGallery: boolean) => {
    const payload = { ...basePayload }
    if (!withGallery) delete payload.imagenes

    if (id && Number.isFinite(id) && id > 0) {
      return supabaseAdmin.from("productos").update(payload).eq("id", id).select("id").single()
    }
    return supabaseAdmin.from("productos").insert(payload).select("id").single()
  }

  const first = await save(true)
  let error = first.error

  if (
    error &&
    typeof (error as any).message === "string" &&
    String((error as any).message).toLowerCase().includes("imagenes")
  ) {
    const second = await save(false)
    error = second.error
    if (error) return { ok: false as const, error }
    const savedId = id && Number.isFinite(id) && id > 0 ? id : Number((second as any)?.data?.id ?? 0)
    return { ok: true as const, id: savedId }
  }

  if (error) return { ok: false as const, error }

  const savedId = id && Number.isFinite(id) && id > 0 ? id : Number((first as any)?.data?.id ?? 0)
  return { ok: true as const, id: savedId }
}

async function replaceSpecs(supabaseAdmin: any, productId: number, specs: SpecInput[]) {
  await supabaseAdmin.from("producto_especificaciones").delete().eq("producto_id", productId)

  const clean = specs
    .map((s) => ({
      clave: normalizeText(s.clave),
      valor: s.valor != null ? normalizeText(s.valor) : null,
      orden: Number.isFinite(Number(s.orden)) ? Number(s.orden) : 0,
    }))
    .filter((s) => s.clave.length > 0)

  if (clean.length === 0) return null

  const { error: insErr } = await supabaseAdmin.from("producto_especificaciones").insert(
    clean.map((s) => ({
      producto_id: productId,
      clave: s.clave,
      valor: s.valor,
      orden: s.orden,
    }))
  )

  return insErr || null
}

async function replaceVariants(supabaseAdmin: any, productId: number, variants: VariantInput[]) {
  // Obtener variantes actuales
  const { data: currentVariants } = await supabaseAdmin
    .from("producto_variantes")
    .select("id, etiqueta")
    .eq("producto_id", productId)

  const currentMap = new Map((currentVariants || []).map((v: any) => [v.etiqueta.toLowerCase(), v.id]))

  const clean = variants
    .map((v) => ({
      etiqueta: normalizeText(v.etiqueta),
      precio: normalizeNumber(v.precio),
      precio_antes: normalizeNumber(v.precio_antes),
      stock: Number.isFinite(Number(v.stock)) ? Number(v.stock) : 0,
      activo: v.activo == null ? true : Boolean(v.activo),
    }))
    .filter((v) => v.etiqueta.length > 0)

  const toDelete = new Set(currentMap.keys())
  const toUpsert = []

  for (const v of clean) {
    const key = v.etiqueta.toLowerCase()
    toDelete.delete(key) // Mantener esta variante

    const existingId = currentMap.get(key)
    toUpsert.push({
      id: existingId, // Si existe, hará update en el upsert
      producto_id: productId,
      etiqueta: v.etiqueta,
      precio: v.precio,
      precio_antes: v.precio_antes,
      // Si ya existía, el stock se manejará por Kardex, pero lo pasamos de todas formas
      stock: v.stock, 
      activo: v.activo,
    })
  }

  // Borrar las que ya no están
  if (toDelete.size > 0) {
    const idsToDelete = Array.from(toDelete).map(k => currentMap.get(k))
    await supabaseAdmin.from("producto_variantes").delete().in("id", idsToDelete)
  }

  // Insertar/Actualizar las nuevas (upsert)
  if (toUpsert.length > 0) {
    // Upsert requiere que le pases el ID si existe para hacer match con la primary key
    for (const item of toUpsert) {
      if (item.id) {
        await supabaseAdmin.from("producto_variantes").update(item).eq("id", item.id)
      } else {
        const { data: newVar } = await supabaseAdmin.from("producto_variantes").insert(item).select("id").single()
        if (newVar?.id && item.stock && item.stock !== 0) {
          await supabaseAdmin.from("inventario_movimientos").insert({
            producto_id: item.producto_id,
            variante_id: newVar.id,
            almacen_id: 1,
            tipo_movimiento: 'AJUSTE_INICIAL',
            cantidad: item.stock,
            costo_unitario: 0,
            notas: 'Stock inicial al crear variante'
          })
        }
      }
    }
  }

  return null
}

/**
 * Public Server Actions
 */

export async function upsertProductAction(args: {
  id?: number
  product: ProductPayload
  specs?: SpecInput[]
  variants?: VariantInput[]
}) {
  try {
    const { supabaseAdmin } = await validateAdmin()
    const { id, product, specs = [], variants = [] } = args
    const isNew = !id || id <= 0

    const saved = await internalUpsertProduct({ supabaseAdmin, id, product })
    if (!saved.ok) {
      return { error: (saved.error as any)?.message || "Error al guardar producto" }
    }

    const productId = Number(saved.id)

    // Si es un producto nuevo sin variantes y tiene stock inicial
    if (isNew && variants.length === 0 && product.stock && product.stock !== 0) {
      await supabaseAdmin.from("inventario_movimientos").insert({
        producto_id: productId,
        almacen_id: 1,
        tipo_movimiento: 'AJUSTE_INICIAL',
        cantidad: product.stock,
        costo_unitario: 0,
        notas: 'Stock inicial al crear producto'
      })
    }

    await replaceSpecs(supabaseAdmin, productId, specs)
    await replaceVariants(supabaseAdmin, productId, variants)

    revalidateTag('products', { expire: 0 })
    revalidatePath('/admin/productos')
    
    return { ok: true, id: productId }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}


export async function deleteProductAction(id: number) {
  try {
    const { supabaseAdmin } = await validateAdmin()
    
    if (!id || id <= 0) return { error: "ID de producto inválido" }

    const { error } = await supabaseAdmin.from("productos").delete().eq("id", id)
    if (error) return { error: error.message }

    revalidateTag('products', { expire: 0 })
    revalidatePath('/admin/productos')
    
    return { ok: true }
  } catch (e: any) {
    return { error: e.message || "Error desconocido" }
  }
}
