import { createClient } from "@/lib/supabase.client"
import type {
    Category,
    Product,
    ProductSpecification,
    ProductVariant,
    ProductWithCategory,
    SortValue,
} from "@/features/products/types"

export async function listCategories(): Promise<Category[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("categorias").select("*").order("nombre", { ascending: true })
    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }
    return (data as Category[]) || []
}

export type ListProductsParams = {
    cat: string
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

export async function listProducts(params: ListProductsParams): Promise<ListProductsResult> {
    const supabase = createClient()
    const q = (params.q || "").trim()
    const min = params.min ? Number(params.min) : null
    const max = params.max ? Number(params.max) : null

    let productsQuery = supabase.from("productos").select("*", { count: "exact" })

    if (params.cat !== "all") {
        const categoryId = Number(params.cat)
        if (Number.isFinite(categoryId) && categoryId > 0) {
            productsQuery = productsQuery.eq("categoria_id", categoryId)
        } else {
            const { data: catRow, error: catError } = await supabase
                .from("categorias")
                .select("id")
                .eq("slug", params.cat)
                .maybeSingle()

            if (!catError && catRow?.id) {
                productsQuery = productsQuery.eq("categoria_id", catRow.id)
            }
        }
    }

    if (q) {
        productsQuery = productsQuery.ilike("nombre", `%${q}%`)
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
        console.error("Error fetching products:", error)
        return { productos: [], totalCount: 0 }
    }

    return {
        productos: (data as Product[]) || [],
        totalCount: Number(count || 0),
    }
}

export type CountProductsParams = {
    cat: string
    q: string
    min: string
    max: string
    stock: boolean
}

export async function countProducts(params: CountProductsParams): Promise<number | null> {
    const supabase = createClient()
    const q = (params.q || "").trim()
    const min = params.min ? Number(params.min) : null
    const max = params.max ? Number(params.max) : null

    let countQuery = supabase.from("productos").select("id", { count: "exact", head: true })

    if (params.cat !== "all") {
        const categoryId = Number(params.cat)
        if (Number.isFinite(categoryId) && categoryId > 0) {
            countQuery = countQuery.eq("categoria_id", categoryId)
        } else {
            const { data: catRow, error: catError } = await supabase
                .from("categorias")
                .select("id")
                .eq("slug", params.cat)
                .maybeSingle()

            if (!catError && catRow?.id) {
                countQuery = countQuery.eq("categoria_id", catRow.id)
            }
        }
    }

    if (q) {
        countQuery = countQuery.ilike("nombre", `%${q}%`)
    }

    if (min !== null && Number.isFinite(min)) {
        countQuery = countQuery.gte("precio", min)
    }

    if (max !== null && Number.isFinite(max)) {
        countQuery = countQuery.lte("precio", max)
    }

    if (params.stock) {
        countQuery = countQuery.gt("stock", 0)
    }

    const { count, error } = await countQuery
    if (error) {
        console.error("Error fetching draft count:", error)
        return null
    }

    return Number(count || 0)
}

export type ProductDetailResult = {
    producto: ProductWithCategory | null
    variantes: ProductVariant[]
    especificaciones: ProductSpecification[]
}

export async function getProductDetail(productId: number): Promise<ProductDetailResult> {
    const supabase = createClient()
    const [prodRes, variantsRes, specsRes] = await Promise.all([
        supabase.from("productos").select(`*, categorias (id, nombre, slug)`).eq("id", productId).single(),
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

    const { data, error } = prodRes

    const producto = error ? null : ((data as ProductWithCategory) || null)

    const variantes = Array.isArray(variantsRes.data) ? (variantsRes.data as ProductVariant[]) : []
    const especificaciones = Array.isArray(specsRes.data)
        ? (specsRes.data as ProductSpecification[])
        : []

    if (error) {
        console.error("Error fetching producto:", error)
    }

    return {
        producto,
        variantes,
        especificaciones,
    }
}

export async function getRecommendedProducts(excludeId: number): Promise<any[]> {
    const supabase = createClient()
    try {
        const { data: topData, error: topError } = await supabase.rpc("get_top_products", {
            limit_count: 8,
            exclude_id: excludeId,
        })

        if (!topError && Array.isArray(topData)) {
            return topData
        }

        const { data: recentData, error: recentError } = await supabase
            .from("productos")
            .select("*")
            .neq("id", excludeId)
            .gt("stock", 0)
            .order("created_at", { ascending: false })
            .limit(8)

        if (!recentError && Array.isArray(recentData)) {
            return recentData
        }

        return []
    } catch (err) {
        return []
    }
}
