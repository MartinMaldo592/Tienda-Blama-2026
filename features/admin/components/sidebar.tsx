"use client"

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
        <div className="w-full h-full bg-[#0f172a] text-slate-100 flex flex-col border-r border-slate-800/80 shadow-2xl relative overflow-hidden select-none">
            {/* Header / Logo */}
            <div className="p-5 border-b border-slate-800/80 shrink-0 flex items-center justify-between bg-[#0f172a]/90 backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            CRM
                        </h2>
                        <span className="text-[9px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded-md">v2.5</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                        {role === 'superadmin' ? 'Panel Propietario' : role === 'admin' ? 'Panel Administración' : 'Panel Trabajador'}
                    </p>
                </div>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 px-3.5 py-5 space-y-6 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-800">
                {menuSections.map((section, idx) => {
                    const visibleItems = section.items.filter(item => 
                        item.roles.includes(role) || (role === "superadmin" && item.roles.includes("admin"))
                    )

                    if (visibleItems.length === 0) return null

                    return (
                        <div key={idx} className="space-y-1">
                            <div className="px-3 pb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                                                ? 'text-white shadow-md'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                        }`}
                                    >
                                        {/* Active background pill */}
                                        {active && (
                                            <m.div
                                                layoutId="sidebar-active-pill"
                                                className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/30"
                                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                            />
                                        )}

                                        <item.icon className={`relative z-10 h-4 w-4 transition-transform duration-200 ${active ? 'text-white scale-105' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'}`} />
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
                <div className={`px-3 py-2 rounded-xl text-xs font-bold text-center border backdrop-blur-md shadow-sm ${
                    role === 'superadmin' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                    role === 'admin' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' :
                    'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                    {role === 'superadmin' ? '⭐ Propietario' : role === 'admin' ? '👑 Administrador' : '👤 Trabajador'}
                </div>
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-slate-800/80 shrink-0 bg-[#0f172a]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3.5 py-2.5 w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 font-semibold group cursor-pointer"
                >
                    <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
