"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useCartStore } from "@/features/cart"
import { Button } from "@/components/ui/button"

import Link from "next/link"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { formatCurrency, slugify } from "@/lib/utils"
import { Filter, Minus, Plus, Search, ShoppingCart, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { listCategories, listProducts } from "@/features/products/services/products.client"
import type { Category, Product, SortValue } from "@/features/products/types"

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

    const { addItem, items, updateQuantity } = useCartStore()

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
        const q = sp.get('q') ?? ''
        const s = (sp.get('sort') ?? 'name-asc') as SortValue
        const min = sp.get('min') ?? ''
        const max = sp.get('max') ?? ''
        const stock = sp.get('stock') === '1'
        const pageRaw = sp.get('page') ?? '1'
        const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)
        return {
            cat,
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





    const getItemQuantity = (productId: number) => {
        const qty = items
            .filter((i: any) => i.id === productId)
            .reduce((sum: number, it: any) => sum + Number(it.quantity || 0), 0)
        return qty
    }

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
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium">Filtrar:</span>

                        {/* Category Filter Dropdown */}
                        <div className="relative">
                            <Button
                                variant={activeFilter === 'cat' || selectedCategory !== 'all' ? "default" : "outline"}
                                size="sm"
                                className="gap-2 h-9"
                                onClick={() => setActiveFilter(activeFilter === 'cat' ? null : 'cat')}
                            >
                                Categoría <Filter className="h-3 w-3" />
                            </Button>
                            {/* Dropdown Container */}
                            {activeFilter === 'cat' && (
                                <div className="absolute top-full left-0 pt-2 w-56 z-20">
                                    <div className="bg-white border border-border shadow-lg rounded-md p-2">
                                        <div className="space-y-1 max-h-60 overflow-y-auto">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory("all");
                                                    updateUrl({ cat: undefined, page: undefined }, 'replace');
                                                    setActiveFilter(null);
                                                }}
                                                className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedCategory === "all" ? "bg-accent/50 font-medium" : ""}`}
                                            >
                                                Todas
                                            </button>
                                            {categorias.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setSelectedCategory(cat.id.toString());
                                                        updateUrl({ cat: cat.id.toString(), page: undefined }, 'replace');
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
                                    updateUrl({ cat: undefined, page: undefined }, 'replace')
                                }}
                            >
                                Categoría: {categorias.find(c => c.id.toString() === selectedCategory)?.nombre || selectedCategory}
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
                                setOnlyInStock(false)
                                setMinPrice("")
                                setMaxPrice("")
                                updateUrl({ cat: undefined, q: undefined, stock: undefined, min: undefined, max: undefined, page: undefined }, 'replace')
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {productos.map((producto) => {
                            const quantity = getItemQuantity(producto.id)
                            const hasVideo = Array.isArray((producto as any).videos) && ((producto as any).videos as any[]).filter(Boolean).length > 0

                            return (
                                <div key={producto.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden group hover:shadow-lg transition-all">
                                    {/* Image */}
                                    <div className="aspect-square bg-popover relative overflow-hidden">
                                        <Link href={`/productos/${slugify(producto.nombre)}-${producto.id}`} className="absolute inset-0">
                                            {((Array.isArray((producto as any).imagenes) && ((producto as any).imagenes as string[]).filter(Boolean).length > 0) || producto.imagen_url) ? (
                                                <ProductImageCarousel
                                                    images={
                                                        (Array.isArray((producto as any).imagenes)
                                                            ? (((producto as any).imagenes as string[]) || []).filter(Boolean).slice(0, 10)
                                                            : producto.imagen_url
                                                                ? [producto.imagen_url]
                                                                : [])
                                                    }
                                                    alt={producto.nombre}
                                                    className="group-hover:scale-105 transition-transform duration-300"
                                                    autoPlay
                                                    intervalMs={2500}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </Link>
                                        {producto.stock <= 0 && (
                                            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                                                <span className="text-sidebar-primary-foreground font-bold">Agotado</span>
                                            </div>
                                        )}

                                        {hasVideo && (
                                            <div className="absolute left-2 bottom-2">
                                                <span className="inline-flex items-center rounded-full bg-black/70 px-2 py-1 text-[11px] font-bold text-white">
                                                    Video
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <Link href={`/productos/${slugify(producto.nombre)}-${producto.id}`} className="hover:underline">
                                            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{producto.nombre}</h3>
                                        </Link>
                                        <p className="text-xl font-bold text-primary mb-3">{formatCurrency(producto.precio)}</p>

                                        {producto.stock > 0 ? (
                                            quantity === 0 ? (
                                                <Button
                                                    className="w-full gap-2"
                                                    onClick={() => addItem(producto)}
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    Agregar
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-between bg-popover rounded-lg p-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(producto.id, quantity - 1, null)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="font-bold">{quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(producto.id, quantity + 1, null)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        ) : (
                                            <Button disabled className="w-full">
                                                Sin Stock
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
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
