import { Suspense } from "react"
import { listCategories, listProducts } from "@/features/products/services/products.server"
import type { SortValue } from "@/features/products/types"
import { ProductosClient } from "@/features/products/components/ProductosClient"

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
    
    // Parse params
    const cat = (resolvedParams.cat as string) ?? 'all'
    const subcat = (resolvedParams.subcat as string) ?? 'all'
    const q = (resolvedParams.q as string) ?? ''
    const s = (resolvedParams.sort as string) ?? 'name-asc'
    const min = (resolvedParams.min as string) ?? ''
    const max = (resolvedParams.max as string) ?? ''
    const stock = resolvedParams.stock === '1'
    const pageRaw = (resolvedParams.page as string) ?? '1'
    const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

    const sort = (['name-asc', 'name-desc', 'price-asc', 'price-desc', 'newest'] as const).includes(s as any) 
        ? (s as SortValue) 
        : 'name-asc'

    try {
        // Fetch data in parallel
        // listCategories y listProducts ahora están internamente cacheados con unstable_cache
        const [categories, productsData] = await Promise.all([
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

        return (
            <Suspense fallback={<div className="p-6 text-center text-muted-foreground min-h-screen">Cargando catálogo...</div>}>
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
    } catch (error) {
        console.error("Error loading products page:", error)
        // Fallback en caso de error crítico
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Lo sentimos, hubo un error al cargar el catálogo.</h2>
                <p className="text-muted-foreground mb-8">Estamos trabajando para solucionarlo. Por favor, intenta recargar la página.</p>
                <a 
                    href="/productos"
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors inline-block"
                >
                    Reintentar
                </a>
            </div>
        )
    }
}
