
import { Database } from "@/types/database.types"

// Helper to extract Row types
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]

export type AdminRole = "superadmin" | "admin" | "worker"

// Base Entity Types
export type Producto = Tables<"productos">
export type Categoria = Tables<"categorias">
export type ProductoVariante = Tables<"producto_variantes">
export type ProductoEspecificacion = Tables<"producto_especificaciones">
export type Cliente = Tables<"clientes">
export type Pedido = Tables<"pedidos">
export type PedidoItem = Tables<"pedido_items">
export type Incidencia = Tables<"incidencias">
export type Cupon = Tables<"cupones">

export type ProfileRow = {
  id: string
  email?: string | null
  nombre?: string | null
  role?: AdminRole | string | null
  created_at?: string | null
  activo?: boolean | null
}

// Extended Types for UI (Joins)

interface AdminPedidoItem extends PedidoItem {
  productos?: Pick<Producto, "nombre" | "precio" | "imagen_url"> | null
}

interface AdminPedido extends Pedido {
  clientes?: Cliente | null
  items?: AdminPedidoItem[]
  asignado_perfil?: ProfileRow | null
  updated_at?: string | null
}

// Aliases for backward compatibility during refactor
export type PedidoRow = AdminPedido
export type PedidoItemRow = AdminPedidoItem


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

export type PedidoPago = {
  id: number
  pedido_id: number
  monto: number
  metodo_pago: 'Efectivo' | 'Yape' | 'Plin' | 'Transferencia BCP' | 'Transferencia Interbank' | 'Tarjeta' | 'Pasarela Culqi' | 'Otro'
  tipo_pago: 'Adelanto' | 'Abono' | 'Pago Final' | 'Reembolso'
  comprobante_url: string | null
  nota: string | null
  registrado_por: string
  created_at: string
}
