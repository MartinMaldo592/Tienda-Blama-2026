import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

import type { CartState } from "@/features/cart/types"

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            addItem: (product, variant) => {
                set((state) => {
                    const items = state.items
                    const variantId = variant?.id ?? null
                    const existingItem = items.find(
                        (item) => item.id === product.id && (item.producto_variante_id ?? null) === variantId
                    )

                    const effectivePrice = Number(variant?.precio ?? product.precio)
                    const effectivePriceBefore = (variant?.precio_antes ?? (product as any).precio_antes ?? null) as number | null
                    const varianteNombre = variant?.etiqueta ?? null

                    const nextItems = existingItem
                        ? items.map((item) => {
                              if (item.id === product.id && (item.producto_variante_id ?? null) === variantId) {
                                  if (item.quantity >= 5) {
                                      toast.warning("Límite alcanzado", {
                                          description: "Solo puedes agregar hasta 5 unidades de este artículo."
                                      })
                                      return item
                                  }
                                  return { ...item, quantity: item.quantity + 1 }
                              }
                              return item
                          })
                        : [
                              ...items,
                              {
                                  ...product,
                                  precio: effectivePrice,
                                  precio_antes: effectivePriceBefore,
                                  producto_variante_id: variantId,
                                  variante_nombre: varianteNombre,
                                  quantity: 1,
                              },
                          ]

                    const total = nextItems.reduce((sum, item) => sum + item.precio * item.quantity, 0)
                    return { items: nextItems, total }
                })
            },
            removeItem: (productId, variantId) => {
                const v = variantId ?? null
                set((state) => {
                    const nextItems = state.items.filter(
                        (item) => !(item.id === productId && (item.producto_variante_id ?? null) === v)
                    )
                    const total = nextItems.reduce((sum, item) => sum + item.precio * item.quantity, 0)
                    return { items: nextItems, total }
                })
            },
            updateQuantity: (productId, quantity, variantId) => {
                const v = variantId ?? null
                if (quantity <= 0) {
                    get().removeItem(productId, v)
                    return
                }
                const finalQuantity = Math.min(quantity, 5)
                if (quantity > 5) {
                    toast.warning("Límite alcanzado", {
                        description: "Solo puedes comprar hasta 5 unidades de este artículo."
                    })
                }
                set((state) => {
                    const nextItems = state.items.map((item) =>
                        item.id === productId && (item.producto_variante_id ?? null) === v
                            ? { ...item, quantity: finalQuantity }
                            : item
                    )
                    const total = nextItems.reduce((sum, item) => sum + item.precio * item.quantity, 0)
                    return { items: nextItems, total }
                })
            },
            clearCart: () => set({ items: [], total: 0 }),
        }),
        {
            name: "cart-storage",
        }
    )
)
