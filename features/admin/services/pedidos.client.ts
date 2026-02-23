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

  // 1. Logic for Deducting Stock (Pendiente -> Confirmado/Enviado/Entregado)
  const deducirStatuses = ["Confirmado", "Enviado", "Entregado"]
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
