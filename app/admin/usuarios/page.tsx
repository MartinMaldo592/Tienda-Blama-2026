"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { createWorkerViaApi, fetchAdminProfiles, updateUserRoleViaApi } from "@/features/admin"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShieldCheck, UserCheck, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function UsuariosPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  // Form State
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [roleToAssign, setRoleToAssign] = useState("worker")

  // 1. Data Fetching with React Query
  const { data: profiles = [], isLoading, isError } = useQuery({
    queryKey: ["adminProfiles"],
    queryFn: fetchAdminProfiles,
    enabled: !guard.loading && !guard.accessDenied, // Only run if allowed
  })

  // 2. Mutations
  const createWorkerMutation = useMutation({
    mutationFn: async () => {
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
        alert(`Invitación enviada para rol ${roleName}.`)
      } else {
        alert(`Usuario creado como ${roleName}.`)
      }
      // Reset Form
      setEmail("")
      setNombre("")
      setPassword("")
      setRoleToAssign("worker")

      // Refresh List automatically
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })
    },
    onError: (err: any) => {
      if (err.message.includes("session")) router.push("/auth/login")
      alert(err.message || "Error al crear usuario")
    }
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No hay sesión activa")
      return updateUserRoleViaApi({
        accessToken: session.access_token,
        userId,
        role: newRole
      })
    },
    onSuccess: () => {
      // We could invalidate, but optimistic updates are nicer. 
      // For simplicity, we invalidate to ensure consistency.
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })
    },
    onError: (err: any) => {
      alert("Error al actualizar rol: " + err.message)
    }
  })


  // Render Logic
  if (guard.loading) {
    return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin" /> Verificando permisos...</div>
  }

  if (guard.accessDenied) {
    return <AccessDenied message="Solo administradores pueden gestionar usuarios." />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Crea trabajadores y revisa perfiles.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["adminProfiles"] })}
          disabled={isLoading}
        >
          Actualizar Lista
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Crear usuario</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@tienda.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
          </div>
          <div className="space-y-2">
            <Label>Rol a Asignar</Label>
            <Select value={roleToAssign} onValueChange={setRoleToAssign}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worker">Worker</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña (opcional)</Label>
            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dejar vacío para invitar" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => createWorkerMutation.mutate()}
            disabled={createWorkerMutation.isPending || !email.trim()}
          >
            {createWorkerMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...</> : "Crear"}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Perfiles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-popover">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Creado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td className="p-6 text-muted-foreground" colSpan={4}>No hay perfiles registrados.</td>
                </tr>
              ) : (
                profiles.map((p: any) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">{p.email || ""}</td>
                    <td className="p-3">{p.nombre || ""}</td>
                    <td className="p-3">
                      <Select
                        defaultValue={p.role || "user"}
                        onValueChange={(val) => updateRoleMutation.mutate({ userId: p.id, newRole: val })}
                        disabled={updateRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-3 w-3" /> Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="worker">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-3 w-3" /> Worker
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            User (Cliente)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
