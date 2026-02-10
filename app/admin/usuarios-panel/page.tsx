"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase.client"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, UserCheck, ShieldCheck } from "lucide-react"

export default function UsersPanelPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Only fetch users present in the public.usuarios table
    // (We cannot list Auth users directly from client-side easily without admin API)
    // So we assume the flow: 
    // 1. User registers/invites
    // 2. Admin MANUALLY adds them here or they appear if they have a public profile?
    // BETTER: We list ALL public.usuarios entries.
    // If a user is not in public.usuarios, we can't manage their role from here easily w/o edge function.
    // But let's start with viewing/editing roles of EXISTING public.usuarios.

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setUsers(data || [])
        }
        setLoading(false)
    }

    async function updateRole(userId: string, newRole: string) {
        // Optimistic update
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))

        const supabase = createClient()
        const { error } = await supabase
            .from('usuarios')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) {
            alert("Error al actualizar rol")
            fetchUsers() // Revert
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios del Sistema</h1>
                <p className="text-gray-500">Administra los roles de acceso (Admin vs Worker).</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Email / Info</TableHead>
                            <TableHead>Rol Actual</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10">Cargando...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10">
                                    No hay usuarios registrados en la tabla pública.
                                    <br />
                                    <span className="text-xs text-muted-foreground">
                                        (Los usuarios deben iniciar sesión al menos una vez para aparecer aquí si tienes un trigger, o debes crearlos manualmente)
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {user.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.nombre || "Sin nombre"}</span>
                                            <span className="text-xs text-gray-500">{user.email || "No email visible"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(val) => updateRole(user.id, val)}
                                            >
                                                <SelectTrigger className="w-[130px] h-8 text-xs">
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                <h3 className="font-bold mb-1 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> ¿Cómo funciona esto?
                </h3>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>Invita usuarios desde <b>Supabase Auth (Dashboard)</b>.</li>
                    <li>Cuando acepten la invitación, se crea su cuenta.</li>
                    <li>Si no aparecen aquí automáticamente, debes insertar su ID en la tabla <code>usuarios</code> manualmente o asegurarte de que tu app lo haga al registrarse.</li>
                    <li>Desde aquí puedes promoverlos a <b>admin</b> o degradarlos a <b>worker</b>.</li>
                </ol>
            </div>
        </div>
    )
}
