import type { Database } from "@/types/database.types"

type Product = Database["public"]["Tables"]["productos"]["Row"]

type ProductVariant = Database["public"]["Tables"]["producto_variantes"]["Row"]

type CartItem = Product & {
    quantity: number
    producto_variante_id?: number | null
    variante_nombre?: string | null
}

export type CartState = {
    items: CartItem[]
    addItem: (product: Product, variant?: ProductVariant | null) => void
    removeItem: (productId: number, variantId?: number | null) => void
    updateQuantity: (productId: number, quantity: number, variantId?: number | null) => void
    clearCart: () => void
    total: number
}
