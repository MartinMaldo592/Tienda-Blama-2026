import { m, AnimatePresence } from "framer-motion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Search, Eye, ChevronLeft, ChevronRight, UserPlus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PedidoRow, ProfileRow } from "@/features/admin/types"
import { PaymentStatusBadge } from "@/features/admin/components/orders/status-badges"
import { OrderRowSkeleton } from "@/features/admin/components/skeleton-previews"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

interface OrdersTableProps {
    userRole: string
    totalItems: number
    loadingPedidos: boolean
    isFetching: boolean
    paginatedPedidos: PedidoRow[]
    selectedIds: number[]
    handleSelectAll: () => void
    toggleSelection: (id: number) => void
    recentOrderIds: Set<number>
    direction: number
    statusMutation: any
    assignMutation: any
    workers: ProfileRow[]
    currentPage: number
    totalPages: number
    handlePageChange: (page: number) => void
    getPageNumbers: () => (number | string)[]
    startIndexDisplay: number
    endIndexDisplay: number
}

export function OrdersTable({
    userRole,
    totalItems,
    loadingPedidos,
    isFetching,
    paginatedPedidos,
    selectedIds,
    handleSelectAll,
    toggleSelection,
    recentOrderIds,
    direction,
    statusMutation,
    assignMutation,
    workers,
    currentPage,
    totalPages,
    handlePageChange,
    getPageNumbers,
    startIndexDisplay,
    endIndexDisplay
}: OrdersTableProps) {
    if (!(userRole === 'admin' || userRole === 'superadmin') && totalItems === 0) {
        return null
    }

    return (
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
                                                value={pedido.status || undefined}
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
    )
}
