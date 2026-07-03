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
        <div className="w-full h-full bg-sidebar text-sidebar-foreground flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border shrink-0">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    CRM Pro
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    {role === 'superadmin' ? 'Panel Propietario' : role === 'admin' ? 'Panel de Administración' : 'Panel de Trabajador'}
                </p>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto overscroll-contain">
                {visibleMenuItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group ${
                                active
                                    ? 'text-sidebar-accent-foreground font-bold'
                                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                            }`}
                        >
                            {/* Animated active background pill */}
                            {active && (
                                <m.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 bg-sidebar-accent rounded-xl"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            {/* Active left accent bar */}
                            {active && (
                                <m.div
                                    layoutId="sidebar-active-bar"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            <item.icon className={`relative z-10 h-4 w-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Role Badge */}
            <div className="px-3 pb-3 shrink-0">
                <div className={`px-3 py-2 rounded-xl text-xs font-bold text-center ${
                    role === 'superadmin' ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border border-amber-200/50' :
                    role === 'admin' ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-200/50' :
                    'bg-accent/10 text-accent-foreground border border-border'
                    }`}>
                    {role === 'superadmin' ? '⭐ Propietario' : role === 'admin' ? '👑 Administrador' : '👤 Trabajador'}
                </div>
            </div>

            <div className="p-3 border-t border-border shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-all font-medium"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
