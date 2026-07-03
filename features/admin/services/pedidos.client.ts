import { createClient } from "@/lib/supabase.client"

import type { AdminRole, PedidoItemRow, PedidoRow, ProfileRow, ProductoVariante, Producto } from "@/features/admin/types"

export async function fetchAdminWorkers(): Promise<ProfileRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("usuarios").select("id, email, nombre, role").in("role", ["worker", "admin"])
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
  pagoStatusFilter?: string;
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
    const workers = args.filterWorker.split(',').map(w => w.trim()).filter(Boolean)
    if (workers.length > 0) {
      const hasUnassigned = workers.includes('unassigned')
      const workerIds = workers.filter(w => w !== 'unassigned')

      if (hasUnassigned && workerIds.length > 0) {
        query = query.or(`asignado_a.in.(${workerIds.map(id => `"${id}"`).join(',')}),asignado_a.is.null`)
      } else if (hasUnassigned) {
        query = query.is("asignado_a", null)
      } else {
        query = query.in("asignado_a", workerIds)
      }
    }
  }

  // Apply Status Filter
  if (args.statusFilter && args.statusFilter !== 'all') {
    const statuses = args.statusFilter.split(',').map(s => s.trim()).filter(Boolean)
    if (statuses.length > 0) {
      query = query.in("status", statuses)
    }
  }

  // Apply Pago Status Filter
  if (args.pagoStatusFilter && args.pagoStatusFilter !== 'all') {
    const pagoStatuses = args.pagoStatusFilter.split(',').map(s => s.trim()).filter(Boolean)
    if (pagoStatuses.length > 0) {
      query = query.in("pago_status", pagoStatuses)
    }
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

    const orParts = []
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
    const workers = args.filterWorker.split(',').map(w => w.trim()).filter(Boolean)
    if (workers.length > 0) {
      const hasUnassigned = workers.includes('unassigned')
      const workerIds = workers.filter(w => w !== 'unassigned')

      if (hasUnassigned && workerIds.length > 0) {
        dataQuery = dataQuery.or(`asignado_a.in.(${workerIds.map(id => `"${id}"`).join(',')}),asignado_a.is.null`)
      } else if (hasUnassigned) {
        dataQuery = dataQuery.is("asignado_a", null)
      } else {
        dataQuery = dataQuery.in("asignado_a", workerIds)
      }
    }
  }

  // Re-apply Status Filter
  if (args.statusFilter && args.statusFilter !== 'all') {
    const statuses = args.statusFilter.split(',').map(s => s.trim()).filter(Boolean)
    if (statuses.length > 0) {
      dataQuery = dataQuery.in("status", statuses)
    }
  }

  // Re-apply Pago Status Filter
  if (args.pagoStatusFilter && args.pagoStatusFilter !== 'all') {
    const pagoStatuses = args.pagoStatusFilter.split(',').map(s => s.trim()).filter(Boolean)
    if (pagoStatuses.length > 0) {
      dataQuery = dataQuery.in("pago_status", pagoStatuses)
    }
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

    const orParts = []
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

  // 4. Trigger Status Update Email (in background securely)
  const notifyStatuses = [
    "Confirmado", 
    "Preparando", 
    "Enviado", 
    "Llegó a Agencia", 
    "Entregado", 
    "Fallido", 
    "Devuelto", 
    "Cancelado"
  ]
  if (notifyStatuses.includes(nextStatus)) {
    try {
      const response = await fetch("/api/admin/pedidos/send-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: pedidoId })
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error triggering status email:", errorData)
        throw new Error(errorData.error || `Error del servidor de correo (${response.status})`)
      }
    } catch (err: any) {
      console.error("Error sending status email:", err)
      throw new Error(`Pedido actualizado, pero la notificación por correo falló: ${err.message}`)
    }
  }
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

export async function fetchActiveProductsForOrder() {
  const supabase = createClient()
  const [prodRes, varRes] = await Promise.all([
    supabase.from("productos").select("id, nombre, precio, stock, imagen_url").order("nombre", { ascending: true }),
    supabase.from("producto_variantes").select("id, producto_id, etiqueta, stock, precio, activo").eq("activo", true).order("id", { ascending: true })
  ])
  if (prodRes.error) throw prodRes.error
  if (varRes.error) throw varRes.error

  return prodRes.data.map((p: any) => ({
    ...p,
    variants: varRes.data.filter((v: any) => v.producto_id === p.id)
  }))
}

export interface ManualPedidoItem {
  producto_id: number
  producto_variante_id: number | null
  cantidad: number
  precio_unitario: number
  producto_nombre: string
  variante_nombre: string | null
}

export interface CreateManualPedidoArgs {
  cliente_nombre: string
  cliente_telefono: string
  cliente_dni: string
  cliente_email?: string
  cliente_direccion: string
  cliente_departamento: string
  cliente_provincia: string
  cliente_distrito: string
  cliente_referencia?: string
  cliente_link_ubicacion?: string
  origen: string
  status: string
  pago_status: string
  metodo_envio: string
  metodo_pago?: string
  comprobante_pago_url?: string[]
  costo_envio?: number
  descuento?: number
  subtotal: number
  total: number
  items: ManualPedidoItem[]
}

export async function createManualPedido(args: CreateManualPedidoArgs) {
  const supabase = createClient()

  // 1. Crear registro de cliente nuevo (si o si)
  const { data: newClient, error: clientError } = await supabase
    .from("clientes")
    .insert({
      nombre: args.cliente_nombre,
      telefono: args.cliente_telefono,
      dni: args.cliente_dni,
      email: args.cliente_email || null,
      direccion: args.cliente_direccion,
      departamento: args.cliente_departamento,
      provincia: args.cliente_provincia,
      distrito: args.cliente_distrito,
      referencia: args.cliente_referencia || null,
      link_ubicacion: args.cliente_link_ubicacion || null
    })
    .select("id")
    .single()

  if (clientError) throw clientError
  const clienteId = newClient.id

  const generatedShalomPin = (
    args.metodo_envio?.toLowerCase() === "provincia" ||
    args.metodo_envio?.toLowerCase().includes("provincia") ||
    args.metodo_envio?.toLowerCase().includes("shalom")
  )
    ? Math.floor(1000 + Math.random() * 9000).toString()
    : null

  // 2. Crear registro de pedido
  const { data: newPedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      cliente_id: clienteId,
      nombre_contacto: args.cliente_nombre,
      dni_contacto: args.cliente_dni,
      telefono_contacto: args.cliente_telefono,
      email_contacto: args.cliente_email || null,
      departamento: args.cliente_departamento,
      provincia: args.cliente_provincia,
      distrito: args.cliente_distrito,
      direccion_calle: args.cliente_direccion,
      referencia_direccion: args.cliente_referencia || null,
      link_ubicacion: args.cliente_link_ubicacion || null,
      origen: args.origen as any,
      status: args.status as any,
      pago_status: args.pago_status as any,
      metodo_envio: args.metodo_envio,
      culqi_charge_id: args.metodo_pago || "manual",
      comprobante_pago_url: args.comprobante_pago_url || null,
      descuento: args.descuento || 0,
      subtotal: args.subtotal,
      total: args.total,
      shalom_pin: generatedShalomPin
    })
    .select("id")
    .single()

  if (pedidoError) throw pedidoError
  const pedidoId = newPedido.id

  // 3. Crear registros de pedido_items
  const orderItems = args.items.map(item => ({
    pedido_id: pedidoId,
    producto_id: item.producto_id,
    producto_variante_id: item.producto_variante_id || null,
    precio_unitario: item.precio_unitario,
    producto_nombre: item.producto_nombre,
    variante_nombre: item.variante_nombre || null,
    cantidad: item.cantidad
  }))

  const { error: itemsError } = await supabase
    .from("pedido_items")
    .insert(orderItems)

  if (itemsError) throw itemsError

  // 4. Procesar descuento de stock si el estado inicial lo requiere
  const deducirStatuses = ["Confirmado", "Preparando", "Enviado", "Entregado"]
  if (deducirStatuses.includes(args.status)) {
    const { error: rpcError } = await supabase.rpc('admin_procesar_descuento_stock', {
      p_pedido_id: pedidoId,
      p_revertir: false
    })
    if (rpcError) {
      console.error("Error al procesar descuento de stock automático:", rpcError)
    } else {
      await supabase
        .from("pedidos")
        .update({ stock_descontado: true })
        .eq("id", pedidoId)
    }
  }

  // 5. Registrar log de auditoría del sistema
  try {
    await supabase.from("pedido_logs").insert({
      pedido_id: pedidoId,
      accion: "Creado Manualmente",
      detalles: `Pedido creado manualmente desde el panel de administración. Origen: ${args.origen}.`
    })
  } catch (err) {
    console.error("Error al registrar log de pedido manual:", err)
  }

  return { pedidoId }
}
