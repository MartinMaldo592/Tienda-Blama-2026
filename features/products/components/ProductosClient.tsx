"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, Search, X, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
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

interface ProductosClientProps {
    initialProducts: Product[]
    initialTotalCount: number
    initialCategories: Category[]
    initialParams: {
        cat: string
        subcat: string
        q: string
        sort: SortValue
        min: string
        max: string
        stock: boolean
        page: number
    }
}

export function ProductosClient({
    initialProducts,
    initialTotalCount,
    initialCategories,
    initialParams
}: ProductosClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // Local state for immediate UI feedback (search query)
    const [searchQuery, setSearchQuery] = useState(initialParams.q)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    // Synchronize local search query with URL if it changes externally
    useEffect(() => {
        setSearchQuery(initialParams.q)
    }, [initialParams.q])

    const updateUrl = (next: Record<string, string | undefined>, mode: 'push' | 'replace' = 'replace') => {
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
        
        startTransition(() => {
            if (mode === 'push') {
                router.push(href)
            } else {
                router.replace(href)
            }
        })
    }

    // Debounced search
    useEffect(() => {
        const handle = setTimeout(() => {
            if (searchQuery !== initialParams.q) {
                updateUrl({ q: searchQuery || undefined, page: undefined }, 'replace')
            }
        }, 400)
        return () => clearTimeout(handle)
    }, [searchQuery, initialParams.q])

    const { cat: selectedCategory, subcat: selectedSubcategory, sort, min: minPrice, max: maxPrice, stock: onlyInStock, page: currentPage } = initialParams
    const totalPages = Math.max(1, Math.ceil(initialTotalCount / (initialParams.page > 0 ? 20 : 20))) // Assume 20 for now
    // Note: The original code had a dynamic pageSize based on window size. 
    // In a Server Component world, we should probably stick to a consistent pageSize or pass it as a param.
    const pageSize = 20 

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 pt-10 pb-6 text-center">
                <h1 className="text-3xl font-bold">Productos</h1>
            </div>

            <div className="container mx-auto px-4 pb-8">
                {/* Search Bar */}
                <div className="mb-6 max-w-xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isPending && (
                            <div className="absolute right-3 top-3">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center border-b border-border pb-4 mb-6">
                    {/* Mobile Filters Drawer */}
                    <div className="lg:hidden mb-4 w-full">
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
                                                onClick={() => updateUrl({ cat: undefined, subcat: undefined, page: undefined })}
                                                className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === "all" ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                            >
                                                Todas
                                            </button>
                                            {initialCategories.filter(c => !c.parent_id).map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => updateUrl({ cat: cat.id.toString(), subcat: undefined, page: undefined })}
                                                    className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === cat.id.toString() ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                                >
                                                    {cat.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subcategories */}
                                    {selectedCategory !== 'all' && (
                                        <div className="space-y-2 pt-2 border-t">
                                            <h3 className="text-sm font-semibold">Subcategoría</h3>
                                            <div className="grid gap-1 pl-2">
                                                <button
                                                    onClick={() => updateUrl({ subcat: undefined, page: undefined })}
                                                    className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${selectedSubcategory === "all" ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                                                >
                                                    Todas
                                                </button>
                                                {initialCategories.filter(c => c.parent_id?.toString() === selectedCategory).map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => updateUrl({ subcat: cat.id.toString(), page: undefined })}
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
                                                    defaultValue={minPrice}
                                                    onBlur={(e) => updateUrl({ min: e.target.value || undefined, page: undefined }, 'push')}
                                                />
                                                <span className="text-muted-foreground">-</span>
                                                <Input
                                                    placeholder="Max"
                                                    className="h-9"
                                                    defaultValue={maxPrice}
                                                    onBlur={(e) => updateUrl({ max: e.target.value || undefined, page: undefined }, 'push')}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="mobile-stock-filter"
                                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                checked={onlyInStock}
                                                onChange={(e) => updateUrl({ stock: e.target.checked ? '1' : undefined, page: undefined }, 'push')}
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

                        {/* Desktop Category Filter */}
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
                                <>
                                    <div className="absolute top-full left-0 pt-2 w-56 z-20">
                                        <div className="bg-white border border-border shadow-lg rounded-md p-2">
                                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                                <button
                                                    onClick={() => {
                                                        updateUrl({ cat: undefined, subcat: undefined, page: undefined })
                                                        setActiveFilter(null)
                                                    }}
                                                    className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedCategory === "all" ? "bg-accent/50 font-medium" : ""}`}
                                                >
                                                    Todas
                                                </button>
                                                {initialCategories.filter(c => !c.parent_id).map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            updateUrl({ cat: cat.id.toString(), subcat: undefined, page: undefined })
                                                            setActiveFilter(null)
                                                        }}
                                                        className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedCategory === cat.id.toString() ? "bg-accent/50 font-medium" : ""}`}
                                                    >
                                                        {cat.nombre}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveFilter(null)} />
                                </>
                            )}
                        </div>

                        {/* Desktop Subcategory Filter */}
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
                                    <>
                                        <div className="absolute top-full left-0 pt-2 w-56 z-20">
                                            <div className="bg-white border border-border shadow-lg rounded-md p-2">
                                                <div className="space-y-1 max-h-60 overflow-y-auto">
                                                    <button
                                                        onClick={() => {
                                                            updateUrl({ subcat: undefined, page: undefined })
                                                            setActiveFilter(null)
                                                        }}
                                                        className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedSubcategory === "all" ? "bg-accent/50 font-medium" : ""}`}
                                                    >
                                                        Todas
                                                    </button>
                                                    {initialCategories.filter(c => c.parent_id?.toString() === selectedCategory).map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => {
                                                                updateUrl({ subcat: cat.id.toString(), page: undefined })
                                                                setActiveFilter(null)
                                                            }}
                                                            className={`w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-accent ${selectedSubcategory === cat.id.toString() ? "bg-accent/50 font-medium" : ""}`}
                                                        >
                                                            {cat.nombre}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fixed inset-0 z-10" onClick={() => setActiveFilter(null)} />
                                    </>
                                )}
                            </div>
                        )}

                        {/* Desktop Stock Filter */}
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
                                <>
                                    <div className="absolute top-full left-0 pt-2 w-48 z-20">
                                        <div className="bg-white border border-border shadow-lg rounded-md p-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="stock-filter"
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    checked={onlyInStock}
                                                    onChange={(e) => updateUrl({ stock: e.target.checked ? '1' : undefined, page: undefined }, 'push')}
                                                />
                                                <label htmlFor="stock-filter" className="text-sm cursor-pointer select-none">
                                                    Solo en stock
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveFilter(null)} />
                                </>
                            )}
                        </div>

                        {/* Desktop Price Filter */}
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
                                <>
                                    <div className="absolute top-full left-0 pt-2 w-64 z-20">
                                        <div className="bg-white border border-border shadow-lg rounded-md p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="space-y-1 flex-1">
                                                    <label className="text-xs text-muted-foreground">Mín</label>
                                                    <Input
                                                        className="h-8 text-xs"
                                                        placeholder="0"
                                                        defaultValue={minPrice}
                                                        onBlur={(e) => updateUrl({ min: e.target.value || undefined, page: undefined }, 'push')}
                                                    />
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <label className="text-xs text-muted-foreground">Máx</label>
                                                    <Input
                                                        className="h-8 text-xs"
                                                        placeholder="9999"
                                                        defaultValue={maxPrice}
                                                        onBlur={(e) => updateUrl({ max: e.target.value || undefined, page: undefined }, 'push')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveFilter(null)} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sort & Count */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium whitespace-nowrap">Ordenar por:</span>
                            <Select
                                value={sort}
                                onValueChange={(v) => updateUrl({ sort: v as SortValue }, 'replace')}
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
                            {initialTotalCount} productos
                        </span>
                    </div>
                </div>

                {/* Active Filters Badges */}
                {(selectedCategory !== "all" || onlyInStock || minPrice || maxPrice || initialParams.q) && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {initialParams.q && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => setSearchQuery("")}
                            >
                                Búsqueda: {initialParams.q}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {selectedCategory !== "all" && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => updateUrl({ cat: undefined, subcat: undefined, page: undefined })}
                            >
                                Categoría: {initialCategories.find(c => c.id.toString() === selectedCategory)?.nombre}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {selectedSubcategory !== "all" && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => updateUrl({ subcat: undefined, page: undefined })}
                            >
                                Sub: {initialCategories.find(c => c.id.toString() === selectedSubcategory)?.nombre}
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        {onlyInStock && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs rounded-full gap-1"
                                onClick={() => updateUrl({ stock: undefined, page: undefined }, 'push')}
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
                                onClick={() => updateUrl({ min: undefined, max: undefined, page: undefined }, 'push')}
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
                                updateUrl({ cat: undefined, subcat: undefined, q: undefined, stock: undefined, min: undefined, max: undefined, page: undefined }, 'replace')
                            }}
                        >
                            Limpiar todo
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {initialTotalCount === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No se encontraron productos.</p>
                            {initialParams.q && (
                                <Button variant="link" onClick={() => setSearchQuery("")}>
                                    Limpiar búsqueda
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                            {initialProducts.map((producto, idx) => (
                                <ProductCard key={producto.id} product={producto as any} imagePriority={idx < 4} />
                            ))}
                        </div>
                    )}

                    {initialTotalCount > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-10">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => updateUrl({ page: String(Math.max(1, currentPage - 1)) }, 'push')}
                            >
                                Anterior
                            </Button>

                            {/* Pagination Logic */}
                            {Array.from({ length: totalPages }).slice(0, 10).map((_, idx) => {
                                const p = idx + 1
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
        </div>
    )
}
