"use client"

import Link from 'next/link'
import { Menu, Search, X, ShoppingBag, Sparkles, User } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { Input } from "@/components/ui/input"
import { getAutocompleteResults } from "@/features/products/services/products.client"
import { formatCurrency, slugify } from "@/lib/utils"
import Image from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"

const CartButton = dynamic(() => import("@/components/cart-button").then(mod => mod.CartButton), {
    ssr: false,
    loading: () => (
        <div className="h-10 w-10 rounded-full border border-[#FFD4E2] bg-white flex items-center justify-center text-[#FF6FA7] select-none shadow-xs">
            <ShoppingBag className="h-5 w-5" />
        </div>
    )
})

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
        if (queryStr.length < 1) {
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

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isHome = pathname === "/"
    const isOverlayHeader = isHome && !isScrolled

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Catálogo", href: "/productos" },
        { name: "Pilates & Gym", href: "/productos?cat=pilates-yoga" },
        { name: "Quiénes Somos", href: "/nosotros" },
        { name: "Contacto", href: "/contacto" },
    ]

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            isOverlayHeader
                ? "bg-transparent border-b-0 shadow-none"
                : "bg-white/95 backdrop-blur-xl border-b border-[#FFD4E2]/70 shadow-[0_4px_20px_rgba(255,111,167,0.05)]"
        }`}>
            {/* Subtle top pink glowing line (only when not transparent overlay) */}
            {!isOverlayHeader && (
                <div className="h-0.5 w-full bg-gradient-to-r from-[#FF6FA7] via-[#FFB6C9] to-[#FF6FA7]" />
            )}
            <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between relative">

                {/* --- STANDARD NAVBAR CONTENT (Hides smoothly when search is activated) --- */}
                <div className={`w-full flex items-center justify-between transition-all duration-300 ${
                    showDesktopSearch ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
                }`}>
                    {/* Left Area: Mobile Menu Trigger, Mobile Search & Desktop Navigation */}
                    <div className="flex items-center justify-start gap-1.5 md:gap-4 md:w-1/3">
                        <button
                            type="button"
                            className={`md:hidden p-2 rounded-full active:scale-95 transition-all inline-flex items-center justify-center ${
                                isOverlayHeader ? "text-white hover:bg-white/20 drop-shadow-sm" : "text-[#2D2D2D] hover:text-[#FF6FA7] hover:bg-[#FFE6EF]"
                            }`}
                            aria-label="Abrir menú"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Mobile Search Trigger */}
                        <button
                            type="button"
                            onClick={() => setShowDesktopSearch(true)}
                            className={`md:hidden p-2 rounded-full transition-all shrink-0 active:scale-95 flex items-center justify-center ${
                                isOverlayHeader ? "text-white hover:bg-white/20 drop-shadow-sm" : "text-[#2D2D2D] hover:text-[#FF6FA7] hover:bg-[#FFE6EF]"
                            }`}
                            aria-label="Buscar"
                        >
                            <Search className="h-5.5 w-5.5" />
                        </button>

                        {/* Desktop Navigation links */}
                        <nav className={`hidden md:flex items-center gap-7 text-xs uppercase font-black tracking-widest ${
                            isOverlayHeader ? "text-white drop-shadow-md" : "text-[#7C6A72]"
                        }`}>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative py-1.5 transition-colors duration-200 ${
                                            isOverlayHeader
                                                ? "hover:text-[#FFB6C9] " + (isActive ? "text-[#FFB6C9]" : "")
                                                : "hover:text-[#FF6FA7] " + (isActive ? "text-[#FF6FA7]" : "")
                                        }`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full animate-in fade-in duration-300 ${
                                                isOverlayHeader ? "bg-[#FFB6C9] shadow-xs" : "bg-[#FF6FA7]"
                                            }`} />
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Center Area: Logo & Brand Tagline */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-auto">
                        <Link href="/" className="group flex flex-col items-center select-none py-1">
                            <div className="flex items-center gap-2">
                                {/* Lotus / Pilates Brand Icon */}
                                <svg className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110 ${
                                    isOverlayHeader ? "text-[#FFB6C9] drop-shadow-md" : "text-[#FF6FA7]"
                                }`} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C10 5 7 8 7 12c0 3 2.5 5 5 5s5-2 5-5c0-4-3-7-5-10zm0 13c-1.6 0-3-1.3-3-3 0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5 0 1.7-1.4 3-3 3z" />
                                    <path d="M6 14c-2 0-4-1-5-3 2 0 4.5.5 6 2 1.5 1.5 1.5 3 1.5 3s-.5-2-2.5-2z" opacity="0.7"/>
                                    <path d="M18 14c2 0 4-1 5-3-2 0-4.5.5-6 2-1.5 1.5-1.5 3-1.5 3s-.5-2 2.5-2z" opacity="0.7"/>
                                </svg>
                                <span className={`text-2xl md:text-3xl font-black lowercase tracking-wider font-serif leading-none ${
                                    isOverlayHeader ? "text-white drop-shadow-md" : "text-[#FF6FA7]"
                                }`}>
                                    blama
                                </span>
                            </div>
                            <span className={`text-[7.5px] md:text-[8.5px] font-black tracking-[0.3em] uppercase mt-0.5 ${
                                isOverlayHeader ? "text-white/90 drop-shadow-xs" : "text-[#2D2D2D] opacity-90"
                            }`}>
                                FITNESS • PILATES • LIFESTYLE
                            </span>
                        </Link>
                    </div>

                    {/* Right Area: Actions (Search on Desktop, User, Cart) */}
                    <div className="flex items-center justify-end gap-1.5 md:gap-2 md:w-1/3 z-10">
                        {/* Search Trigger (Desktop) */}
                        <button
                            type="button"
                            onClick={() => setShowDesktopSearch(true)}
                            className={`hidden md:flex p-2.5 rounded-full transition-all shrink-0 active:scale-95 ${
                                isOverlayHeader ? "text-white hover:bg-white/20" : "text-[#2D2D2D] hover:text-[#FF6FA7] hover:bg-[#FFE6EF]"
                            }`}
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        {/* User Account Link */}
                        <Link
                            href="/auth/login"
                            className={`p-2 rounded-full transition-all shrink-0 active:scale-95 flex items-center justify-center ${
                                isOverlayHeader ? "text-white hover:bg-white/20" : "text-[#2D2D2D] hover:text-[#FF6FA7] hover:bg-[#FFE6EF]"
                            }`}
                            aria-label="Mi Cuenta"
                        >
                            <User className="h-5.5 w-5.5 md:h-5 md:w-5" />
                        </Link>

                        {/* Cart Button */}
                        <div className="shrink-0">
                            <CartButton isOverlay={isOverlayHeader} />
                        </div>
                    </div>
                </div>

                {/* --- MORPHED SEARCH BAR (Replaces Navbar in-place smoothly) --- */}
                <div
                    className={`absolute inset-0 h-18 w-full flex items-center justify-between px-3 md:px-6 transition-all duration-300 z-20 ${
                        showDesktopSearch
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                    } ${
                        isOverlayHeader
                            ? "bg-black/60 backdrop-blur-xl border-b border-white/20"
                            : "bg-white/98 backdrop-blur-xl border-b border-[#FFD4E2]"
                    }`}
                >
                    <div className="w-full max-w-4xl mx-auto relative flex items-center gap-3">
                        <form onSubmit={handleSearch} className="flex-grow flex items-center gap-3">
                            <div className="relative flex-grow flex items-center">
                                <Search className={`absolute left-4 h-5 w-5 ${
                                    isOverlayHeader ? "text-[#FFB6C9]" : "text-[#FF6FA7]"
                                }`} />
                                <Input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder="Buscar bandas de glúteos, mats, pesas tobilleras, aros de pilates..."
                                    className={`w-full h-11 pl-11 pr-4 rounded-full text-sm font-semibold transition-all focus-visible:ring-2 ${
                                        isOverlayHeader
                                            ? "bg-white/15 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-[#FFB6C9] focus-visible:bg-white/20"
                                            : "bg-[#FFF7F9] border-[#FFD4E2] text-[#2D2D2D] placeholder:text-[#7C6A72]/70 focus-visible:ring-[#FF6FA7]"
                                    }`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDesktopSearch(false)
                                    setSearchQuery("")
                                }}
                                className={`text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-full transition-all shrink-0 active:scale-95 ${
                                    isOverlayHeader
                                        ? "text-white hover:bg-white/20 hover:text-[#FFB6C9]"
                                        : "text-[#7C6A72] hover:text-[#FF6FA7] hover:bg-[#FFE6EF]"
                                }`}
                            >
                                Cancelar
                            </button>
                        </form>

                        {/* Autocomplete Dropdown List */}
                        {showDesktopSearch && searchQuery.trim().length >= 1 && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white text-[#2D2D2D] rounded-3xl border border-[#FFD4E2] shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                {isSearching ? (
                                    <div className="p-5 text-center text-sm text-[#7C6A72] flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 border-2 border-[#FF6FA7] border-t-transparent rounded-full animate-spin" />
                                        Buscando productos de pilates & gym...
                                    </div>
                                ) : autocompleteResults.length > 0 ? (
                                    <div className="p-3 divide-y divide-[#FFD4E2]">
                                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#FF6FA7]">
                                            Sugerencias BLAMA
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
                                                        className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#FFF7F9] transition-colors group"
                                                    >
                                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[#FFD4E2] shrink-0 bg-[#FFF7F9]">
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
                                                            <span className="block text-sm font-extrabold text-[#2D2D2D] leading-tight line-clamp-1 group-hover:text-[#FF6FA7] transition-colors">
                                                                {p.nombre}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-sm font-black text-[#FF6FA7]">
                                                                    {formatCurrency(currentPrice)}
                                                                </span>
                                                                {hasSale && (
                                                                    <span className="text-[11px] text-slate-400 line-through">
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
                                            className="w-full text-center py-3 text-xs font-black text-[#FF6FA7] hover:bg-[#FFE6EF] transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider rounded-b-2xl"
                                        >
                                            Ver todos los resultados para &quot;{searchQuery}&quot;
                                            <Search className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-sm text-[#7C6A72]">
                                        No se encontraron productos para &quot;{searchQuery}&quot;
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Navigation */}
            {mobileMenuOpen && (
                mounted ? createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs animate-in fade-in duration-300"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-hidden="true"
                        />
                        <div
                            className="fixed inset-y-0 left-0 z-[80] w-[310px] bg-white shadow-2xl border-r border-[#FFD4E2] flex flex-col justify-between animate-in slide-in-from-left duration-300"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menú BLAMA"
                        >
                            <div>
                                <div className="p-6 border-b border-[#FFD4E2] flex items-center justify-between bg-[#FFF7F9]">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#FF6FA7]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C10 5 7 8 7 12c0 3 2.5 5 5 5s5-2 5-5c0-4-3-7-5-10zm0 13c-1.6 0-3-1.3-3-3 0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5 0 1.7-1.4 3-3 3z" />
                                        </svg>
                                        <span className="text-2xl font-black lowercase text-[#FF6FA7] font-serif">blama</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="h-9 w-9 rounded-full border border-[#FFD4E2] bg-white text-[#2D2D2D] hover:bg-[#FFE6EF] hover:text-[#FF6FA7] transition-all inline-flex items-center justify-center"
                                        aria-label="Cerrar menú"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="p-5">
                                    <form onSubmit={handleSearch} className="relative mb-6">
                                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#7C6A72]" />
                                        <Input
                                            type="search"
                                            placeholder="Buscar bandas, mats, pesas..."
                                            className="pl-10 h-11 w-full bg-[#FFF7F9] border-[#FFD4E2] rounded-full focus-visible:ring-[#FF6FA7] text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </form>

                                    <nav className="flex flex-col gap-2">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-extrabold text-[#2D2D2D] hover:bg-[#FFE6EF] hover:text-[#FF6FA7] transition-all"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <span>{link.name}</span>
                                                <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#FF6FA7]" />
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            <div className="p-6 border-t border-[#FFD4E2] bg-[#FFF7F9] text-center space-y-2">
                                <p className="text-xs font-bold text-[#FF6FA7] font-serif italic">"tu mejor versión, todos los días. ♡"</p>
                                <div className="py-1 px-4 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-[10px] font-extrabold uppercase tracking-widest inline-block">
                                    FUERTE • SEGURA • IMPARABLE
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                ) : null
            )}
        </header>
    )
}
