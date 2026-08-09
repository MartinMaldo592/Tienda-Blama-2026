"use client"

import { m } from "framer-motion"
import {
    DollarSign, ShoppingBag, Users, Package, ClipboardList,
    CheckCircle2, ArrowRight, TrendingUp, RefreshCw, AlertTriangle
} from "lucide-react"
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EzMartDashboardProps {
    stats: {
        totalVentasReales: number
        ventasHoy: number
        pedidosPendientes: number
        pedidosEnProceso: number
        pedidosEntregados: number
        pedidosAsignados: number
        totalClientes: number
        productosLowStock: number
    }
    salesData: Array<{ date: string; total: number; orders: number }>
    period: "week" | "month" | "year"
    onPeriodChange: (p: "week" | "month" | "year") => void
}

export function EzMartDashboard({ stats, salesData, period, onPeriodChange }: EzMartDashboardProps) {
    const totalPeriodSales = salesData.reduce((acc, curr) => acc + curr.total, 0)
    const totalPeriodOrders = salesData.reduce((acc, curr) => acc + curr.orders, 0)

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* ================= 4 REAL STAT CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. VENTAS ENTREGADO */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <Link href="/admin/dashboard/ventas" className="block group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Ventas (Entregado)</span>
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {formatCurrency(stats.totalVentasReales)}
                                </h3>
                                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                                    <TrendingUp className="h-3 w-3" /> Hoy: {formatCurrency(stats.ventasHoy)}
                                </div>
                            </div>
                        </div>
                    </Link>
                </m.div>

                {/* 2. PEDIDOS PENDIENTES */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Link href="/admin/dashboard/pedidos-pendientes" className="block group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Pedidos Pendientes</span>
                                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {stats.pedidosPendientes}
                                </h3>
                                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                                    Por atender urgentemente
                                </div>
                            </div>
                        </div>
                    </Link>
                </m.div>

                {/* 3. EN PROCESO */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <Link href="/admin/dashboard/pedidos-en-proceso" className="block group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">En Proceso</span>
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {stats.pedidosEnProceso}
                                </h3>
                                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-900/40">
                                    Confirmado / Enviado
                                </div>
                            </div>
                        </div>
                    </Link>
                </m.div>

                {/* 4. STOCK BAJO */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/admin/dashboard/stock-bajo" className="block group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Stock Bajo</span>
                                <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Package className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {stats.productosLowStock}
                                </h3>
                                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full border border-rose-200/60 dark:border-rose-900/40">
                                    Productos &lt; 5 unidades
                                </div>
                            </div>
                        </div>
                    </Link>
                </m.div>
            </div>

            {/* ================= SALES CHART & METRICS GRID ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* REVENUE CHART (8 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Tendencia de Ventas</h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                                Total en este periodo: <span className="text-slate-900 dark:text-white font-black text-sm ml-1">{formatCurrency(totalPeriodSales)}</span>
                                <span className="mx-2">•</span>
                                <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full text-xs font-extrabold">{totalPeriodOrders} pedidos</span>
                            </p>
                        </div>

                        {/* Period Filter Buttons */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                            {(["week", "month", "year"] as const).map((p) => (
                                <Button
                                    key={p}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPeriodChange(p)}
                                    className={`px-4 h-9 text-xs font-black tracking-wide rounded-xl transition-all haptic-scale ${
                                        period === p
                                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {p === "week" ? "7 DÍAS" : p === "month" ? "30 DÍAS" : "AÑO"}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[320px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="blamaBlueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `S/${v}`} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const p = payload[0].payload
                                            return (
                                                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{p.date}</p>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">Ventas: {formatCurrency(p.total)}</p>
                                                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Pedidos: {p.orders}</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#blamaBlueGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </m.div>

                {/* SIDEBAR METRICS & QUICK LINKS (4 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="xl:col-span-4 space-y-6 flex flex-col justify-between"
                >
                    {/* CLIENTES TOTALES */}
                    <Link href="/admin/clientes" className="block group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Clientes Totales</p>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.totalClientes}</h4>
                                    <p className="text-xs font-semibold text-slate-400 mt-1">Registrados en el sistema</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* ENTREGAS COMPLETADAS */}
                    <Link href="/admin/dashboard/ventas" className="block group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Entregas Completadas</p>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.pedidosEntregados}</h4>
                                    <p className="text-xs font-semibold text-slate-400 mt-1">Pedidos finalizados con éxito</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* ACCESOS RÁPIDOS CARD */}
                    <div className="bg-slate-900 dark:bg-slate-950 rounded-[2rem] p-6 text-white shadow-md flex-1 flex flex-col justify-between border border-slate-800">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                            <div className="h-5 w-1.5 bg-blue-500 rounded-full" />
                            Accesos Rápidos
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/admin/pedidos" className="group rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-all flex flex-col items-center justify-center gap-2 text-center border border-white/5">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="font-bold text-xs tracking-tight">Pedidos</span>
                            </Link>
                            <Link href="/admin/productos" className="group rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-all flex flex-col items-center justify-center gap-2 text-center border border-white/5">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Package size={20} />
                                </div>
                                <span className="font-bold text-xs tracking-tight">Productos</span>
                            </Link>
                        </div>
                    </div>
                </m.div>
            </div>
        </div>
    )
}
