export type AdminRole = "admin" | "worker"

export type ProfileRow = {
  id: string
  email?: string | null
  nombre?: string | null
  role?: AdminRole | string | null
  created_at?: string | null
}

export type ClienteRow = {
  id: number
  nombre: string
  telefono: string
  dni?: string | null
  direccion?: string | null
}

export type PedidoRow = {
  id: number
  total: number
  status: string
  pago_status?: string | null
  created_at: string
  asignado_a?: string | null
  fecha_asignacion?: string | null
  stock_descontado?: boolean | null
  cupon_codigo?: string | null
  descuento?: number | null
  subtotal?: number | null
  clientes?: Partial<ClienteRow> | null
  asignado_perfil?: ProfileRow | null
}

export type PedidoItemRow = {
  id: number
  pedido_id: number
  producto_id: number
  producto_variante_id?: number | null
  cantidad: number
  productos?: { nombre?: string | null; precio?: number | null; imagen_url?: string | null } | null
}

export type AdminDashboardStats = {
  totalVentasReales: number
  ventasHoy: number
  pedidosPendientes: number
  pedidosEnProceso: number
  pedidosEntregados: number
  pedidosAsignados: number
  totalClientes: number
  productosLowStock: number
}
