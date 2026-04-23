"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase.client"
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
import { Eye, Search, UserPlus, RefreshCw, User, Loader2, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { assignPedidoToWorker, fetchAdminWorkers, fetchPedidosForRole, updatePedidoStatusWithStock, checkBulkStockSufficient } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { PedidoRow, ProfileRow } from "@/features/admin/types"

export default function PedidosPage() {
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const [userId, setUserId] = useState<string>('')
    const [filterWorker, setFilterWorker] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // Date Filters
    const [dateFilter, setDateFilter] = useState('all')
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)
    const [pendingBulkStatus, setPendingBulkStatus] = useState("")
    const [isCheckingStock, setIsCheckingStock] = useState(false)
    const [stockError, setStockError] = useState<string | null>(null)
    const [stockErrorsList, setStockErrorsList] = useState<any[]>([])
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    // Pagination state
    const initialPage = Number(searchParams.get("page")) || 1
    const [currentPage, setCurrentPage] = useState(initialPage)
    const itemsPerPage = 10

    // Sync page to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const oldPage = params.get("page")
        const newPageStr = currentPage > 1 ? currentPage.toString() : null
        
        // Only update if it actually changed to prevent loops
        if (oldPage !== newPageStr && !(oldPage === null && newPageStr === null)) {
            if (newPageStr) {
                params.set("page", newPageStr)
            } else {
                params.delete("page")
            }
            const query = params.toString()
            const newUrl = query ? `${pathname}?${query}` : pathname
            router.replace(newUrl, { scroll: false })
        }
    }, [currentPage, pathname, router, searchParams])

    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })
    const userRole = String(guard.role || 'worker')

    // Fetch Session User ID once
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.id) setUserId(data.session.user.id)
        })
    }, [])

    const isFirstRender = useRef(true)

    // Reset pagination when filters change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setCurrentPage(1)
    }, [searchTerm, statusFilter, dateFilter, filterWorker, customStartDate, customEndDate])

    // 1. Queries
    // Realtime Subscription
    useEffect(() => {
        if (!userId) return

        const supabase = createClient()
        
        let refreshTimeout: NodeJS.Timeout

        const channel = supabase
            .channel('admin-pedidos-realtime')
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'pedidos' }, 
                (payload) => {
                    // Debounce refresh to avoid multiple requests in burst
                    clearTimeout(refreshTimeout)
                    refreshTimeout = setTimeout(() => {
                        queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
                    }, 500)
                    
                    // Show specific toast for new orders
                    if (payload.eventType === 'INSERT') {
                        toast.success("¡Nuevo pedido recibido!", {
                            description: `Pedido #${payload.new.id.toString().padStart(6, '0')}`,
                            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                            duration: 5000,
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            clearTimeout(refreshTimeout)
            supabase.removeChannel(channel)
        }
    }, [userId, queryClient])

    const { data: fetchResult, isLoading: loadingPedidos, isFetching } = useQuery({
        queryKey: ["adminPedidos", userRole, userId, currentPage, itemsPerPage, statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate],
        queryFn: () => fetchPedidosForRole({ 
            role: userRole, 
            currentUserId: userId,
            page: currentPage,
            itemsPerPage,
            statusFilter,
            searchTerm,
            dateFilter,
            filterWorker,
            customStartDate,
            customEndDate
        }),
        enabled: !!userId && !guard.loading && !guard.accessDenied,
    })

    const { data: workers = [] } = useQuery({
        queryKey: ["adminWorkers"],
        queryFn: fetchAdminWorkers,
        enabled: userRole === 'admin' && !guard.loading,
    })

    const paginatedPedidos = fetchResult?.data || []
    const totalItems = fetchResult?.count || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1

    const firstPageItems = totalItems % itemsPerPage || itemsPerPage
    const startIndexDisplay = totalItems === 0 ? 0 : (currentPage === 1 ? 1 : firstPageItems + (currentPage - 2) * itemsPerPage + 1)
    const endIndexDisplay = totalItems === 0 ? 0 : (currentPage === 1 ? firstPageItems : firstPageItems + (currentPage - 1) * itemsPerPage)

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
                toast.error('No tienes permisos para realizar esta acción.')
            } else {
                toast.error('Error al asignar: ' + error.message)
            }
        }
    })

    const statusMutation = useMutation({
        mutationFn: async ({ pedidoId, nextStatus, stockDescontado }: { pedidoId: number, nextStatus: string, stockDescontado: boolean }) => {
            return updatePedidoStatusWithStock({ pedidoId, nextStatus, stockDescontado })
        },
        onSuccess: () => {
            toast.success("Estado de pedido actualizado satisfactoriamente")
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => {
            const msg = String(error?.message || '').toLowerCase()
            if (msg.includes('stock insuficiente')) {
                toast.error('⚠️ No hay stock suficiente para confirmar este pedido.')
            } else if (msg.includes('permission denied') || msg.includes('row level security')) {
                toast.error('No tienes permisos para realizar esta acción.')
            } else {
                toast.error('Error al actualizar estado: ' + error.message)
            }
        }
    })

    const bulkStatusMutation = useMutation({
        mutationFn: async ({ status }: { status: string }) => {
            const supabase = createClient()
            
            // 1. Fetch current state of selected orders (specifically stock_descontado)
            const { data: pedidosToUpdate, error } = await supabase
                .from('pedidos')
                .select('id, stock_descontado')
                .in('id', selectedIds)

            if (error) throw error

            // 2. Process sequentially to handle stock correctly without overwhelming the DB
            for (const p of pedidosToUpdate || []) {
                await updatePedidoStatusWithStock({
                    pedidoId: p.id,
                    nextStatus: status,
                    stockDescontado: p.stock_descontado || false
                })
            }
        },
        onSuccess: () => {
            toast.success(`${selectedIds.length} pedidos actualizados correctamente.`)
            setSelectedIds([])
            setBulkConfirmOpen(false)
            setPendingBulkStatus("")
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => {
            toast.error('Error en actualización masiva: ' + error.message)
            setBulkConfirmOpen(false)
        }
    })

    async function handleBulkStatusRequest(status: string) {
        setPendingBulkStatus(status)
        setStockError(null)
        const deducirStatuses = ["Confirmado", "Preparando", "Enviado", "Entregado"]
        
        // If we are moving to a status that deducts stock, we check upfront
        if (deducirStatuses.includes(status)) {
            setIsCheckingStock(true)
            setBulkConfirmOpen(true) // Open dialog showing loading
            
            try {
                const result = await checkBulkStockSufficient(selectedIds)
                if (!result.ok) {
                    setStockError(result.message || 'Stock insuficiente para la operación masiva.')
                    setStockErrorsList(result.errors || [])
                    // Don't close modal so it shows the error
                    return
                }
                // Stock is OK, dialog remains open to confirm
            } catch (err: any) {
                setStockError('Error al verificar stock: ' + err.message)
                setStockErrorsList([])
            } finally {
                setIsCheckingStock(false)
            }
        } else {
            // For other statuses, just open confirm
            setBulkConfirmOpen(true)
        }
    }

    const bulkAssignMutation = useMutation({
        mutationFn: async ({ workerId }: { workerId: string }) => {
            const assignValue = workerId === 'unassigned' ? null : workerId
            for (const id of selectedIds) {
                await assignPedidoToWorker({ pedidoId: id, workerId: assignValue })
            }
        },
        onSuccess: () => {
            toast.success(`${selectedIds.length} pedidos reasignados correctamente.`)
            setSelectedIds([])
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => {
            toast.error('Error en asignación masiva: ' + error.message)
        }
    })

    function handleSelectAll() {
        if (selectedIds.length === paginatedPedidos.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(paginatedPedidos.map((p: PedidoRow) => p.id))
        }
    }

    function toggleSelection(id: number) {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    async function handleExportXlsx(mode: 'page' | 'all') {
        setIsExporting(true)
        try {
            const XLSX = await import("xlsx")
            let dataToExport: PedidoRow[] = []

            if (mode === 'page') {
                dataToExport = paginatedPedidos
            } else {
                toast.info("Preparando exportación completa...")
                const result = await fetchPedidosForRole({
                    role: userRole,
                    currentUserId: userId,
                    page: 1,
                    itemsPerPage: totalItems, // Fetch everything
                    statusFilter,
                    searchTerm,
                    dateFilter,
                    filterWorker,
                    customStartDate,
                    customEndDate
                })
                dataToExport = result.data
            }

            if (dataToExport.length === 0) {
                toast.error("No hay datos para exportar")
                return
            }

            const rows = dataToExport.map((p: PedidoRow) => {
                const cliente = p.clientes as any
                return {
                    "ID": p.id,
                    "Fecha": new Date(p.created_at).toLocaleDateString(),
                    "Hora": new Date(p.created_at).toLocaleTimeString('es-PE', { hour12: false }),
                    "Cliente": p.clientes?.nombre || p.nombre_contacto || '',
                    "Teléfono": p.clientes?.telefono || p.telefono_contacto || '',
                    "DNI": p.clientes?.dni || p.dni_contacto || '',
                    "Dirección": p.clientes?.direccion || p.direccion_calle || '',
                    "Referencia": cliente?.referencia || p.referencia_direccion || '',
                    "Departamento": p.departamento || cliente?.departamento || '',
                    "Provincia": p.provincia || cliente?.provincia || '',
                    "Distrito": p.distrito || cliente?.distrito || '',
                    "Total (S/)": p.total,
                    "Estado Pedido": p.status,
                    "Estado Pago": p.pago_status,
                    "Cupón": p.cupon_codigo || '',
                    "Descuento": p.descuento ?? '',
                    "Subtotal": p.subtotal ?? '',
                    "Asignado A": p.asignado_perfil?.nombre || p.asignado_perfil?.email || p.asignado_a || '',
                }
            })

            const worksheet = XLSX.utils.json_to_sheet(rows)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos")

            const wscols = [
                { wch: 10 }, // ID
                { wch: 15 }, // Fecha
                { wch: 12 }, // Hora
                { wch: 30 }, // Cliente
                { wch: 15 }, // Telefono
                { wch: 12 }, // DNI
                { wch: 40 }, // Dirección
                { wch: 20 }, // Ref
                { wch: 15 }, // Dep.
                { wch: 15 }, // Prov.
                { wch: 15 }, // Dist.
                { wch: 10 }, // Total
                { wch: 15 }, // Est Pedido
                { wch: 15 }, // Est Pago
                { wch: 10 }, // Cupon
                { wch: 10 }, // Desc
                { wch: 10 }, // Subtotal
                { wch: 20 }, // Asignado
            ]
            worksheet['!cols'] = wscols

            const today = new Date().toISOString().slice(0, 10)
            const suffix = mode === 'all' ? '_Completo' : '_Pagina'
            XLSX.writeFile(workbook, `Pedidos_Blama_${today}${suffix}.xlsx`)
            setExportDialogOpen(false)
            toast.success("Exportación completada")
        } catch (error) {
            console.error("Error exporting excel:", error)
            toast.error("Error al exportar a Excel")
        } finally {
            setIsExporting(false)
        }
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
                        <Button variant="outline" className="gap-2" onClick={() => setExportDialogOpen(true)} disabled={totalItems === 0}>
                            <RefreshCw className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                            Exportar Excel
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

            {/* Bulk Actions Floating Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {selectedIds.length}
                        </span>
                        <span className="text-blue-900 font-medium text-sm">
                            pedidos seleccionados
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Select value={pendingBulkStatus || undefined} onValueChange={handleBulkStatusRequest}>
                            <SelectTrigger className="w-[180px] h-9 bg-white cursor-pointer">
                                <SelectValue placeholder="Cambiar estado..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Confirmado">Marcar como Confirmado</SelectItem>
                                <SelectItem value="Preparando">Marcar como Preparando</SelectItem>
                                <SelectItem value="Enviado">Marcar como Enviado</SelectItem>
                                <SelectItem value="Entregado">Marcar como Entregado</SelectItem>
                            </SelectContent>
                        </Select>

                        {userRole === 'admin' && (
                            <Select onValueChange={(val) => bulkAssignMutation.mutate({ workerId: val })}>
                                <SelectTrigger className="w-[180px] h-9 bg-white cursor-pointer">
                                    <SelectValue placeholder="Asignar masivamente..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Quitar asignación</SelectItem>
                                    {workers.map((w: ProfileRow) => (
                                        <SelectItem key={w.id} value={w.id}>
                                            Asignar a {w.nombre?.split(' ')[0] || (w.email ? w.email.split('@')[0] : 'Usuario')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        <Button variant="outline" size="sm" onClick={() => setSelectedIds([])} className="h-9">
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

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
                                    {w.nombre || (w.email ? w.email.split('@')[0] : 'Usuario')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Date Filter */}
                <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto min-w-0">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Fecha" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las fechas</SelectItem>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="7days">Últimos 7 días</SelectItem>
                            <SelectItem value="thisMonth">Este mes</SelectItem>
                            <SelectItem value="custom">Rango...</SelectItem>
                        </SelectContent>
                    </Select>

                    {dateFilter === 'custom' && (
                        <div className="flex items-center gap-1 w-full md:w-auto animate-in fade-in zoom-in-95">
                            <Input
                                type="date"
                                className="w-full md:w-[125px] h-9 text-xs px-2"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                            <span className="text-gray-400 text-xs">-</span>
                            <Input
                                type="date"
                                className="w-full md:w-[125px] h-9 text-xs px-2"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State for Workers */}
            {userRole === 'worker' && totalItems === 0 && !loadingPedidos && (
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
            {(userRole === 'admin' || totalItems > 0) && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[40px] pl-4">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                        checked={paginatedPedidos.length > 0 && selectedIds.length === paginatedPedidos.length}
                                        onChange={handleSelectAll}
                                        title="Seleccionar todos"
                                    />
                                </TableHead>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado del Pago</TableHead>
                                <TableHead>Estado de Pedido</TableHead>
                                {userRole === 'admin' && <TableHead>Asignado a</TableHead>}
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingPedidos ? (
                                <TableRow>
                                    <TableCell colSpan={userRole === 'admin' ? 9 : 8} className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                            Cargando pedidos...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : totalItems === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={userRole === 'admin' ? 9 : 8} className="text-center py-10">
                                        No hay pedidos {filterWorker !== 'all' ? 'con este filtro' : ''}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedPedidos.map((pedido: PedidoRow) => (
                                    <TableRow key={pedido.id} className={selectedIds.includes(pedido.id) ? "bg-blue-50/50" : ""}>
                                        <TableCell className="pl-4">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                                checked={selectedIds.includes(pedido.id)}
                                                onChange={() => toggleSelection(pedido.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono font-medium">#{pedido.id.toString().padStart(6, '0')}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{pedido.nombre_contacto || pedido.clientes?.nombre || 'Anónimo'}</div>
                                            <div className="text-xs text-gray-500">{pedido.telefono_contacto || pedido.clientes?.telefono}</div>
                                            <div className="text-xs text-gray-500">DNI: {pedido.dni_contacto || pedido.clientes?.dni || '—'}</div>
                                        </TableCell>
                                        <TableCell>{new Date(pedido.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold">{formatCurrency(pedido.total)}</TableCell>
                                        <TableCell>
                                            <PaymentStatusBadge status={pedido.pago_status} />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={pedido.status}
                                                onValueChange={(val) => statusMutation.mutate({
                                                    pedidoId: pedido.id,
                                                    nextStatus: val,
                                                    stockDescontado: pedido.stock_descontado || false
                                                })}
                                                disabled={statusMutation.isPending}
                                            >
                                                <SelectTrigger
                                                    className={`w-[135px] h-7 px-3 py-1 text-xs font-medium border shadow-none focus:ring-0 focus:ring-offset-0 transition-colors rounded-full ${pedido.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                        pedido.status === 'Confirmado' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                            pedido.status === 'Preparando' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                                                pedido.status === 'Enviado' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                                                                    pedido.status === 'Entregado' ? 'bg-green-100 text-green-800 border-green-200' :
                                                                        pedido.status === 'Fallido' || pedido.status === 'Devuelto' ? 'bg-red-100 text-red-800 border-red-200' :
                                                                            'bg-gray-100 text-gray-800 border-gray-200'
                                                        }`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                    <SelectItem value="Confirmado">Confirmado</SelectItem>
                                                    <SelectItem value="Preparando">Preparando</SelectItem>
                                                    <SelectItem value="Enviado">Enviado</SelectItem>
                                                    <SelectItem value="Entregado">Entregado</SelectItem>
                                                    <SelectItem value="Devuelto">Devuelto</SelectItem>
                                                    <SelectItem value="Fallido">Fallido / Cancelado</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                                                {w.nombre || (w.email ? w.email.split('@')[0] : 'Usuario')}
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
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </Button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{startIndexDisplay}</span> a <span className="font-medium">{endIndexDisplay}</span> de <span className="font-medium">{totalItems}</span> pedidos
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center justify-center px-4 text-sm font-medium text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Dialog open={bulkConfirmOpen} onOpenChange={(open) => {
                if (!isCheckingStock && !bulkStatusMutation.isPending) {
                    setBulkConfirmOpen(open)
                    if (!open) {
                        setPendingBulkStatus("")
                        setStockError(null)
                        setStockErrorsList([])
                    }
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmación de Cambio Masivo</DialogTitle>
                        <DialogDescription>
                            Estás a punto de cambiar el estado de <strong>{selectedIds.length}</strong> pedidos a <strong>{pendingBulkStatus}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        {isCheckingStock ? (
                            <div className="flex flex-col items-center justify-center gap-3 text-sm text-gray-500 py-4">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                <span>Verificando disponibilidad de stock para {selectedIds.length} pedidos...</span>
                            </div>
                        ) : stockError ? (
                            <div className="flex flex-col gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                                <div className="flex items-center gap-2 font-semibold text-base text-red-700">
                                    <AlertCircle className="h-6 w-6" />
                                    <span>Stock Insuficiente</span>
                                </div>
                                <p className="text-red-600">
                                    No tienes stock suficiente para procesar todos los pedidos seleccionados. Por favor, revisa el detalle:
                                </p>
                                {stockErrorsList.length > 0 && (
                                    <ul className="mt-1 space-y-2 bg-white rounded p-3 border border-red-200">
                                        {stockErrorsList.map((err, idx) => (
                                            <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                <span className="font-medium text-gray-800">
                                                    {err.productName} {err.sku ? <span className="text-xs text-gray-500 font-normal ml-1">(SKU: {err.sku})</span> : ''}
                                                </span>
                                                <div className="flex flex-col items-end leading-tight">
                                                    <span className="text-red-600 font-semibold text-xs mb-0.5">Faltan {err.required - err.available}</span>
                                                    <span className="text-xs text-gray-500">Stock: {err.available} / Pedidos: {err.required}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <p className="mt-1 text-xs text-red-500">Reduce la cantidad de pedidos seleccionados o actualiza tu inventario en la sección de Productos.</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0" />
                                <div>
                                    <p className="font-semibold text-blue-900 mb-1">¡Stock Verificado!</p>
                                    <p>Hay stock suficiente para procesar los <strong>{selectedIds.length}</strong> pedidos. ¿Estás seguro de que deseas aplicar el estado <strong>{pendingBulkStatus}</strong> a todos los pedidos seleccionados? Esta acción descontará el inventario.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setBulkConfirmOpen(false)
                                setPendingBulkStatus("")
                                setStockError(null)
                            }}
                            disabled={isCheckingStock || bulkStatusMutation.isPending}
                        >
                            {stockError ? 'Cerrar' : 'Cancelar'}
                        </Button>
                        {!stockError && (
                            <Button 
                                onClick={() => bulkStatusMutation.mutate({ status: pendingBulkStatus })} 
                                disabled={isCheckingStock || bulkStatusMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {bulkStatusMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                Confirmar Cambio
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export Selection Dialog */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Opciones de Exportación</DialogTitle>
                        <DialogDescription>
                            ¿Qué datos deseas exportar a Excel? Se respetarán los filtros actuales (búsqueda, fechas, estados).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Button 
                            variant="outline" 
                            className="flex justify-start gap-3 h-14" 
                            onClick={() => handleExportXlsx('page')}
                            disabled={isExporting}
                        >
                            <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Eye className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">Solo página actual</div>
                                <div className="text-xs text-muted-foreground">Exporta los {paginatedPedidos.length} pedidos mostrados ahora.</div>
                            </div>
                        </Button>

                        <Button 
                            variant="outline" 
                            className="flex justify-start gap-3 h-14" 
                            onClick={() => handleExportXlsx('all')}
                            disabled={isExporting}
                        >
                            <div className="h-8 w-8 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <RefreshCw className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">Todos los pedidos</div>
                                <div className="text-xs text-muted-foreground">Exporta el total de {totalItems} pedidos filtrados.</div>
                            </div>
                        </Button>
                    </div>
                    {isExporting && (
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generando archivo Excel...
                        </div>
                    )}
                </DialogContent>
            </Dialog>
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

function PaymentStatusBadge({ status }: { status: string | null }) {
    const styles: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'pago contraentrega': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'paid': 'bg-green-100 text-green-800 border-green-200',
        'pagado': 'bg-green-100 text-green-800 border-green-200',
        'failed': 'bg-red-100 text-red-800 border-red-200',
        'fallido': 'bg-red-100 text-red-800 border-red-200',
    }
    const labels: Record<string, string> = {
        'pending': 'Pendiente',
        'pendiente': 'Pendiente',
        'pago contraentrega': 'Contraentrega',
        'paid': 'Pagado',
        'pagado': 'Pagado',
        'failed': 'Fallido',
        'fallido': 'Fallido',
    }

    // Normalize status just in case
    const normalized = (status || 'pending').toLowerCase()

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[normalized] || 'bg-gray-100'}`}>
            {labels[normalized] || status || 'Pendiente'}
        </span>
    )
}
