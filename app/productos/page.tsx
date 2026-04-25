import { Suspense } from "react"
import { listCategories, listProducts } from "@/features/products/services/products.server"
import type { SortValue } from "@/features/products/types"
import { ProductosClient } from "@/features/products/components/ProductosClient"

export const metadata = {
    title: 'Productos | Tienda Blama',
    description: 'Explora nuestra amplia gama de productos en Tienda Blama. Calidad y mejores precios en un solo lugar.',
}

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

    // Fetch data in parallel
    const [categories, { productos, totalCount }] = await Promise.all([
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
                initialProducts={productos}
                initialTotalCount={totalCount}
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
