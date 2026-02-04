"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { Eye, Search, UserPlus, RefreshCw, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { assignPedidoToWorker, fetchAdminWorkers, fetchPedidosForRole } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { PedidoRow, ProfileRow } from "@/features/admin/types"

export default function PedidosPage() {
    const queryClient = useQueryClient()
    const [userId, setUserId] = useState<string>('')
    const [filterWorker, setFilterWorker] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })
    const userRole = String(guard.role || 'worker')

    // Fetch Session User ID once
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.id) setUserId(data.session.user.id)
        })
    }, [])

    // 1. Queries
    const { data: pedidos = [], isLoading: loadingPedidos, isFetching } = useQuery({
        queryKey: ["adminPedidos", userRole, userId], // Re-fetch if role or userId changes
        queryFn: () => fetchPedidosForRole({ role: userRole, currentUserId: userId }),
        enabled: !!userId && !guard.loading && !guard.accessDenied,
    })

    const { data: workers = [] } = useQuery({
        queryKey: ["adminWorkers"],
        queryFn: fetchAdminWorkers,
        enabled: userRole === 'admin' && !guard.loading,
    })

    // Filter pedidos
    const filteredPedidos = pedidos.filter((p: PedidoRow) => {
        // 1. Worker Filter
        if (userRole === 'admin' && filterWorker !== 'all') {
            if (filterWorker === 'unassigned' && p.asignado_a) return false
            if (filterWorker !== 'unassigned' && p.asignado_a !== filterWorker) return false
        }

        // 2. Status Filter
        if (statusFilter !== 'all' && p.status !== statusFilter) return false

        // 3. Search Term (ID, Client Name, Phone, DNI)
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            const id = p.id.toString()
            const clientName = (p.nombre_contacto || p.clientes?.nombre || '').toLowerCase()
            const phone = (p.telefono_contacto || p.clientes?.telefono || '')
            const dni = (p.dni_contacto || p.clientes?.dni || '')

            if (!id.includes(term) && !clientName.includes(term) && !phone.includes(term) && !dni.includes(term)) {
                return false
            }
        }

        return true
    })

    // 2. Mutations
    const assignMutation = useMutation({
        mutationFn: async ({ pedidoId, workerId }: { pedidoId: number, workerId: string }) => {
            const assignValue = workerId === 'unassigned' ? null : workerId
            return assignPedidoToWorker({ pedidoId, workerId: assignValue })
        },
        onSuccess: () => {
            // Invalidate to refresh list
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => {
            const msg = String(error?.message || '').toLowerCase()
            if (msg.includes('permission denied') || msg.includes('row level security')) {
                alert('No tienes permisos para realizar esta acción.')
            } else {
                alert('Error al asignar: ' + error.message)
            }
        }
    })

    function csvEscape(value: unknown) {
        const str = String(value ?? '')
        if (/[\n\r,\"]/g.test(str)) {
            return '"' + str.replace(/\"/g, '""') + '"'
        }
        return str
    }

    function downloadCsv(rows: Record<string, unknown>[], filename: string) {
        const headers = rows.length > 0 ? Object.keys(rows[0]) : []
        const csv =
            '\ufeff' +
            [
                headers.join(','),
                ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(',')),
            ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    function handleExportCsv() {
        const rows = filteredPedidos.map((p: PedidoRow) => ({
            id: p.id,
            fecha: p.created_at,
            cliente: p.clientes?.nombre || p.nombre_contacto || '',
            telefono: p.clientes?.telefono || p.telefono_contacto || '',
            dni: p.clientes?.dni || p.dni_contacto || '',
            total: p.total,
            status: p.status,
            pago_status: p.pago_status,
            cupon_codigo: p.cupon_codigo || '',
            descuento: p.descuento ?? '',
            subtotal: p.subtotal ?? '',
            asignado_a: p.asignado_a || '',
        }))

        const today = new Date().toISOString().slice(0, 10)
        downloadCsv(rows, `pedidos-${today}.csv`)
    }

    if (guard.loading) {
        return <div className="p-10 flex gap-2"><Loader2 className="animate-spin" /> Verificando...</div>
    }

    if (guard.accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {userRole === 'admin' ? 'Gestión de Pedidos' : 'Mis Pedidos Asignados'}
                    </h1>
                    <p className="text-gray-500">
                        {userRole === 'admin'
                            ? 'Administra y delega órdenes a tu equipo.'
                            : 'Pedidos que te han sido delegados.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {userRole === 'admin' && (
                        <Button variant="outline" className="gap-2" onClick={handleExportCsv} disabled={pedidos.length === 0}>
                            Exportar CSV
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })}
                        disabled={isFetching}
                    >
                        {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Admin Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por cliente, ID, DNI o teléfono..."
                        className="pl-9 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Confirmado">Confirmado</SelectItem>
                        <SelectItem value="Enviado">Enviado</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                        <SelectItem value="Fallido">Fallido / Cancelado</SelectItem>
                    </SelectContent>
                </Select>

                {/* Worker Filter (Admin Only) */}
                {userRole === 'admin' && (
                    <Select value={filterWorker} onValueChange={setFilterWorker}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filtrar por trabajador" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los trabajadores</SelectItem>
                            <SelectItem value="unassigned">Sin asignar</SelectItem>
                            {workers.map((w: ProfileRow) => (
                                <SelectItem key={w.id} value={w.id}>
                                    {w.nombre || w.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Empty State for Workers */}
            {userRole === 'worker' && pedidos.length === 0 && !loadingPedidos && (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin pedidos asignados</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Aún no tienes pedidos delegados. El administrador te asignará pedidos cuando sea necesario.
                    </p>
                </div>
            )}

            {/* Table */}
            {(userRole === 'admin' || pedidos.length > 0) && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado</TableHead>
                                {userRole === 'admin' && <TableHead>Asignado a</TableHead>}
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingPedidos ? (
                                <TableRow>
                                    <TableCell colSpan={userRole === 'admin' ? 7 : 6} className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                            Cargando pedidos...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredPedidos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={userRole === 'admin' ? 7 : 6} className="text-center py-10">
                                        No hay pedidos {filterWorker !== 'all' ? 'con este filtro' : ''}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPedidos.map((pedido: PedidoRow) => (
                                    <TableRow key={pedido.id}>
                                        <TableCell className="font-mono font-medium">#{pedido.id.toString().padStart(6, '0')}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{pedido.nombre_contacto || pedido.clientes?.nombre || 'Anónimo'}</div>
                                            <div className="text-xs text-gray-500">{pedido.telefono_contacto || pedido.clientes?.telefono}</div>
                                            <div className="text-xs text-gray-500">DNI: {pedido.dni_contacto || pedido.clientes?.dni || '—'}</div>
                                        </TableCell>
                                        <TableCell>{new Date(pedido.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold">{formatCurrency(pedido.total)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={pedido.status} />
                                        </TableCell>
                                        {userRole === 'admin' && (
                                            <TableCell>
                                                <Select
                                                    value={pedido.asignado_a || 'unassigned'}
                                                    onValueChange={(val) => assignMutation.mutate({ pedidoId: pedido.id, workerId: val })}
                                                    disabled={assignMutation.isPending}
                                                >
                                                    <SelectTrigger className="w-[160px] h-8 text-xs">
                                                        <SelectValue>
                                                            {pedido.asignado_perfil?.nombre || pedido.asignado_perfil?.email || (
                                                                <span className="text-orange-600 flex items-center gap-1">
                                                                    <UserPlus className="h-3 w-3" /> Sin asignar
                                                                </span>
                                                            )}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="unassigned">
                                                            <span className="text-gray-500">Sin asignar</span>
                                                        </SelectItem>
                                                        {workers.map((w: ProfileRow) => (
                                                            <SelectItem key={w.id} value={w.id}>
                                                                {w.nombre || w.email}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right">
                                            <Link href={`/admin/pedidos/${pedido.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
        'Enviado': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Entregado': 'bg-green-100 text-green-800 border-green-200',
        'Fallido': 'bg-red-100 text-red-800 border-red-200',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    )
}
