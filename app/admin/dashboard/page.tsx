"use client"

import { useState, useEffect } from "react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { DollarSign, ShoppingBag, Users, Package, ClipboardList, AlertTriangle, RefreshCw, LayoutDashboard, ArrowRight, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { useDashboardStats } from "@/features/admin/hooks/use-admin-dashboard"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase.client"
import { DashboardStatsSkeleton } from "@/features/admin/components/skeleton-previews"
import { m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SalesChart, type SalesDataPoint } from "@/features/admin/components/dashboard/sales-chart"
import { fetchAdminSalesChart, fetchAdminRecentOrders, fetchAdminTopProducts } from "@/features/admin/services/dashboard.client"
import { EzMartDashboard } from "@/features/admin/components/dashboard/ezmart-dashboard"

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
    const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin", "worker"] })
    const userRole = guard.role || 'worker'
    const userId = useCurrentUserId()

    const { data: stats, isLoading, isError, error } = useDashboardStats(userRole, userId)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!userId) return
        const supabase = createClient()
        const channel = supabase
            .channel('admin-dashboard-realtime')
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'pedidos' }, 
                () => {
                    queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] })
                }
            )
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [userId, queryClient])

    const safeStats = stats || {
        totalVentasReales: 0, ventasHoy: 0, pedidosPendientes: 0,
        pedidosEnProceso: 0, pedidosEntregados: 0, pedidosAsignados: 0,
        totalClientes: 0, productosLowStock: 0
    }

    const [period, setPeriod] = useState<"week" | "month" | "year">("week")
    const [salesData, setSalesData] = useState<Array<{ date: string; total: number; orders: number }>>([])
    const [recentOrders, setRecentOrders] = useState<Array<any>>([])
    const [topProducts, setTopProducts] = useState<Array<any>>([])
    const [chartLoading, setChartLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        setChartLoading(true)
        Promise.all([
            fetchAdminSalesChart(period),
            fetchAdminRecentOrders(),
            fetchAdminTopProducts()
        ]).then(([chartRes, ordersRes, productsRes]) => {
            if (mounted) {
                setSalesData(chartRes)
                setRecentOrders(ordersRes)
                setTopProducts(productsRes)
                setChartLoading(false)
            }
        })
        return () => { mounted = false }
    }, [period])

    if (guard.loading) {
        return (
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="flex justify-between items-end gap-6">
                    <div className="space-y-3">
                        <Skeleton className="h-14 w-64 rounded-2xl" />
                        <Skeleton className="h-4 w-80 rounded-lg" />
                    </div>
                </div>
                <DashboardStatsSkeleton />
            </div>
        )
    }

    if (guard.accessDenied) return <AccessDenied />

    if (isError) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">Error de Carga</h2>
                <p className="text-gray-600 max-w-md">{(error as Error)?.message || "No se pudieron cargar los datos."}</p>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 rounded-xl">Reintentar</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* --- UNIFIED ADMIN PAGE HEADER --- */}
            <AdminPageHeader
                icon={<LayoutDashboard size={28} strokeWidth={1.5} />}
                iconColor="bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700"
                iconShadow="shadow-blue-500/20"
                title={userRole === 'admin' || userRole === 'superadmin' ? 'Dashboard' : 'Mi Panel'}
                subtitle={userRole === 'admin' || userRole === 'superadmin' ? 'Visión global de tu negocio' : 'Resumen de tus operaciones'}
                isFetching={isLoading}
                dotColor="bg-emerald-500"
                actions={
                    <Button
                        className="flex-1 md:flex-none gap-2 h-11 px-6 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 font-extrabold tracking-tight shadow-md transition-all haptic-scale"
                        onClick={() => {
                            queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] })
                            fetchAdminSalesChart(period).then(setSalesData)
                            fetchAdminRecentOrders().then(setRecentOrders)
                            fetchAdminTopProducts().then(setTopProducts)
                        }}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Sincronizar
                    </Button>
                }
            />

            {/* --- MAIN DASHBOARD CONTENT --- */}
            {isLoading ? (
                <DashboardStatsSkeleton />
            ) : (
                <EzMartDashboard
                    stats={safeStats}
                    salesData={salesData}
                    recentOrders={recentOrders}
                    topProducts={topProducts}
                    period={period}
                    onPeriodChange={setPeriod}
                />
            )}
        </div>
    )
}
