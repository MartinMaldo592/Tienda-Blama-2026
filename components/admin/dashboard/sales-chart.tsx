"use client"

import { useState } from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export type SalesDataPoint = {
    date: string
    total: number
    orders: number
}

interface SalesChartProps {
    data: SalesDataPoint[]
    loading?: boolean
    period: "week" | "month" | "year"
    onPeriodChange: (p: "week" | "month" | "year") => void
}

export function SalesChart({ data, loading, period, onPeriodChange }: SalesChartProps) {
    const [focusData, setFocusData] = useState<SalesDataPoint | null>(null)

    if (loading) {
        return (
            <Card className="col-span-4 border shadow-sm">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </CardContent>
            </Card>
        )
    }

    const totalPeriodSales = data.reduce((acc, curr) => acc + curr.total, 0)
    const totalPeriodOrders = data.reduce((acc, curr) => acc + curr.orders, 0)

    // Format X Axis date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        if (period === "year") {
            return date.toLocaleDateString("es-PE", { month: "short" })
        }
        return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" })
    }

    return (
        <Card className="col-span-4 border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white rounded-[2rem] h-full flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-6 pt-8 px-8">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Tendencia de Ventas</CardTitle>
                    <CardDescription>
                        Total en este periodo: <span className="font-bold text-gray-900 text-lg ml-1">{formatCurrency(totalPeriodSales)}</span>
                        <span className="text-gray-300 mx-2">•</span>
                        <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">{totalPeriodOrders} pedidos</span>
                    </CardDescription>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto mt-4 sm:mt-0">
                    {(["week", "month", "year"] as const).map((p) => (
                        <Button
                            key={p}
                            variant="ghost"
                            size="sm"
                            onClick={() => onPeriodChange(p)}
                            className={`flex-1 sm:flex-none px-6 h-10 text-xs font-black tracking-wide rounded-[1rem] transition-all haptic-scale ${period === p
                                ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                                }`}
                        >
                            {p === "week" ? "7 DÍAS" : p === "month" ? "30 DÍAS" : "AÑO"}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-8 pb-8 flex-1">
                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                            onMouseMove={(e: any) => {
                                if (e.activePayload) {
                                    setFocusData(e.activePayload[0].payload)
                                }
                            }}
                            onMouseLeave={() => setFocusData(null)}
                        >
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={20}
                                tickFormatter={formatDate}
                                style={{ fontSize: '12px', fill: '#94a3b8', fontWeight: 500 }}
                                minTickGap={50}
                                dy={-10}
                            />
                            <Tooltip
                                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload
                                        return (
                                            <div className="rounded-xl border-0 bg-slate-900 text-white p-4 shadow-xl ring-4 ring-slate-100 dark:ring-slate-800 transform translate-y-[-10px]">
                                                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                                                    {new Date(data.date).toLocaleDateString("es-PE", { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <span className="block text-2xl font-bold tracking-tight">
                                                            {formatCurrency(data.total)}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-400">
                                                            {data.orders} {data.orders === 1 ? 'pedido entregado' : 'pedidos entregados'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
