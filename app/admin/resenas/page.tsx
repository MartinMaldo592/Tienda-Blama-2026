"use client"

import { useMemo, useState } from "react"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { AdminPageHeader } from "@/components/admin/page-header"
import { AdminPageSkeleton } from "@/components/admin/page-skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, RefreshCw, Trash2, X, Star, TrendingUp, Clock } from "lucide-react"
import { deleteReview, fetchAdminReviews, setReviewApproved } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m, AnimatePresence } from "framer-motion"

type ReviewRow = {
  id: number; product_id: number; rating: number; title: string | null; body: string
  customer_name: string | null; customer_city: string | null; verified: boolean; approved: boolean
  created_at: string; productos?: { nombre: string } | null
}

export default function AdminResenasPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })
  const qc = useQueryClient()
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<number|null>(null)

  const { data: items = [], isLoading, isFetching } = useQuery({
    queryKey: ["adminResenas"], queryFn: fetchAdminReviews,
    enabled: !guard.loading && !guard.accessDenied,
    select: (d) => ((d as any[]) || []) as ReviewRow[],
  })

  const approveMut = useMutation({
    mutationFn: async ({id,approved}:{id:number,approved:boolean}) => { setBusyId(id); return setReviewApproved({id,approved}) },
    onSuccess: (_,{approved}) => { toast.success(approved?"Reseña publicada":"Reseña despublicada"); qc.invalidateQueries({queryKey:["adminResenas"]}) },
    onError: (e:any) => toast.error(e?.message||"Error"),
    onSettled: () => setBusyId(null),
  })

  const deleteMut = useMutation({
    mutationFn: async (id:number) => { setBusyId(id); return deleteReview(id) },
    onSuccess: () => { toast.success("Reseña eliminada"); qc.invalidateQueries({queryKey:["adminResenas"]}) },
    onError: (e:any) => toast.error(e?.message||"Error"),
    onSettled: () => setBusyId(null),
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(r => [r.customer_name,r.customer_city,r.title,r.body,r.productos?.nombre].some(v=>String(v||"").toLowerCase().includes(q)))
  }, [items, search])

  const stats = useMemo(() => ({
    total: items.length,
    pendientes: items.filter(r=>!r.approved).length,
    avgRating: items.length ? (items.reduce((s,r)=>s+r.rating,0)/items.length).toFixed(1) : "0",
  }), [items])

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={5} tableRows={8} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores." />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<Star size={28} strokeWidth={1.5}/>} iconColor="bg-yellow-500" iconShadow="shadow-yellow-200" title="Reseñas" totalItems={stats.total} totalLabel="reseñas totales" isFetching={isFetching} dotColor="bg-yellow-500"
        actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>qc.invalidateQueries({queryKey:["adminResenas"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
      />

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{l:"Total Reseñas",v:stats.total,icon:Star,c:"text-yellow-600",bg:"bg-yellow-50"},{l:"Pendientes",v:stats.pendientes,icon:Clock,c:"text-orange-600",bg:"bg-orange-50"},{l:"Rating Promedio",v:stats.avgRating,icon:TrendingUp,c:"text-emerald-600",bg:"bg-emerald-50"}].map((s,i)=>(
          <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
              <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
            </div>
          </m.div>
        ))}
      </m.div>

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por producto, texto o cliente..." className="focus-ring-premium rounded-xl h-12 border-slate-200"/>
      </m.div>

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-16 hover:bg-transparent border-slate-100">
              {["Producto","Rating","Reseña","Estado","Acciones"].map((h,i)=>(
                <TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===4?'pr-8 text-right':''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filtered.map((r,i)=>{
                const dis = busyId===r.id
                return (
                  <m.tr key={r.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className="h-[72px] hover:bg-slate-50/80 transition-colors border-slate-50 group">
                    <TableCell className="pl-8 max-w-[220px]">
                      <div className="font-bold text-slate-900">{r.productos?.nombre||`Producto #${r.product_id}`}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.customer_name?`${r.customer_name}${r.customer_city?` • ${r.customer_city}`:""}`:"—"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({length:5}).map((_,si)=>(<Star key={si} className={`h-3.5 w-3.5 ${si<r.rating?'fill-yellow-400 text-yellow-400':'text-slate-200'}`}/>))}
                      </div>
                      {r.verified&&<Badge className="mt-1 rounded-full bg-blue-50 text-blue-600 border-blue-100 text-[10px]">Verificado</Badge>}
                    </TableCell>
                    <TableCell className="max-w-[400px]">
                      <div className="font-semibold text-slate-800 text-sm">{r.title||"Reseña"}</div>
                      <div className="text-sm text-slate-400 line-clamp-2">{r.body}</div>
                      <div className="text-[10px] text-slate-300 mt-1">{new Date(r.created_at).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-full ${r.approved?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-orange-100 text-orange-700 border-orange-200'}`}>{r.approved?"Publicado":"Pendiente"}</Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.approved?(
                          <Button size="sm" variant="outline" disabled={dis} onClick={()=>approveMut.mutate({id:r.id,approved:false})} className="gap-1.5 rounded-xl"><X className="h-3.5 w-3.5"/>Despublicar</Button>
                        ):(
                          <Button size="sm" disabled={dis} onClick={()=>approveMut.mutate({id:r.id,approved:true})} className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"><Check className="h-3.5 w-3.5"/>Aprobar</Button>
                        )}
                        <Button size="sm" variant="outline" disabled={dis} onClick={()=>{if(!confirm("¿Eliminar esta reseña?"))return;deleteMut.mutate(r.id)}} className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/5"><Trash2 className="h-3.5 w-3.5"/></Button>
                      </div>
                    </TableCell>
                  </m.tr>
                )
              })}
            </AnimatePresence>
            {filtered.length===0&&<TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400">No hay reseñas.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </m.div>
    </m.div>
  )
}
