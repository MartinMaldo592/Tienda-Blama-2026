import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { Category, Product, SortValue, ProductSpecification, ProductVariant, ProductWithCategory } from "@/features/products/types"

function createAnonServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) return null
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    })
}


import { unstable_cache } from "next/cache"

export const fetchProductForMeta = unstable_cache(
    async (identifier: string | number) => {
        const supabase = createAnonServerClient()
        if (!supabase) return null

        let query = supabase
            .from("productos")
            .select("id, nombre, descripcion, imagen_url, imagenes, slug, precio, precio_antes, stock, categorias(nombre)")

        if (typeof identifier === "number") {
            query = query.eq("id", identifier)
        } else {
            query = query.eq("slug", identifier)
        }

        const { data, error } = await query.maybeSingle()
        if (error) return null
        return data
    },
    ['product-meta'],
    { tags: ['products'] }
)

export const getProductDetailServer = unstable_cache(
    async (identifier: string | number) => {
        const supabase = createAnonServerClient()
        if (!supabase) return { producto: null, variantes: [], especificaciones: [] }

        let producto: ProductWithCategory | null = null
        let error: any = null

        if (typeof identifier === "number") {
            const { data, error: err } = await supabase
                .from("productos")
                .select(`*, categorias (id, nombre, slug)`)
                .eq("id", identifier)
                .maybeSingle()
            producto = data as ProductWithCategory
            error = err
        } else {
            const { data, error: err } = await supabase
                .from("productos")
                .select(`*, categorias (id, nombre, slug)`)
                .eq("slug", identifier)
                .maybeSingle()
            producto = data as ProductWithCategory
            error = err
        }

        if (error || !producto) {
            console.error("Error fetching product server:", error)
            return { producto: null, variantes: [], especificaciones: [] }
        }

        const productId = producto.id

        const [variantsRes, specsRes] = await Promise.all([
            supabase
                .from("producto_variantes")
                .select("*")
                .eq("producto_id", productId)
                .eq("activo", true)
                .order("id", { ascending: true }),
            supabase
                .from("producto_especificaciones")
                .select("*")
                .eq("producto_id", productId)
                .order("orden", { ascending: true })
                .order("id", { ascending: true }),
        ])

        const variantes = Array.isArray(variantsRes.data) ? (variantsRes.data as ProductVariant[]) : []
        const especificaciones = Array.isArray(specsRes.data)
            ? (specsRes.data as ProductSpecification[])
            : []

        return {
            producto,
            variantes,
            especificaciones,
        }
    },
    ['product-detail-server'],
    { tags: ['products'], revalidate: 3600 }
)


// ... (keep helper functions)

async function getHomePageDataRaw(opts: {
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

    const [categoriesResult, soldItemsResult, offersResult] = await Promise.all([
        supabase.from("categorias").select("*").order("nombre", { ascending: true }),
        supabase.from("pedido_items")
            .select(`
                cantidad,
                productos (*),
                pedidos (status)
            `)
            .limit(1000),
        supabase.from("productos")
            .select("*")
            .not("precio_antes", "is", null)
            .limit(60)
    ])

    const categories = categoriesResult.data || []

    const selectedCategorySlug = String(opts.selectedCategorySlug || "").trim()
    const selectedCategory = (categories as Category[] as any)?.find((c: any) => c.slug === selectedCategorySlug)

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

    // Process Best Sellers
    try {
        const soldItems = soldItemsResult.data
        const soldItemsError = soldItemsResult.error

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

    // Process Offers
    try {
        const offersRaw = offersResult.data
        const offersError = offersResult.error

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
                    // Mayor descuento primero
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

export async function getHomePageData(opts: {
    selectedCategorySlug?: string
    productsLimit: number
}) {
    const slug = opts.selectedCategorySlug ? String(opts.selectedCategorySlug).trim() : "all"
    const limit = opts.productsLimit
    const cacheKey = `home-page-data-${slug}-${limit}`

    return unstable_cache(
        async () => getHomePageDataRaw(opts),
        [cacheKey],
        {
            tags: ['products', 'home-page'],
            revalidate: 600 // Cache for 10 minutes
        }
    )()
}


export const listCategories = unstable_cache(
    async (): Promise<Category[]> => {
        const supabase = createAnonServerClient()
        if (!supabase) return []
        const { data, error } = await supabase.from("categorias").select("*").order("nombre", { ascending: true })
        if (error) {
            console.error("Error fetching categories:", error)
            return []
        }
        return (data as Category[]) || []
    },
    ['categories-list'],
    { tags: ['products', 'categories'], revalidate: 3600 }
)

export type ListProductsParams = {
    cat: string
    subcat?: string
    q: string
    sort: SortValue
    min: string
    max: string
    stock: boolean
    page: number
    pageSize: number
}

export type ListProductsResult = {
    productos: Product[]
    totalCount: number
}

/**
 * Versión interna de listProducts que realiza la consulta a la base de datos.
 */
async function listProductsBase(params: ListProductsParams, allCategories?: Category[]): Promise<ListProductsResult> {
    const supabase = createAnonServerClient()
    if (!supabase) return { productos: [], totalCount: 0 }

    const q = (params.q || "").trim()
    const min = params.min ? Number(params.min) : null
    const max = params.max ? Number(params.max) : null

    let productsQuery = supabase.from("productos").select("*", { count: "exact" })

    const hasSubcat = params.subcat && params.subcat !== "all"
    const hasCat = params.cat && params.cat !== "all"

    if (hasSubcat) {
        const subcatId = Number(params.subcat)
        if (Number.isFinite(subcatId) && subcatId > 0) {
            productsQuery = productsQuery.eq("categoria_id", subcatId)
        } else {
            // Intentar encontrar por slug en la lista de categorías si se proporcionó
            const foundCat = allCategories?.find(c => c.slug === params.subcat)
            if (foundCat) {
                productsQuery = productsQuery.eq("categoria_id", foundCat.id)
            } else {
                // Fallback a consulta individual
                const { data: catRow } = await supabase
                    .from("categorias")
                    .select("id")
                    .eq("slug", params.subcat!)
                    .maybeSingle()
                if ((catRow as any)?.id) {
                    productsQuery = productsQuery.eq("categoria_id", (catRow as any).id)
                }
            }
        }
    } else if (hasCat) {
        let parentId = Number(params.cat)
        if (!Number.isFinite(parentId) || parentId <= 0) {
            const foundCat = allCategories?.find(c => c.slug === params.cat)
            if (foundCat) {
                parentId = foundCat.id
            } else {
                const { data: catRow } = await supabase
                    .from("categorias")
                    .select("id")
                    .eq("slug", params.cat)
                    .maybeSingle()
                parentId = (catRow as any)?.id || 0
            }
        }

        if (parentId > 0) {
            let childrenIds: number[] = []
            if (allCategories) {
                childrenIds = allCategories.filter(c => c.parent_id === parentId).map(c => c.id)
            } else {
                const { data: children } = await supabase
                    .from("categorias")
                    .select("id")
                    .eq("parent_id", parentId)
                childrenIds = (children as any[])?.map(c => c.id) || []
            }

            const ids = [parentId, ...childrenIds]
            productsQuery = productsQuery.in("categoria_id", ids)
        }
    }

    if (q) {
        productsQuery = productsQuery.textSearch('fts', q, {
            config: 'spanish',
            type: 'websearch'
        })
    }

    if (min !== null && Number.isFinite(min)) {
        productsQuery = productsQuery.gte("precio", min)
    }

    if (max !== null && Number.isFinite(max)) {
        productsQuery = productsQuery.lte("precio", max)
    }

    if (params.stock) {
        productsQuery = productsQuery.gt("stock", 0)
    }

    if (params.sort === "price-asc") productsQuery = productsQuery.order("precio", { ascending: true })
    if (params.sort === "price-desc") productsQuery = productsQuery.order("precio", { ascending: false })
    if (params.sort === "name-asc") productsQuery = productsQuery.order("nombre", { ascending: true })
    if (params.sort === "name-desc") productsQuery = productsQuery.order("nombre", { ascending: false })
    if (params.sort === "newest") productsQuery = productsQuery.order("created_at", { ascending: false })

    const from = Math.max(0, (params.page - 1) * params.pageSize)
    const to = Math.max(from, from + params.pageSize - 1)
    productsQuery = productsQuery.range(from, to)

    const { data, error, count } = await productsQuery

    if (error) {
        console.error("Error in listProducts query:", error)
        return { productos: [], totalCount: 0 }
    }

    return {
        productos: (data as Product[]) || [],
        totalCount: Number(count || 0),
    }
}

/**
 * Función principal para listar productos con caché y optimización.
 */
export async function listProducts(params: ListProductsParams, allCategories?: Category[]): Promise<ListProductsResult> {
    // Si no tenemos categorías, las cargamos para optimizar la resolución de slugs
    let categories = allCategories
    if (!categories && (params.cat !== 'all' || params.subcat !== 'all')) {
        categories = await listCategories()
    }

    // Generamos una clave de caché basada en los parámetros
    const cacheKey = `list-products-${JSON.stringify(params)}`
    
    // Usamos unstable_cache para cachear el resultado de la búsqueda
    return unstable_cache(
        async () => listProductsBase(params, categories),
        [cacheKey],
        { 
            tags: ['products'], 
            revalidate: 600 // Cache de 10 minutos para búsquedas
        }
    )()
}

export async function getAllProductIdentifiers() {
    const supabase = createAnonServerClient()
    if (!supabase) return []
    const { data } = await supabase.from("productos").select("id, slug")
    return data || []
}
