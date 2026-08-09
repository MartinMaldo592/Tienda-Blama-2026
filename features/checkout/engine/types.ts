export type OrderChannel = "whatsapp" | "culqi" | "admin_manual"

export interface CheckoutEngineItem {
  id: number
  quantity: number
  precio?: number
  nombre?: string
  producto_variante_id?: number | null
  variante_nombre?: string | null
}

export interface CheckoutEnginePayload {
  name: string
  phone: string
  dni?: string | null
  email?: string | null
  address: string
  reference?: string | null
  locationLink?: string | null
  shippingMethod?: string | null
  couponCode?: string | null
  discountAmount?: number
  items: CheckoutEngineItem[]
  
  // Location
  department?: string | null
  province?: string | null
  provinceName?: string | null
  district?: string | null
  street?: string | null
  
  isQuickCheckout?: boolean
}

export interface CheckoutEngineOptions {
  channel: OrderChannel
  payload: CheckoutEnginePayload
  culqiChargeId?: string
}

export interface CheckoutEngineResult {
  ok: boolean
  orderId: number
  clienteId: number
  subtotal: number
  descuento: number
  total: number
}
