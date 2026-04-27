"use client"

import { useState, useEffect } from "react"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { DollarSign, ShoppingBag, Users, Package, ClipboardList, AlertTriangle, RefreshCw, LayoutDashboard, ArrowRight, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { useDashboardStats } from "@/features/admin/hooks/use-admin-dashboard"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase.client"
import { DashboardStatsSkeleton } from "@/components/admin/skeleton-previews"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SalesChart, type SalesDataPoint } from "@/components/admin/dashboard/sales-chart"
import { fetchAdminSalesChart } from "@/features/admin/services/dashboard.client"

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
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* --- HEADER MATCHING PEDIDOS/PRODUCTOS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pt-4">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                            <LayoutDashboard size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                                    {userRole === 'admin' ? 'Dashboard' : 'Mi Panel'}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    {userRole === 'admin' ? 'Visión global de tu negocio' : 'Resumen de tus operaciones'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap gap-3 w-full lg:w-auto"
                >
                    <Button
                        className="flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 font-black tracking-tight shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all haptic-scale"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] })}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                        SINCRONIZAR
                    </Button>
                </motion.div>
            </div>

            {/* --- MAIN STATS GRID --- */}
            {isLoading ? (
                <DashboardStatsSkeleton />
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {userRole === 'admin' ? (
                        <>
                            <StatsCard
                                title="Ventas (Entregado)"
                                value={formatCurrency(safeStats.totalVentasReales)}
                                change={`Hoy: ${formatCurrency(safeStats.ventasHoy)}`}
                                icon={<DollarSign className="h-7 w-7" />}
                                wrapperClass="green"
                                loading={isLoading}
                                href="/admin/dashboard/ventas"
                                delay={0.1}
                            />
                            <StatsCard
                                title="Pedidos Pendientes"
                                value={safeStats.pedidosPendientes.toString()}
                                change="Por atender urgentemente"
                                icon={<ShoppingBag className="h-7 w-7" />}
                                wrapperClass="orange"
                                loading={isLoading}
                                href="/admin/dashboard/pedidos-pendientes"
                                delay={0.15}
                            />
                            <StatsCard
                                title="En Proceso"
                                value={safeStats.pedidosEnProceso.toString()}
                                change="Confirmado / Enviado"
                                icon={<ClipboardList className="h-7 w-7" />}
                                wrapperClass="blue"
                                loading={isLoading}
                                href="/admin/dashboard/pedidos-en-proceso"
                                delay={0.2}
                            />
                            <StatsCard
                                title="Stock Bajo"
                                value={safeStats.productosLowStock.toString()}
                                change="Productos < 5 unidades"
                                icon={<Package className="h-7 w-7" />}
                                wrapperClass="red"
                                loading={isLoading}
                                href="/admin/dashboard/stock-bajo"
                                delay={0.25}
                            />
                        </>
                    ) : (
                        <StatsCard
                            title="Pedidos Asignados"
                            value={safeStats.pedidosAsignados.toString()}
                            change="Pendientes de gestionar"
                            icon={<ClipboardList className="h-7 w-7" />}
                            wrapperClass="blue"
                            loading={isLoading}
                            href="/admin/pedidos"
                            delay={0.1}
                        />
                    )}
                </motion.div>
            )}

            {/* --- SALES CHART & SECONDARY STATS --- */}
            {userRole === "admin" && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                >
                    <div className="xl:col-span-2">
                        <DashboardSalesChart />
                    </div>
                    
                    <div className="space-y-6 flex flex-col justify-between">
                        <StatsCard
                            title="Clientes Totales"
                            value={safeStats.totalClientes.toString()}
                            change="Registrados en el sistema"
                            icon={<Users className="h-7 w-7" />}
                            wrapperClass="blue"
                            loading={isLoading}
                            href="/admin/clientes"
                            delay={0.35}
                        />
                        <StatsCard
                            title="Entregas Completadas"
                            value={safeStats.pedidosEntregados.toString()}
                            change="Pedidos finalizados"
                            icon={<CheckCircle2 className="h-7 w-7" />}
                            wrapperClass="green"
                            loading={isLoading}
                            href="/admin/dashboard/ventas"
                            delay={0.4}
                        />
                        
                        {/* --- QUICK LINKS CARD --- */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45 }}
                            className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex-1 flex flex-col"
                        >
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <div className="h-6 w-1.5 bg-blue-500 rounded-full" />
                                Accesos Rápidos
                            </h3>
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                <Link href="/admin/pedidos" className="group relative overflow-hidden rounded-[1.5rem] bg-white/10 p-4 hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center border border-white/5 hover:border-white/20">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <span className="font-bold text-sm tracking-wide">Pedidos</span>
                                </Link>
                                <Link href="/admin/productos" className="group relative overflow-hidden rounded-[1.5rem] bg-white/10 p-4 hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center border border-white/5 hover:border-white/20">
                                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                        <Package size={24} />
                                    </div>
                                    <span className="font-bold text-sm tracking-wide">Inventario</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {userRole !== 'admin' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <Link href="/admin/pedidos" className="group bg-slate-900 rounded-[2rem] p-8 text-white flex items-center justify-between hover:shadow-2xl transition-all haptic-scale">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                <ShoppingBag size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">Mis Pedidos</h3>
                                <p className="text-slate-400 font-medium">Gestiona tus entregas asignadas</p>
                            </div>
                        </div>
                        <ArrowRight size={24} className="text-slate-500 group-hover:translate-x-2 group-hover:text-white transition-all" />
                    </Link>
                </motion.div>
            )}
        </div>
    )
}


function StatsCard({ title, value, change, icon, wrapperClass, loading, href, delay = 0 }: any) {
    let styles = "from-slate-50 to-white border-slate-100"
    let iconStyles = "text-blue-600 bg-blue-50"
    let badgeStyles = "text-slate-500 bg-slate-100/50"
    let shadowColor = "shadow-slate-200/50"

    if (wrapperClass?.includes("green")) {
        styles = "from-emerald-50/50 to-white border-emerald-100/50"
        iconStyles = "text-emerald-600 bg-emerald-100/50"
        badgeStyles = "text-emerald-700 bg-emerald-100/50"
        shadowColor = "hover:shadow-emerald-200/50"
    } else if (wrapperClass?.includes("orange")) {
        styles = "from-orange-50/50 to-white border-orange-100/50"
        iconStyles = "text-orange-600 bg-orange-100/50"
        badgeStyles = "text-orange-700 bg-orange-100/50"
        shadowColor = "hover:shadow-orange-200/50"
    } else if (wrapperClass?.includes("red")) {
        styles = "from-rose-50/50 to-white border-rose-100/50"
        iconStyles = "text-rose-600 bg-rose-100/50"
        badgeStyles = "text-rose-700 bg-rose-100/50"
        shadowColor = "hover:shadow-rose-200/50"
    } else if (wrapperClass?.includes("blue")) {
        styles = "from-blue-50/50 to-white border-blue-100/50"
        iconStyles = "text-blue-600 bg-blue-100/50"
        badgeStyles = "text-blue-700 bg-blue-100/50"
        shadowColor = "hover:shadow-blue-200/50"
    }

    const content = (
        <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-[2rem] border bg-gradient-to-br ${styles} p-8 transition-all duration-300 hover:shadow-2xl ${shadowColor} hover:-translate-y-1 group cursor-pointer h-full`}
        >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-white/60"></div>

            <div className="relative flex flex-col h-full justify-between gap-4">
                <div className="flex items-start justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] ${iconStyles} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                        {loading ? <Skeleton className="h-6 w-6 rounded-full" /> : icon}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-sm font-bold tracking-wide uppercase text-slate-400 mb-2">
                        {loading ? <Skeleton className="h-4 w-24" /> : title}
                    </div>
                    {loading ? (
                        <div className="space-y-2 mt-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ) : (
                        <>
                            <h3 className="text-4xl font-black tracking-tight text-slate-900">
                                {value}
                            </h3>
                            {change && (
                                <p className={`text-xs font-bold px-3 py-1 rounded-full inline-block mt-2 tracking-wide ${badgeStyles}`}>
                                    {change}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    )

    if (typeof href === 'string') {
        return (
            <Link href={href} className="block outline-none rounded-[2rem] h-full">
                {content}
            </Link>
        )
    }

    return content
}

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
