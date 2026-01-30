"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, Package, ClipboardList, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { fetchAdminDashboardStats } from "@/features/admin"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalVentasReales: 0,
        ventasHoy: 0,
        pedidosPendientes: 0,
        pedidosEnProceso: 0,
        pedidosEntregados: 0,
        pedidosAsignados: 0,
        totalClientes: 0,
        productosLowStock: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })

    // We trust that if guard.accessDenied is false and guard.loading is false,
    // then guard.role is either 'admin' or 'worker'
    // But we default to 'worker' for UI rendering if strictly null just in case
    const userRole = guard.role || 'worker'

    const fetchStats = useCallback(async (role: string, currentUserId: string) => {
        setLoading(true)

        const next = await fetchAdminDashboardStats({ role, currentUserId })
        setStats(next)
        setLoading(false)
    }, [])

    useEffect(() => {
        if (guard.loading || guard.accessDenied) return

        const role = guard.role || 'worker'

            ; (async () => {
                const { data: { session } } = await supabase.auth.getSession()
                const uid = session?.user?.id || ''
                try {
                    await fetchStats(role, uid)
                } catch (err) {
                    console.error("Dashboard Load Error:", err)
                    setError("No se pudo conectar con la base de datos. Verifica tu conexión a internet o la configuración del proyecto.")
                    setLoading(false)
                }
            })()
    }, [guard.loading, guard.accessDenied, guard.role, fetchStats])

    if (guard.loading) {
        return <div className="p-10">Cargando...</div>
    }

    if (guard.accessDenied) {
        return <AccessDenied />
    }

    if (error) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">Error de Carga</h2>
                <p className="text-gray-600 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {userRole === 'admin' ? 'Dashboard General' : 'Mi Panel'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {userRole === 'admin'
                        ? 'Resumen general de tu tienda'
                        : 'Resumen de tus pedidos asignados'}
                </p>
            </div>

            {/* Stats Grid - Different for Admin vs Worker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userRole === 'admin' ? (
                    <>
                        <StatsCard
                            title="Ventas (Entregado)"
                            value={formatCurrency(stats.totalVentasReales)}
                            change={`Hoy: ${formatCurrency(stats.ventasHoy)}`}
                            icon={<DollarSign className="h-6 w-6 text-green-600" />}
                            wrapperClass="bg-green-50 border-green-100"
                            loading={loading}
                            href="/admin/dashboard/ventas"
                        />
                        <StatsCard
                            title="Pedidos Pendientes"
                            value={stats.pedidosPendientes.toString()}
                            change="Por atender"
                            icon={<ShoppingBag className="h-6 w-6 text-orange-600" />}
                            wrapperClass="bg-orange-50 border-orange-100"
                            loading={loading}
                            href="/admin/dashboard/pedidos-pendientes"
                        />
                        <StatsCard
                            title="En Proceso"
                            value={stats.pedidosEnProceso.toString()}
                            change="Confirmado / Enviado"
                            icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
                            wrapperClass="bg-blue-50 border-blue-100"
                            loading={loading}
                            href="/admin/dashboard/pedidos-en-proceso"
                        />
                        <StatsCard
                            title="Stock Bajo"
                            value={stats.productosLowStock.toString()}
                            change="Productos < 5 un."
                            icon={<Package className="h-6 w-6 text-red-600" />}
                            wrapperClass="bg-red-50 border-red-100"
                            loading={loading}
                            href="/admin/dashboard/stock-bajo"
                        />
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="Pedidos Asignados"
                            value={stats.pedidosAsignados.toString()}
                            change="Pendientes de gestionar"
                            icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
                            wrapperClass="bg-blue-50 border-blue-100"
                            loading={loading}
                            href="/admin/pedidos"
                        />
                    </>
                )}
            </div>

            {userRole === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatsCard
                        title="Clientes Totales"
                        value={stats.totalClientes.toString()}
                        change="Base de datos"
                        icon={<Users className="h-6 w-6 text-blue-600" />}
                        wrapperClass="bg-blue-50 border-blue-100"
                        loading={loading}
                        href="/admin/clientes"
                    />
                    <StatsCard
                        title="Pedidos Entregados"
                        value={stats.pedidosEntregados.toString()}
                        change="Ventas completadas"
                        icon={<ShoppingBag className="h-6 w-6 text-green-600" />}
                        wrapperClass="bg-green-50 border-green-100"
                        loading={loading}
                        href="/admin/dashboard/ventas"
                    />
                </div>
            )}

            {/* Quick Links - Different for Admin vs Worker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                        <CardTitle>Accesos Rápidos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/admin/pedidos" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border flex flex-col items-center justify-center text-center gap-2">
                            <ShoppingBag className="h-8 w-8 text-gray-600" />
                            <span className="font-medium">
                                {userRole === 'admin' ? 'Gestionar Pedidos' : 'Mis Pedidos'}
                            </span>
                        </Link>

                        {/* Inventario - Solo para Admin */}
                        {userRole === 'admin' && (
                            <Link href="/admin/productos" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border flex flex-col items-center justify-center text-center gap-2">
                                <Package className="h-8 w-8 text-gray-600" />
                                <span className="font-medium">Inventario</span>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, icon, wrapperClass, loading, href }: any) {
    const content = (
        <Card className={`border shadow-sm transition-all hover:shadow-md ${wrapperClass}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        {icon}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{change}</p>
                </div>
            </CardContent>
        </Card>
    )

    if (typeof href === 'string') {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        )
    }

    return content
}
