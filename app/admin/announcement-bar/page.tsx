"use client"

import { useEffect, useMemo, useState } from "react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnnouncementBar } from "@/components/announcement-bar"
import { getAnnouncementBarConfigAction, updateAnnouncementBarConfigAction } from "@/features/admin/actions/announcement"

import { Megaphone, RefreshCw, Save, Eye } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m } from "framer-motion"

function toBoolVal(v: boolean) { return v ? "true" : "false" }
function parseBoolVal(v: string) { return v === "true" }
function normalizeMessages(v: string) { return v.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,10) }

export default function AdminAnnouncementBarPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })
  const qc = useQueryClient()
  const [enabled, setEnabled] = useState(true)
  const [intervalMs, setIntervalMs] = useState("3500")
  const [messagesText, setMessagesText] = useState("")
  const [synced, setSynced] = useState(false)

  const { data: result, isLoading, isFetching } = useQuery({
    queryKey: ["announcementConfig"],
    queryFn: () => getAnnouncementBarConfigAction(),
    enabled: !guard.loading && !guard.accessDenied,
  })

  const config = result?.data


  // Sync form state from fetched config (only once on initial load)
  useEffect(() => {
    if (!config || synced) return
    setEnabled(Boolean((config as any).enabled))
    setIntervalMs(String((config as any).interval_ms || 3500))
    setMessagesText((Array.isArray((config as any).messages) ? (config as any).messages : []).join("\n"))
    setSynced(true)
  }, [config, synced])

  const saveMut = useMutation({
    mutationFn: () => updateAnnouncementBarConfigAction({ enabled, interval_ms: Number(intervalMs), messages: normalizeMessages(messagesText) }),

    onSuccess: () => { toast.success("Configuración guardada"); setSynced(false); qc.invalidateQueries({queryKey:["announcementConfig"]}) },
    onError: (e:any) => toast.error(e?.message||"Error al guardar"),
  })

  const messagesPreview = useMemo(() => normalizeMessages(messagesText), [messagesText])
  const canSave = useMemo(() => { const n=Number(intervalMs); return Number.isFinite(n)&&n>=500&&n<=30000 }, [intervalMs])

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={0} hasFilters={false} tableColumns={3} tableRows={3} hasActions actionCount={1} />
  if (guard.accessDenied) return <AccessDenied />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<Megaphone size={28} strokeWidth={1.5}/>} iconColor="bg-rose-600" iconShadow="shadow-rose-200" title="Announcement Bar" subtitle="Configura los mensajes que aparecen arriba de la tienda" isFetching={isFetching} dotColor="bg-rose-500"
        actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>{setSynced(false);qc.invalidateQueries({queryKey:["announcementConfig"]})}} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
      />

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
        <h2 className="text-lg font-black text-slate-900">Configuración</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Estado</Label>
            <Select value={toBoolVal(enabled)} onValueChange={v=>setEnabled(parseBoolVal(v))}>
              <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Selecciona"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activado</SelectItem>
                <SelectItem value="false">Desactivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Intervalo (ms)</Label>
            <Input value={intervalMs} onChange={e=>setIntervalMs(e.target.value)} placeholder="3500" className="focus-ring-premium rounded-xl h-12"/>
            <p className="text-xs text-slate-400">Mín 500ms, máx 30000ms.</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Mensajes (1 por línea)</Label>
          <Textarea value={messagesText} onChange={e=>setMessagesText(e.target.value)} placeholder="Escribe un mensaje por línea" className="min-h-[160px] rounded-xl"/>
          <p className="text-xs text-slate-400">Máximo 10 mensajes. Vacío = mensajes por defecto.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={()=>saveMut.mutate()} disabled={!canSave||saveMut.isPending} className="haptic-scale shadow-lg rounded-2xl h-14 px-8 font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700">
            {saveMut.isPending?<RefreshCw className="h-4 w-4 mr-2 animate-spin"/>:<Save className="h-4 w-4 mr-2"/>}
            {saveMut.isPending?"Guardando...":"Guardar"}
          </Button>
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-bold" onClick={()=>setMessagesText("")} disabled={saveMut.isPending}>Usar mensajes por defecto</Button>
        </div>
      </m.div>

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-4">
        <div className="flex items-center gap-2"><Eye className="h-5 w-5 text-slate-400"/><h2 className="text-lg font-black text-slate-900">Vista previa</h2></div>
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          {enabled ? <AnnouncementBar messages={messagesPreview} intervalMs={Number(intervalMs)||3500}/> : <div className="p-6 text-sm text-slate-400 text-center">Desactivado</div>}
        </div>
      </m.div>
    </m.div>
  )
}
