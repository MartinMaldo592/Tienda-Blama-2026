"use client"

import { useState, useEffect } from "react"
import { m } from "framer-motion"
import {
    DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown,
    MoreHorizontal, ArrowUpRight, ShieldCheck, Eye, ShoppingBag, CreditCard, Sparkles, MapPin
} from "lucide-react"
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
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
    const totalOrdersCount = stats.pedidosPendientes + stats.pedidosEnProceso + stats.pedidosEntregados
    const targetGoal = 500
    const targetPercentage = Math.min(100, Math.round((stats.totalVentasReales / targetGoal) * 100))

    // Donut chart categories data
    const categoryData = [
        { name: "Laptops & PC", value: 1200, color: "#ff7a00" },
        { name: "Audio & Parlantes", value: 950, color: "#ffa040" },
        { name: "Accesorios", value: 750, color: "#ffc280" },
        { name: "Otros Productos", value: 500, color: "#ffe4cc" },
    ]

    // Location users data
    const locationData = [
        { city: "Lima", percentage: 55, count: "2,758" },
        { city: "Arequipa", percentage: 24, count: "1,200" },
        { city: "La Libertad", percentage: 14, count: "680" },
        { city: "Callao & Provincias", percentage: 7, count: "350" },
    ]

    // Funnel steps data
    const funnelSteps = [
        { label: "Vistas Productos", val: "25,000", change: "+9%", height: "h-28 bg-amber-100 dark:bg-amber-950/40 text-amber-700" },
        { label: "Añadidos Carrito", val: "12,000", change: "+6%", height: "h-24 bg-amber-200/80 dark:bg-amber-900/50 text-amber-800" },
        { label: "Inició Pago", val: "8,500", change: "+4%", height: "h-20 bg-amber-300/80 dark:bg-amber-800/60 text-amber-900" },
        { label: "Compras Listas", val: "6,200", change: "+7%", height: "h-16 bg-amber-400 dark:bg-amber-700 text-slate-900" },
        { label: "Carritos Aband.", val: "3,000", change: "-5%", height: "h-12 bg-amber-500 text-white" },
    ]

    // Traffic sources
    const trafficSources = [
        { name: "WhatsApp Directo", percentage: 40, color: "bg-emerald-500" },
        { name: "TikTok & Reel Ads", percentage: 30, color: "bg-amber-500" },
        { name: "Instagram Shop", percentage: 15, color: "bg-purple-500" },
        { name: "Búsqueda Google", percentage: 10, color: "bg-blue-500" },
        { name: "Otros Canales", percentage: 5, color: "bg-slate-400" },
    ]

    return (
        <div className="space-y-8 font-sans">
            {/* ================= TOP 3 KPI CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CARD 1: TOTAL SALES (PEACH FILLED) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-[#fff5eb] dark:bg-slate-900 border border-[#ffe4cc] dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Ventas Totales</span>
                        <div className="h-11 w-11 rounded-full bg-[#ff7a00] text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
                            <DollarSign className="h-6 w-6 stroke-[2.5]" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {formatCurrency(stats.totalVentasReales)}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <TrendingUp className="h-3 w-3" /> +3.34%
                        </span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-700/80 dark:text-amber-400 mt-2">
                        Ventas de Hoy: <span className="font-extrabold">{formatCurrency(stats.ventasHoy)}</span>
                    </p>
                </m.div>

                {/* CARD 2: TOTAL ORDERS */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Pedidos Totales</span>
                        <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {totalOrdersCount}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-600 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200/60">
                            <TrendingDown className="h-3 w-3" /> -2.89%
                        </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2">
                        {stats.pedidosPendientes} pendientes de atención
                    </p>
                </m.div>

                {/* CARD 3: TOTAL VISITORS / CLIENTS */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">Clientes Registrados</span>
                        <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {stats.totalClientes}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <TrendingUp className="h-3 w-3" /> +8.02%
                        </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2">
                        Base de compradores activa
                    </p>
                </m.div>
            </div>

            {/* ================= MIDDLE ROW GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* REVENUE ANALYTICS CHART (7 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Análisis de Ingresos</h3>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Evolución de ventas y volumen de pedidos</p>
                        </div>

                        {/* Period Switcher Pills */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                            {(["week", "month", "year"] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => onPeriodChange(p)}
                                    className={`px-4 py-1.5 text-xs font-extrabold rounded-xl transition-all ${
                                        period === p
                                            ? "bg-[#ff7a00] text-white shadow-md shadow-amber-500/20"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {p === "week" ? "Últimos 8 Días" : p === "month" ? "30 Días" : "Año"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[280px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="ezRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
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
                                                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{p.date}</p>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">Ventas: {formatCurrency(p.total)}</p>
                                                    <p className="text-xs font-bold text-amber-600">Pedidos: {p.orders}</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#ff7a00" strokeWidth={3.5} fillOpacity={1} fill="url(#ezRevenueGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </m.div>

                {/* MONTHLY TARGET GAUGE (5 COLS) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Meta Mensual</h3>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Objetivo de ingresos del mes</p>
                        </div>
                        <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer" />
                    </div>

                    {/* Gauge Progress Bar Graphic */}
                    <div className="my-6 flex flex-col items-center justify-center relative">
                        <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
                            <div className="w-44 h-44 rounded-full border-[16px] border-slate-100 dark:border-slate-800 border-t-[#ff7a00] border-r-[#ff7a00] rotate-45 transform" />
                            <div className="absolute bottom-0 text-center">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{targetPercentage}%</span>
                                <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">+8.02% vs mes anterior</p>
                            </div>
                        </div>

                        <div className="mt-4 text-center space-y-1">
                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">¡Excelente Progreso! 🚀</h4>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xs">
                                Has alcanzado <strong className="text-slate-900 dark:text-white">{formatCurrency(stats.totalVentasReales)}</strong> de la meta propuesta de <strong className="text-slate-900 dark:text-white">{formatCurrency(targetGoal)}</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Target breakdown box */}
                    <div className="bg-[#fff5eb] dark:bg-amber-950/30 border border-[#ffe4cc] dark:border-amber-900/40 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Meta Total</span>
                            <p className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(targetGoal)}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-amber-200 dark:bg-amber-800" />
                        <div className="text-right">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Ingresos Actuales</span>
                            <p className="text-base font-black text-[#ff7a00]">{formatCurrency(stats.totalVentasReales)}</p>
                        </div>
                    </div>
                </m.div>
            </div>

            {/* ================= BOTTOM ROW GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. TOP CATEGORIES DONUT / LIST */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Categorías Principales</h3>
                        <Link href="/admin/productos" className="text-xs font-bold text-[#ff7a00] hover:underline flex items-center gap-0.5">
                            Ver Todo <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Donut Chart Graphic */}
                    <div className="h-44 relative flex items-center justify-center my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ventas Cat.</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white">S/ 3,400</span>
                        </div>
                    </div>

                    {/* Breakdown list */}
                    <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {categoryData.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{cat.name}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-black">{formatCurrency(cat.value)}</span>
                            </div>
                        ))}
                    </div>
                </m.div>

                {/* 2. CONVERSION RATE FUNNEL */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Tasa de Conversión</h3>
                        <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-full">Esta Semana</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">Rendimiento del embudo de compras</p>

                    {/* Funnel Visual Bars */}
                    <div className="grid grid-cols-5 gap-2 items-end justify-center my-4 h-36">
                        {funnelSteps.map((step) => (
                            <div key={step.label} className="flex flex-col items-center gap-1.5 group">
                                <span className="text-[10px] font-extrabold text-emerald-600">{step.change}</span>
                                <div className={`w-full ${step.height} rounded-2xl flex items-center justify-center font-black text-xs shadow-xs transition-transform group-hover:scale-105`}>
                                    {step.val.split(",")[0]}k
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span>Conversión Promedio</span>
                        <span className="text-slate-900 dark:text-white font-black text-sm">24.8%</span>
                    </div>
                </m.div>

                {/* 3. TRAFFIC SOURCES & LOCATIONS */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-xs flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Canales de Tráfico</h3>
                        <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer" />
                    </div>

                    {/* Multi-segment progress bar */}
                    <div className="my-2">
                        <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
                            {trafficSources.map((ts) => (
                                <div key={ts.name} className={`h-full ${ts.color} rounded-full`} style={{ width: `${ts.percentage}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Traffic Sources List */}
                    <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {trafficSources.map((ts) => (
                            <div key={ts.name} className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full ${ts.color} shrink-0`} />
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{ts.name}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-black">{ts.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </m.div>
            </div>
        </div>
    )
}
