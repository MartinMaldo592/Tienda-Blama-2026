"use client"

import Link from 'next/link'
import { Menu, Search, X, ShoppingCart } from "lucide-react"
import dynamic from "next/dynamic"

const CartButton = dynamic(() => import("@/components/cart-button").then(mod => mod.CartButton), {
    ssr: false,
    loading: () => (
        <div className="h-10 w-10 md:w-24 rounded-full border border-border bg-background flex items-center justify-center gap-1.5 px-2.5 md:px-3 text-muted-foreground/25 select-none">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-bold text-sm mr-1 hidden md:inline">Carrito</span>
        </div>
    )
})
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { Input } from "@/components/ui/input"
import { PeruFlag } from "@/components/ui/peru-flag"
import { getAutocompleteResults } from "@/features/products/services/products.client"
import { formatCurrency, slugify } from "@/lib/utils"
import Image from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"

export function Header() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showDesktopSearch, setShowDesktopSearch] = useState(false)
    const [autocompleteResults, setAutocompleteResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (showDesktopSearch) {
            const timer = setTimeout(() => {
                searchInputRef.current?.focus()
            }, 80)
            return () => clearTimeout(timer)
        }
    }, [showDesktopSearch])

    useEffect(() => {
        const queryStr = searchQuery.trim()
        if (queryStr.length < 2) {
            setAutocompleteResults([])
            return
        }

        setIsSearching(true)
        const delayDebounceFn = setTimeout(async () => {
            try {
                const results = await getAutocompleteResults(queryStr)
                setAutocompleteResults(results)
            } catch (err) {
                console.error(err)
            } finally {
                setIsSearching(false)
            }
        }, 250)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery])

    const getProductHref = (p: any) => {
        return p.slug
            ? `/productos/${p.slug}`
            : `/productos/${slugify(p.nombre)}-${p.id}`
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        router.push(`/productos?q=${encodeURIComponent(searchQuery)}`)
        setMobileMenuOpen(false)
        setShowDesktopSearch(false)
    }

    useEffect(() => {
        setMobileMenuOpen(false)
        setShowDesktopSearch(false)
    }, [pathname])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mobileMenuOpen) return
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = prevOverflow
        }
    }, [mobileMenuOpen])

    return (
        <header className="w-full bg-background/80 backdrop-blur-md shadow-sm border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">

                {/* Left Area: Mobile Menu Trigger, Mobile Peru Flag & Desktop Nav Links */}
                <div className="flex items-center justify-start gap-1.5 sm:gap-4 md:w-1/3">
                    <button
                        type="button"
                        className="md:hidden relative z-50 p-2 text-foreground hover:text-primary active:scale-95 transition-all inline-flex items-center justify-center touch-manipulation"
                        aria-label="Abrir menú"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Peru Flag (Visible only on mobile next to hamburger, hidden on desktop nav) */}
                    <div className="flex md:hidden items-center shrink-0 select-none">
                        <PeruFlag className="h-5.5 w-8 rounded-[2px] shadow-sm object-cover border border-black/10 dark:border-white/10" />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 text-sm font-semibold text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <Link href="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
                        <Link href="/nosotros" className="hover:text-primary transition-colors">Quiénes Somos</Link>
                        <Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
                    </nav>
                </div>

                {/* Center Area: Logo & Brand Tagline */}
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
                    <Link href="/" className="group flex flex-col items-center select-none">
                        <div className="flex items-center gap-1.5">
                            {/* Lotus / Pilates Brand Icon */}
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FF6FA7] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C10 5 7 8 7 12c0 3 2.5 5 5 5s5-2 5-5c0-4-3-7-5-10zm0 13c-1.6 0-3-1.3-3-3 0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5 0 1.7-1.4 3-3 3z" />
                                <path d="M6 14c-2 0-4-1-5-3 2 0 4.5.5 6 2 1.5 1.5 1.5 3 1.5 3s-.5-2-2.5-2z" opacity="0.7"/>
                                <path d="M18 14c2 0 4-1 5-3-2 0-4.5.5-6 2-1.5 1.5-1.5 3-1.5 3s.5-2 2.5-2z" opacity="0.7"/>
                            </svg>
                            <span className="text-xl md:text-2xl font-black lowercase tracking-wider text-[#FF6FA7] font-serif leading-none">
                                blama
                            </span>
                        </div>
                        <span className="text-[8px] md:text-[9px] font-extrabold tracking-[0.25em] text-[#2D2D2D] uppercase mt-0.5 opacity-90">
                            Fitness • Pilates • Lifestyle
                        </span>
                    </Link>
                </div>

                {mobileMenuOpen && (
                    mounted ? createPortal(
                        <>
                            <div
                                className="fixed inset-0 z-[70] bg-black/70"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-hidden="true"
                            />
                            <div
                                className="fixed inset-y-0 left-0 z-[80] w-[300px] bg-background shadow-xl border-r border-border opacity-100"
                                role="dialog"
                                aria-modal="true"
                                aria-label="Menú"
                            >
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 h-10 w-10 rounded-full border border-border bg-background shadow-sm hover:shadow-md active:scale-95 transition-all inline-flex items-center justify-center"
                                    aria-label="Cerrar menú"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="mt-14 px-5 mb-6">
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Buscar productos..."
                                            className="pl-9 w-full bg-muted/50"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </form>
                                </div>

                                <nav className="flex flex-col gap-4 px-5">
                                    <Link href="/" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
                                    <Link href="/productos" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Catálogo</Link>
                                    <Link href="/nosotros" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Quiénes Somos</Link>
                                    <Link href="/contacto" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
                                </nav>

                                <div className="absolute bottom-4 left-4 text-sm font-extrabold tracking-tight text-primary">
                                    Blama Shop
                                </div>
                            </div>
                        </>,
                        document.body
                    ) : null
                )}

                {/* Right Area: Actions (Search, Flag on desktop/tablet, Cart) */}
                <div className="flex items-center justify-end gap-1 px-1 sm:gap-2 md:w-1/3 z-10">
                    {/* Peru Flag (Visible only on desktop/tablet, hidden on mobile) */}
                    <div className="hidden md:flex items-center shrink-0 select-none">
                        <PeruFlag className="h-6.5 w-9.5 rounded-[2px] shadow-sm object-cover border border-black/10 dark:border-white/10" />
                    </div>

                    {/* Search */}
                    <button
                        type="button"
                        onClick={() => setShowDesktopSearch(true)}
                        className="p-2 hover:bg-accent rounded-full text-foreground transition-colors shrink-0 active:scale-95"
                        aria-label="Buscar"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Cart Button */}
                    <div className="shrink-0">
                        <CartButton />
                    </div>
                </div>

                {/* Search Overlay Bar — Premium Zara/Apple style */}
                <div
                    className={`absolute inset-x-0 top-0 h-16 bg-background px-4 flex items-center justify-between transition-all duration-300 z-[60] ${
                        showDesktopSearch
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                >
                    <div className="w-full max-w-3xl mx-auto relative flex items-center h-full">
                        <form onSubmit={handleSearch} className="w-full flex items-center gap-3">
                            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                            <Input
                                ref={searchInputRef}
                                type="search"
                                placeholder="Buscar productos, marcas y más..."
                                className="flex-grow h-12 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-muted-foreground/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDesktopSearch(false)
                                    setSearchQuery("")
                                }}
                                className="text-sm font-bold text-muted-foreground hover:text-foreground active:scale-95 transition-all px-3 py-2 rounded-lg hover:bg-muted"
                            >
                                Cancelar
                            </button>
                        </form>

                        {/* Autocomplete Dropdown List */}
                        {showDesktopSearch && searchQuery.trim().length >= 2 && (
                            <div className="absolute top-[calc(100%-4px)] left-0 w-full bg-popover text-popover-foreground rounded-2xl border border-border shadow-2xl overflow-hidden mt-1 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Buscando productos relacionados...
                                    </div>
                                ) : autocompleteResults.length > 0 ? (
                                    <div className="p-2 divide-y divide-border">
                                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Productos sugeridos
                                        </div>
                                        <div className="py-1">
                                            {autocompleteResults.map((p) => {
                                                const pImages = Array.isArray(p.imagenes) ? p.imagenes : []
                                                const pImgSrc = pImages[0] || p.imagen_url || "/placeholder-product.png"
                                                const currentPrice = Number(p.precio ?? 0)
                                                const beforePrice = Number(p.precio_antes ?? 0)
                                                const hasSale = beforePrice > 0 && beforePrice > currentPrice

                                                return (
                                                    <Link
                                                        key={p.id}
                                                        href={getProductHref(p)}
                                                        onClick={() => {
                                                            setShowDesktopSearch(false)
                                                            setSearchQuery("")
                                                        }}
                                                        className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                                                    >
                                                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                                                            <Image
                                                                src={pImgSrc}
                                                                alt={p.nombre}
                                                                fill
                                                                loader={cloudinaryLoader}
                                                                className="object-cover group-hover:scale-105 transition-transform duration-200 animate-in fade-in"
                                                                sizes="48px"
                                                                quality={50}
                                                            />
                                                        </div>
                                                        <div className="flex-grow min-w-0 text-left">
                                                            <span className="block text-sm font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                                {p.nombre}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-sm font-black text-primary">
                                                                    {formatCurrency(currentPrice)}
                                                                </span>
                                                                {hasSale && (
                                                                    <span className="text-[11px] text-muted-foreground line-through">
                                                                        {formatCurrency(beforePrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                        <button
                                            type="submit"
                                            onClick={handleSearch}
                                            className="w-full text-center py-3 text-xs font-black text-primary hover:bg-muted transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                                        >
                                            Ver todos los resultados para &quot;{searchQuery}&quot;
                                            <Search className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-sm text-muted-foreground">
                                        No se encontraron resultados relacionados con &quot;{searchQuery}&quot;
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
