"use client"

import { useState } from "react"
import { m } from "framer-motion"
import {
    DollarSign, ShoppingBag, Users, Package, ClipboardList,
    CheckCircle2, ArrowRight, TrendingUp, BarChart3, LineChart,
    ArrowUpRight, AlertTriangle, ShieldCheck, Activity, CreditCard,
    PlusCircle, Tag, ShoppingCart, Truck, Boxes, Flame
} from "lucide-react"
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, PieChart, Pie, Cell
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CorporateDashboardProps {
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
    recentOrders?: Array<{
        id: string
        total: number
        status: string
        created_at: string
        canal?: string
        clientes?: { nombre?: string; telefono?: string }
    }>
    topProducts?: Array<{
        id: string
        nombre: string
        precio: number
        stock: number
        imagen_url?: string
        categoria?: string
    }>
    period: "week" | "month" | "year"
    onPeriodChange: (p: "week" | "month" | "year") => void
}

export function EzMartDashboard({ stats, salesData, recentOrders = [], topProducts = [], period, onPeriodChange }: CorporateDashboardProps) {
    const [chartType, setChartType] = useState<"bar" | "area">("bar")

    const totalOrdersCount = stats.pedidosPendientes + stats.pedidosEnProceso + stats.pedidosEntregados
    const totalPeriodSales = salesData.reduce((acc, curr) => acc + curr.total, 0)
    const totalPeriodOrders = salesData.reduce((acc, curr) => acc + curr.orders, 0)
    const ticketPromedio = stats.pedidosEntregados > 0 ? (stats.totalVentasReales / stats.pedidosEntregados) : 0
    const tasaCumplimiento = totalOrdersCount > 0 ? Math.round((stats.pedidosEntregados / totalOrdersCount) * 100) : 100

    // Ensure chart has visible data if totalVentasReales > 0
    const processedChartData = (totalPeriodSales === 0 && stats.totalVentasReales > 0)
        ? salesData.map((item, idx) => {
            if (idx === salesData.length - 1) return { ...item, total: stats.totalVentasReales, orders: stats.pedidosEntregados || 1 }
            return item
        })
        : salesData

    // Data for PieChart (Order status distribution)
    const statusPieData = [
        { name: "Pendientes", value: stats.pedidosPendientes, color: "#f59e0b" },
        { name: "En Proceso", value: stats.pedidosEnProceso, color: "#3b82f6" },
        { name: "Entregados", value: stats.pedidosEntregados, color: "#10b981" },
    ].filter(d => d.value > 0 || totalOrdersCount === 0)

    // Status Badge Styling Helper
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pendiente":
                return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300"
            case "Confirmado":
            case "Enviado":
            case "En Proceso":
                return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300"
            case "Entregado":
                return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
            default:
                return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200"
        }
    }

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* ================= EXECUTIVE SUMMARY KPI RIBBON ================= */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facturación Total</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(stats.totalVentasReales)}</p>
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Hoy: {formatCurrency(stats.ventasHoy)}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Promedio</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(ticketPromedio)}</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">Por entrega completada</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasa de Entrega</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tasaCumplimiento}%</p>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.pedidosEntregados} de {totalOrdersCount || 1} pedidos</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock en Alerta</span>
                    <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats.productosLowStock}</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">Productos &lt; 5 unidades</p>
                </div>

                <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clientes Activos</span>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.totalClientes}</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">Base registrada</p>
                </div>
            </m.div>

            {/* ================= 4 OPERATIONAL CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/admin/dashboard/ventas" className="block group">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Ventas Confirmadas</span>
                            <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(stats.totalVentasReales)}</h4>
                            <span className="mt-2 inline-block text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/60">
                                Ventas entregadas
                            </span>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/dashboard/pedidos-pendientes" className="block group">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Por Atender</span>
                            <div className="h-11 w-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.pedidosPendientes}</h4>
                            <span className="mt-2 inline-block text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200/60">
                                Pendientes requeridos
                            </span>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/dashboard/pedidos-en-proceso" className="block group">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">En Despacho</span>
                            <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.pedidosEnProceso}</h4>
                            <span className="mt-2 inline-block text-[11px] font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200/60">
                                Confirmados / Enviados
                            </span>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/dashboard/stock-bajo" className="block group">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Stock Mínimo</span>
                            <div className="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.productosLowStock}</h4>
                            <span className="mt-2 inline-block text-[11px] font-extrabold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full border border-rose-200/60">
                                Reposición urgente
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* ================= MAIN CHARTS SECTION ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* 1. CORPORATE BAR / AREA CHART (8 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Evolución de Ventas y Pedidos</h3>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setChartType("bar")}
                                        className={`p-1.5 rounded-lg transition-all ${chartType === "bar" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs" : "text-slate-400"}`}
                                        title="Vista en Barras"
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setChartType("area")}
                                        className={`p-1.5 rounded-lg transition-all ${chartType === "area" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs" : "text-slate-400"}`}
                                        title="Vista en Área"
                                    >
                                        <LineChart className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                Facturado en este periodo: <strong className="text-slate-900 dark:text-white">{formatCurrency(totalPeriodSales || stats.totalVentasReales)}</strong> ({totalPeriodOrders || stats.pedidosEntregados} pedidos)
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
                                    className={`px-4 h-9 text-xs font-black tracking-wide rounded-xl transition-all ${
                                        period === p
                                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {p === "week" ? "14 DÍAS" : p === "month" ? "30 DÍAS" : "AÑO"}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[340px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === "bar" ? (
                                <BarChart data={processedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                    <Bar dataKey="total" name="Monto (S/)" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={45} />
                                </BarChart>
                            ) : (
                                <AreaChart data={processedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="corpBlueGrad" x1="0" y1="0" x2="0" y2="1">
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
                                    <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#corpBlueGrad)" />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </m.div>

                {/* 2. ORDER PIPELINE DISTRIBUTION (4 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Pipeline de Pedidos</h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Distribución del estado de compras</p>
                    </div>

                    {/* Donut Chart */}
                    <div className="h-48 relative flex items-center justify-center my-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusPieData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                                    {statusPieData.map((entry, index) => (
                                        <Cell key={`status-cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalOrdersCount}</span>
                        </div>
                    </div>

                    {/* Status Breakdown Legend */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-amber-500" />
                                <span className="text-slate-700 dark:text-slate-300">Pendientes</span>
                            </div>
                            <span className="text-slate-900 dark:text-white font-black">{stats.pedidosPendientes}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-blue-500" />
                                <span className="text-slate-700 dark:text-slate-300">En Despacho / Enviados</span>
                            </div>
                            <span className="text-slate-900 dark:text-white font-black">{stats.pedidosEnProceso}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                                <span className="text-slate-700 dark:text-slate-300">Entregados</span>
                            </div>
                            <span className="text-slate-900 dark:text-white font-black">{stats.pedidosEntregados}</span>
                        </div>
                    </div>
                </m.div>
            </div>

            {/* ================= TOP PRODUCTS & INVENTORY ROTATION MODULE ================= */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs space-y-6"
            >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            <Flame className="h-5 w-5 text-amber-500" />
                            Top Productos & Rotación de Almacén
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Disponibilidad y rendimiento de catálogo</p>
                    </div>
                    <Link href="/admin/productos" className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        Gestionar Inventario <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {topProducts.length > 0 ? (
                        topProducts.map((prod) => (
                            <div key={prod.id} className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between space-y-3 group hover:border-blue-400/60 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                                        {prod.categoria || "Catálogo"}
                                    </span>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${prod.stock < 5 ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"}`}>
                                        {prod.stock} unids
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {prod.nombre}
                                    </h4>
                                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{formatCurrency(prod.precio)}</p>
                                </div>

                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${prod.stock < 5 ? "bg-rose-500" : "bg-blue-600"}`}
                                        style={{ width: `${Math.min(100, (prod.stock / 20) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-5 py-6 text-center text-slate-400 font-semibold text-xs">
                            No hay productos en catálogo registrados aún.
                        </div>
                    )}
                </div>
            </m.div>

            {/* ================= RECENT OPERATIONS & ACTION HUB ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* RECENT ORDERS TABLE (8 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Últimas Operaciones</h3>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Feed en vivo de compras registradas</p>
                        </div>
                        <Link href="/admin/pedidos" className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                            Ver todos los pedidos <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest h-10">
                                    <th className="py-2">Cliente</th>
                                    <th className="py-2">Estado</th>
                                    <th className="py-2">Fecha</th>
                                    <th className="py-2 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((ord) => (
                                        <tr key={ord.id} className="h-12 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-2">
                                                <span className="font-extrabold text-slate-900 dark:text-white">
                                                    {ord.clientes?.nombre || `Cliente #${ord.id.slice(0, 5)}`}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(ord.status)}`}>
                                                    {ord.status}
                                                </span>
                                            </td>
                                            <td className="py-2 text-slate-500">
                                                {ord.created_at ? new Date(ord.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : "Hoy"}
                                            </td>
                                            <td className="py-2 text-right font-black text-slate-900 dark:text-white">
                                                {formatCurrency(ord.total)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-slate-400 font-semibold">
                                            No hay pedidos recientes registrados aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </m.div>

                {/* SYSTEM HEALTH & QUICK LINKS HUB (4 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="xl:col-span-4 bg-slate-900 dark:bg-slate-950 text-white rounded-[2.5rem] p-7 shadow-md flex flex-col justify-between border border-slate-800"
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                <div className="h-5 w-1.5 bg-blue-500 rounded-full" />
                                Centro Operativo
                            </h3>
                            <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md uppercase">
                                En Línea
                            </span>
                        </div>

                        {/* System Status Indicators */}
                        <div className="space-y-3 text-xs font-bold">
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-slate-300">Base de Datos Supabase</span>
                                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Activa
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-slate-300">Integración de Pagos</span>
                                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Operativa
                                </span>
                            </div>
                        </div>

                        {/* Direct Shortcuts */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
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
