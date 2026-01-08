"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useCartStore } from "@/features/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
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
import { countProducts, listCategories, listProducts } from "@/features/products/services/products.client"
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
    const [draftCount, setDraftCount] = useState<number | null>(null)
    const [categorias, setCategorias] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sort, setSort] = useState<SortValue>('name-asc')
    const [minPrice, setMinPrice] = useState<string>('')
    const [maxPrice, setMaxPrice] = useState<string>('')
    const [onlyInStock, setOnlyInStock] = useState<boolean>(false)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [draftCategory, setDraftCategory] = useState<string>('all')
    const [draftSort, setDraftSort] = useState<SortValue>('name-asc')
    const [draftMinPrice, setDraftMinPrice] = useState<string>('')
    const [draftMaxPrice, setDraftMaxPrice] = useState<string>('')
    const [draftOnlyInStock, setDraftOnlyInStock] = useState<boolean>(false)

    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(max-width: 767px)').matches
    })
    const [showAllCategoriesMobile, setShowAllCategoriesMobile] = useState(false)

    const [pageSize, setPageSize] = useState<number>(() => {
        if (typeof window === 'undefined') return 20
        return window.matchMedia('(max-width: 767px)').matches ? 12 : 20
    })

    const { addItem, items, updateQuantity } = useCartStore()

    useEffect(() => {
        let active = true
        ;(async () => {
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

    const visibleCategorias = useMemo(() => {
        if (!isMobile) return categorias

        const limit = 3
        if (showAllCategoriesMobile) return categorias

        const base = categorias.slice(0, limit)
        if (selectedCategory === 'all') return base

        const selected = categorias.find((c) => c.id.toString() === selectedCategory) || null
        if (!selected) return base
        if (base.some((c) => c.id === selected.id)) return base
        return [...base, selected]
    }, [categorias, isMobile, selectedCategory, showAllCategoriesMobile])

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

    useEffect(() => {
        if (!filtersOpen) return
        setDraftCategory(selectedCategory)
        setDraftSort(sort)
        setDraftMinPrice(minPrice)
        setDraftMaxPrice(maxPrice)
        setDraftOnlyInStock(onlyInStock)
    }, [filtersOpen, selectedCategory, sort, minPrice, maxPrice, onlyInStock])

    const currentPage = appliedFromUrl.page
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

    useEffect(() => {
        if (currentPage > totalPages) {
            updateUrl({ page: undefined }, 'replace')
        }
    }, [currentPage, totalPages])

    useEffect(() => {
        if (!filtersOpen) {
            setDraftCount(null)
            return
        }

        const handle = setTimeout(async () => {
            const nextCount = await countProducts({
                cat: draftCategory,
                q: searchQuery,
                min: draftMinPrice,
                max: draftMaxPrice,
                stock: draftOnlyInStock,
            })

            setDraftCount(nextCount)
        }, 250)

        return () => clearTimeout(handle)
    }, [filtersOpen, draftCategory, searchQuery, draftMinPrice, draftMaxPrice, draftOnlyInStock])

    const appliedBadges = useMemo(() => {
        const badges: { key: string; label: string; onClear: () => void }[] = []

        if (draftCategory !== 'all') {
            const catName = categorias.find((c) => c.id.toString() === draftCategory)?.nombre || 'Categoría'
            badges.push({
                key: 'cat',
                label: catName,
                onClear: () => setDraftCategory('all'),
            })
        }
        if (draftMinPrice) {
            badges.push({
                key: 'min',
                label: `Desde $${draftMinPrice}`,
                onClear: () => setDraftMinPrice(''),
            })
        }
        if (draftMaxPrice) {
            badges.push({
                key: 'max',
                label: `Hasta $${draftMaxPrice}`,
                onClear: () => setDraftMaxPrice(''),
            })
        }
        if (draftOnlyInStock) {
            badges.push({
                key: 'stock',
                label: 'Solo en stock',
                onClear: () => setDraftOnlyInStock(false),
            })
        }

        return badges
    }, [categorias, draftCategory, draftMinPrice, draftMaxPrice, draftOnlyInStock])

    const getItemQuantity = (productId: number) => {
        const qty = items
            .filter((i: any) => i.id === productId)
            .reduce((sum: number, it: any) => sum + Number(it.quantity || 0), 0)
        return qty
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-sidebar to-sidebar-primary text-sidebar-primary-foreground py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Catálogo</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explora nuestra selección de productos. Agrega al carrito y realiza tu pedido por WhatsApp.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-4 mb-8">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar productos..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            updateUrl({ q: searchQuery || undefined, page: undefined }, 'push')
                                        }
                                    }}
                                />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 w-full md:w-auto"
                                onClick={() => updateUrl({ q: searchQuery || undefined, page: undefined }, 'push')}
                            >
                                <Search className="h-4 w-4" />
                                Buscar
                            </Button>

                            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="gap-2 w-full md:w-auto">
                                        <Filter className="h-4 w-4" />
                                        Filtrar y ordenar
                                    </Button>
                                </SheetTrigger>
                            <SheetContent side="right" className="p-0">
                                <SheetHeader className="border-b">
                                    <div className="flex items-center justify-between gap-3">
                                        <SheetTitle className="text-base tracking-wide">Filtrar y ordenar</SheetTitle>
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="px-0"
                                            onClick={() => {
                                                setDraftCategory('all')
                                                setDraftSort('name-asc')
                                                setDraftMinPrice('')
                                                setDraftMaxPrice('')
                                                setDraftOnlyInStock(false)
                                            }}
                                        >
                                            Borrar todo
                                        </Button>
                                    </div>
                                </SheetHeader>

                                <div className="px-4 pb-4 space-y-6 overflow-y-auto">
                                    {appliedBadges.length > 0 && (
                                        <div className="pt-4">
                                            <div className="text-sm font-semibold mb-2">Filtros aplicados</div>
                                            <div className="flex flex-wrap gap-2">
                                                {appliedBadges.map((b) => (
                                                    <Badge key={b.key} variant="outline" className="rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-2"
                                                            onClick={b.onClear}
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            <span>{b.label}</span>
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-4 border-t">
                                        <div className="text-sm font-semibold">Ordenar por</div>
                                        <Select value={draftSort} onValueChange={(v) => setDraftSort(v as SortValue)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="name-asc">Nombre: A → Z</SelectItem>
                                                <SelectItem value="name-desc">Nombre: Z → A</SelectItem>
                                                <SelectItem value="price-asc">Precio: menor → mayor</SelectItem>
                                                <SelectItem value="price-desc">Precio: mayor → menor</SelectItem>
                                                <SelectItem value="newest">Más nuevos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t">
                                        <div className="text-sm font-semibold">Categoría de producto</div>
                                        <Select value={draftCategory} onValueChange={setDraftCategory}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                {categorias.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t">
                                        <div className="text-sm font-semibold">Precio</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <div className="text-xs text-muted-foreground">Mínimo</div>
                                                <Input
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    value={draftMinPrice}
                                                    onChange={(e) => setDraftMinPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-muted-foreground">Máximo</div>
                                                <Input
                                                    inputMode="numeric"
                                                    placeholder="9999"
                                                    value={draftMaxPrice}
                                                    onChange={(e) => setDraftMaxPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <button
                                            type="button"
                                            className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                                            onClick={() => setDraftOnlyInStock((v) => !v)}
                                        >
                                            <span className="font-medium">Solo en stock</span>
                                            <span className={draftOnlyInStock ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                                                {draftOnlyInStock ? 'Sí' : 'No'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <SheetFooter className="border-t">
                                    <div className="w-full space-y-2">
                                        <div className="text-sm text-muted-foreground">
                                            {(draftCount ?? totalCount)} artículos encontrados
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                setSelectedCategory(draftCategory)
                                                setSort(draftSort)
                                                setMinPrice(draftMinPrice)
                                                setMaxPrice(draftMaxPrice)
                                                setOnlyInStock(draftOnlyInStock)
                                                updateUrl(
                                                    {
                                                        cat: draftCategory !== 'all' ? draftCategory : undefined,
                                                        sort: draftSort !== 'name-asc' ? draftSort : undefined,
                                                        min: draftMinPrice || undefined,
                                                        max: draftMaxPrice || undefined,
                                                        stock: draftOnlyInStock ? '1' : undefined,
                                                        page: undefined,
                                                    },
                                                    'push'
                                                )
                                                setFiltersOpen(false)
                                            }}
                                        >
                                            Aplicar
                                        </Button>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                            </Sheet>
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={selectedCategory === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory("all")
                                    updateUrl({ cat: undefined, page: undefined }, 'replace')
                                }}
                            >
                                Todos
                            </Button>
                            {visibleCategorias.map(cat => (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.id.toString() ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory(cat.id.toString())
                                        updateUrl({ cat: cat.id.toString(), page: undefined }, 'replace')
                                    }}
                                >
                                    {cat.nombre}
                                </Button>
                            ))}

                            {isMobile && categorias.length > 6 ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={() => setShowAllCategoriesMobile((v) => !v)}
                                >
                                    {showAllCategoriesMobile ? 'Ver menos categorías' : 'Ver más categorías'}
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>

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
