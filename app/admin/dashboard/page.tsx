"use client"

import { useState } from "react"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, Package, ClipboardList, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { useDashboardStats } from "@/features/admin/hooks/use-admin-dashboard"
import { createClient } from "@/lib/supabase.client"

// Helper hook to get current user ID
import { useEffect } from "react"
function useCurrentUserId() {
    const [uid, setUid] = useState("")
    useEffect(() => {
        createClient().auth.getSession().then(({ data }) => {
            if (data.session?.user?.id) setUid(data.session.user.id)
        })
    }, [])
    return uid
}

export default function AdminDashboard() {
    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })
    const userRole = guard.role || 'worker'
    const userId = useCurrentUserId()

    // React Query Hook
    const { data: stats, isLoading, isError, error } = useDashboardStats(userRole, userId)

    // Default empty stats to avoid crashes while loading
    const safeStats = stats || {
        totalVentasReales: 0,
        ventasHoy: 0,
        pedidosPendientes: 0,
        pedidosEnProceso: 0,
        pedidosEntregados: 0,
        pedidosAsignados: 0,
        totalClientes: 0,
        productosLowStock: 0
    }

    if (guard.loading) {
        return <div className="p-10 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-muted-foreground text-sm">Verificando permisos...</p>
            </div>
        </div>
    }

    if (guard.accessDenied) {
        return <AccessDenied />
    }

    if (isError) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">Error de Carga</h2>
                <p className="text-gray-600 max-w-md">{(error as Error)?.message || "No se pudieron cargar los datos."}</p>
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
        <div className="space-y-8 animate-in fade-in duration-500">
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
                            value={formatCurrency(safeStats.totalVentasReales)}
                            change={`Hoy: ${formatCurrency(safeStats.ventasHoy)}`}
                            icon={<DollarSign className="h-6 w-6" />}
                            wrapperClass="bg-green-50 border-green-100 green"
                            loading={isLoading}
                            href="/admin/dashboard/ventas"
                        />
                        <StatsCard
                            title="Pedidos Pendientes"
                            value={safeStats.pedidosPendientes.toString()}
                            change="Por atender"
                            icon={<ShoppingBag className="h-6 w-6" />}
                            wrapperClass="bg-orange-50 border-orange-100 orange"
                            loading={isLoading}
                            href="/admin/dashboard/pedidos-pendientes"
                        />
                        <StatsCard
                            title="En Proceso"
                            value={safeStats.pedidosEnProceso.toString()}
                            change="Confirmado / Enviado"
                            icon={<ClipboardList className="h-6 w-6" />}
                            wrapperClass="bg-blue-50 border-blue-100 blue"
                            loading={isLoading}
                            href="/admin/dashboard/pedidos-en-proceso"
                        />
                        <StatsCard
                            title="Stock Bajo"
                            value={safeStats.productosLowStock.toString()}
                            change="Productos < 5 un."
                            icon={<Package className="h-6 w-6" />}
                            wrapperClass="bg-red-50 border-red-100 red"
                            loading={isLoading}
                            href="/admin/dashboard/stock-bajo"
                        />
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="Pedidos Asignados"
                            value={safeStats.pedidosAsignados.toString()}
                            change="Pendientes de gestionar"
                            icon={<ClipboardList className="h-6 w-6" />}
                            wrapperClass="bg-blue-50 border-blue-100 blue"
                            loading={isLoading}
                            href="/admin/pedidos"
                        />
                    </>
                )}
            </div>

            {/* Sales Chart Section (Admin Only) */}
            {
                userRole === "admin" && (
                    <div className="grid grid-cols-1">
                        <DashboardSalesChart />
                    </div>
                )
            }


            {userRole === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatsCard
                        title="Clientes Totales"
                        value={safeStats.totalClientes.toString()}
                        change="Base de datos"
                        icon={<Users className="h-6 w-6" />}
                        wrapperClass="bg-blue-50 border-blue-100 blue"
                        loading={isLoading}
                        href="/admin/clientes"
                    />
                    <StatsCard
                        title="Pedidos Entregados"
                        value={safeStats.pedidosEntregados.toString()}
                        change="Ventas completadas"
                        icon={<ShoppingBag className="h-6 w-6" />}
                        wrapperClass="bg-green-50 border-green-100 green"
                        loading={isLoading}
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
        </div >
    )
}

function StatsCard({ title, value, change, icon, wrapperClass, loading, href }: any) {
    // Definimos estilos base según clases antiguas para mantener compatibilidad
    let styles = "from-gray-50 to-slate-50 border-gray-100/50 hover:border-gray-200"
    let iconStyles = "text-blue-600"
    let badgeStyles = "text-slate-600 bg-slate-100/50 border-slate-200/50"

    // Animación específica para cada tipo de tarjeta
    let animationClass = "group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"

    if (wrapperClass?.includes("green")) {
        styles = "from-emerald-50 to-teal-50 border-emerald-100/50 hover:border-emerald-200"
        iconStyles = "text-emerald-600"
        badgeStyles = "text-emerald-700 bg-emerald-100/50 border-emerald-200/50"
        // Dinero: Efecto "Pop" grande y rotación divertida
        animationClass = "group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 ease-out"
    } else if (wrapperClass?.includes("orange")) {
        styles = "from-amber-50 to-orange-50 border-amber-100/50 hover:border-amber-200"
        iconStyles = "text-amber-600"
        badgeStyles = "text-amber-700 bg-amber-100/50 border-amber-200/50"
        // Pendiente: Efecto de "avance" o "bolsa moviéndose"
        animationClass = "group-hover:translate-x-2 transition-all duration-300"
    } else if (wrapperClass?.includes("red")) {
        styles = "from-rose-50 to-red-50 border-rose-100/50 hover:border-rose-200"
        iconStyles = "text-rose-600"
        badgeStyles = "text-rose-700 bg-rose-100/50 border-rose-200/50"
        // Alerta: Pulso para llamar la atención
        animationClass = "group-hover:animate-pulse group-hover:scale-110"
    } else if (wrapperClass?.includes("blue")) {
        styles = "from-blue-50 to-indigo-50 border-blue-100/50 hover:border-blue-200"
        iconStyles = "text-blue-600"
        badgeStyles = "text-blue-700 bg-blue-100/50 border-blue-200/50"
    }

    const content = (
        <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${styles} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer`}>
            {/* Background Decoration Circle */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-white/50"></div>

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground/80 mb-1 transition-colors group-hover:text-gray-700">{title}</p>
                    {loading ? (
                        <div className="space-y-2 mt-2">
                            <div className="h-8 w-24 bg-black/5 animate-pulse rounded-md"></div>
                            <div className="h-3 w-16 bg-black/5 animate-pulse rounded-md"></div>
                        </div>
                    ) : (
                        <div className="mt-1">
                            <h3 className="text-3xl font-bold tracking-tight text-gray-900 transition-transform duration-300 group-hover:translate-x-1">
                                {value}
                            </h3>
                            {change && (
                                <div className="flex items-center gap-1 mt-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border transition-colors ${badgeStyles}`}>
                                        {change}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Icon Container with Animated Glass Effect */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-black/5 ${iconStyles} ${animationClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    )

    if (typeof href === 'string') {
        return (
            <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-2xl">
                {content}
            </Link>
        )
    }

    return content
}


import { SalesChart, type SalesDataPoint } from "@/components/admin/dashboard/sales-chart"
import { fetchAdminSalesChart } from "@/features/admin/services/dashboard.client"

function DashboardSalesChart() {
    const [period, setPeriod] = useState<"week" | "month" | "year">("week")
    const [data, setData] = useState<SalesDataPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        fetchAdminSalesChart(period).then((res) => {
            if (mounted) {
                setData(res)
                setLoading(false)
            }
        })
        return () => { mounted = false }
    }, [period])

    return (
        <SalesChart
            data={data}
            loading={loading}
            period={period}
            onPeriodChange={setPeriod}
        />
    )
}
