"use client"

import { useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase.client"
import { LayoutDashboard, ShoppingBag, Package, PackageOpen, Users, AlertCircle, LogOut, Percent, Star, MessageSquare, Megaphone, Share2, ShieldAlert, Activity } from "lucide-react"
import { m } from "framer-motion"

interface AdminSidebarProps {
    role: string
}

export function AdminSidebar({ role }: AdminSidebarProps) {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const navRef = useRef<HTMLElement>(null)

    const handleWheel = (e: React.WheelEvent) => {
        const nav = navRef.current
        if (!nav) {
            window.scrollBy({ top: e.deltaY })
            return
        }
        const isScrollable = nav.scrollHeight > nav.clientHeight
        if (!isScrollable) {
            window.scrollBy({ top: e.deltaY })
        } else {
            const atTop = nav.scrollTop <= 0 && e.deltaY < 0
            const atBottom = nav.scrollTop + nav.clientHeight >= nav.scrollHeight - 1 && e.deltaY > 0
            if (atTop || atBottom) {
                window.scrollBy({ top: e.deltaY })
            }
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/auth/login")
    }

    // Define menu items with section categories and role restrictions
    const menuSections = [
        {
            title: "VENTAS & CONTROL",
            items: [
                { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "worker"] },
                { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos", roles: ["admin", "worker"] },
                { href: "/admin/clientes", icon: Users, label: "Clientes", roles: ["admin"] },
                { href: "/admin/cupones", icon: Percent, label: "Cupones", roles: ["admin"] },
            ]
        },
        {
            title: "CATÁLOGO & ALMACÉN",
            items: [
                { href: "/admin/productos", icon: Package, label: "Productos", roles: ["admin"] },
                { href: "/admin/inventario", icon: PackageOpen, label: "Inventario", roles: ["admin"] },
            ]
        },
        {
            title: "MARKETING & CRECIMIENTO",
            items: [
                { href: "/admin/marketing", icon: Activity, label: "Píxeles y Marketing", roles: ["admin"] },
                { href: "/admin/announcement-bar", icon: Megaphone, label: "Announcement Bar", roles: ["admin"] },
                { href: "/admin/resenas", icon: Star, label: "Reseñas", roles: ["admin"] },
                { href: "/admin/preguntas", icon: MessageSquare, label: "Preguntas", roles: ["admin"] },
            ]
        },
        {
            title: "SISTEMA & AUDITORÍA",
            items: [
                { href: "/admin/usuarios", icon: Users, label: "Usuarios Sistema", roles: ["admin"] },
                { href: "/admin/redes-sociales", icon: Share2, label: "Redes Sociales", roles: ["admin"] },
                { href: "/admin/incidencias", icon: AlertCircle, label: "Incidencias", roles: ["admin", "worker"] },
                { href: "/admin/auditoria", icon: ShieldAlert, label: "Auditoría", roles: ["admin"] },
            ]
        }
    ]

    // Check if a menu item is active (matches current pathname or is a parent)
    const isActive = (href: string) => {
        if (!pathname) return false
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <div onWheel={handleWheel} className="w-full h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 shadow-xs relative overflow-hidden select-none">
            {/* Header / Logo */}
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 flex items-center justify-between bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            CRM
                        </h2>
                        <span className="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md">v2.5</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {role === 'superadmin' ? 'Panel Propietario' : role === 'admin' ? 'Panel Administración' : 'Panel Trabajador'}
                    </p>
                </div>
            </div>

            {/* Navigation items */}
            <nav ref={navRef} className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overscroll-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {menuSections.map((section, idx) => {
                    const visibleItems = section.items.filter(item => 
                        item.roles.includes(role) || (role === "superadmin" && item.roles.includes("admin"))
                    )

                    if (visibleItems.length === 0) return null

                    return (
                        <div key={idx} className="space-y-1">
                            <div className="px-3 pb-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {section.title}
                            </div>
                            {visibleItems.map((item) => {
                                const active = isActive(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative flex items-center gap-3.5 px-3.5 py-2.5 text-xs rounded-xl transition-all duration-200 group font-bold ${
                                            active
                                                ? 'text-white dark:text-slate-900 shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900'
                                        }`}
                                    >
                                        {/* Minimalist active background pill */}
                                        {active && (
                                            <m.div
                                                layoutId="sidebar-active-pill"
                                                className="absolute inset-0 bg-slate-900 dark:bg-slate-100 rounded-xl shadow-md"
                                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                            />
                                        )}

                                        <item.icon className={`relative z-10 h-4 w-4 transition-transform duration-200 ${active ? 'text-white dark:text-slate-900 scale-105' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:scale-105'}`} />
                                        <span className="relative z-10 tracking-tight">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )
                })}
            </nav>

            {/* Role Badge */}
            <div className="px-4 pb-3 shrink-0">
                <div className={`px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    role === 'superadmin' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40' :
                    role === 'admin' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40' :
                    'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800'
                    }`}>
                    {role === 'superadmin' ? '⭐ Propietario' : role === 'admin' ? '👑 Administrador' : '👤 Trabajador'}
                </div>
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-slate-50/50 dark:bg-slate-950">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3.5 py-2.5 w-full text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-200 font-semibold group"
                >
                    <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
