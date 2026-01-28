import { createClient } from "@supabase/supabase-js"
import type { Category, Product } from "@/features/products/types"

function createAnonServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) return null
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    })
}

export async function fetchProductForMeta(id: number) {
    const supabase = createAnonServerClient()
    if (!supabase) return null

    const { data, error } = await supabase
        .from("productos")
        .select("id, nombre, descripcion, imagen_url, imagenes")
        .eq("id", id)
        .maybeSingle()

    if (error) return null
    return data
}

export async function getHomePageData(opts: {
    selectedCategorySlug?: string
    productsLimit: number
}) {
    const supabase = createAnonServerClient()
    if (!supabase) {
        return {
            categories: [] as Category[],
            products: [] as Product[],
            bestSellers: [] as Product[],
            offers: [] as Product[],
            productsError: null as any,
        }
    }

    const { data: categories } = await supabase.from("categorias").select("*").order("nombre", { ascending: true })


    const selectedCategorySlug = String(opts.selectedCategorySlug || "").trim()
    const selectedCategory = (categories as Category[] | null)?.find((c) => c.slug === selectedCategorySlug)

    let productsQuery = supabase.from("productos").select("*").order("created_at", { ascending: false })
    productsQuery = productsQuery.limit(opts.productsLimit)

    if ((selectedCategory as any)?.id) {
        const catId = (selectedCategory as any).id
        const allCats = (categories as any[]) || []
        const childIds = allCats.filter(c => c.parent_id === catId).map(c => c.id)
        const ids = [catId, ...childIds]
        productsQuery = productsQuery.in("categoria_id", ids)
    }
    const { data: products, error: productsError } = await productsQuery

    let bestSellers: Product[] = []
    let offers: Product[] = []

    try {
        const { data: soldItems, error: soldItemsError } = await supabase
            .from("pedido_items")
            .select(`
        cantidad,
        productos (*),
        pedidos (status)
      `)
            .limit(1000)

        if (!soldItemsError && soldItems && soldItems.length > 0) {
            const soldByProductId = new Map<number, { product: Product; sold: number }>()

            for (const row of soldItems as any[]) {
                const status: string | undefined = row.pedidos?.status
                if (status && ["Fallido", "Devuelto"].includes(status)) continue

                const product: Product | null | undefined = row.productos
                if (!product) continue

                const productId = product.id
                const qty = Number(row.cantidad) || 0
                if (qty <= 0) continue

                const current = soldByProductId.get(productId)
                if (current) {
                    current.sold += qty
                } else {
                    soldByProductId.set(productId, { product, sold: qty })
                }
            }

            bestSellers = Array.from(soldByProductId.values())
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 10)
                .map((x) => x.product)
        }
    } catch (err) {
        bestSellers = []
    }

    try {
        const { data: offersRaw, error: offersError } = await supabase
            .from("productos")
            .select("*")
            .not("precio_antes", "is", null)
            .limit(60)

        if (!offersError && offersRaw && offersRaw.length > 0) {
            offers = (offersRaw as Product[])
                .filter((p) => {
                    const before = Number((p as any)?.precio_antes ?? 0)
                    const current = Number((p as any)?.precio ?? 0)
                    return Number.isFinite(before) && Number.isFinite(current) && before > current && current > 0
                })
                .sort((a, b) => {
                    const beforeA = Number((a as any)?.precio_antes ?? 0)
                    const currentA = Number((a as any)?.precio ?? 0)
                    const beforeB = Number((b as any)?.precio_antes ?? 0)
                    const currentB = Number((b as any)?.precio ?? 0)
                    const discA = beforeA > 0 ? (beforeA - currentA) / beforeA : 0
                    const discB = beforeB > 0 ? (beforeB - currentB) / beforeB : 0
                    return discB - discA
                })
                .slice(0, 6)
        }
    } catch (err) {
        offers = []
    }

    const visibleCategories = ((categories as Category[]) || []).filter((c: any) => !c.parent_id)

    return {
        categories: visibleCategories,
        products: (products as Product[] | null) || [],
        bestSellers,
        offers,
        productsError,
    }
}
