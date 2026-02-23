import { SupabaseClient } from "@supabase/supabase-js"

export async function validateAndCalculateTotals(
    supabaseAdmin: SupabaseClient,
    items: Array<{ id: number; quantity: number; producto_variante_id?: number | null }>,
    couponCode?: string | null
) {
    // 1. Obtener IDs de productos y variantes
    const productIds = items.map(it => it.id)
    const variantIds = items.map(it => it.producto_variante_id).filter((id): id is number => id !== null && id !== undefined)

    if (productIds.length === 0) {
        throw new Error("El carrito está vacío")
    }

    // 2. Consultar productos y variantes en paralelo
    const [productsRes, variantsRes, couponRes] = await Promise.all([
        supabaseAdmin.from("productos").select("id, precio, stock, nombre").in("id", productIds),
        variantIds.length > 0
            ? supabaseAdmin.from("producto_variantes").select("id, precio, stock, talla, color, modelo").in("id", variantIds)
            : Promise.resolve({ data: [], error: null }),
        couponCode
            ? supabaseAdmin.from("cupones").select("*").eq("codigo", couponCode).single()
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

    // 3. Calcular subtotal
    let hasInvalidProducts = false
    let subtotal = 0

    for (const item of items) {
        let unitPrice: number | undefined;
        let availableStock = 0;
        let itemName = productNames.get(item.id) || "Producto desconocido";

        if (item.producto_variante_id) {
            unitPrice = officialVariantPrices.get(item.producto_variante_id)
            // Si la variante no tiene precio específico, usar el precio del producto base
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
            throw new Error(`¡Ups! No hay stock suficiente para: ${itemName}. Solo quedan ${availableStock} unidades.`);
        }

        subtotal += unitPrice * item.quantity
    }

    if (hasInvalidProducts) {
        throw new Error("Algunos productos en el carrito ya no están disponibles")
    }

    // Redondear subtotal
    subtotal = Math.max(0, Math.round(subtotal * 100) / 100)

    // 4. Validar Cupón y calcular descuento
    let discountAmount = 0
    let validCouponCode = null

    if (couponCode && couponRes.data) {
        const coupon = couponRes.data
        const now = new Date()

        const isActive = coupon.activo !== false
        const hasNotExpired = !coupon.expires_at || new Date(coupon.expires_at) >= now
        const hasStarted = !coupon.starts_at || new Date(coupon.starts_at) <= now
        const hasUsesLeft = !coupon.max_usos || (coupon.usos < coupon.max_usos)
        const meetsMinTotal = subtotal >= (coupon.min_total || 0)

        if (isActive && hasNotExpired && hasStarted && hasUsesLeft && meetsMinTotal) {
            validCouponCode = coupon.codigo
            if (coupon.tipo === 'monto') {
                discountAmount = coupon.valor
            } else if (coupon.tipo === 'porcentaje') {
                discountAmount = (subtotal * coupon.valor) / 100
            }
        }
    }

    // Asegurar que el descuento no supere el subtotal
    discountAmount = Math.max(0, Math.round(Math.min(subtotal, discountAmount) * 100) / 100)

    // Calcular total final
    const total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100)

    // Proveer una forma de resolver el precio por item para guardar en la BD
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
