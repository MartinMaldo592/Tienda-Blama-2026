export type CheckoutItem = {
    id: number
    quantity: number
    precio: number
    nombre: string
    producto_variante_id?: number | null
    variante_nombre?: string | null
}

export type ValidateCouponResult = {
    descuento: number
    codigo: string | null
}

export type CreateOrderPayload = {
    name: string
    phone: string
    dni: string
    address: string
    reference?: string
    locationLink?: string
    couponCode?: string | null
    discountAmount?: number
    shippingMethod?: string
    items: Array<{
        id: number
        quantity: number
        precio: number
        nombre: string
        producto_variante_id?: number | null
        variante_nombre?: string | null
    }>
}

export type CreateOrderSuccess = {
    ok: true
    orderId: number
    subtotal: number
    descuento: number
    total: number
}

export type CreateOrderError = {
    ok?: false
    error?: string
    missing?: string[]
}

export type CreateOrderResponse = CreateOrderSuccess | CreateOrderError
