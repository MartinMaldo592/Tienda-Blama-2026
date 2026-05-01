"use client"

import Image from "next/image"
import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, RefreshCw, Trash2, UploadCloud, X, AlertTriangle } from "lucide-react"
import { createIncidencia, deleteIncidencia, fetchIncidencias as fetchIncidenciasService, fetchPedidosForIncidencias, uploadIncidenciaImages } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m, AnimatePresence } from "framer-motion"

const TIPOS = ["Devolución","Queja","Producto dañado","Entrega tardía","Otro"] as const
type Tipo = (typeof TIPOS)[number]
type TipoFilter = Tipo | "all"

export default function IncidenciasPage() {
  const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin", "worker"] })
  const qc = useQueryClient()
  const [userRole, setUserRole] = useState("worker")
  const [pedidoId, setPedidoId] = useState("")
  const [tipo, setTipo] = useState<Tipo>("Queja")
  const [comentario, setComentario] = useState("")
  const [fotos, setFotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [filterPedido, setFilterPedido] = useState("")
  const [filterTipo, setFilterTipo] = useState<TipoFilter>("all")

  const { data: pedidos = [] } = useQuery({
    queryKey: ["incidenciasPedidos"], queryFn: fetchPedidosForIncidencias,
    enabled: !guard.loading && !guard.accessDenied,
  })

  const { data: incidencias = [], isLoading, isFetching } = useQuery({
    queryKey: ["incidencias"], queryFn: fetchIncidenciasService,
    enabled: !guard.loading && !guard.accessDenied,
  })

  // Set role when guard resolves
  const guardReady = !guard.loading && !guard.accessDenied
  if (guardReady && guard.role && userRole !== String(guard.role)) setUserRole(String(guard.role))

  const createMut = useMutation({
    mutationFn: async () => {
      const pid = pedidoId.trim()
      if (!pid) throw new Error("Selecciona un pedido")
      if (!comentario.trim()) throw new Error("Ingresa un comentario")
      const normalizedFotos = fotos.map(x=>x.trim()).filter(Boolean).slice(0,5)
      return createIncidencia({ pedido_id: Number(pid), tipo, comentario: comentario.trim(), foto: normalizedFotos[0]||null, fotos: normalizedFotos })
    },
    onSuccess: () => { toast.success("Incidencia registrada"); setPedidoId("");setTipo("Queja");setComentario("");setFotos([]); qc.invalidateQueries({queryKey:["incidencias"]}) },
    onError: (e:any) => {
      const msg = e?.message||""
      if (msg.toLowerCase().includes("permission")||msg.toLowerCase().includes("security")) toast.error("No tienes permisos para esta acción")
      else toast.error(msg||"Error al crear incidencia")
    },
  })

  const delMut = useMutation({
    mutationFn: (id:number) => deleteIncidencia(id),
    onSuccess: () => { toast.success("Incidencia eliminada"); qc.invalidateQueries({queryKey:["incidencias"]}) },
    onError: (e:any) => {
      const msg = e?.message||""
      if (msg.toLowerCase().includes("permission")) toast.error("No tienes permisos")
      else toast.error(msg||"Error al eliminar")
    },
  })

  const filtered = useMemo(() => {
    const pid = filterPedido.trim()
    return incidencias.filter((i:any) => {
      const matchP = !pid || String(i.pedido_id||"").includes(pid)
      const matchT = filterTipo==="all" || i.tipo===filterTipo
      return matchP && matchT
    })
  }, [incidencias, filterPedido, filterTipo])

  const stats = useMemo(() => ({
    total: (incidencias as any[]).length,
    quejas: (incidencias as any[]).filter((i:any)=>i.tipo==="Queja").length,
    devoluciones: (incidencias as any[]).filter((i:any)=>i.tipo==="Devolución").length,
  }), [incidencias])

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={6} tableRows={6} />
  if (guard.accessDenied) return <AccessDenied />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<AlertCircle size={28} strokeWidth={1.5}/>} iconColor="bg-red-600" iconShadow="shadow-red-200" title="Incidencias" totalItems={stats.total} totalLabel="incidencias registradas" isFetching={isFetching} dotColor="bg-red-500"
        actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>{qc.invalidateQueries({queryKey:["incidencias"]});qc.invalidateQueries({queryKey:["incidenciasPedidos"]})}} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
      />

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{l:"Total",v:stats.total,icon:AlertCircle,c:"text-red-600",bg:"bg-red-50"},{l:"Quejas",v:stats.quejas,icon:AlertTriangle,c:"text-amber-600",bg:"bg-amber-50"},{l:"Devoluciones",v:stats.devoluciones,icon:RefreshCw,c:"text-blue-600",bg:"bg-blue-50"}].map((s,i)=>(
          <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
              <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
            </div>
          </m.div>
        ))}
      </m.div>

      {/* Create form */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
        <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-600"/><h2 className="text-lg font-black text-slate-900">Registrar incidencia</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Pedido</Label>
            <Select value={pedidoId} onValueChange={setPedidoId}><SelectTrigger className="rounded-xl h-12" disabled={createMut.isPending||uploading}><SelectValue placeholder="Selecciona un pedido"/></SelectTrigger><SelectContent>{pedidos.map((p:any)=><SelectItem key={p.id} value={String(p.id)}>#{String(p.id).padStart(6,'0')} • {p.status} • {p.clientes?.nombre||'—'}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Tipo</Label>
            <Select value={tipo} onValueChange={v=>setTipo(v as Tipo)}><SelectTrigger className="rounded-xl h-12" disabled={createMut.isPending||uploading}><SelectValue/></SelectTrigger><SelectContent>{TIPOS.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Comentario</Label>
            <Textarea placeholder="Describe el problema..." value={comentario} onChange={e=>setComentario(e.target.value)} disabled={createMut.isPending||uploading} className="rounded-xl min-h-[100px]"/>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Fotos (hasta 5)</Label>
            <div className="flex items-center gap-3">
              <label className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${uploading?'opacity-60':'cursor-pointer hover:bg-slate-50'}`}>
                <UploadCloud className="h-4 w-4"/>{uploading?'Subiendo...':'Subir imágenes'}
                <input type="file" accept="image/*" multiple className="hidden" disabled={createMut.isPending||uploading||fotos.length>=5}
                  onChange={async(e)=>{
                    if(!e.target.files?.length)return
                    try{ setUploading(true); const files=Array.from(e.target.files).slice(0,Math.max(0,5-fotos.length)); const urls=await uploadIncidenciaImages({pedidoId,files}); setFotos(prev=>[...prev,...urls].map(x=>x.trim()).filter(Boolean).slice(0,5)) }
                    catch(err:any){ toast.error('Error subiendo: '+(err?.message||'')) }
                    finally{ setUploading(false);e.target.value='' }
                  }}/>
              </label>
              <span className="text-xs text-slate-400">{fotos.length}/5</span>
            </div>
            {fotos.length>0&&<div className="grid grid-cols-5 gap-2 mt-2">{fotos.map(url=><div key={url} className="relative aspect-square rounded-xl overflow-hidden border bg-slate-50"><Image src={url} alt="Foto" fill className="object-cover"/><button type="button" className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/80 border flex items-center justify-center" onClick={()=>setFotos(p=>p.filter(x=>x!==url))} disabled={createMut.isPending||uploading}><X className="h-4 w-4"/></button></div>)}</div>}
          </div>
          <div className="md:col-span-2"><Button onClick={()=>createMut.mutate()} disabled={createMut.isPending||uploading} className="haptic-scale shadow-lg rounded-2xl h-14 px-8 font-bold bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700">{createMut.isPending?<RefreshCw className="h-4 w-4 mr-2 animate-spin"/>:null}{createMut.isPending?"Registrando...":"Registrar Incidencia"}</Button></div>
        </div>
      </m.div>

      {/* Filters */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input inputMode="numeric" placeholder="Filtrar por ID pedido" value={filterPedido} onChange={e=>setFilterPedido(e.target.value.replace(/\D/g,""))} className="rounded-xl h-12 border-slate-200"/>
          <Select value={filterTipo} onValueChange={v=>setFilterTipo(v as TipoFilter)}><SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Todos"/></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem>{TIPOS.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
        </div>
      </m.div>

      {/* Table */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-16 hover:bg-transparent border-slate-100">
              {["ID","Pedido","Tipo","Cliente","Fecha","Acciones"].map((h,i)=>(<TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===5?'pr-8 text-right':''}`}>{h}</TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filtered.map((inc:any,i:number)=>(
                <m.tr key={inc.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className="h-[72px] hover:bg-slate-50/80 transition-colors border-slate-50 group">
                  <TableCell className="pl-8 font-mono font-bold text-slate-600">#{String(inc.id).padStart(5,"0")}</TableCell>
                  <TableCell><Link href={`/admin/pedidos/${inc.pedido_id}`} className="text-sm font-bold text-indigo-600 hover:underline">#{String(inc.pedido_id).padStart(6,"0")}</Link><div className="text-xs text-slate-400">{inc.pedidos?.status||""}</div></TableCell>
                  <TableCell><Badge variant="outline" className="rounded-full font-bold">{inc.tipo||""}</Badge></TableCell>
                  <TableCell><div className="font-medium text-slate-800">{inc.pedidos?.clientes?.nombre||"—"}</div><div className="text-xs text-slate-400">{inc.pedidos?.clientes?.telefono||""}</div></TableCell>
                  <TableCell className="text-sm text-slate-400">{new Date(inc.created_at).toLocaleString()}</TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      {inc.foto&&<a href={inc.foto} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:underline">Foto</a>}
                      {userRole==="admin"&&<Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-destructive/40 text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={()=>{if(!confirm("¿Eliminar?"))return;delMut.mutate(inc.id)}}><Trash2 className="h-4 w-4"/></Button>}
                    </div>
                  </TableCell>
                </m.tr>
              ))}
            </AnimatePresence>
            {filtered.length===0&&<TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">No hay incidencias.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </m.div>
    </m.div>
  )
}
