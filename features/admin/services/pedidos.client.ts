import { createClient } from "@/lib/supabase.client"

import type { AdminRole, PedidoItemRow, PedidoRow, ProfileRow, ProductoVariante, Producto } from "@/features/admin/types"

export async function fetchAdminWorkers(): Promise<ProfileRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("usuarios").select("id, email, nombre, role").eq("role", "worker")
  if (error) throw error
  return (data as ProfileRow[]) || []
}

export async function fetchPedidosForRole(args: { role: AdminRole | string; currentUserId: string }): Promise<PedidoRow[]> {
  const supabase = createClient()
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
      return (fallbackData as PedidoRow[]) || []
    }
    throw error
  }

  const rows = (data as PedidoRow[]) || []

  // Fetch worker profiles manually
  const withWorkers = await Promise.all(
    rows.map(async (pedido) => {
      if (pedido.asignado_a) {
        const { data: workerProfile } = await supabase
          .from("usuarios")
          .select("id, email, nombre")
          .eq("id", pedido.asignado_a)
          .single()
        return { ...pedido, asignado_perfil: (workerProfile as ProfileRow) || null }
      }
      return { ...pedido, asignado_perfil: null }
    })
  )

  return withWorkers as PedidoRow[]
}

export async function assignPedidoToWorker(args: { pedidoId: number; workerId: string | null }) {
  const supabase = createClient()
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

export async function fetchPedidoDetail(pedidoId: number): Promise<{ pedido: PedidoRow; items: PedidoItemRow[] }> {
  const supabase = createClient()
  const { data: pedidoData, error } = await supabase
    .from("pedidos")
    .select(
      `
        *,
        clientes (*)
      `
    )
    .eq("id", pedidoId)
    .maybeSingle()

  if (error) throw error
  if (!pedidoData) throw new Error("Pedido no encontrado")

  let asignadoPerfil: ProfileRow | null = null
  const pData = pedidoData as PedidoRow

  if (pData.asignado_a) {
    const { data: workerProfile } = await supabase
      .from("usuarios")
      .select("id, email, nombre")
      .eq("id", pData.asignado_a)
      .single()
    asignadoPerfil = workerProfile as ProfileRow
  }

  const pedido = { ...pData, asignado_perfil: asignadoPerfil } as PedidoRow

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
    items: (itemsData as PedidoItemRow[]) || [],
  }
}

export async function updatePedidoStatusWithStock(args: { pedidoId: number; nextStatus: string; stockDescontado: boolean }) {
  const supabase = createClient()
  const pedidoId = Number(args.pedidoId)
  const nextStatus = String(args.nextStatus || "")
  const isCurrentlyDeducted = args.stockDescontado

  // 1. Logic for Deducting Stock (Pendiente -> Confirmado/Preparando/Enviado/Entregado)
  const deducirStatuses = ["Confirmado", "Preparando", "Enviado", "Entregado"]
  if (deducirStatuses.includes(nextStatus) && !isCurrentlyDeducted) {
    const { error: rpcError } = await supabase.rpc('admin_procesar_descuento_stock', {
      p_pedido_id: pedidoId,
      p_revertir: false
    })

    if (rpcError) throw rpcError
  }

  // 2. Logic for Restocking (Confirmado -> Pendiente/Cancelado/Fallido/Devuelto)
  const restockingStatuses = ["Pendiente", "Cancelado", "Fallido", "Devuelto"]
  if (restockingStatuses.includes(nextStatus) && isCurrentlyDeducted) {
    const { error: rpcError } = await supabase.rpc('admin_procesar_descuento_stock', {
      p_pedido_id: pedidoId,
      p_revertir: true
    })

    if (rpcError) throw rpcError
  }

  // 3. Update Status
  // We use explicit 'any' for status only because the generic update type might expect strict Enum match,
  // but nextStatus is string. If it's a valid enum value it works.
  const { error } = await supabase.from("pedidos").update({ status: nextStatus as any }).eq("id", pedidoId)
  if (error) throw error
}

export async function checkBulkStockSufficient(pedidoIds: number[]): Promise<{ ok: boolean; message?: string }> {
  const supabase = createClient()
  
  if (!pedidoIds || pedidoIds.length === 0) return { ok: true }

  // 1. Get all items for the selected orders that are NOT yet deducted
  const { data: items, error } = await supabase
    .from("pedido_items")
    .select("producto_id, variante_id, cantidad, pedidos!inner(stock_descontado)")
    .in("pedido_id", pedidoIds)
    .eq("pedidos.stock_descontado", false)
    
  if (error) throw error
  if (!items || items.length === 0) return { ok: true }

  // 2. Aggregate quantities required by product/variant
  const requiredStock: Record<string, { pId: number; vId: number | null; qty: number }> = {}
  for (const item of items) {
    const key = `${item.producto_id}-${item.variante_id || 'null'}`
    if (!requiredStock[key]) {
      requiredStock[key] = { pId: item.producto_id, vId: item.variante_id, qty: 0 }
    }
    requiredStock[key].qty += item.cantidad
  }

  // 3. Check each product/variant against DB
  for (const key in requiredStock) {
    const { pId, vId, qty } = requiredStock[key]
    
    if (vId) {
      // Check variant stock
      const { data: variant, error: vErr } = await supabase
        .from("producto_variantes")
        .select("stock, sku")
        .eq("id", vId)
        .single()
      
      if (vErr && vErr.code !== 'PGRST116') throw vErr
      if (variant && (variant.stock || 0) < qty) {
        return { ok: false, message: `Stock insuficiente para la variante SKU ${variant.sku || 'N/A'}. Se requieren ${qty}, pero solo hay ${variant.stock || 0} disponibles.` }
      }
    } else {
      // Check product stock
      const { data: prod, error: pErr } = await supabase
        .from("productos")
        .select("stock, nombre")
        .eq("id", pId)
        .single()
      
      if (pErr && pErr.code !== 'PGRST116') throw pErr
      if (prod && (prod.stock || 0) < qty) {
        return { ok: false, message: `Stock insuficiente para el producto "${prod.nombre}". Se requieren ${qty}, pero solo hay ${prod.stock || 0} disponibles.` }
      }
    }
  }

  return { ok: true }
}
