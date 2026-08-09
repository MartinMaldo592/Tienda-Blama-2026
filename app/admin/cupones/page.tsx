"use client"

import { useMemo, useState } from "react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Plus, Trash2, Pencil, Percent, Ticket, TrendingUp } from "lucide-react"
import { createAdminCupon, deleteAdminCupon, fetchAdminCupones, updateAdminCupon } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m, AnimatePresence } from "framer-motion"

type CouponType = "porcentaje" | "monto"
type CouponRow = {
  id: number; codigo: string; tipo: CouponType; valor: number; activo: boolean
  min_total: number; max_usos: number | null; usos: number
  starts_at: string | null; expires_at: string | null; created_at: string
}

function toDateVal(iso: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}
function toIsoStart(s: string) { const v=s.trim(); if(!v)return null; const d=new Date(`${v}T00:00:00.000`); return Number.isNaN(d.getTime())?null:d.toISOString() }
function toIsoEnd(s: string) { const v=s.trim(); if(!v)return null; const d=new Date(`${v}T23:59:59.999`); return Number.isNaN(d.getTime())?null:d.toISOString() }

export default function CuponesAdminPage() {
  const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin"] })
  const qc = useQueryClient()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<CouponRow | null>(null)
  const [codigo, setCodigo] = useState("")
  const [tipo, setTipo] = useState<CouponType>("porcentaje")
  const [valor, setValor] = useState("")
  const [activo, setActivo] = useState<"true"|"false">("true")
  const [minTotal, setMinTotal] = useState("0")
  const [maxUsos, setMaxUsos] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [expiresAt, setExpiresAt] = useState("")

  const { data: coupons = [], isLoading, isFetching } = useQuery({
    queryKey: ["adminCupones"], queryFn: fetchAdminCupones,
    enabled: !guard.loading && !guard.accessDenied,
    select: (d) => (d as any[]) as CouponRow[],
  })

  const saveMut = useMutation({
    mutationFn: async () => {
      const c = codigo.trim().toUpperCase()
      if (!c) throw new Error("Ingresa un código")
      const v = Number(valor); if (!Number.isFinite(v)||v<=0) throw new Error("Valor inválido")
      const mt = Number(minTotal); if (!Number.isFinite(mt)||mt<0) throw new Error("Mín total inválido")
      const mu = maxUsos.trim() ? Number(maxUsos) : null
      if (mu!=null&&(!Number.isFinite(mu)||mu<1)) throw new Error("Máx usos inválido")
      const p:any = { codigo:c, tipo, valor:v, activo:activo==="true", min_total:mt, max_usos:mu, starts_at:toIsoStart(startsAt), expires_at:toIsoEnd(expiresAt) }
      return editing ? updateAdminCupon(editing.id, p) : createAdminCupon(p)
    },
    onSuccess: () => { toast.success(editing?"Cupón actualizado":"Cupón creado"); setSheetOpen(false); resetForm(); qc.invalidateQueries({queryKey:["adminCupones"]}) },
    onError: (e:any) => toast.error(e?.message||"Error al guardar"),
  })

  const delMut = useMutation({
    mutationFn: (id:number) => deleteAdminCupon(id),
    onSuccess: () => { toast.success("Cupón eliminado"); qc.invalidateQueries({queryKey:["adminCupones"]}) },
    onError: (e:any) => toast.error(e?.message||"Error al eliminar"),
  })

  const stats = useMemo(() => ({
    total: coupons.length,
    activos: coupons.filter(c=>c.activo).length,
    usos: coupons.reduce((s,c)=>s+(c.usos||0),0),
  }), [coupons])

  function resetForm() { setEditing(null);setCodigo("");setTipo("porcentaje");setValor("");setActivo("true");setMinTotal("0");setMaxUsos("");setStartsAt("");setExpiresAt("") }
  function openCreate() { resetForm(); setSheetOpen(true) }
  function openEdit(c: CouponRow) {
    setEditing(c);setCodigo(c.codigo);setTipo(c.tipo||"porcentaje");setValor(String(c.valor??""))
    setActivo(c.activo?"true":"false");setMinTotal(String(c.min_total??0))
    setMaxUsos(c.max_usos==null?"":String(c.max_usos));setStartsAt(toDateVal(c.starts_at));setExpiresAt(toDateVal(c.expires_at));setSheetOpen(true)
  }
  function handleDel(c: CouponRow) { if(!confirm(`Eliminar cupón ${c.codigo}?`))return; delMut.mutate(c.id) }

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={8} tableRows={6} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores pueden gestionar cupones." />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<Percent size={28} strokeWidth={1.5}/>} iconColor="bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700" iconShadow="shadow-amber-500/20" title="Cupones" totalItems={stats.total} totalLabel="cupones registrados" isFetching={isFetching} dotColor="bg-amber-500"
        actions={<>
          <Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-xl h-11 px-5 font-bold border-slate-200 dark:border-slate-800" onClick={()=>qc.invalidateQueries({queryKey:["adminCupones"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>
          <Button className="gap-2 haptic-scale shadow-lg shadow-amber-600/20 rounded-xl h-11 px-5 font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700" onClick={openCreate}><Plus className="h-4 w-4"/>Nuevo Cupón</Button>
        </>}
      />

      {/* Stats */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{l:"Total Cupones",v:stats.total,icon:Ticket,c:"text-amber-600",bg:"bg-amber-50"},{l:"Activos",v:stats.activos,icon:TrendingUp,c:"text-emerald-600",bg:"bg-emerald-50"},{l:"Usos Totales",v:stats.usos,icon:Percent,c:"text-blue-600",bg:"bg-blue-50"}].map((s,i)=>(
          <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
              <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
            </div>
          </m.div>
        ))}
      </m.div>

      {/* Table */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-16 hover:bg-transparent border-slate-100">
              {["Código","Tipo","Valor","Estado","Usos","Inicio","Expira","Acciones"].map((h,i)=>(
                <TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===7?'pr-8 text-right':''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {coupons.map((c,i)=>(
                <m.tr key={c.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className="h-[68px] hover:bg-slate-50/80 transition-colors border-slate-50 group">
                  <TableCell className="pl-8 font-bold text-slate-900 font-mono tracking-wide">{c.codigo}</TableCell>
                  <TableCell><Badge variant="outline" className="rounded-full capitalize">{c.tipo}</Badge></TableCell>
                  <TableCell className="font-bold text-slate-900">{c.tipo==="porcentaje"?`${c.valor}%`:`S/ ${c.valor}`}</TableCell>
                  <TableCell><Badge className={`rounded-full ${c.activo?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-slate-100 text-slate-500 border-slate-200'}`}>{c.activo?"Activo":"Inactivo"}</Badge></TableCell>
                  <TableCell><span className="font-bold">{c.usos}</span><span className="text-slate-400"> / {c.max_usos==null?"∞":c.max_usos}</span></TableCell>
                  <TableCell className="text-sm text-slate-500">{toDateVal(c.starts_at)||"—"}</TableCell>
                  <TableCell className="text-sm text-slate-500">{toDateVal(c.expires_at)||"—"}</TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="icon" className="rounded-xl h-9 w-9" onClick={()=>openEdit(c)}><Pencil className="h-4 w-4"/></Button>
                      <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-destructive/40 text-destructive hover:bg-destructive/5" onClick={()=>handleDel(c)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </TableCell>
                </m.tr>
              ))}
            </AnimatePresence>
            {coupons.length===0&&<TableRow><TableCell colSpan={8} className="text-center py-20 text-slate-400">No hay cupones.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </m.div>

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[90%] sm:max-w-[420px]">
          <SheetHeader><SheetTitle className="text-xl font-black">{editing?"Editar cupón":"Nuevo cupón"}</SheetTitle></SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Código</Label><Input value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="PROMO10" disabled={saveMut.isPending} className="rounded-xl h-12"/></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Tipo</Label><Select value={tipo} onValueChange={v=>setTipo(v as CouponType)}><SelectTrigger className="rounded-xl h-12"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="porcentaje">Porcentaje</SelectItem><SelectItem value="monto">Monto fijo</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Valor</Label><Input inputMode="decimal" value={valor} onChange={e=>setValor(e.target.value)} placeholder={tipo==="porcentaje"?"10":"15"} disabled={saveMut.isPending} className="rounded-xl h-12"/></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Estado</Label><Select value={activo} onValueChange={v=>setActivo(v as any)}><SelectTrigger className="rounded-xl h-12"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="true">Activo</SelectItem><SelectItem value="false">Inactivo</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Mín. total</Label><Input inputMode="decimal" value={minTotal} onChange={e=>setMinTotal(e.target.value)} disabled={saveMut.isPending} className="rounded-xl h-12"/></div>
              <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Máx. usos</Label><Input inputMode="numeric" value={maxUsos} onChange={e=>setMaxUsos(e.target.value)} placeholder="∞" disabled={saveMut.isPending} className="rounded-xl h-12"/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Inicio</Label><Input type="date" value={startsAt} onChange={e=>setStartsAt(e.target.value)} disabled={saveMut.isPending} className="rounded-xl h-12"/></div>
              <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Expira</Label><Input type="date" value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} disabled={saveMut.isPending} className="rounded-xl h-12"/></div>
            </div>
            <div className="pt-3"><Button className="w-full haptic-scale shadow-lg rounded-2xl h-14 font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700" onClick={()=>saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending?<RefreshCw className="h-4 w-4 mr-2 animate-spin"/>:null}{saveMut.isPending?"Guardando...":"Guardar Cupón"}</Button></div>
          </div>
        </SheetContent>
      </Sheet>
    </m.div>
  )
}
