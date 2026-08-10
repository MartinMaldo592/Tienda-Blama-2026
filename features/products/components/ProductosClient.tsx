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
import { Badge } from "@/components/ui/badge"
import { Filter, Search, X, Loader2, Grid2X2, SlidersHorizontal, ChevronRight, Tag } from "lucide-react"
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

    const [localMin, setLocalMin] = useState(initialParams.min)
    const [localMax, setLocalMax] = useState(initialParams.max)

    useEffect(() => {
        setSearchQuery(initialParams.q)
    }, [initialParams.q])

    useEffect(() => {
        setLocalMin(initialParams.min)
    }, [initialParams.min])

    useEffect(() => {
        setLocalMax(initialParams.max)
    }, [initialParams.max])

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

    const activeCatParam = searchParams?.get('categoria') || searchParams?.get('cat') || initialParams.cat
    const activeCategoryObj = initialCategories.find(
        (c) => c.slug === activeCatParam || String(c.id) === activeCatParam
    )

    const categoryHeaderInfo = (() => {
        const slug = activeCategoryObj?.slug || activeCatParam
        if (slug === 'equipamiento-pilates') {
            return {
                badge: "PILATES & HOME WORKOUT 🧘‍♀️",
                title: "Equipamiento & Pilates",
                highlight: "Premium 🧘‍♀️",
                description: "Mats TPE antideslizantes, aros de pilates flex ring, pesas tobilleras y bandas de resistencia diseñadas para potenciar tu entrenamiento en casa o estudio."
            }
        }
        if (slug === 'suplementos-femeninos') {
            return {
                badge: "NUTRICIÓN FEMENINA 💖",
                title: "Suplementación & Nutrición",
                highlight: "Femenina 💖",
                description: "Colágeno hidrolizado enriquecido con biotina, proteína ISO-Whey 0% azúcar, creatina micronizada pura y multivitamínicos para tonificar y cuidar tu piel."
            }
        }
        if (slug === 'accesorios-gym') {
            return {
                badge: "ESTILO DE VIDA GYM 🥤",
                title: "Accesorios & Estilo",
                highlight: "de Vida Gym 🥤",
                description: "Tomatodos térmicos de acero inoxidable, shakers antigrumos, bolsos impermeables duffle bag y scrunchies de satén que elevan tu estilo diario."
            }
        }
        if (slug === 'kits-bundles') {
            return {
                badge: "KITS AHORRO EXCLUSIVOS 🎁",
                title: "Kits & Combos Ahorro",
                highlight: "con Descuento 💖",
                description: "Paquetes completos de entrenamiento y nutrición con descuento directo. La forma más fácil de iniciar o equipar tu rutina con regalos incluidos."
            }
        }
        return {
            badge: "Colección BLAMA ♡",
            title: "Tu Mejor Versión",
            highlight: "Todos los Días. ♡",
            description: "Equipamiento de pilates, resistencia, mats, suplementación femenina y accesorios diseñados para acompañarte a tu propio ritmo, en casa o en el gym."
        }
    })()

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* --- HERO HEADER --- */}
            <div className="relative pt-16 pb-12 overflow-hidden bg-gradient-to-b from-[#FFF7F9] to-[#fafafa]">
                <div className="container mx-auto px-6 relative z-10">
                    <m.div 
                        key={categoryHeaderInfo.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-px w-8 bg-[#FF6FA7]" />
                            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#FF6FA7]">
                                {categoryHeaderInfo.badge}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] leading-[0.98] tracking-tighter mb-4 font-serif">
                            {categoryHeaderInfo.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7]">
                                {categoryHeaderInfo.highlight}
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-[#7C6A72] font-medium leading-relaxed max-w-2xl">
                            {categoryHeaderInfo.description}
                        </p>
                    </m.div>

                    {/* --- QUICK CATEGORY PILLS BAR --- */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-8 no-scrollbar">
                        <button
                            type="button"
                            onClick={() => updateUrl({ cat: undefined, categoria: undefined, subcat: undefined, page: undefined }, 'replace')}
                            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 shrink-0 ${
                                !activeCatParam || activeCatParam === 'all'
                                    ? "bg-[#FF6FA7] text-white shadow-md shadow-[#FF6FA7]/20 scale-105"
                                    : "bg-white text-[#7C6A72] border border-[#FFD4E2] hover:border-[#FF6FA7] hover:text-[#FF6FA7]"
                            }`}
                        >
                            Todas las Categorías
                        </button>
                        {initialCategories.filter(c => !c.parent_id).map((cat) => {
                            const isSelected = activeCatParam === cat.slug || activeCatParam === String(cat.id)
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => updateUrl({ cat: cat.slug, categoria: cat.slug, subcat: undefined, page: undefined }, 'replace')}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                                        isSelected
                                            ? "bg-[#FF6FA7] text-white shadow-md shadow-[#FF6FA7]/20 scale-105"
                                            : "bg-white text-[#7C6A72] border border-[#FFD4E2] hover:border-[#FF6FA7] hover:text-[#FF6FA7]"
                                    }`}
                                >
                                    {cat.slug === 'kits-bundles' && <span>🎁</span>}
                                    {cat.slug === 'suplementos-femeninos' && <span>💖</span>}
                                    {cat.slug === 'equipamiento-pilates' && <span>🧘‍♀️</span>}
                                    {cat.slug === 'accesorios-gym' && <span>🥤</span>}
                                    {cat.nombre}
                                </button>
                            )
                        })}
                    </div>
                </div>
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FFE6EF]/50 to-transparent pointer-events-none" />
            </div>

            <div className="container mx-auto px-6 pb-20">
                {/* --- CONTROLS BAR --- */}
                <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border border-[#FFD4E2] rounded-[2rem] p-4 mb-12 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between" suppressHydrationWarning>
                        {/* Search Field */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C6A72] group-focus-within:text-[#FF6FA7] transition-colors" />
                            <Input
                                placeholder="Busca tu banda, mat o accesorio..."
                                className="h-12 pl-11 bg-[#FFF7F9] border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#FF6FA7]/10 focus:border-[#FF6FA7] transition-all font-medium"
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
                                <SheetContent side="right" className="w-full sm:max-w-md rounded-l-[3rem] p-8 border-none shadow-2xl flex flex-col justify-between overflow-y-auto">
                                    <div>
                                        <SheetHeader className="mb-8">
                                            <SheetTitle className="text-3xl font-black text-slate-900 tracking-tight">Refinar Búsqueda</SheetTitle>
                                            <SheetDescription className="font-medium">Personaliza tu experiencia de navegación.</SheetDescription>
                                        </SheetHeader>

                                        <div className="space-y-6">
                                            {/* Categories list in Mobile */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Categorías</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                                        onClick={() => updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace')}
                                                        className="rounded-full text-xs font-bold transition-all"
                                                        size="sm"
                                                    >
                                                        Todas
                                                    </Button>
                                                    {initialCategories.filter(c => !c.parent_id).map((cat) => {
                                                        const isSelected = selectedCategory === String(cat.id) || selectedCategory === cat.slug
                                                        return (
                                                            <Button
                                                                key={cat.id}
                                                                variant={isSelected ? 'default' : 'outline'}
                                                                onClick={() => updateUrl({ cat: cat.slug, subcat: undefined, page: undefined }, 'replace')}
                                                                className="rounded-full text-xs font-bold transition-all"
                                                                size="sm"
                                                            >
                                                                {cat.nombre}
                                                            </Button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Subcategories list in Mobile */}
                                            {(() => {
                                                const parentCat = initialCategories.find(c => String(c.id) === selectedCategory || c.slug === selectedCategory)
                                                if (!parentCat) return null
                                                const subcategories = initialCategories.filter(c => c.parent_id === parentCat.id)
                                                if (subcategories.length === 0) return null
                                                return (
                                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                                        <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Subcategorías de {parentCat.nombre}</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant={selectedSubcategory === 'all' ? 'secondary' : 'outline'}
                                                                onClick={() => updateUrl({ subcat: undefined, page: undefined }, 'replace')}
                                                                className="rounded-full text-xs font-bold transition-all"
                                                                size="sm"
                                                            >
                                                                Ver Todo
                                                            </Button>
                                                            {subcategories.map((sub) => {
                                                                const isSubSelected = selectedSubcategory === String(sub.id) || selectedSubcategory === sub.slug
                                                                return (
                                                                    <Button
                                                                        key={sub.id}
                                                                        variant={isSubSelected ? 'secondary' : 'outline'}
                                                                        onClick={() => updateUrl({ subcat: sub.slug, page: undefined }, 'replace')}
                                                                        className="rounded-full text-xs font-bold transition-all"
                                                                        size="sm"
                                                                    >
                                                                        {sub.nombre}
                                                                    </Button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })()}

                                            {/* Stock Filter in Mobile */}
                                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                                <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Disponibilidad</h4>
                                                <Button
                                                    variant={onlyInStock ? 'default' : 'outline'}
                                                    onClick={() => updateUrl({ stock: onlyInStock ? undefined : '1', page: undefined }, 'replace')}
                                                    className="w-full justify-between rounded-xl font-bold h-12"
                                                >
                                                    <span>Solo productos en stock</span>
                                                    <span className={`h-2.5 w-2.5 rounded-full ${onlyInStock ? 'bg-white' : 'bg-slate-300'}`} />
                                                </Button>
                                            </div>

                                            {/* Price Range Filter in Mobile */}
                                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                                <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Rango de Precio (S/.)</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="Mínimo"
                                                        className="h-12 rounded-xl"
                                                        value={localMin}
                                                        onChange={(e) => setLocalMin(e.target.value)}
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Máximo"
                                                        className="h-12 rounded-xl"
                                                        value={localMax}
                                                        onChange={(e) => setLocalMax(e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    className="w-full h-12 rounded-xl font-bold"
                                                    onClick={() => updateUrl({ min: localMin || undefined, max: localMax || undefined, page: undefined }, 'replace')}
                                                >
                                                    Aplicar Rango
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions in Mobile */}
                                    <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-1/2 h-12 rounded-xl font-bold"
                                            onClick={() => {
                                                setLocalMin("")
                                                setLocalMax("")
                                                updateUrl({ cat: undefined, subcat: undefined, q: undefined, stock: undefined, min: undefined, max: undefined, page: undefined }, 'replace')
                                            }}
                                        >
                                            Limpiar Todo
                                        </Button>
                                        <SheetTrigger asChild>
                                            <Button className="w-1/2 h-12 rounded-xl font-bold">
                                                Listo
                                            </Button>
                                        </SheetTrigger>
                                    </div>
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

                {/* --- DESKTOP CATEGORIES PANEL --- */}
                <AnimatePresence>
                    {activeFilter === 'cat' && (
                        <m.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden hidden lg:block"
                        >
                            <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Filtrar por Categoría</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace')
                                            setActiveFilter(null)
                                        }}
                                        className="h-8 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900"
                                    >
                                        Limpiar Categoría
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    <Button
                                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                        onClick={() => {
                                            updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace')
                                            setActiveFilter(null)
                                        }}
                                        className="rounded-full font-bold transition-all h-10 px-5 text-xs uppercase tracking-wider"
                                    >
                                        Todas las Categorías
                                    </Button>
                                    {initialCategories.filter(c => !c.parent_id).map((cat) => {
                                        const isSelected = selectedCategory === String(cat.id) || selectedCategory === cat.slug
                                        return (
                                            <Button
                                                key={cat.id}
                                                variant={isSelected ? 'default' : 'outline'}
                                                onClick={() => {
                                                    updateUrl({ cat: cat.slug, subcat: undefined, page: undefined }, 'replace')
                                                    setActiveFilter(null)
                                                }}
                                                className="rounded-full font-bold transition-all h-10 px-5 text-xs uppercase tracking-wider"
                                            >
                                                {cat.nombre}
                                            </Button>
                                        )
                                    })}
                                </div>

                                {/* Dynamic Subcategories */}
                                {(() => {
                                    const parentCat = initialCategories.find(c => String(c.id) === selectedCategory || c.slug === selectedCategory)
                                    if (!parentCat) return null
                                    const subcategories = initialCategories.filter(c => c.parent_id === parentCat.id)
                                    if (subcategories.length === 0) return null
                                    return (
                                        <div className="w-full mt-5 pt-4 border-t border-slate-100/80">
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <Tag className="w-3.5 h-3.5 text-slate-400" />
                                                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subcategorías de {parentCat.nombre}:</h5>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant={selectedSubcategory === 'all' ? 'secondary' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateUrl({ subcat: undefined, page: undefined }, 'replace')}
                                                    className="rounded-full text-xs font-bold transition-all px-4"
                                                >
                                                    Ver Todo
                                                </Button>
                                                {subcategories.map((sub) => {
                                                    const isSubSelected = selectedSubcategory === String(sub.id) || selectedSubcategory === sub.slug
                                                    return (
                                                        <Button
                                                            key={sub.id}
                                                            variant={isSubSelected ? 'secondary' : 'outline'}
                                                            size="sm"
                                                            onClick={() => updateUrl({ subcat: sub.slug, page: undefined }, 'replace')}
                                                            className="rounded-full text-xs font-bold transition-all px-4"
                                                        >
                                                            {sub.nombre}
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* --- ACTIVE BADGES --- */}
                <AnimatePresence>
                    {(selectedCategory !== "all" || onlyInStock || minPrice || maxPrice || initialParams.q) && (
                        <m.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap items-center gap-2 mb-8 overflow-hidden pb-1"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Filtros Activos:</span>
                            
                            {/* Individual Filter Badges */}
                            {initialParams.q && (
                                <Badge className="h-8 rounded-full px-4 text-xs font-bold gap-1 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer" onClick={() => {
                                    setSearchQuery("")
                                    updateUrl({ q: undefined, page: undefined }, 'replace')
                                }}>
                                    Búsqueda: {initialParams.q} <X size={12} className="shrink-0" />
                                </Badge>
                            )}

                            {(() => {
                                if (selectedCategory === 'all') return null
                                const catRow = initialCategories.find(c => String(c.id) === selectedCategory || c.slug === selectedCategory)
                                if (!catRow) return null
                                return (
                                    <Badge className="h-8 rounded-full px-4 text-xs font-bold gap-1 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer" onClick={() => updateUrl({ cat: undefined, subcat: undefined, page: undefined }, 'replace')}>
                                        Categoría: {catRow.nombre} <X size={12} className="shrink-0" />
                                    </Badge>
                                )
                            })()}

                            {(() => {
                                if (selectedSubcategory === 'all') return null
                                const subRow = initialCategories.find(c => String(c.id) === selectedSubcategory || c.slug === selectedSubcategory)
                                if (!subRow) return null
                                return (
                                    <Badge className="h-8 rounded-full px-4 text-xs font-bold gap-1 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer" onClick={() => updateUrl({ subcat: undefined, page: undefined }, 'replace')}>
                                        Subcategoría: {subRow.nombre} <X size={12} className="shrink-0" />
                                    </Badge>
                                )
                            })()}

                            {(minPrice || maxPrice) && (
                                <Badge className="h-8 rounded-full px-4 text-xs font-bold gap-1 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer" onClick={() => {
                                    setLocalMin("")
                                    setLocalMax("")
                                    updateUrl({ min: undefined, max: undefined, page: undefined }, 'replace')
                                }}>
                                    Precio: {minPrice ? `S/. ${minPrice}` : 'S/. 0'} - {maxPrice ? `S/. ${maxPrice}` : 'Máx'} <X size={12} className="shrink-0" />
                                </Badge>
                            )}

                            {onlyInStock && (
                                <Badge className="h-8 rounded-full px-4 text-xs font-bold gap-1 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer" onClick={() => updateUrl({ stock: undefined, page: undefined }, 'replace')}>
                                    En Stock <X size={12} className="shrink-0" />
                                </Badge>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50"
                                onClick={() => {
                                    setLocalMin("")
                                    setLocalMax("")
                                    setSearchQuery("")
                                    updateUrl({ cat: undefined, subcat: undefined, q: undefined, stock: undefined, min: undefined, max: undefined, page: undefined }, 'replace')
                                }}
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
