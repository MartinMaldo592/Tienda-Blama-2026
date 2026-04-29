"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase.client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { fetchAdminProfiles } from "@/features/admin"
import { createWorkerAction, updateUserProfile, updateUserRole } from "@/features/admin/actions/users"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, UserCheck, Loader2, Search, UserPlus, Mail, User, Shield, AlertTriangle, Lock, RefreshCw, Edit2, Users } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { m, AnimatePresence } from "framer-motion"

export default function UsuariosPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [roleToAssign, setRoleToAssign] = useState("worker")
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmRoleDialog, setConfirmRoleDialog] = useState<{open:boolean;userId:string;newRole:string;userName:string}|null>(null)
  const [editProfileDialog, setEditProfileDialog] = useState<{open:boolean;userId:string;nombre:string}|null>(null)

  const { data: profiles = [], isLoading, isFetching } = useQuery({
    queryKey: ["adminProfiles"], queryFn: fetchAdminProfiles,
    enabled: !guard.loading && !guard.accessDenied,
  })

  const createMut = useMutation({
    mutationFn: async () => {
      return createWorkerAction({
        email,
        nombre,
        password: password || null,
        role: roleToAssign,
        origin: window.location.origin
      })
    },

    onSuccess: (json:any) => {
      toast.success(json?.isInvite?`Invitación enviada para rol ${roleToAssign==="admin"?"Administrador":"Trabajador"}.`:`Usuario creado como ${roleToAssign==="admin"?"Administrador":"Trabajador"}.`)
      setEmail("");setNombre("");setPassword("");setRoleToAssign("worker")
      qc.invalidateQueries({queryKey:["adminProfiles"]});qc.invalidateQueries({queryKey:["adminWorkers"]})
    },
    onError: (err:any) => { if(err.message.includes("session"))router.push("/auth/login"); toast.error(err.message||"Error al crear usuario") },
  })

  const updateRoleMut = useMutation({
    mutationFn: ({userId,newRole}:{userId:string,newRole:string}) => updateUserRole(userId,newRole),
    onMutate: async ({userId,newRole}) => {
      await qc.cancelQueries({queryKey:["adminProfiles"]})
      const prev = qc.getQueryData(["adminProfiles"])
      qc.setQueryData(["adminProfiles"], (old:any) => old?.map((p:any) => p.id===userId?{...p,role:newRole}:p))
      return { prev }
    },
    onError: (err:any,_,ctx) => { if(ctx?.prev)qc.setQueryData(["adminProfiles"],ctx.prev); toast.error("Error: "+err.message) },
    onSettled: () => { qc.invalidateQueries({queryKey:["adminProfiles"]});qc.invalidateQueries({queryKey:["adminWorkers"]}) },
    onSuccess: () => { toast.success("Rol actualizado"); setConfirmRoleDialog(null) },
  })

  const updateProfileMut = useMutation({
    mutationFn: ({userId,nombre}:{userId:string,nombre:string}) => updateUserProfile(userId,nombre),
    onSuccess: () => { toast.success("Perfil actualizado"); setEditProfileDialog(null); qc.invalidateQueries({queryKey:["adminProfiles"]}) },
    onError: (err:any) => toast.error("Error: "+err.message),
  })

  const filteredProfiles = profiles.filter((p:any) => p.email?.toLowerCase().includes(searchTerm.toLowerCase())||p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = { total: profiles.length, admins: profiles.filter((p:any)=>p.role==="admin").length, workers: profiles.filter((p:any)=>p.role==="worker").length }

  if (guard.loading) return <AdminPageSkeleton hasStats={3} tableColumns={4} tableRows={6} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores pueden gestionar usuarios." />

  return (
    <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto">
      <AdminPageHeader icon={<Users size={28} strokeWidth={1.5}/>} iconColor="bg-violet-600" iconShadow="shadow-violet-200" title="Usuarios" totalItems={stats.total} totalLabel="usuarios registrados" isFetching={isFetching} dotColor="bg-violet-500"
        actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>qc.invalidateQueries({queryKey:["adminProfiles"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
      />

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{l:"Total Usuarios",v:stats.total,icon:Users,c:"text-violet-600",bg:"bg-violet-50"},{l:"Administradores",v:stats.admins,icon:Shield,c:"text-red-600",bg:"bg-red-50"},{l:"Trabajadores",v:stats.workers,icon:UserCheck,c:"text-blue-600",bg:"bg-blue-50"}].map((s,i)=>(
          <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
              <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
            </div>
          </m.div>
        ))}
      </m.div>

      {/* Create user form */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
        <div className="flex items-center gap-2 text-violet-600"><UserPlus className="h-5 w-5"/><h2 className="text-lg font-black text-slate-900">Registrar Nuevo Miembro</h2></div>
        <p className="text-sm text-slate-400">Completa los datos para invitar o crear un nuevo acceso directo.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Email</Label><div className="relative"><Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-300"/><Input type="email" className="pl-9 rounded-xl h-12" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ejemplo@blama.shop"/></div></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nombre</Label><div className="relative"><User className="absolute left-3 top-3.5 h-4 w-4 text-slate-300"/><Input className="pl-9 rounded-xl h-12" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Juan Pérez"/></div></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Rol</Label><Select value={roleToAssign} onValueChange={setRoleToAssign}><SelectTrigger className="rounded-xl h-12"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="worker">Worker (Logística)</SelectItem><SelectItem value="admin">Administrador (Total)</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Contraseña</Label><div className="relative"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-300"/><Input type="password" className="pl-9 rounded-xl h-12" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Vacío = invitar vía email"/></div></div>
        </div>
        <div className="flex justify-end pt-2"><Button onClick={()=>createMut.mutate()} disabled={createMut.isPending||!email.trim()||!nombre.trim()} className="haptic-scale shadow-lg rounded-2xl h-14 px-8 font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700">{createMut.isPending?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Procesando...</>:<><UserPlus className="mr-2 h-4 w-4"/>Crear Usuario</>}</Button></div>
      </m.div>

      {/* Search + Table */}
      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
        <div className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-300"/><Input placeholder="Buscar usuario..." className="pl-10 rounded-xl h-12 border-slate-200" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div>
      </m.div>

      <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-16 hover:bg-transparent border-slate-100">
              {["Usuario","Nombre","Nivel de Acceso","Fecha Registro"].map((h,i)=>(<TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===3?'pr-8 text-right':''}`}>{h}</TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredProfiles.map((p:any,i:number)=>(
                <m.tr key={p.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className="h-[72px] hover:bg-slate-50/80 transition-colors border-slate-50 group">
                  <TableCell className="pl-8">
                    <div className="flex flex-col"><span className="font-bold text-slate-900">{p.email||"Sin email"}</span><span className="text-[10px] text-slate-300 font-mono tracking-tighter uppercase">{p.id.substring(0,8)}...</span></div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center text-violet-600 font-black text-xs uppercase border border-violet-100">{p.nombre?.charAt(0)||"U"}</div>
                      <span className="font-medium text-slate-800">{p.nombre||"Sin nombre"}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" onClick={()=>setEditProfileDialog({open:true,userId:p.id,nombre:p.nombre||""})}><Edit2 className="h-3.5 w-3.5 text-slate-400"/></Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={p.role||"user"} onValueChange={val=>setConfirmRoleDialog({open:true,userId:p.id,newRole:val,userName:p.nombre||p.email})} disabled={updateRoleMut.isPending}>
                      <SelectTrigger className="w-[160px] h-9 rounded-xl border-slate-200"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin" className="text-red-600"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Administrador</div></SelectItem>
                        <SelectItem value="worker"><div className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-blue-600"/>Trabajador</div></SelectItem>
                        <SelectItem value="user"><div className="flex items-center gap-2 opacity-60"><User className="h-4 w-4"/>Cliente</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="pr-8 text-right text-sm text-slate-400 font-medium">{p.created_at?new Date(p.created_at).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}):"-"}</TableCell>
                </m.tr>
              ))}
            </AnimatePresence>
            {filteredProfiles.length===0&&<TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">No se encontraron usuarios.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </m.div>

      {/* Confirm Role Dialog */}
      <Dialog open={confirmRoleDialog?.open} onOpenChange={open=>!open&&setConfirmRoleDialog(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl">
          <DialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-yellow-50 flex items-center justify-center mb-2"><AlertTriangle className="h-6 w-6 text-yellow-600"/></div>
            <DialogTitle className="font-black">Confirmar Cambio de Rol</DialogTitle>
            <DialogDescription>¿Cambiar el acceso de <strong>{confirmRoleDialog?.userName}</strong> a <strong>{confirmRoleDialog?.newRole==='admin'?'Administrador':confirmRoleDialog?.newRole==='worker'?'Trabajador':'Cliente'}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" className="rounded-xl" onClick={()=>setConfirmRoleDialog(null)} disabled={updateRoleMut.isPending}>Cancelar</Button>
            <Button variant={confirmRoleDialog?.newRole==='admin'?"destructive":"default"} className="rounded-xl" onClick={()=>confirmRoleDialog&&updateRoleMut.mutate({userId:confirmRoleDialog.userId,newRole:confirmRoleDialog.newRole})} disabled={updateRoleMut.isPending}>{updateRoleMut.isPending?<Loader2 className="animate-spin h-4 w-4"/>:"Confirmar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileDialog?.open} onOpenChange={open=>!open&&setEditProfileDialog(null)}>
        <DialogContent className="max-w-[400px] rounded-2xl">
          <DialogHeader><DialogTitle className="font-black">Editar Nombre</DialogTitle><DialogDescription>Modifica el nombre público de este usuario.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4"><div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nombre</Label><Input value={editProfileDialog?.nombre||""} onChange={e=>setEditProfileDialog(prev=>prev?{...prev,nombre:e.target.value}:null)} placeholder="Nuevo nombre" className="rounded-xl h-12"/></div></div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={()=>setEditProfileDialog(null)} disabled={updateProfileMut.isPending}>Cancelar</Button>
            <Button className="rounded-xl" onClick={()=>editProfileDialog&&updateProfileMut.mutate({userId:editProfileDialog.userId,nombre:editProfileDialog.nombre})} disabled={updateProfileMut.isPending||!editProfileDialog?.nombre.trim()}>{updateProfileMut.isPending?<Loader2 className="animate-spin h-4 w-4"/>:"Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </m.div>
  )
}
