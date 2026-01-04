import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: number
    nombre: string
    precio: number
    imagen_url?: string
    quantity: number
}

interface CartStore {
    items: CartItem[]
    addItem: (product: Omit<CartItem, 'quantity'>) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.id === product.id)

                    if (existingItem) {
                        return {
                            items: state.items.map(item =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            )
                        }
                    }

                    return {
                        items: [...state.items, { ...product, quantity: 1 }]
                    }
                })
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== productId)
                }))
            },

            updateQuantity: (productId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(item => item.id !== productId)
                        }
                    }

                    return {
                        items: state.items.map(item =>
                            item.id === productId
                                ? { ...item, quantity }
                                : item
                        )
                    }
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            getTotal: () => {
                return get().items.reduce((total, item) => total + (item.precio * item.quantity), 0)
            }
        }),
        {
            name: 'cart-storage', // Key for localStorage
        }
    )
)
