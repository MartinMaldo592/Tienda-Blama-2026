import { createClient } from "@/lib/supabase.client"

import type { AdminRole, PedidoItemRow, PedidoRow, ProfileRow, ProductoVariante, Producto } from "@/features/admin/types"

export async function fetchAdminWorkers(): Promise<ProfileRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("usuarios").select("id, email, nombre, role").eq("role", "worker")
  if (error) throw error
  return (data as ProfileRow[]) || []
}

export interface FetchPedidosArgs {
  role: string;
  currentUserId: string;
  page: number;
  itemsPerPage: number;
  statusFilter: string;
  searchTerm: string;
  dateFilter: string;
  filterWorker: string;
  customStartDate?: string;
  customEndDate?: string;
}

export async function fetchPedidosForRole(args: FetchPedidosArgs): Promise<{ data: PedidoRow[], count: number }> {
  const supabase = createClient()
  const role = String(args.role || "worker")
  const currentUserId = String(args.currentUserId || "")

  // We need to build the filter query first to get the total count, then we can apply the range
  let query = supabase.from("pedidos").select("id", { count: 'exact' })

  // Apply Role Filters
  if (role === "worker") {
    query = query.eq("asignado_a", currentUserId)
  }

  // Apply Worker Filter
  if (args.filterWorker && args.filterWorker !== 'all') {
    if (args.filterWorker === 'unassigned') {
      query = query.is("asignado_a", null)
    } else {
      query = query.eq("asignado_a", args.filterWorker)
    }
  }

  // Apply Status Filter
  if (args.statusFilter && args.statusFilter !== 'all') {
    query = query.eq("status", args.statusFilter)
  }

  // Apply Date Filter
  if (args.dateFilter && args.dateFilter !== 'all') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (args.dateFilter === 'today') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      query = query.gte("created_at", today.toISOString()).lt("created_at", tomorrow.toISOString())
    } else if (args.dateFilter === '7days') {
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      query = query.gte("created_at", sevenDaysAgo.toISOString())
    } else if (args.dateFilter === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      query = query.gte("created_at", firstDay.toISOString())
    } else if (args.dateFilter === 'custom') {
      if (args.customStartDate) {
        query = query.gte("created_at", new Date(args.customStartDate).toISOString())
      }
      if (args.customEndDate) {
        const end = new Date(args.customEndDate)
        end.setHours(23, 59, 59, 999)
        query = query.lte("created_at", end.toISOString())
      }
    }
  }

  // Apply Search Term Filter
  if (args.searchTerm) {
    const term = `%${args.searchTerm.trim()}%`
    const isNum = !isNaN(Number(args.searchTerm.trim()))
    
    // Attempt to search in Clientes table first to get matching IDs
    const { data: cData } = await supabase.from('clientes')
      .select('id')
      .or(`nombre.ilike.${term},telefono.ilike.${term},dni.ilike.${term}`)
      
    let matchingClientIds: number[] = []
    if (cData && cData.length > 0) {
      matchingClientIds = cData.map((c: any) => c.id)
    }

    let orParts = []
    if (isNum) orParts.push(`id.eq.${args.searchTerm.trim()}`)
    orParts.push(`nombre_contacto.ilike.${term}`)
    orParts.push(`telefono_contacto.ilike.${term}`)
    orParts.push(`dni_contacto.ilike.${term}`)
    
    // We cannot easily do an IN clause inside an OR string in SupabaseJS. 
    // So we will do a filter after getting data, or rely mostly on contact fields.
    // If there are client IDs, we will just use them in an 'in' filter combined with 'or' using 'or' method chaining?
    // Supabase allows .or().in() which acts as AND. 
    
    if (matchingClientIds.length > 0) {
      // Workaround: if it matches a client, we will fetch orders for those clients OR the orders that match the ID/Contact fields
      query = query.or(`cliente_id.in.(${matchingClientIds.join(',')}),${orParts.join(',')}`)
    } else {
      query = query.or(orParts.join(','))
    }
  }

  // First, get the COUNT
  const { count, error: countError } = await query
  if (countError) throw countError
  
  const totalItems = count || 0

  if (totalItems === 0) {
    return { data: [], count: 0 }
  }

  // Calculate Reverse Pagination Range
  const firstPageItems = totalItems % args.itemsPerPage || args.itemsPerPage
  
  let startIndex = 0
  let endIndex = 0
  
  if (args.page === 1) {
      startIndex = 0
      endIndex = firstPageItems - 1
  } else {
      startIndex = firstPageItems + (args.page - 2) * args.itemsPerPage
      endIndex = startIndex + args.itemsPerPage - 1
  }

  // Now, fetch the actual Data using the exact same filters, but applying the range
  // We recreate the query to fetch full rows
  let dataQuery = supabase.from("pedidos").select(`*, clientes (nombre, telefono, dni)`)
  
  // Re-apply Role Filters
  if (role === "worker") {
    dataQuery = dataQuery.eq("asignado_a", currentUserId)
  }

  // Re-apply Worker Filter
  if (args.filterWorker && args.filterWorker !== 'all') {
    if (args.filterWorker === 'unassigned') {
      dataQuery = dataQuery.is("asignado_a", null)
    } else {
      dataQuery = dataQuery.eq("asignado_a", args.filterWorker)
    }
  }

  // Re-apply Status Filter
  if (args.statusFilter && args.statusFilter !== 'all') {
    dataQuery = dataQuery.eq("status", args.statusFilter)
  }

  // Re-apply Date Filter
  if (args.dateFilter && args.dateFilter !== 'all') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (args.dateFilter === 'today') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dataQuery = dataQuery.gte("created_at", today.toISOString()).lt("created_at", tomorrow.toISOString())
    } else if (args.dateFilter === '7days') {
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      dataQuery = dataQuery.gte("created_at", sevenDaysAgo.toISOString())
    } else if (args.dateFilter === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      dataQuery = dataQuery.gte("created_at", firstDay.toISOString())
    } else if (args.dateFilter === 'custom') {
      if (args.customStartDate) {
        dataQuery = dataQuery.gte("created_at", new Date(args.customStartDate).toISOString())
      }
      if (args.customEndDate) {
        const end = new Date(args.customEndDate)
        end.setHours(23, 59, 59, 999)
        dataQuery = dataQuery.lte("created_at", end.toISOString())
      }
    }
  }

  // Re-apply Search Term Filter
  if (args.searchTerm) {
    const term = `%${args.searchTerm.trim()}%`
    const isNum = !isNaN(Number(args.searchTerm.trim()))
    
    // Attempt to search in Clientes table first to get matching IDs
    const { data: cData } = await supabase.from('clientes')
      .select('id')
      .or(`nombre.ilike.${term},telefono.ilike.${term},dni.ilike.${term}`)
      
    let matchingClientIds: number[] = []
    if (cData && cData.length > 0) {
      matchingClientIds = cData.map((c: any) => c.id)
    }

    let orParts = []
    if (isNum) orParts.push(`id.eq.${args.searchTerm.trim()}`)
    orParts.push(`nombre_contacto.ilike.${term}`)
    orParts.push(`telefono_contacto.ilike.${term}`)
    orParts.push(`dni_contacto.ilike.${term}`)
    
    if (matchingClientIds.length > 0) {
      dataQuery = dataQuery.or(`cliente_id.in.(${matchingClientIds.join(',')}),${orParts.join(',')}`)
    } else {
      dataQuery = dataQuery.or(orParts.join(','))
    }
  }

  // Apply Sort and Range
  const { data, error } = await dataQuery
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex)

  if (error) {
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
  return { data: withWorkers as PedidoRow[], count: totalItems }
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

export interface BulkStockError {
  productName: string;
  sku?: string;
  required: number;
  available: number;
}

export async function checkBulkStockSufficient(pedidoIds: number[]): Promise<{ ok: boolean; message?: string, errors?: BulkStockError[] }> {
  // El usuario solicitó permitir stock negativo para preventas,
  // por lo que omitimos la validación restrictiva de stock.
  return { ok: true }
}
