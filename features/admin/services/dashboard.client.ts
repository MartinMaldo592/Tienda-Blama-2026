import { supabase } from "@/lib/supabaseClient"

import type { AdminDashboardStats, AdminRole } from "@/features/admin/types"

export async function fetchAdminDashboardStats(args: { role: AdminRole | string; currentUserId: string }): Promise<AdminDashboardStats> {
  const role = String(args.role || "worker")
  const currentUserId = String(args.currentUserId || "")

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id, total, status, asignado_a, created_at")

  const deliveredSales = (pedidos || []).filter((p: any) => p.status === "Entregado")
  const totalVentasReales = deliveredSales.reduce((sum: number, p: any) => sum + (Number(p.total) || 0), 0)

  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const todayPrefix = `${yyyy}-${mm}-${dd}`

  const ventasHoy = deliveredSales
    .filter((p: any) => typeof p.created_at === "string" && p.created_at.startsWith(todayPrefix))
    .reduce((sum: number, p: any) => sum + (Number(p.total) || 0), 0)

  const pedidosPendientes = (pedidos || []).filter((p: any) => p.status === "Pendiente").length
  const pedidosEnProceso = (pedidos || []).filter((p: any) => ["Confirmado", "Enviado"].includes(p.status)).length
  const pedidosEntregados = deliveredSales.length

  const pedidosAsignados = (pedidos || []).filter(
    (p: any) => p.asignado_a === currentUserId && !["Fallido", "Devuelto", "Entregado"].includes(p.status)
  ).length

  let totalClientes = 0
  if (role === "admin") {
    const { count } = await supabase.from("clientes").select("*", { count: "exact", head: true })
    totalClientes = count || 0
  }

  let productosLowStock = 0
  if (role === "admin") {
    const { count } = await supabase.from("productos").select("*", { count: "exact", head: true }).lt("stock", 5)
    productosLowStock = count || 0
  }

  return {
    totalVentasReales,
    ventasHoy,
    pedidosPendientes,
    pedidosEnProceso,
    pedidosEntregados,
    pedidosAsignados,
    totalClientes,
    productosLowStock,
  }
}

export async function fetchAdminVentasEntregadas(args: { from: string; to: string }) {
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
