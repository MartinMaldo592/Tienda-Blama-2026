import { m } from "framer-motion"
import { Search, Calendar, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
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
    pagoStatusFilter: string
    setPagoStatusFilter: (val: string) => void
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
    pagoStatusFilter, setPagoStatusFilter,
    userRole,
    filterWorker, setFilterWorker,
    workers,
    dateFilter, setDateFilter,
    customStartDate, setCustomStartDate,
    customEndDate, setCustomEndDate
}: OrdersFilterBarProps) {
    const [statusOpen, setStatusOpen] = useState(false)
    const [workerOpen, setWorkerOpen] = useState(false)
    const [pagoStatusOpen, setPagoStatusOpen] = useState(false)

    const statusRef = useRef<HTMLDivElement>(null)
    const workerRef = useRef<HTMLDivElement>(null)
    const pagoStatusRef = useRef<HTMLDivElement>(null)

    // Cerrar los dropdowns al hacer clic fuera del componente
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setStatusOpen(false)
            }
            if (workerRef.current && !workerRef.current.contains(event.target as Node)) {
                setWorkerOpen(false)
            }
            if (pagoStatusRef.current && !pagoStatusRef.current.contains(event.target as Node)) {
                setPagoStatusOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const allStatuses = [
        { value: "Pendiente", label: "Pendiente" },
        { value: "Confirmado", label: "Confirmado" },
        { value: "Preparando", label: "Preparando" },
        { value: "Enviado", label: "Enviado" },
        { value: "Llegó a Agencia", label: "Llegó a Agencia" },
        { value: "Entregado", label: "Entregado" },
        { value: "Fallido", label: "Fallido" },
        { value: "Devuelto", label: "Devuelto" },
        { value: "Cancelado", label: "Cancelado" },
    ]

    const allPagoStatuses = [
        { value: "Pendiente", label: "Pendiente" },
        { value: "Pago Parcial", label: "Pago Parcial" },
        { value: "Pagado", label: "Pagado" },
        { value: "Pago Contraentrega", label: "Pago Contraentrega" },
        { value: "Pagado Anticipado", label: "Pagado Anticipado" },
        { value: "Pagado al Recibir", label: "Pagado al Recibir" },
        { value: "Fallido", label: "Fallido" },
    ]

    const selectedStatuses = statusFilter === "all" ? [] : statusFilter.split(",").filter(Boolean)
    const selectedWorkers = filterWorker === "all" ? [] : filterWorker.split(",").filter(Boolean)
    const selectedPagoStatuses = pagoStatusFilter === "all" ? [] : pagoStatusFilter.split(",").filter(Boolean)

    const toggleStatus = (status: string) => {
        const next = selectedStatuses.includes(status)
            ? selectedStatuses.filter(s => s !== status)
            : [...selectedStatuses, status]
        setStatusFilter(next.length === 0 ? "all" : next.join(","))
    }

    const toggleWorker = (workerId: string) => {
        const next = selectedWorkers.includes(workerId)
            ? selectedWorkers.filter(w => w !== workerId)
            : [...selectedWorkers, workerId]
        setFilterWorker(next.length === 0 ? "all" : next.join(","))
    }

    const togglePagoStatus = (pagoStatus: string) => {
        const next = selectedPagoStatuses.includes(pagoStatus)
            ? selectedPagoStatuses.filter(s => s !== pagoStatus)
            : [...selectedPagoStatuses, pagoStatus]
        setPagoStatusFilter(next.length === 0 ? "all" : next.join(","))
    }

    // Texto dinámico y contextual para los botones
    const getStatusButtonText = () => {
        if (selectedStatuses.length === 0) return "Todos los estados"
        if (selectedStatuses.length <= 2) return selectedStatuses.join(", ")
        return `${selectedStatuses.length} estados sel.`
    }

    const getWorkerButtonText = () => {
        if (selectedWorkers.length === 0) return "Todo el equipo"
        
        const names = selectedWorkers.map(id => {
            if (id === 'unassigned') return "Sin asignar"
            const w = workers.find(work => work.id === id)
            return w ? (w.nombre || "Trabajador") : "Desconocido"
        })

        if (names.length <= 2) return names.join(", ")
        return `${names.length} asignados`
    }

    const getPagoStatusButtonText = () => {
        if (selectedPagoStatuses.length === 0) return "Todos los pagos"
        if (selectedPagoStatuses.length <= 2) return selectedPagoStatuses.join(", ")
        return `${selectedPagoStatuses.length} pagos sel.`
    }

    return (
        <m.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
            {/* Campo de búsqueda */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                <Input
                    placeholder="Buscar cliente, DNI..."
                    className="h-14 pl-12 bg-slate-50 border-none rounded-2xl font-medium focus:ring-4 focus:ring-slate-900/5 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filtro Multiselección de Estado */}
            <div ref={statusRef} className="relative">
                <button
                    type="button"
                    onClick={() => {
                        setStatusOpen(!statusOpen)
                        setWorkerOpen(false)
                        setPagoStatusOpen(false)
                    }}
                    className="h-14 w-full flex items-center justify-between bg-slate-50 border-none rounded-2xl font-bold text-slate-900 px-6 cursor-pointer focus:outline-none hover:bg-slate-100/70 transition-all text-left"
                >
                    <span className="truncate pr-2">{getStatusButtonText()}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
                </button>

                {statusOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-3 space-y-1 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-2 px-1">
                            <span className="text-[10px] uppercase font-black text-muted-foreground">Estados</span>
                            {selectedStatuses.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter("all")}
                                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                        {allStatuses.map((st) => {
                            const isChecked = selectedStatuses.includes(st.value)
                            return (
                                <label
                                    key={st.value}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleStatus(st.value)}
                                        className="h-5 w-5 rounded border-slate-200 text-slate-900 focus:ring-slate-900/5 focus:ring-offset-0 focus:ring-2 accent-slate-900 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-800">{st.label}</span>
                                </label>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Filtro Multiselección de Trabajador */}
            {(userRole === 'admin' || userRole === 'superadmin') && (
                <div ref={workerRef} className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setWorkerOpen(!workerOpen)
                            setStatusOpen(false)
                            setPagoStatusOpen(false)
                        }}
                        className="h-14 w-full flex items-center justify-between bg-slate-50 border-none rounded-2xl font-bold text-slate-900 px-6 cursor-pointer focus:outline-none hover:bg-slate-100/70 transition-all text-left"
                    >
                        <span className="truncate pr-2">{getWorkerButtonText()}</span>
                        <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${workerOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {workerOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-3 space-y-1 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between border-b pb-2 mb-2 px-1">
                                <span className="text-[10px] uppercase font-black text-muted-foreground">Personal</span>
                                {selectedWorkers.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setFilterWorker("all")}
                                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            {/* Opción Sin asignar */}
                            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={selectedWorkers.includes("unassigned")}
                                    onChange={() => toggleWorker("unassigned")}
                                    className="h-5 w-5 rounded border-slate-200 text-slate-900 focus:ring-slate-900/5 focus:ring-offset-0 focus:ring-2 accent-slate-900 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-800">Sin asignar</span>
                            </label>

                            {/* Lista de Trabajadores */}
                            {workers.map((w) => {
                                const isChecked = selectedWorkers.includes(w.id)
                                return (
                                    <label
                                        key={w.id}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleWorker(w.id)}
                                            className="h-5 w-5 rounded border-slate-200 text-slate-900 focus:ring-slate-900/5 focus:ring-offset-0 focus:ring-2 accent-slate-900 cursor-pointer"
                                        />
                                        <span className="text-xs font-bold text-slate-800">{w.nombre || 'Trabajador'}</span>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Filtro Multiselección de Estado de Pago */}
            <div ref={pagoStatusRef} className="relative">
                <button
                    type="button"
                    onClick={() => {
                        setPagoStatusOpen(!pagoStatusOpen)
                        setStatusOpen(false)
                        setWorkerOpen(false)
                    }}
                    className="h-14 w-full flex items-center justify-between bg-slate-50 border-none rounded-2xl font-bold text-slate-900 px-6 cursor-pointer focus:outline-none hover:bg-slate-100/70 transition-all text-left"
                >
                    <span className="truncate pr-2">{getPagoStatusButtonText()}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${pagoStatusOpen ? 'rotate-180' : ''}`} />
                </button>

                {pagoStatusOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-3 space-y-1 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-2 px-1">
                            <span className="text-[10px] uppercase font-black text-muted-foreground">Pago Estado</span>
                            {selectedPagoStatuses.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setPagoStatusFilter("all")}
                                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                        {allPagoStatuses.map((pst) => {
                            const isChecked = selectedPagoStatuses.includes(pst.value)
                            return (
                                <label
                                    key={pst.value}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => togglePagoStatus(pst.value)}
                                        className="h-5 w-5 rounded border-slate-200 text-slate-900 focus:ring-slate-900/5 focus:ring-offset-0 focus:ring-2 accent-slate-900 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-800">{pst.label}</span>
                                </label>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Filtro de Rango de Fechas */}
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
