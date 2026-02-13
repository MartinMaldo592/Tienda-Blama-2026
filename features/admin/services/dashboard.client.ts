import { createClient } from "@/lib/supabase.client"

import type { AdminDashboardStats, AdminRole } from "@/features/admin/types"

export async function fetchAdminDashboardStats(args: { role: AdminRole | string; currentUserId: string }): Promise<AdminDashboardStats> {
  const supabase = createClient()
  const currentUserId = String(args.currentUserId || "")

  // Llamada a la función RPC optimizada
  const { data, error } = await supabase.rpc("get_admin_dashboard_stats", {
    p_user_id: currentUserId || null
  })

  if (error) {
    console.error("Error fetching dashboard stats via RPC:", error)
    // Fallback: Si falla la RPC, devolvemos ceros en lugar de romper (o intentar hacerlo lento)
    return {
      totalVentasReales: 0,
      ventasHoy: 0,
      pedidosPendientes: 0,
      pedidosEnProceso: 0,
      pedidosEntregados: 0,
      pedidosAsignados: 0,
      totalClientes: 0,
      productosLowStock: 0,
    }
  }

  // Mapeo directo del JSON devuelto por la RPC
  return {
    totalVentasReales: Number(data.totalVentasReales) || 0,
    ventasHoy: Number(data.ventasHoy) || 0,
    pedidosPendientes: Number(data.pedidosPendientes) || 0,
    pedidosEnProceso: Number(data.pedidosEnProceso) || 0,
    pedidosEntregados: Number(data.pedidosEntregados) || 0,
    pedidosAsignados: Number(data.pedidosAsignados) || 0,
    totalClientes: Number(data.totalClientes) || 0,
    productosLowStock: Number(data.productosLowStock) || 0,
  }
}


export async function fetchAdminVentasEntregadas(args: { from: string; to: string }) {
  const supabase = createClient()
  const fromIso = args.from ? `${args.from}T00:00:00.000Z` : undefined
  const toIso = args.to ? `${args.to}T23:59:59.999Z` : undefined

  let query = supabase
    .from("pedidos")
    .select("id, total, status, created_at, clientes (nombre, telefono, dni)")
    .eq("status", "Entregado")
    .order("created_at", { ascending: false })

  if (fromIso) query = query.gte("created_at", fromIso)
  if (toIso) query = query.lte("created_at", toIso)

  const { data, error } = await query
  if (error) throw error
  return (data as any[]) || []
}

export async function fetchAdminStockBajo(args: { threshold: number }) {
  const supabase = createClient()
  const th = Number(args.threshold)
  const { data, error } = await supabase
    .from("productos")
    .select("id, nombre, precio, stock, imagen_url")
    .lt("stock", th)
    .order("stock", { ascending: true })

  if (error) throw error
  return (data as any[]) || []
}

export async function fetchAdminPedidosPendientes() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, total, status, created_at, clientes (nombre, telefono, dni)")
    .eq("status", "Pendiente")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as any[]) || []
}

const PROCESS_STATUSES = ["Confirmado", "Enviado"] as const
type ProcessStatus = (typeof PROCESS_STATUSES)[number]
type StatusFilter = ProcessStatus | "all"

export async function fetchAdminPedidosEnProceso(args: { status: StatusFilter; from: string; to: string }) {
  const supabase = createClient()
  const fromIso = args.from ? `${args.from}T00:00:00.000Z` : undefined
  const toIso = args.to ? `${args.to}T23:59:59.999Z` : undefined

  let query = supabase
    .from("pedidos")
    .select("id, total, status, created_at, asignado_a, clientes (nombre, telefono, dni)")
    .in("status", PROCESS_STATUSES as unknown as string[])
    .order("created_at", { ascending: false })

  if (args.status !== "all") query = query.eq("status", args.status)
  if (fromIso) query = query.gte("created_at", fromIso)
  if (toIso) query = query.lte("created_at", toIso)

  const { data, error } = await query
  if (error) throw error
  return (data as any[]) || []
}

import type { SalesDataPoint } from "@/components/admin/dashboard/sales-chart"

export async function fetchAdminSalesChart(period: "week" | "month" | "year"): Promise<SalesDataPoint[]> {
  const supabase = createClient()

  const endDate = new Date()
  const startDate = new Date()
  let interval = "day"

  if (period === "week") {
    startDate.setDate(endDate.getDate() - 7)
  } else if (period === "month") {
    startDate.setDate(endDate.getDate() - 30)
  } else if (period === "year") {
    startDate.setFullYear(endDate.getFullYear(), 0, 1) // First day of current year
    interval = "month"
  }

  const { data, error } = await supabase.rpc("get_sales_chart_data", {
    p_start_date: startDate.toISOString().split("T")[0],
    p_end_date: endDate.toISOString().split("T")[0],
    p_interval: interval
  })

  if (error) {
    console.error("Chart Error:", error)
    return []
  }

  // Map RPC result to component props
  return (data || []).map((d: any) => ({
    date: d.period_label,
    total: Number(d.total_sales),
    orders: Number(d.order_count)
  }))
}

