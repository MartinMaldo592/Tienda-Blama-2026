import { Suspense } from "react"
import Link from "next/link"
import { listCategories, listProducts } from "@/features/products/services/products.server"
import type { SortValue } from "@/features/products/types"
import { ProductosClient } from "@/features/products/components/ProductosClient"
import Loading from "./loading"

export const metadata = {
    title: 'Colección Exclusiva | Blama Shop',
    description: 'Descubre piezas únicas seleccionadas por su diseño y calidad excepcional. Una experiencia de compra elevada en Blama Shop.',
}

export const revalidate = 300 // Revalidar cada 5 minutos

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductosPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams
    
    const rawCat = typeof resolvedParams.categoria === 'string' ? resolvedParams.categoria : (typeof resolvedParams.cat === 'string' ? resolvedParams.cat : 'all')
    const cat = rawCat
    const subcat = typeof resolvedParams.subcat === 'string' ? resolvedParams.subcat : 'all'
    const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
    const s = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'name-asc'
    const min = typeof resolvedParams.min === 'string' ? resolvedParams.min : ''
    const max = typeof resolvedParams.max === 'string' ? resolvedParams.max : ''
    const stock = resolvedParams.stock === 'true' || resolvedParams.stock === '1'
    const pageRaw = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1'
    const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

    const sort = (['name-asc', 'name-desc', 'price-asc', 'price-desc', 'newest'] as const).includes(s as any) 
        ? (s as SortValue) 
        : 'name-asc'

    let categories: any[] = []
    let productsData: { productos: any[]; totalCount: number } = { productos: [], totalCount: 0 }
    let hasError = false

    try {
        // Fetch data in parallel
        // listCategories y listProducts ahora están internamente cacheados con unstable_cache
        const [cats, prods] = await Promise.all([
            listCategories(),
            listProducts({
                cat,
                subcat,
                q,
                sort,
                min,
                max,
                stock,
                page,
                pageSize: 20
            })
        ])
        categories = cats
        productsData = prods
    } catch (error) {
        console.error("Error loading products page:", error)
        hasError = true
    }

    if (hasError) {
        // Fallback en caso de error crítico
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Lo sentimos, hubo un error al cargar el catálogo.</h2>
                <p className="text-muted-foreground mb-8">Estamos trabajando para solucionarlo. Por favor, intenta recargar la página.</p>
                <Link 
                    href="/productos"
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors inline-block"
                >
                    Reintentar
                </Link>
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <ProductosClient 
                initialProducts={productsData.productos}
                initialTotalCount={productsData.totalCount}
                initialCategories={categories}
                initialParams={{
                    cat,
                    subcat,
                    q,
                    sort,
                    min,
                    max,
                    stock,
                    page
                }}
            />
        </Suspense>
    )
}
