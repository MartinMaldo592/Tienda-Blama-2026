"use client"

import Link from 'next/link'
import { CartButton } from "@/components/cart-button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"

export function Header() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

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
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Mobile Menu Trigger & Logo */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        type="button"
                        className="md:hidden relative z-50 h-10 w-10 rounded-full border border-border bg-background/70 backdrop-blur shadow-sm hover:shadow-md active:scale-95 transition-all inline-flex items-center justify-center touch-manipulation"
                        aria-label="Abrir menú"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <Link href="/" className="text-xl font-extrabold tracking-tight text-primary">
                        Blama Shop
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

                                <nav className="flex flex-col gap-4 mt-14 px-5">
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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <Link href="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
                    <Link href="/nosotros" className="hover:text-primary transition-colors">Quiénes Somos</Link>
                    <Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
                </nav>

                {/* Cart Action */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <CartButton />
                </div>
            </div>
        </header>
    )
}
