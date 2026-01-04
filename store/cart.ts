
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['productos']['Row']

interface CartItem extends Product {
    quantity: number
}

interface CartState {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    total: number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            addItem: (product) => {
                const items = get().items
                const existingItem = items.find((item) => item.id === product.id)

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }] })
                }

                // Recalculate total
                const newItems = get().items
                const total = newItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
                set({ total })
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) })
                const newItems = get().items
                const total = newItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
                set({ total })
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                })
                const newItems = get().items
                const total = newItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
                set({ total })
            },
            clearCart: () => set({ items: [], total: 0 }),
        }),
        {
            name: 'cart-storage',
        }
    )
)
