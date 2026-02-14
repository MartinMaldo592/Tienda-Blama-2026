"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useCartStore } from "@/features/cart"
import { Button } from "@/components/ui/button"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { listCategories, listProducts } from "@/features/products/services/products.client"
import type { Category, Product, SortValue } from "@/features/products/types"
import { ProductCard } from "@/components/product-card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function ProductosPage() {
    return (
        <Suspense fallback={<div className="p-6 text-muted-foreground">Cargando...</div>}>
            <ProductosPageContent />
        </Suspense>
    )
}

function ProductosPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchParamsString = searchParams?.toString() ?? ''

    const [productos, setProductos] = useState<Product[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)

    const [categorias, setCategorias] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sort, setSort] = useState<SortValue>('name-asc')
    const [minPrice, setMinPrice] = useState<string>('')
    const [maxPrice, setMaxPrice] = useState<string>('')
    const [onlyInStock, setOnlyInStock] = useState<boolean>(false)


    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(max-width: 767px)').matches
    })
    const [activeFilter, setActiveFilter] = useState<string | null>(null)


    const [pageSize, setPageSize] = useState<number>(() => {
        if (typeof window === 'undefined') return 20
        return window.matchMedia('(max-width: 767px)').matches ? 12 : 20
    })

    const { items } = useCartStore()

    useEffect(() => {
        let active = true
            ; (async () => {
                const categoriasData = await listCategories()
                if (active) setCategorias((categoriasData as Category[]) || [])
            })()
        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        function updatePageSize() {
            if (typeof window === 'undefined') return
            const isMobile = window.matchMedia('(max-width: 767px)').matches
            const next = isMobile ? 12 : 20
            setPageSize((prev) => (prev === next ? prev : next))
            setIsMobile(isMobile)
        }

        updatePageSize()
        if (typeof window === 'undefined') return

        window.addEventListener('resize', updatePageSize)
        return () => window.removeEventListener('resize', updatePageSize)
    }, [])



    async function fetchData(opts: {
        cat: string
        subcat?: string
        q: string
        sort: SortValue
        min: string
        max: string
        stock: boolean
        page: number
    }) {
        setLoading(true)

        const { productos, totalCount } = await listProducts({
            cat: opts.cat,
            subcat: opts.subcat,
            q: opts.q,
            sort: opts.sort,
            min: opts.min,
            max: opts.max,
            stock: opts.stock,
            page: opts.page,
            pageSize,
        })

        setProductos(productos)
        setTotalCount(totalCount)

        setLoading(false)
    }

    function updateUrl(next: Record<string, string | undefined>, mode: 'push' | 'replace' = 'replace') {
        const params = new URLSearchParams(searchParams?.toString())
        for (const [key, value] of Object.entries(next)) {
            if (!value) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        }
        const qs = params.toString()
        const href = qs ? `/productos?${qs}` : '/productos'
        if (mode === 'push') {
            router.push(href)
        } else {
            router.replace(href)
        }
    }

    const appliedFromUrl = useMemo(() => {
        const sp = new URLSearchParams(searchParamsString)
        const cat = sp.get('cat') ?? 'all'
        const subcat = sp.get('subcat') ?? 'all'
        const q = sp.get('q') ?? ''
        const s = (sp.get('sort') ?? 'name-asc') as SortValue
        const min = sp.get('min') ?? ''
        const max = sp.get('max') ?? ''
        const stock = sp.get('stock') === '1'
        const pageRaw = sp.get('page') ?? '1'
        const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)
        return {
            cat,
            subcat,
            q,
            sort: (['name-asc', 'name-desc', 'price-asc', 'price-desc', 'newest'] as const).includes(s) ? s : 'name-asc',
            min,
            max,
            stock,
            page,
        }
    }, [searchParamsString])

    useEffect(() => {
        fetchData(appliedFromUrl)
    }, [appliedFromUrl, pageSize])

    useEffect(() => {
        setSelectedCategory(appliedFromUrl.cat || 'all')
        setSelectedSubcategory(appliedFromUrl.subcat || 'all')
        setSearchQuery(appliedFromUrl.q || '')
        setSort(appliedFromUrl.sort)
        setMinPrice(appliedFromUrl.min || '')
        setMaxPrice(appliedFromUrl.max || '')
        setOnlyInStock(Boolean(appliedFromUrl.stock))
    }, [appliedFromUrl])

    useEffect(() => {
        const handle = setTimeout(() => {
            updateUrl({ q: searchQuery || undefined, page: undefined }, 'replace')
        }, 250)
        return () => clearTimeout(handle)
    }, [searchQuery])



    const currentPage = appliedFromUrl.page
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

    useEffect(() => {
        if (currentPage > totalPages) {
            updateUrl({ page: undefined }, 'replace')
        }
    }, [currentPage, totalPages])




    return (
        <div className="min-h-screen bg-background">
            {/* Simple Header */}
            <div className="container mx-auto px-4 pt-10 pb-6 text-center">
                <h1 className="text-3xl font-bold">Productos</h1>
            </div>

            <div className="container mx-auto px-4 pb-8">
                {/* Search Bar (Full Width) */}
                <div className="mb-6 max-w-xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center border-b border-border pb-4 mb-6">
                    {/* Left: Filters */}

                    {/* Mobile Filters Drawer */}
                    <div className="lg:hidden mb-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2 w-full justify-between">
                                    <span className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" /> Filtros
                                    </span>
                                    {(selectedCategory !== "all" || onlyInStock || minPrice || maxPrice) && (
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] overflow-y-auto">
                                <SheetHeader className="mb-4">
                                    <SheetTitle>Filtros</SheetTitle>
                                    <SheetDescription>Refina tu búsqueda</SheetDescription>
                                </SheetHeader>

                                <div className="space-y-6">
                                    {/* Categories */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold">Categoría</h3>
                                        <div className="grid gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory("all")
                                                    setSelectedSubcategory("all")
                                                    updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace')
                                                }}
                                                className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === "all" ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                            >
                                                Todas
                                            </button>
                                            {categorias.filter(c => !c.parent_id).map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setSelectedCategory(cat.id.toString())
                                                        setSelectedSubcategory("all")
                                                        updateUrl({ cat: cat.id.toString(), subcat: undefined, page: undefined }, 'replace')
                                                    }}
                                                    className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === cat.id.toString() ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                                >
                                                    {cat.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subcategories (Conditional) */}
                                    {selectedCategory !== 'all' && (
                                        <div className="space-y-2 pt-2 border-t">
                                            <h3 className="text-sm font-semibold">Subcategoría</h3>
                                            <div className="grid gap-1 pl-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubcategory("all")
                                                        updateUrl({ subcat: undefined, page: undefined }, 'replace')
                                                    }}
                                                    className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedSubcategory === "all" ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                                >
                                                    Todas
                                                </button>
                                                {categorias.filter(c => c.parent_id?.toString() === selectedCategory).map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setSelectedSubcategory(cat.id.toString())
                                                            updateUrl({ subcat: cat.id.toString(), page: undefined }, 'replace')
                                                        }}
                                                        className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedSubcategory === cat.id.toString() ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                                    >
                                                        {cat.nombre}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price and Stock */}
                                    <div className="space-y-4 pt-2 border-t">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold">Precio</h3>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Min"
                                                    className="h-9"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(e.target.value)}
                                                    onBlur={() => updateUrl({ min: minPrice || undefined, page: undefined }, 'push')}
                                                />
                                                <span className="text-muted-foreground">-</span>
                                                <Input
                                                    placeholder="Max"
                                                    className="h-9"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(e.target.value)}
                                                    onBlur={() => updateUrl({ max: maxPrice || undefined, page: undefined }, 'push')}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="mobile-stock-filter"
                                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                checked={onlyInStock}
                                                onChange={(e) => {
                                                    const val = e.target.checked
                                                    setOnlyInStock(val)
                                                    updateUrl({ stock: val ? '1' : undefined, page: undefined }, 'push')
                                                }}
                                            />
                                            <label htmlFor="mobile-stock-filter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Solo en stock
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="hidden lg:flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium">Filtrar:</span>

                        {/* Parent Category Filter Dropdown */}
                        <div className="relative">
                            <Button
                                variant={activeFilter === 'cat' || selectedCategory !== 'all' ? "default" : "outline"}
                                size="sm"
                                className="gap-2 h-9"
                                onClick={() => setActiveFilter(activeFilter === 'cat' ? null : 'cat')}
                            >
                                Categoría <Filter className="h-3 w-3" />
                            </Button>
                            {activeFilter === 'cat' && (
                                <div className="absolute top-full left-0 pt-2 w-56 z-20">
                                    <div className="bg-white border border-border shadow-lg rounded-md p-2">
                                        <div className="space-y-1 max-h-60 overflow-y-auto">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory("all");
                                                    setSelectedSubcategory("all");
                                                    updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace');
                                                    setActiveFilter(null);
                                                }}
                                                className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedCategory === "all" ? "bg-accent/50 font-medium" : ""}`}
                                            >
                                                Todas
                                            </button>
                                            {categorias.filter(c => !c.parent_id).map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setSelectedCategory(cat.id.toString());
                                                        setSelectedSubcategory("all");
                                                        updateUrl({ cat: cat.id.toString(), subcat: undefined, page: undefined }, 'replace');
                                                        setActiveFilter(null);
                                                    }}
                                                    className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedCategory === cat.id.toString() ? "bg-accent/50 font-medium" : ""}`}
                                                >
                                                    {cat.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Subcategory Filter Dropdown - Only visible if parent category selected */}
                        {selectedCategory !== 'all' && (
                            <div className="relative">
                                <Button
                                    variant={activeFilter === 'subcat' || selectedSubcategory !== 'all' ? "default" : "outline"}
                                    size="sm"
                                    className="gap-2 h-9"
                                    onClick={() => setActiveFilter(activeFilter === 'subcat' ? null : 'subcat')}
                                >
                                    Subcategoría <Filter className="h-3 w-3" />
                                </Button>
                                {activeFilter === 'subcat' && (
                                    <div className="absolute top-full left-0 pt-2 w-56 z-20">
                                        <div className="bg-white border border-border shadow-lg rounded-md p-2">
                                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubcategory("all");
                                                        updateUrl({ subcat: undefined, page: undefined }, 'replace');
                                                        setActiveFilter(null);
                                                    }}
                                                    className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedSubcategory === "all" ? "bg-accent/50 font-medium" : ""}`}
                                                >
                                                    Todas
                                                </button>
                                                {categorias
                                                    .filter(c => c.parent_id?.toString() === selectedCategory)
                                                    .map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => {
                                                                setSelectedSubcategory(cat.id.toString());
                                                                updateUrl({ subcat: cat.id.toString(), page: undefined }, 'replace');
                                                                setActiveFilter(null);
                                                            }}
                                                            className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedSubcategory === cat.id.toString() ? "bg-accent/50 font-medium" : ""}`}
                                                        >
                                                            {cat.nombre}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Availability Filter Dropdown */}
                        <div className="relative">
                            <Button
                                variant={activeFilter === 'stock' || onlyInStock ? "default" : "outline"}
                                size="sm"
                                className="gap-2 h-9"
                                onClick={() => setActiveFilter(activeFilter === 'stock' ? null : 'stock')}
                            >
                                Disponibilidad <Filter className="h-3 w-3" />
                            </Button>
                            {activeFilter === 'stock' && (
                                <div className="absolute top-full left-0 pt-2 w-48 z-20">
                                    <div className="bg-white border border-border shadow-lg rounded-md p-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="stock-filter"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={onlyInStock}
                                                onChange={(e) => {
                                                    const val = e.target.checked
                                                    setOnlyInStock(val)
                                                    updateUrl({ stock: val ? '1' : undefined, page: undefined }, 'push')
                                                }}
                                            />
                                            <label htmlFor="stock-filter" className="text-sm cursor-pointer select-none">
                                                Solo en stock
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Filter Dropdown */}
                        <div className="relative">
                            <Button
                                variant={activeFilter === 'price' || minPrice || maxPrice ? "default" : "outline"}
                                size="sm"
                                className="gap-2 h-9"
                                onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
                            >
                                Precio <Filter className="h-3 w-3" />
                            </Button>
                            {activeFilter === 'price' && (
                                <div className="absolute top-full left-0 pt-2 w-64 z-20">
                                    <div className="bg-white border border-border shadow-lg rounded-md p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="space-y-1 flex-1">
                                                <label className="text-xs text-muted-foreground">Mín</label>
                                                <Input
                                                    className="h-8 text-xs"
                                                    placeholder="0"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(e.target.value)}
                                                    onBlur={() => updateUrl({ min: minPrice || undefined, page: undefined }, 'push')}
                                                />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <label className="text-xs text-muted-foreground">Máx</label>
                                                <Input
                                                    className="h-8 text-xs"
                                                    placeholder="9999"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(e.target.value)}
                                                    onBlur={() => updateUrl({ max: maxPrice || undefined, page: undefined }, 'push')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Backdrop for closing filters */}
                        {activeFilter && (
                            <div
                                className="fixed inset-0 z-10 bg-transparent"
                                onClick={() => setActiveFilter(null)}
                            />
                        )}
                    </div>

                    {/* Right: Sort & Count */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium whitespace-nowrap">Ordenar por:</span>
                            <Select
                                value={sort}
                                onValueChange={(v) => {
                                    setSort(v as SortValue)
                                    updateUrl({ sort: v as SortValue }, 'replace')
                                }}
                            >
                                <SelectTrigger className="w-[180px] h-9 text-sm">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name-asc">Alfabéticamente, A-Z</SelectItem>
                                    <SelectItem value="name-desc">Alfabéticamente, Z-A</SelectItem>
                                    <SelectItem value="price-asc">Precio, menor a mayor</SelectItem>
                                    <SelectItem value="price-desc">Precio, mayor a menor</SelectItem>
                                    <SelectItem value="newest">Más nuevos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {totalCount} productos
                        </span>
                    </div>
                </div>

                {/* Active Filters Badges */}
                {(selectedCategory !== "all" || onlyInStock || minPrice || maxPrice || searchQuery) && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {searchQuery && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => setSearchQuery("")}
                            >
                                Búsqueda: {searchQuery}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {selectedCategory !== "all" && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => {
                                    setSelectedCategory("all")
                                    setSelectedSubcategory("all")
                                    updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace')
                                }}
                            >
                                Categoría: {categorias.find(c => c.id.toString() === selectedCategory)?.nombre}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {selectedSubcategory !== "all" && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => {
                                    setSelectedSubcategory("all")
                                    updateUrl({ subcat: undefined, page: undefined }, 'replace')
                                }}
                            >
                                Sub: {categorias.find(c => c.id.toString() === selectedSubcategory)?.nombre}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {onlyInStock && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => {
                                    setOnlyInStock(false)
                                    updateUrl({ stock: undefined, page: undefined }, 'push')
                                }}
                            >
                                Solo Stock
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {(minPrice || maxPrice) && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => {
                                    setMinPrice("")
                                    setMaxPrice("")
                                    updateUrl({ min: undefined, max: undefined, page: undefined }, 'push')
                                }}
                            >
                                Precio: {minPrice || '0'} - {maxPrice || '∞'}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedCategory("all")
                                setSelectedSubcategory("all")
                                setOnlyInStock(false)
                                setMinPrice("")
                                setMaxPrice("")
                                updateUrl({ cat: undefined, subcat: undefined, q: undefined, stock: undefined, min: undefined, max: undefined, page: undefined }, 'replace')
                            }}
                        >
                            Limpiar todo
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Cargando productos...</p>
                    </div>
                ) : totalCount === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No se encontraron productos.</p>
                        {searchQuery && (
                            <Button variant="link" onClick={() => setSearchQuery("")}>
                                Limpiar búsqueda
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                        {productos.map((producto, idx) => (
                            <ProductCard key={producto.id} product={producto as any} imagePriority={idx < 4} />
                        ))}
                    </div>
                )}

                {!loading && totalCount > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => updateUrl({ page: String(Math.max(1, currentPage - 1)) }, 'push')}
                        >
                            Anterior
                        </Button>

                        {Array.from({ length: totalPages }).slice(0, 100).map((_, idx) => {
                            const p = idx + 1
                            const isEdge = p === 1 || p === totalPages
                            const near = Math.abs(p - currentPage) <= 1

                            if (!isEdge && !near) {
                                if (p === 2 && currentPage > 3) {
                                    return (
                                        <span key="gap-left" className="px-2 text-muted-foreground">
                                            …
                                        </span>
                                    )
                                }
                                if (p === totalPages - 1 && currentPage < totalPages - 2) {
                                    return (
                                        <span key="gap-right" className="px-2 text-muted-foreground">
                                            …
                                        </span>
                                    )
                                }
                                return null
                            }

                            return (
                                <Button
                                    key={p}
                                    variant={p === currentPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => updateUrl({ page: p === 1 ? undefined : String(p) }, 'push')}
                                >
                                    {p}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => updateUrl({ page: String(Math.min(totalPages, currentPage + 1)) }, 'push')}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
