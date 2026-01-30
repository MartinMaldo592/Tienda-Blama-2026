"use client"

import { useCallback, useEffect, useState } from "react"
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
import { ShieldCheck, UserCheck } from "lucide-react"

export default function UsuariosPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  const [profiles, setProfiles] = useState<any[]>([])

  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [roleToAssign, setRoleToAssign] = useState("worker")
  const [creating, setCreating] = useState(false)

  const fetchProfiles = useCallback(async () => {
    try {
      const data = await fetchAdminProfiles()
      setProfiles(data || [])
    } catch (err) {
      setProfiles([])
    }
  }, [])

  useEffect(() => {
    if (guard.loading || guard.accessDenied) return

      ; (async () => {
        setLoading(true)
        await fetchProfiles()
        setLoading(false)
      })()
  }, [guard.loading, guard.accessDenied, fetchProfiles])

  async function handleCreateWorker() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push("/auth/login")
      return
    }

    setCreating(true)
    try {
      const json = await createWorkerViaApi({
        accessToken: session.access_token,
        email,
        nombre,
        password: password || null,
        role: roleToAssign,
      })

      const roleName = roleToAssign === "admin" ? "Administrador" : "Trabajador"

      if ((json as any)?.isInvite) {
        alert(`Invitación enviada para rol ${roleName}.`)
      } else {
        alert(`Usuario creado como ${roleName}.`)
      }

      setEmail("")
      setNombre("")
      setPassword("")
      setRoleToAssign("worker")
      await fetchProfiles()
    } catch (e: any) {
      alert(e?.message || "Error")
    } finally {
      setCreating(false)
    }
  }

  if (guard.loading || loading) {
    return <div className="p-10">Cargando...</div>
  }

  if (guard.accessDenied) {
    return <AccessDenied message="Solo administradores pueden gestionar usuarios." />
  }

  async function handleRoleUpdate(userId: string, newRole: string) {
    // Optimistic update
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p))

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      await updateUserRoleViaApi({
        accessToken: session.access_token,
        userId,
        role: newRole
      })
    } catch (e: any) {
      alert("Error al actualizar rol: " + e.message)
      fetchProfiles() // Revert
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Crea trabajadores y revisa perfiles.</p>
        </div>
        <Button variant="outline" onClick={fetchProfiles}>Actualizar</Button>
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
          <Button onClick={handleCreateWorker} disabled={creating || !email.trim()}>
            {creating ? "Creando..." : "Crear"}
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
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">{p.email || ""}</td>
                  <td className="p-3">{p.nombre || ""}</td>
                  <td className="p-3">
                    <Select
                      defaultValue={p.role || "user"}
                      onValueChange={(val) => handleRoleUpdate(p.id, val)}
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
                  <td className="p-3">{p.created_at ? new Date(p.created_at).toLocaleString() : ""}</td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td className="p-6 text-muted-foreground" colSpan={4}>No hay perfiles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
