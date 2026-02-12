
import { Database } from "@/types/database.types"

// Helper to extract Row types
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]

export type AdminRole = "admin" | "worker"

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
}

// Extended Types for UI (Joins)
export interface AdminProduct extends Producto {
  categoria?: Categoria | null
  variantes?: ProductoVariante[]
  especificaciones?: ProductoEspecificacion[]
  // Some UI specific fields that might be calculated
  stockTotal?: number
}

export interface AdminPedidoItem extends PedidoItem {
  productos?: Pick<Producto, "nombre" | "precio" | "imagen_url"> | null
  variante_nombre?: string | null // often joined or saved
  cantidad_devuelta?: number | null
}

export interface AdminPedido extends Pedido {
  clientes?: Cliente | null
  items?: AdminPedidoItem[]
  asignado_perfil?: ProfileRow | null

  // Fields potentially missing from generated types but present in DB/App logic
  asignado_a?: string | null
  fecha_asignacion?: string | null

  // Legacy fields that seem to be used in UI but missing in simplified type definition?
  // We include them as optional to avoid breaking existing code immediately, 
  // but typed properly.
  // Ideally these should be in the DB definition if they exist.
  nombre_contacto?: string | null
  dni_contacto?: string | null
  telefono_contacto?: string | null
  departamento?: string | null
  provincia?: string | null
  distrito?: string | null
  direccion_calle?: string | null
  referencia_direccion?: string | null
  link_ubicacion?: string | null
  guia_archivo_url?: string | null
  comprobante_pago_url?: string[] | null
  codigo_seguimiento?: string | null
  shalom_orden?: string | null
  shalom_clave?: string | null
  evidencia_entrega_url?: string | null
  shalom_pin?: string | null
  updated_at?: string | null
}

// Aliases for backward compatibility during refactor
export type PedidoRow = AdminPedido
export type PedidoItemRow = AdminPedidoItem
export type ClienteRow = Cliente

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
  metodo_pago: 'Efectivo' | 'Yape' | 'Plin' | 'Transferencia BCP' | 'Transferencia Interbank' | 'Otro'
  tipo_pago: 'Adelanto' | 'Abono' | 'Pago Final' | 'Reembolso'
  comprobante_url: string | null
  nota: string | null
  registrado_por: string
  created_at: string
}
