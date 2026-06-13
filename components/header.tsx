"use client"

import Link from 'next/link'
import { CartButton } from "@/components/cart-button"
import { Menu, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { Input } from "@/components/ui/input"
import { PeruFlag } from "@/components/ui/peru-flag"

export function Header() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showDesktopSearch, setShowDesktopSearch] = useState(false)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        router.push(`/productos?q=${encodeURIComponent(searchQuery)}`)
        setMobileMenuOpen(false)
        setShowDesktopSearch(false)
    }

    useEffect(() => {
        setMobileMenuOpen(false)
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
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm border-b">
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
                    <div className="flex md:hidden items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 shrink-0 select-none">
                        <PeruFlag className="h-2.5 w-3.5 rounded-[1px] shadow-sm object-cover" />
                        <span className="text-[8px] font-black text-gray-600 dark:text-gray-300">PERÚ</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 text-sm font-semibold text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <Link href="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
                        <Link href="/nosotros" className="hover:text-primary transition-colors">Quiénes Somos</Link>
                        <Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
                    </nav>
                </div>

                {/* Center Area: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <Link href="/" className="text-xl md:text-2xl font-black uppercase tracking-widest text-primary whitespace-nowrap select-none hover:opacity-90 transition-opacity">
                        BLAMA SHOP
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
                    <div className="hidden md:flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shrink-0 select-none">
                        <PeruFlag className="h-3 w-4 rounded-[1px] shadow-sm object-cover" />
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">PERÚ</span>
                    </div>

                    {/* Search */}
                    <div className="flex items-center relative">
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDesktopSearch ? 'w-24 sm:w-40 md:w-48 lg:w-64 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
                            <form onSubmit={handleSearch}>
                                <Input
                                    type="search"
                                    placeholder="Buscar..."
                                    className="h-9 text-xs sm:text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDesktopSearch(!showDesktopSearch)}
                            className="p-2 hover:bg-accent rounded-full text-foreground transition-colors shrink-0"
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Cart Button */}
                    <div className="shrink-0">
                        {mounted ? (
                            <CartButton />
                        ) : (
                            <div className="h-10 w-16 sm:w-24 rounded-full border border-border bg-muted/40 animate-pulse" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
