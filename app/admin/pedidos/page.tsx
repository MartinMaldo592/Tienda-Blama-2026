"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { m, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase.client"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { RefreshCw, Box, Download, Eye, LayoutDashboard, Loader2, PlusCircle } from "lucide-react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { 
    fetchPedidosForRole, 
    updatePedidoStatusWithStock, 
    assignPedidoToWorker, 
    checkBulkStockSufficient,
    fetchAdminWorkers
} from "@/features/admin/services/pedidos.client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PedidoRow } from "@/features/admin/types"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2 } from "lucide-react"

// Nuevos componentes refactorizados
import { OrdersFilterBar } from "@/features/admin/components/orders/orders-filter-bar"
import { OrdersBulkActions } from "@/features/admin/components/orders/orders-bulk-actions"
import { OrdersTable } from "@/features/admin/components/orders/orders-table"
import { CreateOrderModal } from "@/features/admin/components/orders/create-order-modal"

function PedidosPageContent() {
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
    const exportDropdownRef = useRef<HTMLDivElement>(null)

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
    const [pagoStatusFilter, setPagoStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')

    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)
    const [pendingBulkStatus, setPendingBulkStatus] = useState("")
    const [isCheckingStock, setIsCheckingStock] = useState(false)
    const [stockError, setStockError] = useState<string | null>(null)
    const [stockErrorsList, setStockErrorsList] = useState<any[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [recentOrderIds, setRecentOrderIds] = useState<Set<number>>(new Set())
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const currentPage = Number(searchParams.get("page")) || 1
    const itemsPerPage = 10
    const [direction, setDirection] = useState(0)

    const handlePageChange = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1)
        const params = new URLSearchParams(searchParams.toString())
        if (newPage > 1) params.set("page", newPage.toString())
        else params.delete("page")
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

    const prevFiltersRef = useRef({ searchTerm, statusFilter, pagoStatusFilter, dateFilter, filterWorker, customStartDate, customEndDate })
    useEffect(() => {
        const prev = prevFiltersRef.current
        const changed =
            prev.searchTerm !== searchTerm ||
            prev.statusFilter !== statusFilter ||
            prev.pagoStatusFilter !== pagoStatusFilter ||
            prev.dateFilter !== dateFilter ||
            prev.filterWorker !== filterWorker ||
            prev.customStartDate !== customStartDate ||
            prev.customEndDate !== customEndDate

        prevFiltersRef.current = { searchTerm, statusFilter, pagoStatusFilter, dateFilter, filterWorker, customStartDate, customEndDate }
        if (changed) handlePageChange(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, statusFilter, pagoStatusFilter, dateFilter, filterWorker, customStartDate, customEndDate])

    useEffect(() => {
        if (!userId) return
        const supabase = createClient()
        const channel = supabase.channel('admin-pedidos-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, (payload) => {
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
            }).subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [userId, queryClient])

    const { data: fetchResult, isLoading: loadingPedidos, isFetching } = useQuery({
        queryKey: ["adminPedidos", userRole, userId, currentPage, itemsPerPage, statusFilter, pagoStatusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate],
        queryFn: () => fetchPedidosForRole({ 
            role: userRole, currentUserId: userId, page: currentPage, itemsPerPage,
            statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate,
            pagoStatusFilter
        }),
        enabled: !!userId && !guard.loading && !guard.accessDenied,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    })

    const paginatedPedidos = fetchResult?.data || []
    const totalItems = fetchResult?.count || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1

    useEffect(() => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1
            queryClient.prefetchQuery({
                queryKey: ["adminPedidos", userRole, userId, nextPage, itemsPerPage, statusFilter, pagoStatusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate],
                queryFn: () => fetchPedidosForRole({ 
                    role: userRole, currentUserId: userId, page: nextPage, itemsPerPage,
                    statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate,
                    pagoStatusFilter
                }),
            })
        }
    }, [currentPage, totalPages, queryClient, userRole, userId, itemsPerPage, statusFilter, pagoStatusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate])

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
        onError: (error: Error) => toast.error('Error al actualizar: ' + error.message),
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
            toast.success(`${selectedIds.length} pedidos actualizados.`)
            setSelectedIds([])
            setBulkConfirmOpen(false)
            setPendingBulkStatus("")
            queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })
        },
        onError: (error: Error) => toast.error('Error: ' + error.message)
    })

    async function handleBulkStatusRequest(status: string) {
        setPendingBulkStatus(status)
        setStockError(null)
        const deducirStatuses = ["Confirmado", "Enviado", "Entregado"]
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
        if (selectedIds.length === paginatedPedidos.length) setSelectedIds([]) 
        else setSelectedIds(paginatedPedidos.map((p: PedidoRow) => p.id))
    }

    function toggleSelection(id: number) {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    async function handleExportXlsx(mode: 'page' | 'all') {
        setIsExporting(true)
        try {
            const ExcelJS = await import("exceljs")
            let dataToExport: PedidoRow[] = []
            if (mode === 'page') dataToExport = paginatedPedidos 
            else {
                const result = await fetchPedidosForRole({
                    role: userRole, currentUserId: userId, page: 1, itemsPerPage: totalItems, 
                    statusFilter, searchTerm, dateFilter, filterWorker, customStartDate, customEndDate
                })
                dataToExport = result.data
            }
            if (dataToExport.length === 0) { toast.error("Sin datos"); return }
            const rows = dataToExport.map((p: PedidoRow) => ([
                p.id, new Date(p.created_at).toLocaleDateString(),
                p.clientes?.nombre || p.nombre_contacto || '', p.total, p.status, p.pago_status,
                p.asignado_perfil?.nombre || p.asignado_a || '',
            ]))
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet("Pedidos")
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 }, { header: "Fecha", key: "fecha", width: 15 },
                { header: "Cliente", key: "cliente", width: 25 }, { header: "Total (S/)", key: "total", width: 15 },
                { header: "Estado", key: "estado", width: 15 }, { header: "Pago", key: "pago", width: 15 },
                { header: "Asignado", key: "asignado", width: 20 },
            ]
            rows.forEach(r => worksheet.addRow(r))
            const buffer = await workbook.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `Pedidos_Blama_${new Date().toISOString().slice(0, 10)}.xlsx`
            a.click()
            URL.revokeObjectURL(url)
            setExportDropdownOpen(false)
            toast.success("Exportado correctamente")
        } catch (error) { toast.error("Error al exportar") } finally { setIsExporting(false) }
    }

    if (guard.loading) {
        return (
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="h-16 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse" />
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-[500px] animate-pulse" />
            </div>
        )
    }

    if (guard.accessDenied) return <AccessDenied />

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* --- UNIFIED HEADER --- */}
            <AdminPageHeader
                icon={<Box size={28} strokeWidth={1.5} />}
                iconColor="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900"
                iconShadow="shadow-slate-900/20"
                title={(userRole === 'admin' || userRole === 'superadmin') ? 'Pedidos' : 'Mis Entregas'}
                totalItems={totalItems}
                totalLabel="órdenes registradas"
                isFetching={isFetching && !loadingPedidos}
                dotColor="bg-emerald-500"
                actions={
                    <>
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                            <div className="relative" ref={exportDropdownRef}>
                                <Button 
                                    variant="outline" 
                                    className={`gap-2 h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 font-bold tracking-tight shadow-sm transition-all haptic-scale ${exportDropdownOpen ? 'bg-slate-100 dark:bg-slate-800 border-slate-300' : 'bg-white dark:bg-slate-900 hover:bg-slate-50'}`} 
                                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)} 
                                    disabled={totalItems === 0 || isExporting}
                                >
                                    <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                                    EXPORTAR DATA
                                </Button>

                                <AnimatePresence>
                                    {exportDropdownOpen && (
                                        <m.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-[60] overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Formato Excel</p>
                                            </div>
                                            <div className="space-y-1">
                                                <button onClick={() => handleExportXlsx('page')} disabled={isExporting} className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group text-left">
                                                    <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><Eye size={16} /></div>
                                                    <div className="flex-1"><p className="text-xs font-bold text-slate-900 dark:text-white uppercase">Página Actual</p><p className="text-[10px] text-slate-400 font-semibold">{paginatedPedidos.length} pedidos</p></div>
                                                </button>
                                                <button onClick={() => handleExportXlsx('all')} disabled={isExporting} className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group text-left">
                                                    <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><LayoutDashboard size={16} /></div>
                                                    <div className="flex-1"><p className="text-xs font-bold text-slate-900 dark:text-white uppercase">Todo el Universo</p><p className="text-[10px] text-slate-400 font-semibold">{totalItems} pedidos</p></div>
                                                </button>
                                            </div>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <Button
                            className="gap-2 h-11 px-5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 font-bold tracking-tight shadow-md transition-all haptic-scale"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })} disabled={isFetching}
                        >
                            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Sincronizar
                        </Button>
                        <Button
                            className="gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 font-bold tracking-tight shadow-lg shadow-indigo-500/20 transition-all haptic-scale"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <PlusCircle className="h-4 w-4" /> NUEVO PEDIDO
                        </Button>
                    </>
                }
            />

            <OrdersBulkActions 
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                pendingBulkStatus={pendingBulkStatus}
                handleBulkStatusRequest={handleBulkStatusRequest}
                userRole={userRole}
                workers={workers}
                onAssignWorker={(val) => bulkAssignMutation.mutate({ workerId: val })}
            />

            <OrdersFilterBar 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                pagoStatusFilter={pagoStatusFilter} setPagoStatusFilter={setPagoStatusFilter}
                userRole={userRole}
                filterWorker={filterWorker} setFilterWorker={setFilterWorker}
                workers={workers}
                dateFilter={dateFilter} setDateFilter={setDateFilter}
                customStartDate={customStartDate} setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate} setCustomEndDate={setCustomEndDate}
            />

            <OrdersTable 
                userRole={userRole}
                totalItems={totalItems} loadingPedidos={loadingPedidos} isFetching={isFetching}
                paginatedPedidos={paginatedPedidos}
                selectedIds={selectedIds} handleSelectAll={handleSelectAll} toggleSelection={toggleSelection}
                recentOrderIds={recentOrderIds} direction={direction}
                statusMutation={statusMutation} assignMutation={assignMutation} workers={workers}
                currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}
                getPageNumbers={getPageNumbers} startIndexDisplay={startIndexDisplay} endIndexDisplay={endIndexDisplay}
            />

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

            <CreateOrderModal 
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["adminPedidos"] })}
            />
        </div>
    )
}

export default function PedidosPage() {
    return (
        <Suspense fallback={
            <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
                <div className="h-16 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse" />
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-[500px] animate-pulse" />
            </div>
        }>
            <PedidosPageContent />
        </Suspense>
    )
}
