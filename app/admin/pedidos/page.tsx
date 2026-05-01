"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { m, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase.client"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { 
    RefreshCw, Search, Eye, Filter, Loader2, Calendar, 
    User, UserPlus, ChevronLeft, ChevronRight, 
    AlertCircle, CheckCircle2, Box, ArrowRight, Download, LayoutDashboard
} from "lucide-react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { 
    fetchPedidosForRole, 
    updatePedidoStatusWithStock, 
    assignPedidoToWorker, 
    checkBulkStockSufficient,
    fetchAdminWorkers
} from "@/features/admin/services/pedidos.client"
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
import { toast } from "sonner"
import { PaymentStatusBadge } from "@/features/admin/components/orders/status-badges"
import { OrderRowSkeleton } from "@/features/admin/components/skeleton-previews"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PedidoRow, ProfileRow } from "@/features/admin/types"

function PedidosPageContent() {
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
    const exportDropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
                setExportDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

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
    const [isExporting, setIsExporting] = useState(false)
    const [recentOrderIds, setRecentOrderIds] = useState<Set<number>>(new Set())

    // Pagination state (Derived from URL to guarantee consistency)
    const currentPage = Number(searchParams.get("page")) || 1
    const itemsPerPage = 10
    const [direction, setDirection] = useState(0) // -1 back, 1 forward

    const handlePageChange = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1)
        const params = new URLSearchParams(searchParams.toString())
        if (newPage > 1) {
            params.set("page", newPage.toString())
        } else {
            params.delete("page")
        }
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin", "worker"] })
    const userRole = String(guard.role || 'worker')

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.id) setUserId(data.session.user.id)
        })
    }, [])

    // Track filter changes to reset page ONLY when user changes a filter,
    // not on component mount/remount (safe with React Strict Mode)
    const prevFiltersRef = useRef({ searchTerm, statusFilter, dateFilter, filterWorker, customStartDate, customEndDate })

    useEffect(() => {
        const prev = prevFiltersRef.current
        const changed =
            prev.searchTerm !== searchTerm ||
            prev.statusFilter !== statusFilter ||
            prev.dateFilter !== dateFilter ||
            prev.filterWorker !== filterWorker ||
            prev.customStartDate !== customStartDate ||
            prev.customEndDate !== customEndDate

        prevFiltersRef.current = { searchTerm, statusFilter, dateFilter, filterWorker, customStartDate, customEndDate }

        if (changed) handlePageChange(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, statusFilter, dateFilter, filterWorker, customStartDate, customEndDate])

    useEffect(() => {
        if (!userId) return

        const supabase = createClient()
        const channel = supabase
            .channel('admin-pedidos-realtime')
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'pedidos' }, 
                (payload) => {
                    queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
                    queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] })
                    
                    if (payload.eventType === 'INSERT') {
                        const newId = payload.new.id
                        setRecentOrderIds(prev => new Set(prev).add(newId))
                        setTimeout(() => {
                            setRecentOrderIds(prev => {
                                const next = new Set(prev)
                                next.delete(newId)
                                return next
                            })
                        }, 15000)
                    }
                }
            )
            .subscribe()

        return () => {
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
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const paginatedPedidos = fetchResult?.data || []
    const totalItems = fetchResult?.count || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1

    // --- PREFETCHING NEXT PAGE FOR SMOOTH TRANSITION ---
    useEffect(() => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1
            queryClient.prefetchQuery({
                queryKey: ["adminPedidos", userRole, userId, nextPage, itemsPerPage, statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate],
                queryFn: () => fetchPedidosForRole({ 
                    role: userRole, 
                    currentUserId: userId,
                    page: nextPage,
                    itemsPerPage,
                    statusFilter,
                    searchTerm,
                    dateFilter,
                    filterWorker,
                    customStartDate,
                    customEndDate
                }),
            })
        }
    }, [currentPage, totalPages, queryClient, userRole, userId, itemsPerPage, statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate])

    const { data: workers = [] } = useQuery({
        queryKey: ["adminWorkers"],
        queryFn: fetchAdminWorkers,
        enabled: (userRole === 'admin' || userRole === 'superadmin') && !guard.loading,
    })

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)
            if (currentPage <= 3) { start = 2; end = 4 }
            else if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1 }
            if (start > 2) pages.push('...')
            for (let i = start; i <= end; i++) pages.push(i)
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    const firstPageItems = totalItems % itemsPerPage || itemsPerPage
    const startIndexDisplay = totalItems === 0 ? 0 : (currentPage === 1 ? 1 : firstPageItems + (currentPage - 2) * itemsPerPage + 1)
    const endIndexDisplay = totalItems === 0 ? 0 : (currentPage === 1 ? firstPageItems : firstPageItems + (currentPage - 1) * itemsPerPage)

    const assignMutation = useMutation({
        mutationFn: async ({ pedidoId, workerId }: { pedidoId: number, workerId: string }) => {
            const assignValue = workerId === 'unassigned' ? null : workerId
            return assignPedidoToWorker({ pedidoId, workerId: assignValue })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminPedidos"] }),
        onError: (error: Error) => toast.error('Error al asignar: ' + error.message)
    })

    const statusMutation = useMutation({
        mutationFn: async ({ pedidoId, nextStatus, stockDescontado }: { pedidoId: number, nextStatus: string, stockDescontado: boolean }) => {
            return updatePedidoStatusWithStock({ pedidoId, nextStatus, stockDescontado })
        },
        onSuccess: () => toast.success("Estado de pedido actualizado satisfactoriamente"),
        onError: (error: Error) => toast.error('Error al actualizar estado: ' + error.message),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
    })

    const bulkStatusMutation = useMutation({
        mutationFn: async ({ status }: { status: string }) => {
            const supabase = createClient()
            const { data: pedidosToUpdate } = await supabase.from('pedidos').select('id, stock_descontado').in('id', selectedIds)
            for (const p of pedidosToUpdate || []) {
                await updatePedidoStatusWithStock({ pedidoId: p.id, nextStatus: status, stockDescontado: p.stock_descontado || false })
            }
        },
        onSuccess: () => {
            toast.success(`${selectedIds.length} pedidos actualizados correctamente.`)
            setSelectedIds([])
            setBulkConfirmOpen(false)
            setPendingBulkStatus("")
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => toast.error('Error en actualización masiva: ' + error.message)
    })

    async function handleBulkStatusRequest(status: string) {
        setPendingBulkStatus(status)
        setStockError(null)
        const deducirStatuses = ["Confirmado", "Preparando", "Enviado", "Entregado"]
        if (deducirStatuses.includes(status)) {
            setIsCheckingStock(true)
            setBulkConfirmOpen(true)
            try {
                const result = await checkBulkStockSufficient(selectedIds)
                if (!result.ok) {
                    setStockError(result.message || 'Stock insuficiente.')
                    setStockErrorsList(result.errors || [])
                    return
                }
            } catch (err: any) { setStockError('Error: ' + err.message) } finally { setIsCheckingStock(false) }
        } else { setBulkConfirmOpen(true) }
    }

    const bulkAssignMutation = useMutation({
        mutationFn: async ({ workerId }: { workerId: string }) => {
            const assignValue = workerId === 'unassigned' ? null : workerId
            for (const id of selectedIds) { await assignPedidoToWorker({ pedidoId: id, workerId: assignValue }) }
        },
        onSuccess: () => {
            toast.success(`${selectedIds.length} pedidos reasignados.`)
            setSelectedIds([])
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => toast.error('Error: ' + error.message)
    })

    function handleSelectAll() {
        if (selectedIds.length === paginatedPedidos.length) { setSelectedIds([]) } 
        else { setSelectedIds(paginatedPedidos.map((p: PedidoRow) => p.id)) }
    }

    function toggleSelection(id: number) {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    async function handleExportXlsx(mode: 'page' | 'all') {
        setIsExporting(true)
        try {
            const XLSX = await import("xlsx")
            let dataToExport: PedidoRow[] = []
            if (mode === 'page') { dataToExport = paginatedPedidos } 
            else {
                const result = await fetchPedidosForRole({
                    role: userRole, currentUserId: userId, page: 1, itemsPerPage: totalItems, 
                    statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate
                })
                dataToExport = result.data
            }
            if (dataToExport.length === 0) { toast.error("Sin datos"); return }
            const rows = dataToExport.map((p: PedidoRow) => ({
                "ID": p.id,
                "Fecha": new Date(p.created_at).toLocaleDateString(),
                "Cliente": p.clientes?.nombre || p.nombre_contacto || '',
                "Total (S/)": p.total,
                "Estado": p.status,
                "Pago": p.pago_status,
                "Asignado": p.asignado_perfil?.nombre || p.asignado_a || '',
            }))
            const worksheet = XLSX.utils.json_to_sheet(rows)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos")
            XLSX.writeFile(workbook, `Pedidos_Blama_${new Date().toISOString().slice(0, 10)}.xlsx`)
            setExportDropdownOpen(false)
            toast.success("Exportado correctamente")
        } catch (error) { toast.error("Error al exportar") } finally { setIsExporting(false) }
    }

    if (guard.loading) {
        return (
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="flex justify-between items-end gap-6">
                    <div className="space-y-3">
                        <Skeleton className="h-14 w-64 rounded-2xl" />
                        <Skeleton className="h-4 w-80 rounded-lg" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-14 w-40 rounded-2xl" />
                        <Skeleton className="h-14 w-40 rounded-2xl" />
                    </div>
                </div>
                <div className="h-16 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse" />
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16">
                                <TableHead className="w-[60px] pl-8"></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead className="pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <OrderRowSkeleton count={10} />
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    if (guard.accessDenied) return <AccessDenied />

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pt-4">
                <m.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                            <Box size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                                    {(userRole === 'admin' || userRole === 'superadmin') ? 'Pedidos' : 'Mis Entregas'}
                                </h1>
                                {isFetching && !loadingPedidos && (
                                    <m.div 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-blue-50 text-blue-600 p-2 rounded-xl"
                                    >
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    </m.div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    {totalItems} Órdenes registradas
                                </p>
                            </div>
                        </div>
                    </div>
                </m.div>

                <m.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap gap-3 w-full lg:w-auto"
                >
                    {(userRole === 'admin' || userRole === 'superadmin') && (
                        <div className="relative" ref={exportDropdownRef}>
                            <Button 
                                variant="outline" 
                                className={`flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl border-slate-200 font-black tracking-tight shadow-sm transition-all haptic-scale ${exportDropdownOpen ? 'bg-slate-100 border-slate-300 ring-4 ring-slate-100' : 'bg-white hover:bg-slate-50'}`} 
                                onClick={() => setExportDropdownOpen(!exportDropdownOpen)} 
                                disabled={totalItems === 0 || isExporting}
                            >
                                <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                                EXPORTAR DATA
                            </Button>

                            <AnimatePresence>
                                {exportDropdownOpen && (
                                    <m.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-3 z-[60] overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-slate-50 mb-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Formato Excel</p>
                                        </div>
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => handleExportXlsx('page')}
                                                disabled={isExporting}
                                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group text-left"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <Eye size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-slate-900 uppercase">Página Actual</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{paginatedPedidos.length} pedidos</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleExportXlsx('all')}
                                                disabled={isExporting}
                                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group text-left"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                    <LayoutDashboard size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-slate-900 uppercase">Todo el Universo</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{totalItems} pedidos</p>
                                                </div>
                                            </button>
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                    <Button
                        className="flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 font-black tracking-tight shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all haptic-scale"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })}
                        disabled={isFetching}
                    >
                        {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                        SINCRONIZAR
                    </Button>
                </m.div>
            </div>

            {/* --- BULK ACTIONS --- */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <m.div 
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="bg-slate-900 text-white p-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-300 ring-4 ring-white"
                    >
                        <div className="flex items-center gap-4 pl-4">
                            <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center font-black">
                                {selectedIds.length}
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest">Acciones Masivas</p>
                                <p className="text-xs text-slate-400">Editando {selectedIds.length} pedidos simultáneamente</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 pr-2">
                            <Select value={pendingBulkStatus || undefined} onValueChange={handleBulkStatusRequest}>
                                <SelectTrigger className="w-[200px] h-12 bg-white/10 border-white/10 text-white rounded-xl font-bold cursor-pointer hover:bg-white/20 transition-all">
                                    <SelectValue placeholder="Cambiar estado..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Confirmado">Marcar como Confirmado</SelectItem>
                                    <SelectItem value="Preparando">Marcar como Preparando</SelectItem>
                                    <SelectItem value="Enviado">Marcar como Enviado</SelectItem>
                                    <SelectItem value="Entregado">Marcar como Entregado</SelectItem>
                                </SelectContent>
                            </Select>

                            {(userRole === 'admin' || userRole === 'superadmin') && (
                                <Select onValueChange={(val) => bulkAssignMutation.mutate({ workerId: val })}>
                                    <SelectTrigger className="w-[200px] h-12 bg-white/10 border-white/10 text-white rounded-xl font-bold cursor-pointer hover:bg-white/20 transition-all">
                                        <SelectValue placeholder="Reasignar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Quitar asignación</SelectItem>
                                        {workers.map((w: ProfileRow) => (
                                            <SelectItem key={w.id} value={w.id}>
                                                {w.nombre?.split(' ')[0] || 'Trabajador'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            <Button variant="ghost" onClick={() => setSelectedIds([])} className="h-12 px-6 text-white hover:bg-white/10 rounded-xl font-bold">
                                CANCELAR
                            </Button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* --- FILTERS BAR --- */}
            <m.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            >
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                    <Input
                        placeholder="Buscar cliente, DNI..."
                        className="h-14 pl-12 bg-slate-50 border-none rounded-2xl font-medium focus:ring-4 focus:ring-slate-900/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 px-6">
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

                {(userRole === 'admin' || userRole === 'superadmin') && (
                    <Select value={filterWorker} onValueChange={setFilterWorker}>
                        <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 px-6">
                            <SelectValue placeholder="Trabajador" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todo el equipo</SelectItem>
                            <SelectItem value="unassigned">Sin asignar</SelectItem>
                            {workers.map((w: ProfileRow) => (
                                <SelectItem key={w.id} value={w.id}>
                                    {w.nombre || 'Trabajador'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <div className="flex gap-2">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="h-14 flex-1 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 px-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <SelectValue placeholder="Fecha" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Cualquier fecha</SelectItem>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="7days">Últimos 7 días</SelectItem>
                            <SelectItem value="thisMonth">Este mes</SelectItem>
                            <SelectItem value="custom">Personalizado...</SelectItem>
                        </SelectContent>
                    </Select>

                    {dateFilter === 'custom' && (
                        <div className="flex gap-2 animate-in slide-in-from-right-4 duration-500">
                            <Input type="date" className="h-14 w-36 rounded-2xl bg-slate-50 border-none text-xs" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
                            <Input type="date" className="h-14 w-36 rounded-2xl bg-slate-50 border-none text-xs" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
                        </div>
                    )}
                </div>
            </m.div>

            {/* --- TABLE --- */}
            {((userRole === 'admin' || userRole === 'superadmin') || totalItems > 0) && (
                <m.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative"
                >
                    {/* Top Loader Bar */}
                    <AnimatePresence>
                        {isFetching && !loadingPedidos && (
                            <m.div 
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10 origin-left"
                            />
                        )}
                    </AnimatePresence>

                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-[60px] pl-8 h-16">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded-lg border-slate-300 text-slate-900 cursor-pointer transition-all focus:ring-offset-0 focus:ring-0"
                                        checked={paginatedPedidos.length > 0 && selectedIds.length === paginatedPedidos.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">ID Orden</TableHead>
                                <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Cliente & Contacto</TableHead>
                                <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Fecha</TableHead>
                                <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Inversión Total</TableHead>
                                <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Estado Pago</TableHead>
                                <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Estado Pedido</TableHead>
                                {(userRole === 'admin' || userRole === 'superadmin') && <TableHead className="h-16 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Asignación</TableHead>}
                                <TableHead className="text-right h-16 pr-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Detalle</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingPedidos ? (
                                <OrderRowSkeleton count={10} />
                            ) : totalItems === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={(userRole === 'admin' || userRole === 'superadmin') ? 9 : 8} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <Search size={48} strokeWidth={1} />
                                            <p className="text-lg font-medium">No se encontraron pedidos con los filtros actuales.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {paginatedPedidos.map((pedido: PedidoRow, index: number) => {
                                        const isNew = recentOrderIds.has(pedido.id)
                                        return (
                                            <m.tr
                                                key={pedido.id}
                                                layout
                                                initial={{ opacity: 0, x: direction * 30, filter: 'blur(4px)' }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    x: 0, 
                                                    filter: 'blur(0px)',
                                                    backgroundColor: isNew ? "rgba(34, 197, 94, 0.05)" : (selectedIds.includes(pedido.id) ? "rgba(15, 23, 42, 0.02)" : "transparent") 
                                                }}
                                                exit={{ opacity: 0, x: direction * -30, filter: 'blur(4px)' }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 35,
                                                    delay: index * 0.015 
                                                }}
                                                className={`group border-slate-50 transition-colors ${selectedIds.includes(pedido.id) ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                                            >
                                                <TableCell className="pl-8 py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded-lg border-slate-300 text-slate-900 cursor-pointer transition-all"
                                                        checked={selectedIds.includes(pedido.id)}
                                                        onChange={() => toggleSelection(pedido.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-mono font-bold text-slate-900 relative">
                                                    #{pedido.id.toString().padStart(6, '0')}
                                                    {isNew && (
                                                        <span className="absolute -top-1 -left-1 flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {pedido.nombre_contacto || pedido.clientes?.nombre || 'Anónimo'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            {pedido.telefono_contacto || pedido.clientes?.telefono || 'Sin teléfono'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500 text-xs font-medium">
                                                    {new Date(pedido.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-base font-black text-slate-900 tracking-tight">
                                                        {formatCurrency(pedido.total)}
                                                    </span>
                                                </TableCell>
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
                                                            className={`h-9 px-4 text-[10px] font-black uppercase tracking-widest border-none shadow-none focus:ring-0 rounded-full transition-all ${
                                                                pedido.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                                                                pedido.status === 'Confirmado' ? 'bg-sky-100 text-sky-700' :
                                                                pedido.status === 'Preparando' ? 'bg-orange-100 text-orange-700' :
                                                                pedido.status === 'Enviado' ? 'bg-indigo-100 text-indigo-700' :
                                                                pedido.status === 'Entregado' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-rose-100 text-rose-700'
                                                            }`}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                            {['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Entregado', 'Devuelto', 'Fallido'].map(s => (
                                                                <SelectItem key={s} value={s} className="text-xs font-bold py-3 rounded-xl">{s}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                {(userRole === 'admin' || userRole === 'superadmin') && (
                                                    <TableCell>
                                                        <Select
                                                            value={pedido.asignado_a || 'unassigned'}
                                                            onValueChange={(val) => assignMutation.mutate({ pedidoId: pedido.id, workerId: val })}
                                                            disabled={assignMutation.isPending}
                                                        >
                                                            <SelectTrigger className="h-9 bg-slate-50 border-none rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all">
                                                                <SelectValue>
                                                                    {pedido.asignado_perfil?.nombre?.split(' ')[0] || (
                                                                        <span className="flex items-center gap-1.5 opacity-60 italic">
                                                                            <UserPlus size={12} /> Libre
                                                                        </span>
                                                                    )}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                                <SelectItem value="unassigned" className="text-xs font-bold py-3">Libre / Sin asignar</SelectItem>
                                                                {workers.map((w: ProfileRow) => (
                                                                    <SelectItem key={w.id} value={w.id} className="text-xs font-bold py-3">
                                                                        {w.nombre || 'Trabajador'}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-right pr-8">
                                                    <Link href={`/admin/pedidos/${pedido.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all group/btn">
                                                            <Eye className="h-5 w-5" />
                                                            <ArrowRight className="absolute h-4 w-4 opacity-0 group-hover/btn:opacity-100 translate-x-[-10px] group-hover/btn:translate-x-[15px] transition-all" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </m.tr>
                                        )
                                    })}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>

                    {/* --- PAGINATION --- */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-slate-50/30">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Mostrando <span className="text-slate-900">{startIndexDisplay}-{endIndexDisplay}</span> de <span className="text-slate-900">{totalItems}</span> órdenes
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    className="h-10 w-10 p-0 rounded-xl border-slate-200"
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </Button>

                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                    {getPageNumbers().map((page, idx) => (
                                        typeof page === 'number' ? (
                                            <Button
                                                key={idx}
                                                variant={currentPage === page ? "default" : "ghost"}
                                                className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-black ${currentPage === page ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        ) : (
                                            <span key={idx} className="px-1 text-slate-300 text-[10px]">•••</span>
                                        )
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    className="h-10 w-10 p-0 rounded-xl border-slate-200"
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </m.div>
            )}

            {/* --- DIALOGS --- */}
            <Dialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
                <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">Confirmar Acción Masiva</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Vas a actualizar {selectedIds.length} pedidos al estado <span className="font-bold text-slate-900">{pendingBulkStatus}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                        {isCheckingStock ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verificando Inventario...</p>
                            </div>
                        ) : stockError ? (
                            <div className="space-y-4 bg-rose-50 p-6 rounded-3xl border border-rose-100">
                                <div className="flex items-center gap-3 text-rose-600">
                                    <AlertCircle size={24} />
                                    <h4 className="font-black uppercase tracking-tight">Conflicto de Inventario</h4>
                                </div>
                                <p className="text-sm text-rose-700 font-medium leading-relaxed">{stockError}</p>
                                {stockErrorsList.length > 0 && (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                        {stockErrorsList.map((err, i) => (
                                            <div key={i} className="flex justify-between p-3 bg-white/50 rounded-xl border border-rose-100 text-xs">
                                                <span className="font-bold text-slate-900">{err.productName}</span>
                                                <span className="text-rose-600 font-black">Faltan {err.required - err.available}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-4 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                                <div>
                                    <h4 className="font-black text-emerald-900 uppercase tracking-tight text-sm mb-1">¡Todo listo para procesar!</h4>
                                    <p className="text-xs text-emerald-700 leading-relaxed font-medium">Hay disponibilidad de stock suficiente para todos los pedidos seleccionados.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setBulkConfirmOpen(false)} className="h-14 px-8 rounded-2xl font-bold">CANCELAR</Button>
                        {!stockError && !isCheckingStock && (
                            <Button 
                                onClick={() => bulkStatusMutation.mutate({ status: pendingBulkStatus })} 
                                className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black haptic-scale shadow-xl shadow-slate-200"
                            >
                                {bulkStatusMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'APLICAR CAMBIOS'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- EXPORT DIALOG REMOVED --- */}
        </div>
    )
}

export default function PedidosPage() {
    return (
        <Suspense fallback={
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="flex justify-between items-end gap-6">
                    <div className="space-y-3">
                        <div className="h-14 w-64 bg-slate-100 animate-pulse rounded-2xl" />
                        <div className="h-4 w-80 bg-slate-100 animate-pulse rounded-lg" />
                    </div>
                </div>
                <div className="h-16 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse" />
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-[500px] animate-pulse" />
            </div>
        }>
            <PedidosPageContent />
        </Suspense>
    )
}

