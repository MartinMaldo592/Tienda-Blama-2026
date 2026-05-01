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
            <AdminPageHeader icon={<Warehouse size={28} strokeWidth={1.5}/>} iconColor="bg-emerald-600" iconShadow="shadow-emerald-200" title="Inventario" subtitle={`${stats.total} ítems registrados`} totalItems={stats.total} totalLabel="ítems en almacén" isFetching={isFetching} dotColor="bg-emerald-500"
                actions={<>
                    <Button variant="outline" className="h-14 px-8 rounded-2xl font-black haptic-scale shadow-sm" asChild>
                        <Link href="/admin/inventario/movimientos"><History className="h-4 w-4 mr-2" />VER KARDEX</Link>
                    </Button>
                    <Button className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black haptic-scale shadow-lg" onClick={()=>qc.invalidateQueries({queryKey:["adminInventory"]})} disabled={isFetching}>
                        <RefreshCw className={`h-5 w-5 mr-2 ${isFetching?'animate-spin':''}`}/>SINCRONIZAR
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

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-16 hover:bg-transparent border-slate-100">
                            {["Producto / Variante","Stock Actual","Estado"].map((h,i)=>(<TableHead key={h} className={`font-black text-[11px] uppercase tracking-widest text-slate-400 ${i===0?'pl-8':i===1?'text-right':i===2?'pr-8':''}`}>{h}</TableHead>))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((item:any,i:number)=>(
                                <m.tr key={`${item.producto_id}_${item.variante_id}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className="h-16 group hover:bg-slate-50/80 transition-colors border-slate-50">
                                    <TableCell className="pl-8 font-bold text-slate-700 text-sm">{item.nombre}</TableCell>
                                    <TableCell className="text-right"><span className={`text-2xl font-black tabular-nums ${item.stock<=0?'text-rose-600':item.stock<=5?'text-amber-600':'text-slate-900'}`}>{item.stock}</span></TableCell>
                                    <TableCell className="pr-8">
                                        {item.stock>5?<Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">Adecuado</Badge>:item.stock>0?<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">Stock Bajo</Badge>:<Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">Agotado</Badge>}
                                    </TableCell>
                                </m.tr>
                            ))}
                        </AnimatePresence>
                        {filtered.length===0&&<TableRow><TableCell colSpan={3} className="text-center py-20 text-slate-400">No se encontraron productos.</TableCell></TableRow>}
                    </TableBody>
                </Table>
                {filtered.length>0&&<div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filtered.length} de {stats.total} ítems</p></div>}
            </m.div>
        </m.div>
    )
}
