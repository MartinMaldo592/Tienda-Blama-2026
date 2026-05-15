import { m, AnimatePresence } from "framer-motion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ProfileRow } from "@/features/admin/types"

interface OrdersBulkActionsProps {
    selectedIds: number[]
    setSelectedIds: (ids: number[]) => void
    pendingBulkStatus: string
    handleBulkStatusRequest: (status: string) => void
    userRole: string
    workers: ProfileRow[]
    onAssignWorker: (workerId: string) => void
}

export function OrdersBulkActions({
    selectedIds,
    setSelectedIds,
    pendingBulkStatus,
    handleBulkStatusRequest,
    userRole,
    workers,
    onAssignWorker
}: OrdersBulkActionsProps) {
    return (
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
                            <Select onValueChange={onAssignWorker}>
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
    )
}
