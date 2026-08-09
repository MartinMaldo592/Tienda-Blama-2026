"use client"

import { useMemo, useState } from "react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, MessageSquare, RefreshCw, Save, X, HelpCircle, CheckCircle } from "lucide-react"
import { fetchAdminQuestions, saveQuestionAnswer, setQuestionPublished } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m, AnimatePresence } from "framer-motion"

type QuestionRow = {
  id: number; product_id: number; question: string; asker_name: string | null
  asker_phone: string | null; published: boolean; created_at: string
  productos?: { nombre: string } | null
  product_answers?: { id: number; answer: string; answered_by: string | null; created_at: string; published: boolean }[]
}

export default function AdminPreguntasPage() {
  const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin"] })
  const qc = useQueryClient()
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<number|null>(null)
  const [editingId, setEditingId] = useState<number|null>(null)
  const [answer, setAnswer] = useState("")

  const { data: items = [], isLoading, isFetching } = useQuery({
    queryKey: ["adminPreguntas"], queryFn: fetchAdminQuestions,
    enabled: !guard.loading && !guard.accessDenied,
    select: (d) => ((d as any[]) || []) as QuestionRow[],
  })

  const publishMut = useMutation({
    mutationFn: async ({id,published}:{id:number,published:boolean}) => { setBusyId(id); return setQuestionPublished({id,published}) },
    onSuccess: (_,{published}) => { toast.success(published?"Pregunta publicada":"Pregunta ocultada"); qc.invalidateQueries({queryKey:["adminPreguntas"]}) },
    onError: (e:any) => toast.error(e?.message||"Error"),
    onSettled: () => setBusyId(null),
  })

  const answerMut = useMutation({
    mutationFn: async (questionId:number) => {
      if (!answer.trim()||answer.trim().length<6) throw new Error("Escribe una respuesta más completa")
      return saveQuestionAnswer({ questionId, answer: answer.trim() })
    },
    onSuccess: () => { toast.success("Respuesta guardada"); setEditingId(null); setAnswer(""); qc.invalidateQueries({queryKey:["adminPreguntas"]}) },
    onError: (e:any) => toast.error(e?.message||"Error"),
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(r => [r.productos?.nombre,r.question,r.asker_name,r.asker_phone].some(v=>String(v||"").toLowerCase().includes(q)))
  }, [items, search])

  const stats = useMemo(() => ({
    total: items.length,
    sinResponder: items.filter(q=>!q.product_answers?.length).length,
    publicadas: items.filter(q=>q.published).length,
  }), [items])

  function startAnswer(q: QuestionRow) {
    setEditingId(q.id)
    const existing = q.product_answers?.length ? q.product_answers[0] : null
    setAnswer(existing?.answer || "")
  }

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={4} tableRows={8} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores." />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<MessageSquare size={28} strokeWidth={1.5}/>} iconColor="bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700" iconShadow="shadow-indigo-500/20" title="Preguntas" totalItems={stats.total} totalLabel="preguntas recibidas" isFetching={isFetching} dotColor="bg-indigo-500"
        actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-xl h-11 px-5 font-bold border-slate-200 dark:border-slate-800" onClick={()=>qc.invalidateQueries({queryKey:["adminPreguntas"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
      />

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{l:"Total",v:stats.total,icon:MessageSquare,c:"text-indigo-600",bg:"bg-indigo-50"},{l:"Sin Responder",v:stats.sinResponder,icon:HelpCircle,c:"text-orange-600",bg:"bg-orange-50"},{l:"Publicadas",v:stats.publicadas,icon:CheckCircle,c:"text-emerald-600",bg:"bg-emerald-50"}].map((s,i)=>(
          <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
              <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
            </div>
          </m.div>
        ))}
      </m.div>

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por producto o texto..." className="focus-ring-premium rounded-xl h-12 border-slate-200"/>
      </m.div>

      {/* Answer editor */}
      {editingId!=null&&(
        <m.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-indigo-600"/>Responder pregunta #{editingId}</div>
            <Button variant="outline" className="rounded-xl" onClick={()=>{setEditingId(null);setAnswer("")}}>Cancelar</Button>
          </div>
          <Textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Escribe una respuesta clara..." className="rounded-xl min-h-[100px]"/>
          <div className="flex justify-end">
            <Button onClick={()=>answerMut.mutate(editingId)} className="gap-2 haptic-scale rounded-2xl h-12 px-6 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white" disabled={answerMut.isPending}>
              {answerMut.isPending?<RefreshCw className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}
              {answerMut.isPending?"Guardando...":"Guardar y publicar"}
            </Button>
          </div>
        </m.div>
      )}

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-16 hover:bg-transparent border-slate-100">
              {["Producto","Pregunta","Estado","Acciones"].map((h,i)=>(
                <TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===3?'pr-8 text-right':''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filtered.map((q,i)=>{
                const dis = busyId===q.id
                const hasAns = !!(q.product_answers?.length)
                return (
                  <m.tr key={q.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className={`h-[80px] hover:bg-slate-50/80 transition-colors border-slate-50 group ${editingId===q.id?'bg-indigo-50/50':''}`}>
                    <TableCell className="pl-8 max-w-[220px]">
                      <div className="font-bold text-slate-900">{q.productos?.nombre||`Producto #${q.product_id}`}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{q.asker_name?`${q.asker_name}${q.asker_phone?` • ${q.asker_phone}`:""}`:"—"}</div>
                    </TableCell>
                    <TableCell className="max-w-[450px]">
                      <div className="text-sm font-semibold text-slate-800">{q.question}</div>
                      {hasAns?<div className="mt-1.5 text-xs text-slate-400 line-clamp-2">💬 {q.product_answers?.[0]?.answer}</div>:<div className="mt-1.5 text-xs text-orange-400 font-medium">Sin respuesta</div>}
                      <div className="text-[10px] text-slate-300 mt-1">{new Date(q.created_at).toLocaleString()}</div>
                    </TableCell>
                    <TableCell><Badge className={`rounded-full ${q.published?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-orange-100 text-orange-700 border-orange-200'}`}>{q.published?"Publicado":"Pendiente"}</Badge></TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={()=>startAnswer(q)} className="gap-1.5 rounded-xl"><MessageSquare className="h-3.5 w-3.5"/>Responder</Button>
                        {q.published?(
                          <Button size="sm" variant="outline" disabled={dis} onClick={()=>publishMut.mutate({id:q.id,published:false})} className="gap-1.5 rounded-xl"><X className="h-3.5 w-3.5"/>Ocultar</Button>
                        ):(
                          <Button size="sm" disabled={dis} onClick={()=>publishMut.mutate({id:q.id,published:true})} className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"><Check className="h-3.5 w-3.5"/>Publicar</Button>
                        )}
                      </div>
                    </TableCell>
                  </m.tr>
                )
              })}
            </AnimatePresence>
            {filtered.length===0&&<TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">No hay preguntas.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </m.div>
    </m.div>
  )
}
