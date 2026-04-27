"use client"

import { useState, useEffect } from "react"
import { m } from "framer-motion"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import {
    ArrowLeft, BookOpenCheck, RefreshCw, PackageOpen
} from "lucide-react"
import { createClient } from "@/lib/supabase.client"

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}

function getBadgeColor(tipo: string) {
    if (tipo === 'ENTRADA_COMPRA' || tipo === 'DEVOLUCION') return 'bg-emerald-100 text-emerald-700'
    if (tipo === 'SALIDA_VENTA') return 'bg-rose-100 text-rose-700'
    if (tipo === 'AJUSTE' || tipo === 'AJUSTE_INICIAL') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-700'
}

function formatTipo(tipo: string) {
    return tipo.replace(/_/g, ' ')
}

async function fetchMovimientosClient() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("kardex_valorizado_view")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200)

    if (error) {
        console.error("Error fetching movimientos:", error)
        return []
    }
    return data || []
}

function KardexRowSkeleton({ count = 10 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <TableRow key={i} className="h-14">
                    <TableCell><Skeleton className="h-4 w-20 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 rounded-lg ml-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-10 rounded-lg mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-10 rounded-lg mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-12 rounded-lg mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 rounded-lg ml-auto" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export default function MovimientosPage() {
    const guard = useRoleGuard({ allowedRoles: ["admin"] })
    const [movimientos, setMovimientos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        setLoading(true)
        const data = await fetchMovimientosClient()
        setMovimientos(data)
        setLoading(false)
    }

    useEffect(() => {
        if (!guard.loading && !guard.accessDenied) {
            loadData()
        }
    }, [guard.loading, guard.accessDenied])

    if (guard.loading) {
        return (
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="flex justify-between items-end gap-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-14 w-14 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-72 rounded-2xl" />
                            <Skeleton className="h-4 w-60 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16">
                                {Array.from({ length: 8 }).map((_, i) => <TableHead key={i}></TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody><KardexRowSkeleton /></TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    if (guard.accessDenied) return <AccessDenied />

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pt-4">
                <m.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 rounded-[1.25rem] bg-slate-100 hover:bg-slate-200 transition-all haptic-scale"
                            asChild
                        >
                            <Link href="/admin/inventario">
                                <ArrowLeft size={22} />
                            </Link>
                        </Button>
                        <div className="h-14 w-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                            <BookOpenCheck size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Kardex</h1>
                                {loading && (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-indigo-50 text-indigo-600 p-2 rounded-xl"
                                    >
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    </m.div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    Control detallado de entradas, salidas, saldos y costos
                                </p>
                            </div>
                        </div>
                    </div>
                </m.div>

                <m.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap gap-3 w-full lg:w-auto"
                >
                    <Button
                        className="flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 font-black tracking-tight shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all haptic-scale"
                        onClick={loadData}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        SINCRONIZAR
                    </Button>
                </m.div>
            </div>

            {/* --- TABLE --- */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16 border-b border-slate-100">
                                <TableHead className="pl-8 font-black text-[11px] uppercase tracking-[0.15em] text-slate-400 whitespace-nowrap">Fecha</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400 min-w-[200px]">Producto</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Concepto</TableHead>
                                <TableHead className="text-right font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Costo Unit.</TableHead>
                                <TableHead className="text-center font-black text-[11px] uppercase tracking-[0.15em] text-emerald-500">Entradas</TableHead>
                                <TableHead className="text-center font-black text-[11px] uppercase tracking-[0.15em] text-rose-500">Salidas</TableHead>
                                <TableHead className="text-center font-black text-[11px] uppercase tracking-[0.15em] text-slate-900 bg-slate-100/50">Saldo</TableHead>
                                <TableHead className="text-right pr-8 font-black text-[11px] uppercase tracking-[0.15em] text-slate-900 bg-slate-100/50">Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <KardexRowSkeleton />
                            ) : movimientos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                                <PackageOpen className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold text-sm">No hay movimientos registrados en el Kardex</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                movimientos.map((mov: any, idx: number) => {
                                    const prodName = mov.producto_nombre || 'Desconocido'
                                    const varName = mov.variante_nombre ? ` - ${mov.variante_nombre}` : ''
                                    const isPos = mov.cantidad > 0

                                    return (
                                        <m.tr
                                            key={mov.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                                            className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors h-14"
                                        >
                                            <TableCell className="pl-8 whitespace-nowrap text-xs font-bold text-slate-400">
                                                {new Date(mov.created_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-sm text-slate-700">{prodName}{varName}</div>
                                                {mov.referencia && <div className="text-[10px] text-slate-400 font-bold mt-0.5">Ref: {mov.referencia}</div>}
                                                {mov.notas && <div className="text-[10px] text-slate-400 mt-0.5">{mov.notas}</div>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getBadgeColor(mov.tipo_movimiento)} border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap`}>
                                                    {formatTipo(mov.tipo_movimiento)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-bold text-slate-500 tabular-nums">
                                                {formatCurrency(mov.costo_unitario)}
                                            </TableCell>
                                            <TableCell className="text-center font-black text-emerald-600 tabular-nums">
                                                {mov.entradas > 0 ? mov.entradas : <span className="text-slate-200">-</span>}
                                            </TableCell>
                                            <TableCell className="text-center font-black text-rose-600 tabular-nums">
                                                {mov.salidas > 0 ? mov.salidas : <span className="text-slate-200">-</span>}
                                            </TableCell>
                                            <TableCell className="text-center font-black text-slate-900 bg-slate-50/50 tabular-nums text-lg">
                                                {mov.saldo_cantidad}
                                            </TableCell>
                                            <TableCell className={`text-right pr-8 font-black bg-slate-50/50 tabular-nums ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {formatCurrency(Math.abs(mov.valor_total))}
                                            </TableCell>
                                        </m.tr>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer info */}
                {!loading && movimientos.length > 0 && (
                    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            Mostrando {movimientos.length} movimientos más recientes
                        </p>
                    </div>
                )}
            </m.div>
        </div>
    )
}
