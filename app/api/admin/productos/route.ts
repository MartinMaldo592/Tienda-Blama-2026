import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

function getEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { url, anon, service }
}

async function requireAdmin(req: Request) {
  const { url, anon, service } = getEnv()
  if (!url || !anon || !service) {
    const missing: string[] = []
    if (!url) missing.push("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
    if (!anon) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY")
    return { ok: false as const, res: NextResponse.json({ error: "Server env not configured", missing }, { status: 500 }) }
  }

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : ""
  if (!token) {
    return { ok: false as const, res: NextResponse.json({ error: "Missing Authorization token" }, { status: 401 }) }
  }

  const supabaseAuth = createClient(url, anon)
  const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token)
  if (userErr || !userData?.user) {
    return { ok: false as const, res: NextResponse.json({ error: "Invalid session" }, { status: 401 }) }
  }

  const { data: profile, error: profileErr } = await supabaseAuth
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileErr) {
    return { ok: false as const, res: NextResponse.json({ error: profileErr.message }, { status: 500 }) }
  }

  if (String((profile as any)?.role || "").toLowerCase() !== "admin") {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  const supabaseAdmin = createClient(url, service)
  return { ok: true as const, supabaseAdmin }
}

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

async function upsertProduct(args: {
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
    categoria_id: product.categoria_id != null ? Number(product.categoria_id) : null,
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
  const { error: delErr } = await supabaseAdmin.from("producto_especificaciones").delete().eq("producto_id", productId)
  if (delErr) return delErr

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
  const { error: delErr } = await supabaseAdmin.from("producto_variantes").delete().eq("producto_id", productId)
  if (delErr) return delErr

  const clean = variants
    .map((v) => ({
      etiqueta: normalizeText(v.etiqueta),
      precio: normalizeNumber(v.precio),
      precio_antes: normalizeNumber(v.precio_antes),
      stock: Number.isFinite(Number(v.stock)) ? Number(v.stock) : 0,
      activo: v.activo == null ? true : Boolean(v.activo),
    }))
    .filter((v) => v.etiqueta.length > 0)

  if (clean.length === 0) return null

  const { error: insErr } = await supabaseAdmin.from("producto_variantes").insert(
    clean.map((v) => ({
      producto_id: productId,
      etiqueta: v.etiqueta,
      precio: v.precio,
      precio_antes: v.precio_antes,
      stock: v.stock,
      activo: v.activo,
    }))
  )

  return insErr || null
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.res

  try {
    const body = await req.json()

    const product = body?.product as ProductPayload
    const specs = Array.isArray(body?.specs) ? (body.specs as SpecInput[]) : []
    const variants = Array.isArray(body?.variants) ? (body.variants as VariantInput[]) : []

    const saved = await upsertProduct({ supabaseAdmin: auth.supabaseAdmin, product })
    if (!saved.ok) {
      return NextResponse.json({ error: (saved.error as any)?.message || "Failed to save product" }, { status: 400 })
    }

    const productId = Number(saved.id)

    const specsErr = await replaceSpecs(auth.supabaseAdmin, productId, specs)
    if (specsErr) {
      return NextResponse.json({ error: (specsErr as any)?.message || "Failed to save specs" }, { status: 400 })
    }

    const variantsErr = await replaceVariants(auth.supabaseAdmin, productId, variants)
    if (variantsErr) {
      return NextResponse.json({ error: (variantsErr as any)?.message || "Failed to save variants" }, { status: 400 })
    }

    return NextResponse.json({ ok: true, id: productId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.res

  try {
    const body = await req.json()
    const id = Number(body?.id ?? 0)
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
    }

    const product = body?.product as ProductPayload
    const specs = Array.isArray(body?.specs) ? (body.specs as SpecInput[]) : []
    const variants = Array.isArray(body?.variants) ? (body.variants as VariantInput[]) : []

    const saved = await upsertProduct({ supabaseAdmin: auth.supabaseAdmin, id, product })
    if (!saved.ok) {
      return NextResponse.json({ error: (saved.error as any)?.message || "Failed to update product" }, { status: 400 })
    }

    const productId = Number(saved.id)

    const specsErr = await replaceSpecs(auth.supabaseAdmin, productId, specs)
    if (specsErr) {
      return NextResponse.json({ error: (specsErr as any)?.message || "Failed to save specs" }, { status: 400 })
    }

    const variantsErr = await replaceVariants(auth.supabaseAdmin, productId, variants)
    if (variantsErr) {
      return NextResponse.json({ error: (variantsErr as any)?.message || "Failed to save variants" }, { status: 400 })
    }

    return NextResponse.json({ ok: true, id: productId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.res

  try {
    const body = await req.json().catch(() => ({}))
    const id = Number(body?.id ?? 0)
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
    }

    const { error } = await auth.supabaseAdmin.from("productos").delete().eq("id", id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
