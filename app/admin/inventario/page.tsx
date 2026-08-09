"use client"

import { useMemo, useState } from "react"
import { m, AnimatePresence } from "framer-motion"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Warehouse, History, RefreshCw, Search, PackageOpen, ArrowLeftRight, AlertTriangle, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { AjusteStockModal } from "@/features/admin/components/inventario/ajuste-stock-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchAdminInventory } from "@/features/admin"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function InventarioPage() {
    const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin", "worker"] })
    const qc = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")
    const [stockFilter, setStockFilter] = useState<"all" | "low" | "out" | "ok">("all")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    const { data: inventory = [], isLoading, isFetching } = useQuery({
        queryKey: ["adminInventory"], queryFn: fetchAdminInventory,
        enabled: !guard.loading && !guard.accessDenied,
    })

    const filtered = useMemo(() => {
        return inventory.filter((item:any) => {
            if (searchTerm && !item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false
            if (stockFilter === "low" && !(item.stock > 0 && item.stock <= 5)) return false
            if (stockFilter === "out" && item.stock > 0) return false
            if (stockFilter === "ok" && item.stock <= 5) return false
            return true
        }).sort((a:any, b:any) => sortDir === "asc" ? a.stock - b.stock : b.stock - a.stock)
    }, [inventory, searchTerm, stockFilter, sortDir])

    const stats = useMemo(() => ({
        total: inventory.length,
        lowStock: inventory.filter((i:any) => i.stock > 0 && i.stock <= 5).length,
        outOfStock: inventory.filter((i:any) => i.stock <= 0).length
    }), [inventory])

    if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={3} tableRows={10} />
    if (guard.accessDenied) return <AccessDenied />

    return (
        <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            <AdminPageHeader icon={<Warehouse size={28} strokeWidth={1.5}/>} iconColor="bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700" iconShadow="shadow-emerald-500/20" title="Inventario" subtitle={`${stats.total} ítems registrados`} totalItems={stats.total} totalLabel="ítems en almacén" isFetching={isFetching} dotColor="bg-emerald-500"
                actions={<>
                    <Button variant="outline" className="h-11 px-5 rounded-xl font-bold haptic-scale shadow-sm border-slate-200 dark:border-slate-800" asChild>
                        <Link href="/admin/inventario/movimientos"><History className="h-4 w-4 mr-2" />VER KARDEX</Link>
                    </Button>
                    <Button className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold haptic-scale shadow-lg shadow-emerald-600/20" onClick={()=>qc.invalidateQueries({queryKey:["adminInventory"]})} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isFetching?'animate-spin':''}`}/>SINCRONIZAR
                    </Button>
                </>}
            />

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {l:"Total de Ítems",v:stats.total,icon:PackageOpen,c:"text-blue-600",bg:"bg-blue-50", onClick:()=>setStockFilter("all"), active:stockFilter==="all"},
                    {l:"Stock Bajo (≤ 5)",v:stats.lowStock,icon:ArrowLeftRight,c:"text-amber-600",bg:"bg-amber-50", onClick:()=>setStockFilter("low"), active:stockFilter==="low"},
                    {l:"Sin Stock / Negativo",v:stats.outOfStock,icon:AlertTriangle,c:"text-rose-600",bg:"bg-rose-50", onClick:()=>setStockFilter("out"), active:stockFilter==="out"}
                ].map((s,i)=>(
                    <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} onClick={s.onClick} className={`cursor-pointer bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all hover:scale-[1.02] ${s.active?'ring-2 ring-emerald-500 shadow-md':''}`}>
                        <div className="flex items-center justify-between">
                            <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
                            <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
                        </div>
                    </m.div>
                ))}
            </m.div>

            <m.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 md:p-3">
                <div className="relative flex-1"><Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-300"/><Input placeholder="Buscar producto o variante..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-12 h-12 border-0 bg-slate-50 rounded-[1.25rem] font-bold text-slate-700"/></div>
                <div className="flex items-center gap-3">
                    <Select value={stockFilter} onValueChange={(val:any)=>setStockFilter(val)}>
                        <SelectTrigger className="h-12 rounded-[1.25rem] border-slate-100 bg-slate-50 font-black text-xs uppercase tracking-wide min-w-[160px]"><Filter className="h-4 w-4 mr-2 text-slate-400"/><SelectValue/></SelectTrigger>
                        <SelectContent className="rounded-2xl"><SelectItem value="all">Todos</SelectItem><SelectItem value="ok">Adecuado (&gt;5)</SelectItem><SelectItem value="low">Stock Bajo (≤5)</SelectItem><SelectItem value="out">Agotado</SelectItem></SelectContent>
                    </Select>
                    <Button variant="outline" className="h-12 px-4 rounded-[1.25rem] border-slate-100 bg-slate-50 font-black text-xs haptic-scale" onClick={()=>setSortDir(d=>d==="asc"?"desc":"asc")}>
                        {sortDir==="asc"?<><ChevronUp className="h-4 w-4 mr-1"/>MENOR</>:<><ChevronDown className="h-4 w-4 mr-1"/>MAYOR</>}
                    </Button>
                    <AjusteStockModal items={inventory} />
                </div>
            </m.div>

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800">
                        <TableRow className="h-16 hover:bg-transparent border-none">
                            {["Producto / Variante", "Stock Disponible", "Estado Almacén", "Acciones"].map((h, i) => (
                                <TableHead key={h} className={`font-black text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 ${i === 0 ? 'pl-8' : i === 1 ? 'text-center' : i === 2 ? 'text-center' : 'pr-8 text-right'}`}>
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((item: any, i: number) => (
                                <m.tr key={`${item.producto_id}_${item.variante_id}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.025}} className="h-20 group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-none">
                                    <TableCell className="pl-8">
                                        <div className="flex items-center gap-3.5">
                                            <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center font-black text-sm shrink-0">
                                                <Warehouse className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                                                    {item.nombre}
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                    ID: #{item.producto_id} {item.variante_id ? `• Var: #${item.variante_id}` : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-2xl font-black tabular-nums tracking-tight ${item.stock <= 0 ? 'text-rose-600 dark:text-rose-400' : item.stock <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                                            {item.stock} <span className="text-xs font-bold text-slate-400 dark:text-slate-500">unidades</span>
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.stock > 5 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Adecuado
                                            </span>
                                        ) : item.stock > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100/70 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                                Stock Bajo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100/70 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                                Agotado
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 transition-all haptic-scale h-9 px-3.5 shadow-sm" asChild>
                                            <Link href={`/admin/productos/${item.producto_id}`}>Ver Producto</Link>
                                        </Button>
                                    </TableCell>
                                </m.tr>
                            ))}
                        </AnimatePresence>
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-slate-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <PackageOpen className="h-10 w-10 stroke-1 text-slate-300" />
                                        <p className="text-base font-medium">No se encontraron productos en el inventario.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {filtered.length > 0 && (
                    <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Mostrando {filtered.length} de {stats.total} ítems en almacén
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Kardex Sincronizado
                        </span>
                    </div>
                )}
            </m.div>
        </m.div>
    )
}
