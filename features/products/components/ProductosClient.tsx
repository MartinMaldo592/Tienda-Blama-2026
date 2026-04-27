
"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, Search, X, Loader2, Grid2X2, SlidersHorizontal, ChevronRight } from "lucide-react"
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
import { m, AnimatePresence } from "framer-motion"

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

    const [searchQuery, setSearchQuery] = useState(initialParams.q)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

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

    useEffect(() => {
        const handle = setTimeout(() => {
            if (searchQuery !== initialParams.q) {
                updateUrl({ q: searchQuery || undefined, page: undefined }, 'replace')
            }
        }, 400)
        return () => clearTimeout(handle)
    }, [searchQuery, initialParams.q])

    const { cat: selectedCategory, subcat: selectedSubcategory, sort, min: minPrice, max: maxPrice, stock: onlyInStock, page: currentPage } = initialParams
    const totalPages = Math.max(1, Math.ceil(initialTotalCount / 20))
    const pageSize = 20 

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* --- HERO HEADER --- */}
            <div className="relative pt-20 pb-16 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-px w-8 bg-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Catálogo Exclusivo</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
                            Nuestra <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Colección.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                            Explora piezas seleccionadas por su diseño, calidad y carácter. Objetos que cuentan una historia en cada detalle.
                        </p>
                    </m.div>
                </div>
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
            </div>

            <div className="container mx-auto px-6 pb-20">
                {/* --- CONTROLS BAR --- */}
                <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-4 mb-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Field */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Busca tu próximo favorito..."
                                className="h-12 pl-11 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filters & Sort Row */}
                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                            {/* Mobile Sheet Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="lg:hidden h-12 rounded-2xl gap-2 px-6 border-slate-200">
                                        <SlidersHorizontal size={16} /> Filtros
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full sm:max-w-md rounded-l-[3rem] p-8 border-none shadow-2xl">
                                    <SheetHeader className="mb-8">
                                        <SheetTitle className="text-3xl font-black text-slate-900 tracking-tight">Refinar Búsqueda</SheetTitle>
                                        <SheetDescription className="font-medium">Personaliza tu experiencia de navegación.</SheetDescription>
                                    </SheetHeader>
                                    {/* ... mobile filter content (simplified for brevity or reused logic) ... */}
                                </SheetContent>
                            </Sheet>

                            <div className="hidden lg:flex items-center gap-2">
                                <Button
                                    variant={selectedCategory !== 'all' ? 'default' : 'outline'}
                                    className="h-12 rounded-2xl gap-2 px-6 transition-all border-slate-200"
                                    onClick={() => setActiveFilter(activeFilter === 'cat' ? null : 'cat')}
                                >
                                    <Grid2X2 size={16} /> Categorías
                                </Button>
                                {/* Add more filters as elegant dropdowns or buttons */}
                            </div>

                            <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block" />

                            <Select
                                value={sort}
                                onValueChange={(v) => updateUrl({ sort: v as SortValue }, 'replace')}
                            >
                                <SelectTrigger className="h-12 w-[220px] rounded-2xl border-slate-200 font-bold bg-white focus:ring-4 focus:ring-blue-600/5 transition-all">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                    <SelectItem value="name-asc" className="rounded-xl my-1">Alfabéticamente (A-Z)</SelectItem>
                                    <SelectItem value="name-desc" className="rounded-xl my-1">Alfabéticamente (Z-A)</SelectItem>
                                    <SelectItem value="price-asc" className="rounded-xl my-1">Precio: Menor a Mayor</SelectItem>
                                    <SelectItem value="price-desc" className="rounded-xl my-1">Precio: Mayor a Menor</SelectItem>
                                    <SelectItem value="newest" className="rounded-xl my-1">Recién Llegados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* --- ACTIVE BADGES --- */}
                <AnimatePresence>
                    {(selectedCategory !== "all" || onlyInStock || minPrice || maxPrice || initialParams.q) && (
                        <m.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap items-center gap-2 mb-8 overflow-hidden"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Filtros Activos:</span>
                            {/* Filter badges ... */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50"
                                onClick={() => updateUrl({ cat: undefined, subcat: undefined, q: undefined, stock: undefined, min: undefined, max: undefined, page: undefined }, 'replace')}
                            >
                                Limpiar Todo
                            </Button>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* --- PRODUCTS GRID --- */}
                <div className={`transition-all duration-700 ${isPending ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}>
                    {initialTotalCount === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-300">
                            <Search size={60} strokeWidth={1} />
                            <p className="text-xl font-medium">No encontramos lo que buscas.</p>
                        </div>
                    ) : (
                        <m.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6 md:gap-10"
                        >
                            {initialProducts.map((producto, idx) => (
                                <ProductCard key={producto.id} product={producto as any} imagePriority={idx < 4} />
                            ))}
                        </m.div>
                    )}

                    {/* --- PAGINATION --- */}
                    {initialTotalCount > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-20">
                            <Button
                                variant="outline"
                                className="h-12 w-12 rounded-2xl border-slate-200"
                                disabled={currentPage <= 1}
                                onClick={() => updateUrl({ page: String(Math.max(1, currentPage - 1)) }, 'push')}
                            >
                                <X size={16} className="rotate-45" />
                            </Button>

                            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[1.5rem]">
                                {Array.from({ length: totalPages }).map((_, idx) => {
                                    const p = idx + 1
                                    if (p > 5 && p < totalPages) return null
                                    if (p === 6) return <span key="dots" className="px-2 text-slate-400">...</span>
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => updateUrl({ page: p === 1 ? undefined : String(p) }, 'push')}
                                            className={`h-10 px-4 rounded-xl text-sm font-bold transition-all ${p === currentPage ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                        >
                                            {p}
                                        </button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                className="h-12 w-12 rounded-2xl border-slate-200"
                                disabled={currentPage >= totalPages}
                                onClick={() => updateUrl({ page: String(Math.min(totalPages, currentPage + 1)) }, 'push')}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
