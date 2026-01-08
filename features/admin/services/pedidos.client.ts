import { supabase } from "@/lib/supabaseClient"

import type { AdminRole, PedidoItemRow, PedidoRow, ProfileRow } from "@/features/admin/types"

export async function fetchAdminWorkers() {
  const { data, error } = await supabase.from("profiles").select("id, email, nombre, role").eq("role", "worker")
  if (error) throw error
  return ((data as any[]) || []) as ProfileRow[]
}

export async function fetchPedidosForRole(args: { role: AdminRole | string; currentUserId: string }) {
  const role = String(args.role || "worker")
  const currentUserId = String(args.currentUserId || "")

  let query = supabase
    .from("pedidos")
    .select(
      `
        *,
        clientes (nombre, telefono, dni)
      `
    )
    .order("created_at", { ascending: false })

  if (role === "worker") {
    query = query.eq("asignado_a", currentUserId)
  }

  const { data, error } = await query

  if (error) {
    if (String(error.message || "").includes("asignado_a")) {
      const { data: fallbackData } = await supabase
        .from("pedidos")
        .select(`*, clientes (nombre, telefono, dni)`)
        .order("created_at", { ascending: false })
      return ((fallbackData as any[]) || []) as PedidoRow[]
    }
    throw error
  }

  const rows = ((data as any[]) || []) as PedidoRow[]

  const withWorkers = await Promise.all(
    rows.map(async (pedido: any) => {
      if (pedido.asignado_a) {
        const { data: workerProfile } = await supabase
          .from("profiles")
          .select("id, email, nombre")
          .eq("id", pedido.asignado_a)
          .single()
        return { ...pedido, asignado_perfil: (workerProfile as any) || null }
      }
      return { ...pedido, asignado_perfil: null }
    })
  )

  return withWorkers as PedidoRow[]
}

export async function assignPedidoToWorker(args: { pedidoId: number; workerId: string | null }) {
  const assignValue = args.workerId ? String(args.workerId) : null
  const { error } = await supabase
    .from("pedidos")
    .update({
      asignado_a: assignValue,
      fecha_asignacion: assignValue ? new Date().toISOString() : null,
    })
    .eq("id", args.pedidoId)

  if (error) throw error
}

export async function fetchPedidoDetail(pedidoId: number) {
  const { data: pedidoData, error } = await supabase
    .from("pedidos")
    .select(
      `
        *,
        clientes (*)
      `
    )
    .eq("id", pedidoId)
    .single()

  if (error) throw error

  let asignadoPerfil: any = null
  if ((pedidoData as any)?.asignado_a) {
    const { data: workerProfile } = await supabase
      .from("profiles")
      .select("id, email, nombre")
      .eq("id", (pedidoData as any).asignado_a)
      .single()
    asignadoPerfil = workerProfile
  }

  const pedido = { ...(pedidoData as any), asignado_perfil: asignadoPerfil } as PedidoRow

  const { data: itemsData, error: itemsErr } = await supabase
    .from("pedido_items")
    .select(
      `
        *,
        productos (nombre, precio, imagen_url)
      `
    )
    .eq("pedido_id", pedidoId)

  if (itemsErr) throw itemsErr

  return {
    pedido,
    items: ((itemsData as any[]) || []) as PedidoItemRow[],
  }
}

export async function updatePedidoStatusWithStock(args: { pedidoId: number; nextStatus: string; stockDescontado: boolean }) {
  const pedidoId = Number(args.pedidoId)
  const nextStatus = String(args.nextStatus || "")

  if (nextStatus === "Confirmado" && !args.stockDescontado) {
    const { data: itemsData, error: itemsError } = await supabase
      .from("pedido_items")
      .select("producto_id, producto_variante_id, cantidad")
      .eq("pedido_id", pedidoId)

    if (itemsError) throw itemsError

    const safeItems = (itemsData || []).filter((it: any) => it.producto_id)

    for (const it of safeItems) {
      const productoId = Number(it.producto_id)
      const varianteId = it.producto_variante_id != null ? Number(it.producto_variante_id) : null
      const qty = Number(it.cantidad || 0)
      if (!productoId || qty <= 0) continue

      if (varianteId) {
        const { data: variante, error: varError } = await supabase
          .from("producto_variantes")
          .select("stock")
          .eq("id", varianteId)
          .single()

        if (varError) throw varError

        const currentStock = Number((variante as any)?.stock ?? 0)
        const newStock = Math.max(0, currentStock - qty)

        const { error: updError } = await supabase.from("producto_variantes").update({ stock: newStock }).eq("id", varianteId)

        if (updError) throw updError
      } else {
        const { data: producto, error: prodError } = await supabase.from("productos").select("stock").eq("id", productoId).single()

        if (prodError) throw prodError

        const currentStock = Number((producto as any)?.stock ?? 0)
        const newStock = Math.max(0, currentStock - qty)

        const { error: updError } = await supabase.from("productos").update({ stock: newStock }).eq("id", productoId)

        if (updError) throw updError
      }
    }

    const { error: markError } = await supabase.from("pedidos").update({ stock_descontado: true }).eq("id", pedidoId)
    if (markError) throw markError
  }

  const { error } = await supabase.from("pedidos").update({ status: nextStatus }).eq("id", pedidoId)
  if (error) throw error
}
