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
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import {
    Warehouse, History, RefreshCw, Search, PackageOpen,
    ArrowLeftRight, AlertTriangle, ChevronDown, ChevronUp, Filter
} from "lucide-react"
import { createClient } from "@/lib/supabase.client"
import { AjusteStockModal } from "@/components/admin/inventario/ajuste-stock-modal"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

type InventoryItem = {
    producto_id: number
    variante_id: number | null
    nombre: string
    stock: number
    precio: number
}

async function fetchInventoryClient(): Promise<InventoryItem[]> {
    const supabase = createClient()
    const { data: products, error } = await supabase
        .from("productos")
        .select(`
            id, nombre, stock, precio,
            producto_variantes (
                id, etiqueta, stock, precio
            )
        `)
        .order("nombre")

    if (error || !products) return []

    const flat: InventoryItem[] = []
    for (const p of products) {
        const variants = Array.isArray((p as any).producto_variantes) ? (p as any).producto_variantes : []
        if (variants.length > 0) {
            for (const v of variants) {
                flat.push({
                    producto_id: p.id,
                    variante_id: v.id,
                    nombre: `${p.nombre} - ${v.etiqueta}`,
                    stock: v.stock,
                    precio: v.precio || p.precio
                })
            }
        } else {
            flat.push({
                producto_id: p.id,
                variante_id: null,
                nombre: p.nombre,
                stock: p.stock,
                precio: p.precio
            })
        }
    }
    return flat
}

function InventoryRowSkeleton({ count = 8 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <TableRow key={i} className="h-16">
                    <TableCell className="pl-8"><Skeleton className="h-4 w-40 rounded-lg" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-14 rounded-xl ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export default function InventarioPage() {
    const guard = useRoleGuard({ allowedRoles: ["admin"] })
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [stockFilter, setStockFilter] = useState<"all" | "low" | "out" | "ok">("all")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    const loadData = async () => {
        setLoading(true)
        const data = await fetchInventoryClient()
        setInventory(data)
        setLoading(false)
    }

    useEffect(() => {
        if (!guard.loading && !guard.accessDenied) {
            loadData()
        }
    }, [guard.loading, guard.accessDenied])

    // Stats
    const totalProducts = inventory.length
    const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock <= 5).length
    const outOfStockCount = inventory.filter(i => i.stock <= 0).length

    // Filtering
    const filtered = inventory
        .filter(item => {
            if (searchTerm && !item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false
            if (stockFilter === "low" && !(item.stock > 0 && item.stock <= 5)) return false
            if (stockFilter === "out" && item.stock > 0) return false
            if (stockFilter === "ok" && item.stock <= 5) return false
            return true
        })
        .sort((a, b) => sortDir === "asc" ? a.stock - b.stock : b.stock - a.stock)

    if (guard.loading) {
        return (
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="flex justify-between items-end gap-6">
                    <div className="space-y-3">
                        <Skeleton className="h-14 w-64 rounded-2xl" />
                        <Skeleton className="h-4 w-80 rounded-lg" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-14 w-40 rounded-2xl" />
                        <Skeleton className="h-14 w-40 rounded-2xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-[2rem]" />)}
                </div>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16">
                                <TableHead className="pl-8"></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody><InventoryRowSkeleton /></TableBody>
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
                        <div className="h-14 w-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                            <Warehouse size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Inventario</h1>
                                {loading && (
                                    <m.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"
                                    >
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    </m.div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    {totalProducts} ítems registrados
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
                        variant="outline"
                        className="flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl border-slate-200 font-black tracking-tight shadow-sm transition-all haptic-scale bg-white hover:bg-slate-50"
                        asChild
                    >
                        <Link href="/admin/inventario/movimientos">
                            <History className="h-4 w-4" />
                            VER KARDEX
                        </Link>
                    </Button>

                    <Button
                        className="flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-emerald-600 font-black tracking-tight shadow-xl shadow-slate-200 hover:shadow-emerald-200 transition-all haptic-scale"
                        onClick={loadData}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        SINCRONIZAR
                    </Button>
                </m.div>
            </div>

            {/* --- STATS CARDS --- */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <InventoryStatCard
                    label="Total de Ítems"
                    value={totalProducts}
                    icon={<PackageOpen size={24} />}
                    colorClass="blue"
                    loading={loading}
                    delay={0.1}
                />
                <InventoryStatCard
                    label="Stock Bajo (≤ 5)"
                    value={lowStockCount}
                    icon={<ArrowLeftRight size={24} />}
                    colorClass="orange"
                    loading={loading}
                    delay={0.15}
                    onClick={() => setStockFilter(stockFilter === "low" ? "all" : "low")}
                    active={stockFilter === "low"}
                />
                <InventoryStatCard
                    label="Sin Stock / Negativo"
                    value={outOfStockCount}
                    icon={<AlertTriangle size={24} />}
                    colorClass="red"
                    loading={loading}
                    delay={0.2}
                    onClick={() => setStockFilter(stockFilter === "out" ? "all" : "out")}
                    active={stockFilter === "out"}
                />
            </m.div>

            {/* --- FILTERS BAR --- */}
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 md:p-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input
                        placeholder="Buscar producto o variante..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 border-0 bg-slate-50 rounded-[1.25rem] font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-emerald-200"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Select value={stockFilter} onValueChange={(val: any) => setStockFilter(val)}>
                        <SelectTrigger className="h-12 rounded-[1.25rem] border-slate-100 bg-slate-50 font-black text-xs uppercase tracking-wide min-w-[160px]">
                            <Filter className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="ok">Adecuado (&gt;5)</SelectItem>
                            <SelectItem value="low">Stock Bajo (≤5)</SelectItem>
                            <SelectItem value="out">Agotado</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        className="h-12 px-4 rounded-[1.25rem] border-slate-100 bg-slate-50 font-black text-xs haptic-scale"
                        onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
                    >
                        {sortDir === "asc"
                            ? <><ChevronUp className="h-4 w-4 mr-1" />MENOR</>
                            : <><ChevronDown className="h-4 w-4 mr-1" />MAYOR</>
                        }
                    </Button>

                    <AjusteStockModal items={inventory} />
                </div>
            </m.div>

            {/* --- TABLE --- */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
            >
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-16 border-b border-slate-100">
                            <TableHead className="pl-8 font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">
                                Producto / Variante
                            </TableHead>
                            <TableHead className="text-right font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">
                                Stock Actual
                            </TableHead>
                            <TableHead className="pr-8 font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">
                                Estado
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <InventoryRowSkeleton count={10} />
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                            <PackageOpen className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">Sin resultados encontrados</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item, idx) => (
                                <m.tr
                                    key={`${item.producto_id}_${item.variante_id}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                                    className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors h-16"
                                >
                                    <TableCell className="pl-8 font-bold text-slate-700 text-sm">
                                        {item.nombre}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`text-2xl font-black tabular-nums ${item.stock <= 0 ? 'text-rose-600' : item.stock <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                                            {item.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell className="pr-8">
                                        {item.stock > 5 ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                                                Adecuado
                                            </Badge>
                                        ) : item.stock > 0 ? (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                                                Stock Bajo
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                                                Agotado
                                            </Badge>
                                        )}
                                    </TableCell>
                                </m.tr>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Footer info */}
                {!loading && filtered.length > 0 && (
                    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            Mostrando {filtered.length} de {totalProducts} ítems
                        </p>
                    </div>
                )}
            </m.div>
        </div>
    )
}

// --- Stat Card ---
function InventoryStatCard({ label, value, icon, colorClass, loading, delay = 0, onClick, active }: any) {
    let styles = "from-slate-50 to-white border-slate-100"
    let iconBg = "text-blue-600 bg-blue-100/50"
    let badgeBg = "text-blue-700 bg-blue-100/50"
    let shadow = "hover:shadow-blue-200/50"

    if (colorClass === "orange") {
        styles = "from-orange-50/50 to-white border-orange-100/50"
        iconBg = "text-orange-600 bg-orange-100/50"
        badgeBg = "text-orange-700 bg-orange-100/50"
        shadow = "hover:shadow-orange-200/50"
    } else if (colorClass === "red") {
        styles = "from-rose-50/50 to-white border-rose-100/50"
        iconBg = "text-rose-600 bg-rose-100/50"
        badgeBg = "text-rose-700 bg-rose-100/50"
        shadow = "hover:shadow-rose-200/50"
    }

    return (
        <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            onClick={onClick}
            className={`relative overflow-hidden rounded-[2rem] border bg-gradient-to-br ${styles} p-8 transition-all duration-300 hover:shadow-2xl ${shadow} hover:-translate-y-1 group ${onClick ? 'cursor-pointer' : ''} ${active ? 'ring-2 ring-offset-2 ring-emerald-400' : ''}`}
        >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-white/60"></div>

            <div className="relative flex flex-col gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] ${iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                    {loading ? <Skeleton className="h-6 w-6 rounded-full" /> : icon}
                </div>
                <div className="space-y-1">
                    <div className="text-sm font-bold tracking-wide uppercase text-slate-400">
                        {loading ? <Skeleton className="h-4 w-24" /> : label}
                    </div>
                    {loading ? (
                        <Skeleton className="h-10 w-20" />
                    ) : (
                        <h3 className="text-4xl font-black tracking-tight text-slate-900">{value}</h3>
                    )}
                </div>
            </div>
        </m.div>
    )
}
