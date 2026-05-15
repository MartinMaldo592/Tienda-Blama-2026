import { m } from "framer-motion"
import { Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProfileRow } from "@/features/admin/types"

interface OrdersFilterBarProps {
    searchTerm: string
    setSearchTerm: (val: string) => void
    statusFilter: string
    setStatusFilter: (val: string) => void
    userRole: string
    filterWorker: string
    setFilterWorker: (val: string) => void
    workers: ProfileRow[]
    dateFilter: string
    setDateFilter: (val: string) => void
    customStartDate: string
    setCustomStartDate: (val: string) => void
    customEndDate: string
    setCustomEndDate: (val: string) => void
}

export function OrdersFilterBar({
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    userRole,
    filterWorker, setFilterWorker,
    workers,
    dateFilter, setDateFilter,
    customStartDate, setCustomStartDate,
    customEndDate, setCustomEndDate
}: OrdersFilterBarProps) {
    return (
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
                        {workers.map((w) => (
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
    )
}
