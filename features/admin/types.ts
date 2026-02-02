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
  nombre_contacto?: string | null
  dni_contacto?: string | null
  telefono_contacto?: string | null
  departamento?: string | null
  provincia?: string | null
  distrito?: string | null
  direccion_calle?: string | null
  referencia_direccion?: string | null
  link_ubicacion?: string | null
  metodo_envio?: string | null
  guia_archivo_url?: string | null
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

export type PedidoLog = {
  id: number
  pedido_id: number
  usuario_nombre: string
  accion: string
  detalles: string
  created_at: string
}
