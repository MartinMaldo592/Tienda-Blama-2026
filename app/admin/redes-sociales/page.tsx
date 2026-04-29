"use client"

import { useRef, useState } from "react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Trash2, ExternalLink, RefreshCw, Share2, Pencil } from "lucide-react"
import { fetchSocialLinks, saveSocialLink, deleteSocialLink, SocialLink } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m, AnimatePresence } from "framer-motion"

export default function AdminSocialLinksPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })
  const qc = useQueryClient()
  const formRef = useRef<HTMLDivElement|null>(null)

  const [editingId, setEditingId] = useState<number|null>(null)
  const [platform, setPlatform] = useState("facebook")
  const [url, setUrl] = useState("")
  const [orden, setOrden] = useState("0")
  const [active, setActive] = useState(true)

  const { data: items = [], isLoading, isFetching } = useQuery({
    queryKey: ["socialLinks"], queryFn: fetchSocialLinks,
    enabled: !guard.loading && !guard.accessDenied,
    select: (d) => (d as SocialLink[]) || [],
  })

  const saveMut = useMutation({
    mutationFn: () => {
      if (!url) throw new Error("La URL es obligatoria")
      return saveSocialLink({ id: editingId, payload: { platform, url, orden: Number(orden)||0, active } })
    },
    onSuccess: () => { toast.success(editingId?"Enlace actualizado":"Enlace agregado"); resetForm(); qc.invalidateQueries({queryKey:["socialLinks"]}) },
    onError: (e:any) => toast.error(e?.message||"Error guardando"),
  })

  const delMut = useMutation({
    mutationFn: (id:number) => deleteSocialLink(id),
    onSuccess: () => { toast.success("Enlace eliminado"); qc.invalidateQueries({queryKey:["socialLinks"]}) },
    onError: (e:any) => toast.error(e?.message||"Error eliminando"),
  })

  function resetForm() { setEditingId(null);setPlatform("facebook");setUrl("");setOrden("0");setActive(true) }
  function startCreate() { resetForm();setOrden(String(items.length+1));formRef.current?.scrollIntoView({behavior:"smooth",block:"start"}) }
  function startEdit(item:SocialLink) { setEditingId(item.id);setPlatform(item.platform);setUrl(item.url);setOrden(String(item.orden??0));setActive(item.active);formRef.current?.scrollIntoView({behavior:"smooth",block:"start"}) }
  function handleDel(id:number) { if(!confirm("¿Eliminar esta red social?"))return; if(editingId===id)resetForm(); delMut.mutate(id) }

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={0} tableColumns={6} tableRows={5} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores pueden gestionar redes sociales." />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<Share2 size={28} strokeWidth={1.5}/>} iconColor="bg-cyan-600" iconShadow="shadow-cyan-200" title="Redes Sociales" totalItems={items.length} totalLabel="enlaces configurados" isFetching={isFetching} dotColor="bg-cyan-500"
        actions={<>
          <Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>qc.invalidateQueries({queryKey:["socialLinks"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>
          <Button className="gap-2 haptic-scale shadow-lg rounded-2xl h-14 px-6 font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700" onClick={startCreate}><Plus className="h-5 w-5"/>Nuevo Enlace</Button>
        </>}
      />

      {/* Form */}
      <m.div ref={formRef} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{editingId!=null?`Editando #${editingId}`:"Agregar nueva red social"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Plataforma</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Selecciona..."/></SelectTrigger>
              <SelectContent>
                {["facebook","instagram","tiktok","whatsapp","twitter","youtube","linkedin"].map(p=><SelectItem key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">URL del Perfil</Label>
            <Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.instagram.com/mi-tienda" className="focus-ring-premium rounded-xl h-12"/>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Orden</Label>
            <Input inputMode="numeric" value={orden} onChange={e=>setOrden(e.target.value.replace(/[^0-9-]/g,""))} className="rounded-xl h-12"/>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Visible</Label>
            <div className="flex items-center gap-2 h-12">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                Mostrar enlace en el footer
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          {editingId!=null?<Button variant="outline" className="rounded-2xl h-12 px-6 font-bold" onClick={resetForm} disabled={saveMut.isPending}>Cancelar</Button>:<Button variant="outline" className="rounded-2xl h-12 px-6 font-bold" onClick={resetForm} disabled={saveMut.isPending}>Limpiar</Button>}
          <Button onClick={()=>saveMut.mutate()} disabled={!url||saveMut.isPending} className="haptic-scale shadow-lg rounded-2xl h-12 px-8 font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700">
            {saveMut.isPending?<RefreshCw className="h-4 w-4 mr-2 animate-spin"/>:<Save className="h-4 w-4 mr-2"/>}
            {saveMut.isPending?"Guardando...":editingId!=null?"Guardar cambios":"Agregar"}
          </Button>
        </div>
      </m.div>

      {/* Table */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-16 hover:bg-transparent border-slate-100">
              {["Icono","Plataforma","URL","Orden","Estado","Acciones"].map((h,i)=>(
                <TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===5?'pr-8 text-right':''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {items.map((item,i)=>(
                <m.tr key={item.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className={`h-[68px] hover:bg-slate-50/80 transition-colors border-slate-50 group ${editingId===item.id?'bg-cyan-50/50':''}`}>
                  <TableCell className="pl-8">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center capitalize font-black text-xs text-slate-500 border border-slate-200">{item.platform.slice(0,2)}</div>
                  </TableCell>
                  <TableCell className="capitalize font-bold text-slate-900">{item.platform}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center text-slate-500 hover:text-slate-900 hover:underline transition-colors">{item.url}<ExternalLink className="h-3 w-3 ml-1.5 shrink-0"/></a>
                  </TableCell>
                  <TableCell className="font-bold text-slate-600">{item.orden}</TableCell>
                  <TableCell><Badge className={`rounded-full ${item.active?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-slate-100 text-slate-500 border-slate-200'}`}>{item.active?"Activo":"Oculto"}</Badge></TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="icon" className="rounded-xl h-9 w-9" onClick={()=>startEdit(item)}><Pencil className="h-4 w-4"/></Button>
                      <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-destructive/40 text-destructive hover:bg-destructive/5" onClick={()=>handleDel(item.id)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </TableCell>
                </m.tr>
              ))}
            </AnimatePresence>
            {items.length===0&&<TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">No hay redes sociales configuradas.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </m.div>
    </m.div>
  )
}
