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

    // Define menu items with role restrictions
    const menuItems = [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "worker"] },
        { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos", roles: ["admin", "worker"] },
        { href: "/admin/productos", icon: Package, label: "Productos", roles: ["admin"] },
        { href: "/admin/inventario", icon: PackageOpen, label: "Inventario", roles: ["admin"] },
        { href: "/admin/clientes", icon: Users, label: "Clientes", roles: ["admin"] },
        { href: "/admin/cupones", icon: Percent, label: "Cupones", roles: ["admin"] },
        { href: "/admin/announcement-bar", icon: Megaphone, label: "Announcement Bar", roles: ["admin"] },
        { href: "/admin/resenas", icon: Star, label: "Reseñas", roles: ["admin"] },
        { href: "/admin/preguntas", icon: MessageSquare, label: "Preguntas", roles: ["admin"] },
        { href: "/admin/usuarios", icon: Users, label: "Usuarios Sistema", roles: ["admin"] },
        { href: "/admin/redes-sociales", icon: Share2, label: "Redes Sociales", roles: ["admin"] },
        { href: "/admin/marketing", icon: Activity, label: "Píxeles y Marketing", roles: ["admin"] },
        { href: "/admin/incidencias", icon: AlertCircle, label: "Incidencias", roles: ["admin", "worker"] },
        { href: "/admin/auditoria", icon: ShieldAlert, label: "Auditoría", roles: ["admin"] },
    ]

    // Filter menu items based on user role (superadmin sees everything admin sees)
    const visibleMenuItems = menuItems.filter(item => 
        item.roles.includes(role) || (role === "superadmin" && item.roles.includes("admin"))
    )

    // Check if a menu item is active (matches current pathname or is a parent)
    const isActive = (href: string) => {
        if (!pathname) return false
        // Exact match or starts with the href (for nested routes like /admin/pedidos/123)
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <div onWheel={handleWheel} className="w-full h-full bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800/60 shadow-2xl relative overflow-hidden select-none">
            {/* Ambient subtle glow gradient overlay */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Logo */}
            <div className="p-5 border-b border-slate-800/60 shrink-0 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-lg">
                    B
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                        CRM Pro
                    </h2>
                    <p className="text-[11px] font-medium text-slate-400">
                        {role === 'superadmin' ? 'Panel Propietario' : role === 'admin' ? 'Panel Administración' : 'Panel Trabajador'}
                    </p>
                </div>
            </div>

            {/* Navigation items */}
            <nav ref={navRef} className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-auto scrollbar-thin scrollbar-thumb-slate-800">
                {visibleMenuItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3.5 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200 group font-medium ${
                                active
                                    ? 'text-white font-bold'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                            }`}
                        >
                            {/* Animated active background pill */}
                            {active && (
                                <m.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl shadow-inner"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            {/* Active left accent bar */}
                            {active && (
                                <m.div
                                    layoutId="sidebar-active-bar"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full shadow-md shadow-blue-500/50"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            <item.icon className={`relative z-10 h-4.5 w-4.5 transition-transform duration-300 ${active ? 'text-blue-400 scale-110' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'}`} />
                            <span className="relative z-10 tracking-tight">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Role Badge */}
            <div className="px-4 pb-3 shrink-0">
                <div className={`px-3 py-2 rounded-xl text-xs font-bold text-center backdrop-blur-md shadow-sm ${
                    role === 'superadmin' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                    role === 'admin' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' :
                    'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                    {role === 'superadmin' ? '⭐ Propietario' : role === 'admin' ? '👑 Administrador' : '👤 Trabajador'}
                </div>
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-slate-800/60 shrink-0 bg-slate-950/80">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3.5 py-2.5 w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 font-semibold group"
                >
                    <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
