"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Search, MapPin, Phone, History, Mail, Users, RefreshCw,
    UserCheck, UserX, ExternalLink
} from "lucide-react"
import { fetchAdminClientes } from "@/features/admin"

function ClienteRowSkeleton({ count = 8 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <TableRow key={i} className="h-[72px]">
                    <TableCell className="pl-8"><Skeleton className="h-4 w-8 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 rounded-lg" /></TableCell>
                    <TableCell className="pr-8"><Skeleton className="h-9 w-28 rounded-xl ml-auto" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export default function ClientesPage() {
    const guard = useRoleGuard({ allowedRoles: ["admin"] })
    const [clientes, setClientes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    async function loadClientes() {
        setLoading(true)
        try {
            const data = await fetchAdminClientes()
            setClientes(data)
        } catch (err) {
            setClientes([])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!guard.loading && !guard.accessDenied) {
            loadClientes()
        }
    }, [guard.loading, guard.accessDenied])

    const filteredClientes = clientes.filter(cliente => {
        if (!searchTerm) return true
        const st = searchTerm.toLowerCase()
        return (
            (cliente.nombre?.toLowerCase() || "").includes(st) ||
            (cliente.telefono?.toLowerCase() || "").includes(st) ||
            (cliente.dni?.toLowerCase() || "").includes(st) ||
            (cliente.email?.toLowerCase() || "").includes(st) ||
            (cliente.distrito?.toLowerCase() || "").includes(st)
        )
    })

    // Stats
    const totalClientes = clientes.length
    const conEmail = clientes.filter(c => c.email).length
    const sinDireccion = clientes.filter(c => !c.direccion).length

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
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-[2rem]" />)}
                </div>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16">
                                {Array.from({ length: 8 }).map((_, i) => <TableHead key={i}></TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody><ClienteRowSkeleton /></TableBody>
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
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-violet-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-violet-200">
                            <Users size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Clientes</h1>
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-violet-50 text-violet-600 p-2 rounded-xl"
                                    >
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    </motion.div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    Base de datos de compradores
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap gap-3 w-full lg:w-auto"
                >
                    <Button
                        className="flex-1 md:flex-none gap-2 h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-violet-600 font-black tracking-tight shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all haptic-scale"
                        onClick={loadClientes}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        SINCRONIZAR
                    </Button>
                </motion.div>
            </div>

            {/* --- STATS CARDS --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <StatCard
                    label="Total Clientes"
                    value={totalClientes}
                    icon={<Users size={24} />}
                    colorClass="violet"
                    loading={loading}
                    delay={0.1}
                />
                <StatCard
                    label="Con Correo Electrónico"
                    value={conEmail}
                    icon={<UserCheck size={24} />}
                    colorClass="blue"
                    loading={loading}
                    delay={0.15}
                />
                <StatCard
                    label="Sin Dirección Registrada"
                    value={sinDireccion}
                    icon={<UserX size={24} />}
                    colorClass="orange"
                    loading={loading}
                    delay={0.2}
                />
            </motion.div>

            {/* --- SEARCH BAR --- */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 md:p-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input
                        placeholder="Buscar por nombre, teléfono, DNI, correo o distrito..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 border-0 bg-slate-50 rounded-[1.25rem] font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-violet-200"
                    />
                </div>
                {!loading && (
                    <div className="flex items-center px-4">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">
                            {filteredClientes.length} de {totalClientes} clientes
                        </p>
                    </div>
                )}
            </motion.div>

            {/* --- TABLE --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16 border-b border-slate-100">
                                <TableHead className="pl-8 font-black text-[11px] uppercase tracking-[0.15em] text-slate-400 w-[70px]">ID</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Nombre</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Contacto</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">DNI</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Ubicación</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Dirección</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">Mapa</TableHead>
                                <TableHead className="pr-8 font-black text-[11px] uppercase tracking-[0.15em] text-slate-400 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <ClienteRowSkeleton />
                            ) : filteredClientes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Users className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold text-sm">
                                                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados aún"}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClientes.map((cliente, idx) => (
                                    <motion.tr
                                        key={cliente.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                                        className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors h-[72px]"
                                    >
                                        <TableCell className="pl-8">
                                            <span className="font-mono text-[10px] font-black text-slate-300 bg-slate-100 px-2 py-1 rounded-lg">
                                                #{cliente.id}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-black text-sm text-slate-800">{cliente.nombre}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                {cliente.email && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Mail className="h-3 w-3 text-slate-300 flex-shrink-0" />
                                                        <span className="truncate max-w-[180px]" title={cliente.email}>{cliente.email}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Phone className="h-3 w-3 text-slate-300 flex-shrink-0" />
                                                    {cliente.telefono || '—'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-bold text-slate-600 tabular-nums">{cliente.dni || <span className="text-slate-300">—</span>}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                {cliente.departamento && (
                                                    <p className="text-xs font-bold text-slate-700">{cliente.departamento}</p>
                                                )}
                                                <p className="text-[10px] text-slate-400">
                                                    {[cliente.provincia, cliente.distrito].filter(Boolean).join(' / ') || '—'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-2 text-xs text-slate-500 max-w-[220px]">
                                                <MapPin className="h-3 w-3 mt-0.5 text-slate-300 flex-shrink-0" />
                                                <div>
                                                    <span>{cliente.direccion || 'Sin dirección'}</span>
                                                    {cliente.referencia && (
                                                        <p className="text-[10px] text-slate-400 italic mt-0.5">{cliente.referencia}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {cliente.link_ubicacion ? (
                                                <a
                                                    href={cliente.link_ubicacion}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-800 text-xs font-black uppercase tracking-wider bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Mapa
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 hover:border-slate-300 transition-all haptic-scale h-9"
                                            >
                                                <History className="h-3 w-3" />
                                                Pedidos
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer info */}
                {!loading && filteredClientes.length > 0 && (
                    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            Mostrando {filteredClientes.length} de {totalClientes} clientes
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

// --- Stat Card ---
function StatCard({ label, value, icon, colorClass, loading, delay = 0 }: any) {
    let styles = "from-slate-50 to-white border-slate-100"
    let iconBg = "text-blue-600 bg-blue-100/50"
    let shadow = "hover:shadow-blue-200/50"

    if (colorClass === "violet") {
        styles = "from-violet-50/50 to-white border-violet-100/50"
        iconBg = "text-violet-600 bg-violet-100/50"
        shadow = "hover:shadow-violet-200/50"
    } else if (colorClass === "blue") {
        styles = "from-blue-50/50 to-white border-blue-100/50"
        iconBg = "text-blue-600 bg-blue-100/50"
        shadow = "hover:shadow-blue-200/50"
    } else if (colorClass === "orange") {
        styles = "from-orange-50/50 to-white border-orange-100/50"
        iconBg = "text-orange-600 bg-orange-100/50"
        shadow = "hover:shadow-orange-200/50"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-[2rem] border bg-gradient-to-br ${styles} p-8 transition-all duration-300 hover:shadow-2xl ${shadow} hover:-translate-y-1 group`}
        >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-white/60"></div>

            <div className="relative flex flex-col gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] ${iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                    {loading ? <Skeleton className="h-6 w-6 rounded-full" /> : icon}
                </div>
                <div className="space-y-1">
                    <div className="text-sm font-bold tracking-wide uppercase text-slate-400">
                        {loading ? <Skeleton className="h-4 w-24" /> : label}
                    </div>
                    {loading ? (
                        <Skeleton className="h-10 w-20" />
                    ) : (
                        <h3 className="text-4xl font-black tracking-tight text-slate-900">{value}</h3>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
