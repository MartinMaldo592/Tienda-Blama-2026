"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, RefreshCw, Trash2, X, Star, TrendingUp, Clock } from "lucide-react"
import { deleteReview, fetchAdminReviewsPaginated, setReviewApproved } from "@/features/admin"
import { createClient } from "@/lib/supabase.client"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "sonner"
import { m, AnimatePresence } from "framer-motion"

type ReviewRow = {
  id: number; product_id: number; rating: number; title: string | null; body: string
  customer_name: string | null; customer_city: string | null; verified: boolean; approved: boolean
  created_at: string; productos?: { nombre: string } | null
}

export default function AdminResenasPage() {
  const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin"] })
  const qc = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [busyId, setBusyId] = useState<number|null>(null)

  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 10

  // Debounce del input de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage > 1) params.set("page", newPage.toString())
    else params.delete("page")
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [searchParams, pathname, router])

  // Reiniciar página a 1 al buscar
  useEffect(() => {
    handlePageChange(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, handlePageChange])

  // Petición paginada al servidor
  const { data: queryResult, isLoading, isFetching } = useQuery({
    queryKey: ["adminResenas", currentPage, debouncedSearch],
    queryFn: () => fetchAdminReviewsPaginated({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
    enabled: !guard.loading && !guard.accessDenied,
    placeholderData: keepPreviousData,
    select: (d) => ({
      reviews: (d?.reviews || []) as ReviewRow[],
      totalCount: d?.totalCount || 0
    })
  })

  const reviews = queryResult?.reviews || []
  const totalItems = queryResult?.totalCount || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1

  // Consulta global de estadísticas del negocio (conteo y rating promedio acumulado)
  const { data: stats = { total: 0, pendientes: 0, avgRating: "0" } } = useQuery({
    queryKey: ["adminResenasStats"],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("product_reviews").select("rating, approved")
      if (error) throw error
      const total = data.length
      const pendientes = data.filter(r => !r.approved).length
      const avgRating = total ? (data.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : "0"
      return { total, pendientes, avgRating }
    },
    enabled: !guard.loading && !guard.accessDenied,
  })

  const approveMut = useMutation({
    mutationFn: async ({id,approved}:{id:number,approved:boolean}) => { setBusyId(id); return setReviewApproved({id,approved}) },
    onSuccess: (_,{approved}) => { 
      toast.success(approved?"Reseña publicada":"Reseña despublicada")
      qc.invalidateQueries({queryKey:["adminResenas"]}) 
      qc.invalidateQueries({queryKey:["adminResenasStats"]}) 
    },
    onError: (e:any) => toast.error(e?.message||"Error"),
    onSettled: () => setBusyId(null),
  })

  const deleteMut = useMutation({
    mutationFn: async (id:number) => { setBusyId(id); return deleteReview(id) },
    onSuccess: () => { 
      toast.success("Reseña eliminada")
      qc.invalidateQueries({queryKey:["adminResenas"]}) 
      qc.invalidateQueries({queryKey:["adminResenasStats"]}) 
    },
    onError: (e:any) => toast.error(e?.message||"Error"),
    onSettled: () => setBusyId(null),
  })

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        pages.push(1)
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)
        if (currentPage <= 3) { start = 2; end = 4 }
        else if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1 }
        if (start > 2) pages.push('...')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
    }
    return pages
  }

  const startIndexDisplay = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endIndexDisplay = Math.min(totalItems, currentPage * itemsPerPage)

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={5} tableRows={8} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores." />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<Star size={28} strokeWidth={1.5}/>} iconColor="bg-yellow-500" iconShadow="shadow-yellow-200" title="Reseñas" totalItems={stats.total} totalLabel="reseñas totales" isFetching={isFetching} dotColor="bg-yellow-500"
        actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>{qc.invalidateQueries({queryKey:["adminResenas"]}); qc.invalidateQueries({queryKey:["adminResenasStats"]})}} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
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
              {reviews.map((r,i)=>{
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
            {reviews.length===0&&<TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400">No hay reseñas.</TableCell></TableRow>}
          </TableBody>
        </Table>

        {/* Sección de Paginación */}
        {totalPages > 1 && (
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Mostrando {startIndexDisplay}-{endIndexDisplay} de {totalItems} reseñas
                </p>
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl font-bold text-xs"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    {getPageNumbers().map((p, idx) => (
                        <Button
                            key={idx}
                            variant={p === currentPage ? "default" : "outline"}
                            size="sm"
                            className={`h-9 w-9 rounded-xl font-bold text-xs ${p === '...' ? 'pointer-events-none border-none' : ''}`}
                            onClick={() => typeof p === 'number' && handlePageChange(p)}
                        >
                            {p}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl font-bold text-xs"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        )}
        {reviews.length > 0 && totalPages <= 1 && (
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Mostrando {reviews.length} de {totalItems} reseñas
                </p>
            </div>
        )}
      </m.div>
    </m.div>
  )
}
