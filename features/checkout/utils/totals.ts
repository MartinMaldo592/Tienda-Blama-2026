import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Validates cart items against the DB (prices, stock, variants) and
 * calculates subtotal, discount and final total server-side.
 * Canonical location: features/checkout/utils/totals.ts
 */
export async function validateAndCalculateTotals(
    supabaseAdmin: SupabaseClient,
    items: Array<{ id: number; quantity: number; producto_variante_id?: number | null }>,
    couponCode?: string | null,
    customerEmail?: string | null,
    isQuickCheckout?: boolean
) {
    const productIds = items.map(it => it.id)
    const variantIds = items
        .map(it => it.producto_variante_id)
        .filter((id): id is number => id !== null && id !== undefined)

    if (productIds.length === 0) {
        throw new Error("El carrito está vacío")
    }

    const [productsRes, variantsRes, couponRes, subscriptionRes] = await Promise.all([
        supabaseAdmin.from("productos").select("id, precio, stock, nombre").in("id", productIds),
        variantIds.length > 0
            ? supabaseAdmin.from("producto_variantes").select("id, precio, stock, talla, color, modelo").in("id", variantIds)
            : Promise.resolve({ data: [], error: null }),
        couponCode
            ? supabaseAdmin.from("cupones").select("*").eq("codigo", couponCode).maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        couponCode
            ? supabaseAdmin.from("newsletter_subscriptions").select("email").eq("cupon_codigo", couponCode).maybeSingle()
            : Promise.resolve({ data: null, error: null })
    ])

    if (productsRes.error) throw new Error("Error validando catálogo de productos")
    if (variantIds.length > 0 && variantsRes.error) throw new Error("Error validando variantes de productos")

    const officialProductPrices = new Map<number, number>()
    const officialProductStock = new Map<number, number>()
    const productNames = new Map<number, string>()

    productsRes.data?.forEach(p => {
        officialProductPrices.set(p.id, Number(p.precio) || 0)
        officialProductStock.set(p.id, Number(p.stock) || 0)
        productNames.set(p.id, p.nombre || `Producto #${p.id}`)
    })

    const officialVariantPrices = new Map<number, number>()
    const officialVariantStock = new Map<number, number>()
    const variantNames = new Map<number, string>()

    variantsRes.data?.forEach(v => {
        if (v.precio !== null && v.precio !== undefined) {
            officialVariantPrices.set(v.id, Number(v.precio))
        }
        officialVariantStock.set(v.id, Number(v.stock) || 0)
        const nameParts = [v.talla, v.color, v.modelo].filter(Boolean)
        variantNames.set(v.id, nameParts.length > 0 ? nameParts.join(" / ") : `Variante #${v.id}`)
    })

    let hasInvalidProducts = false
    let subtotal = 0

    for (const item of items) {
        let unitPrice: number | undefined
        let availableStock = 0
        let itemName = productNames.get(item.id) || "Producto desconocido"

        if (item.producto_variante_id) {
            unitPrice = officialVariantPrices.get(item.producto_variante_id)
            if (unitPrice === undefined) {
                unitPrice = officialProductPrices.get(item.id)
            }
            availableStock = officialVariantStock.get(item.producto_variante_id) || 0
            const varName = variantNames.get(item.producto_variante_id)
            if (varName) itemName += ` (${varName})`
        } else {
            unitPrice = officialProductPrices.get(item.id)
            availableStock = officialProductStock.get(item.id) || 0
        }

        if (unitPrice === undefined) {
            hasInvalidProducts = true
            break
        }

        if (availableStock < item.quantity) {
            throw new Error(`¡Ups! No hay stock suficiente para: ${itemName}. Solo quedan ${availableStock} unidades.`)
        }

        subtotal += unitPrice * item.quantity
    }

    if (hasInvalidProducts) {
        throw new Error("Algunos productos en el carrito ya no están disponibles")
    }

    subtotal = Math.max(0, Math.round(subtotal * 100) / 100)

    // ── Calcular descuento automático por volumen (Packs) ──
    let volumeDiscount = 0
    const totalQuantity = items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0)
    if (totalQuantity === 2) {
        volumeDiscount = Math.round(subtotal * 0.15 * 100) / 100
    } else if (totalQuantity >= 3) {
        volumeDiscount = Math.round(subtotal * 0.30 * 100) / 100
    }

    let couponDiscount = 0
    let validCouponCode = null

    if (couponCode) {
        if (couponCode === "EXIT10") {
            if (totalQuantity === 1) {
                couponDiscount = Math.round(subtotal * 0.10)
                validCouponCode = "EXIT10"
            } else {
                throw new Error("El cupón de descuento adicional solo aplica para pedidos de 1 unidad")
            }
        } else {
            if (couponRes.error || !couponRes.data) {
                throw new Error("Cupón inválido")
            }
            const coupon = couponRes.data
            const now = new Date()
            const isActive = coupon.activo !== false
            const hasNotExpired = !coupon.expires_at || new Date(coupon.expires_at) >= now
            const hasStarted = !coupon.starts_at || new Date(coupon.starts_at) <= now
            const hasUsesLeft = !coupon.max_usos || coupon.usos < coupon.max_usos
            const meetsMinTotal = subtotal >= (coupon.min_total || 0)

            if (!isActive) throw new Error("Cupón inactivo")
            if (!hasNotExpired) throw new Error("El cupón expiró")
            if (!hasStarted) throw new Error("El cupón aún no está disponible")
            if (!hasUsesLeft) throw new Error("El cupón ya alcanzó el máximo de usos")
            if (!meetsMinTotal) throw new Error("El cupón no aplica para este total")

            // ── Validar propiedad de cupón de bienvenida (newsletter) ──
            if (subscriptionRes && subscriptionRes.data) {
                const cleanedUserEmail = String(customerEmail || "").trim().toLowerCase()
                const cleanedSubEmail = String(subscriptionRes.data.email || "").trim().toLowerCase()
                if (!cleanedUserEmail) {
                    throw new Error("Por favor ingresa tu correo de contacto para aplicar este cupón de bienvenida.")
                }
                if (cleanedUserEmail !== cleanedSubEmail) {
                    throw new Error("Este cupón de bienvenida solo es válido para el correo que se suscribió.")
                }
            }

            validCouponCode = coupon.codigo
            if (coupon.tipo === 'monto') {
                couponDiscount = coupon.valor
            } else if (coupon.tipo === 'porcentaje') {
                couponDiscount = (subtotal * coupon.valor) / 100
            }
        }
    }

    let discountAmount = Math.max(0, Math.round(Math.min(subtotal, volumeDiscount + couponDiscount) * 100) / 100)
    let total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100)

    if (isQuickCheckout && (totalQuantity > 1 || couponCode === "EXIT10")) {
        total = Math.round(total)
        discountAmount = Math.max(0, Math.round((subtotal - total) * 100) / 100)
    }

    const getUnitPrice = (productId: number, variantId?: number | null) => {
        let price: number | undefined
        if (variantId) {
            price = officialVariantPrices.get(variantId)
        }
        if (price === undefined) {
            price = officialProductPrices.get(productId)
        }
        return price || 0
    }

    return { subtotal, discountAmount, total, validCouponCode, getUnitPrice }
}
