"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase.client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { createWorkerViaApi, fetchAdminProfiles, updateUserRole, updateUserProfile } from "@/features/admin"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShieldCheck, UserCheck, Loader2, Search, UserPlus, Mail, User, Shield, AlertTriangle, Lock, RefreshCw, Edit2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function UsuariosPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  // Form State
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [roleToAssign, setRoleToAssign] = useState("worker")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Dialog State
  const [confirmRoleDialog, setConfirmRoleDialog] = useState<{ open: boolean; userId: string; newRole: string; userName: string } | null>(null)
  const [editProfileDialog, setEditProfileDialog] = useState<{ open: boolean; userId: string; nombre: string } | null>(null)

  // 1. Data Fetching with React Query
  const { data: profiles = [], isLoading, isError } = useQuery({
    queryKey: ["adminProfiles"],
    queryFn: fetchAdminProfiles,
    enabled: !guard.loading && !guard.accessDenied, // Only run if allowed
  })

  // 2. Mutations
  const createWorkerMutation = useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No hay sesión activa")
      return createWorkerViaApi({
        accessToken: session.access_token,
        email,
        nombre,
        password: password || null,
        role: roleToAssign
      })
    },
    onSuccess: (json: any) => {
      const roleName = roleToAssign === "admin" ? "Administrador" : "Trabajador"
      if (json?.isInvite) {
        toast.success(`Invitación enviada para rol ${roleName}.`)
      } else {
        toast.success(`Usuario creado como ${roleName}.`)
      }
      // Reset Form
      setEmail("")
      setNombre("")
      setPassword("")
      setRoleToAssign("worker")

      // Refresh List automatically
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })
      queryClient.invalidateQueries({ queryKey: ["adminWorkers"] })
    },
    onError: (err: any) => {
      if (err.message.includes("session")) router.push("/auth/login")
      toast.error(err.message || "Error al crear usuario")
    }
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      return updateUserRole(userId, newRole)
    },
    onMutate: async ({ userId, newRole }) => {
      // Optimistic UI update
      await queryClient.cancelQueries({ queryKey: ["adminProfiles"] })
      const previousProfiles = queryClient.getQueryData(["adminProfiles"])
      
      queryClient.setQueryData(["adminProfiles"], (old: any) => {
        if (!old) return old
        return old.map((p: any) => p.id === userId ? { ...p, role: newRole } : p)
      })
      
      return { previousProfiles }
    },
    onError: (err: any, variables, context) => {
      // Rollback on error
      if (context?.previousProfiles) {
        queryClient.setQueryData(["adminProfiles"], context.previousProfiles)
      }
      toast.error("Error al actualizar rol: " + err.message)
    },
    onSettled: () => {
      // Sync with server state and invalidate workers for the orders table
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })
      queryClient.invalidateQueries({ queryKey: ["adminWorkers"] })
    },
    onSuccess: () => {
      toast.success("Rol actualizado correctamente")
      setConfirmRoleDialog(null)
    }
  })

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, nombre }: { userId: string, nombre: string }) => {
      return updateUserProfile(userId, nombre)
    },
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente")
      setEditProfileDialog(null)
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })
    },
    onError: (err: any) => {
      toast.error("Error al actualizar perfil: " + err.message)
    }
  })

  // 3. Logic
  const filteredProfiles = profiles.filter((p: any) => 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="gap-1"><Shield className="h-3 w-3" /> Admin</Badge>
      case 'worker':
        return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 gap-1"><User className="h-3 w-3" /> Worker</Badge>
      default:
        return <Badge variant="secondary" className="gap-1">Cliente</Badge>
    }
  }


  // Render Logic
  if (guard.loading) {
    return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin" /> Verificando permisos...</div>
  }

  if (guard.accessDenied) {
    return <AccessDenied message="Solo administradores pueden gestionar usuarios." />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los accesos y roles de tu equipo de trabajo.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar usuario..."
                    className="pl-9 h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })}
                disabled={isLoading}
            >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
                <UserPlus className="h-5 w-5" />
                <CardTitle className="text-lg">Registrar Nuevo Miembro</CardTitle>
            </div>
            <CardDescription>Completa los datos para invitar o crear un nuevo acceso directo.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email Corporativo</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                            id="email" 
                            type="email"
                            className="pl-9 bg-white"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="ejemplo@blama.shop" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Nombre Completo</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                            id="nombre" 
                            className="pl-9 bg-white"
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            placeholder="Juan Pérez" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Rol de Sistema</Label>
                    <Select value={roleToAssign} onValueChange={setRoleToAssign}>
                        <SelectTrigger className="bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="worker">Worker (Logística/Ventas)</SelectItem>
                            <SelectItem value="admin">Administrador (Total)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Contraseña de Acceso</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                            id="password" 
                            type="password"
                            className="pl-9 bg-white"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Vacio para invitar via email" 
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
                <Button
                    onClick={() => createWorkerMutation.mutate()}
                    disabled={createWorkerMutation.isPending || !email.trim() || !nombre.trim()}
                    className="min-w-[140px] shadow-sm"
                >
                    {createWorkerMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                    ) : (
                        <><UserPlus className="mr-2 h-4 w-4" /> Crear Usuario</>
                    )}
                </Button>
            </div>
        </CardContent>
      </Card>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Listado de Perfiles Registrados
            </h2>
            <Badge variant="outline" className="font-normal">{filteredProfiles.length} usuarios encontrados</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableHead className="w-[30%]">Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Nivel de Acceso</TableHead>
                <TableHead className="text-right">Fecha de Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No se encontraron usuarios con esos criterios.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((p: any) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{p.email || "Sin email"}</span>
                            <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{p.id.substring(0, 8)}...</span>
                        </div>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                {p.nombre?.charAt(0) || "U"}
                            </div>
                            <span className="flex-1">{p.nombre || "Sin nombre"}</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setEditProfileDialog({ open: true, userId: p.id, nombre: p.nombre || "" })}
                            >
                                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                        </div>
                    </td>
                    <td className="p-4">
                      <Select
                        defaultValue={p.role || "user"}
                        onValueChange={(val) => setConfirmRoleDialog({ open: true, userId: p.id, newRole: val, userName: p.nombre || p.email })}
                        disabled={updateRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-[160px] h-9 border-gray-200 focus:ring-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin" className="text-red-600">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4" /> Administrador
                            </div>
                          </SelectItem>
                          <SelectItem value="worker">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-blue-600" /> Trabajador
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2 opacity-60">
                                <User className="h-4 w-4" /> Cliente (User)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-right text-muted-foreground text-xs font-medium">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmRoleDialog?.open} 
        onOpenChange={(open) => !open && setConfirmRoleDialog(null)}
      >
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <DialogTitle>Confirmar Cambio de Rol</DialogTitle>
            <DialogDescription>
                ¿Estás seguro de que deseas cambiar el nivel de acceso de <strong>{confirmRoleDialog?.userName}</strong> a <strong>{confirmRoleDialog?.newRole === 'admin' ? 'Administrador' : confirmRoleDialog?.newRole === 'worker' ? 'Trabajador' : 'Cliente'}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setConfirmRoleDialog(null)} disabled={updateRoleMutation.isPending}>
              Cancelar
            </Button>
            <Button 
                variant={confirmRoleDialog?.newRole === 'admin' ? "destructive" : "default"}
                onClick={() => confirmRoleDialog && updateRoleMutation.mutate({ userId: confirmRoleDialog.userId, newRole: confirmRoleDialog.newRole })}
                disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirmar Cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editProfileDialog?.open} 
        onOpenChange={(open) => !open && setEditProfileDialog(null)}
      >
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Nombre de Usuario</DialogTitle>
            <DialogDescription>
                Modifica el nombre público de este usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input 
                    id="edit-nombre"
                    value={editProfileDialog?.nombre || ""}
                    onChange={(e) => setEditProfileDialog(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                    placeholder="Nuevo nombre"
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileDialog(null)} disabled={updateProfileMutation.isPending}>
              Cancelar
            </Button>
            <Button 
                onClick={() => editProfileDialog && updateProfileMutation.mutate({ userId: editProfileDialog.userId, nombre: editProfileDialog.nombre })}
                disabled={updateProfileMutation.isPending || !editProfileDialog?.nombre.trim()}
            >
              {updateProfileMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
