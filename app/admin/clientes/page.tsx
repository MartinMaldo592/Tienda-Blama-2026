"use client"

import { useMemo, useState } from "react"
import { m, AnimatePresence } from "framer-motion"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Search, MapPin, Phone, History, Mail, Users, RefreshCw,
    UserCheck, UserX, ExternalLink
} from "lucide-react"
import { fetchAdminClientes, Cliente } from "@/features/admin"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function ClientesPage() {
    const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin"] })
    const qc = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")

    const { data: clientes = [], isLoading, isFetching } = useQuery<Cliente[]>({
        queryKey: ["adminClientes"], queryFn: fetchAdminClientes,
        enabled: !guard.loading && !guard.accessDenied,
    })

    const cleanDireccion = (dir: string) => {
        if (!dir) return "Sin dirección"
        // Remover enlaces de mapa redundantes en texto plano del campo de dirección
        const index = dir.indexOf("[Link:")
        if (index !== -1) {
            return dir.substring(0, index).trim()
        }
        return dir
    }

    const filteredClientes = useMemo(() => {
        if (!searchTerm) return clientes
        const st = searchTerm.toLowerCase()
        return clientes.filter((c: Cliente) => (
            (c.nombre?.toLowerCase() || "").includes(st) ||
            (c.telefono?.toLowerCase() || "").includes(st) ||
            (c.dni?.toLowerCase() || "").includes(st) ||
            (c.email?.toLowerCase() || "").includes(st) ||
            (c.distrito?.toLowerCase() || "").includes(st)
        ))
    }, [clientes, searchTerm])

    const stats = useMemo(() => ({
        total: clientes.length,
        conEmail: clientes.filter((c: Cliente) => c.email).length,
        sinDireccion: clientes.filter((c: Cliente) => !c.direccion).length
    }), [clientes])

    if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={8} tableRows={8} />
    if (guard.accessDenied) return <AccessDenied />

    return (
        <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-8 max-w-[1600px] mx-auto pb-20">
            <AdminPageHeader icon={<Users size={28} strokeWidth={1.5}/>} iconColor="bg-gradient-to-tr from-violet-600 via-indigo-600 to-violet-700" iconShadow="shadow-violet-500/20" title="Clientes" subtitle="Base de datos de compradores" totalItems={stats.total} totalLabel="clientes registrados" isFetching={isFetching} dotColor="bg-violet-500"
                actions={<Button className="gap-2 haptic-scale shadow-md rounded-xl h-11 px-5 font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all" onClick={()=>qc.invalidateQueries({queryKey:["adminClientes"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
            />

            {/* Tarjetas de Estadísticas con Alto Contraste */}
            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {l:"Total Clientes",v:stats.total,icon:Users,c:"text-violet-700 dark:text-violet-400",bg:"bg-violet-100/70 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-900/40"},
                    {l:"Con Correo",v:stats.conEmail,icon:UserCheck,c:"text-blue-700 dark:text-blue-400",bg:"bg-blue-100/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40"},
                    {l:"Sin Dirección",v:stats.sinDireccion,icon:UserX,c:"text-amber-700 dark:text-amber-400",bg:"bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40"}
                ].map((s,i)=>(
                    <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-md border border-slate-200/90 dark:border-slate-800 p-7 transition-all">
                        <div className="flex items-center justify-between">
                            <div><p className="text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 dark:text-white mt-2">{s.v}</p></div>
                            <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center shadow-xs`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
                        </div>
                    </m.div>
                ))}
            </m.div>

            {/* Barra de Búsqueda con Definición de Borde */}
            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200/90 dark:border-slate-800 p-5">
                <div className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400"/><Input placeholder="Buscar por nombre, teléfono, DNI, correo o distrito..." className="pl-10 rounded-xl h-12 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:bg-white" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div>
            </m.div>

            {/* Tabla de Clientes con Encabezado Oscuro y Definición Nítida */}
            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/90 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <Table className="min-w-[1100px] w-full">
                        <TableHeader className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                            <TableRow className="h-16 hover:bg-transparent border-none">
                                {["ID", "Cliente & Contacto", "DNI / RUC", "Ubicación", "Dirección de Entrega", "Mapa", "Acciones"].map((h, i) => (
                                    <TableHead key={h} className={`text-slate-800 dark:text-slate-200 font-black text-[11px] uppercase tracking-widest ${i === 0 ? 'pl-8' : ''} ${i === 6 ? 'pr-8 text-right' : ''}`}>
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            <AnimatePresence mode="popLayout">
                                {filteredClientes.map((cliente: any, i: number) => (
                                    <m.tr key={cliente.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.025}} className="h-[76px] hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-none group">
                                        {/* ID */}
                                        <TableCell className="pl-8 font-mono text-xs font-bold text-slate-500">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px] font-black border border-slate-200/60 dark:border-slate-700">
                                                #{cliente.id}
                                            </span>
                                        </TableCell>

                                        {/* Cliente & Contacto */}
                                        <TableCell className="min-w-[240px]">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20 uppercase border border-violet-400/30">
                                                    {(cliente.nombre || 'C').charAt(0)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors truncate" title={cliente.nombre}>
                                                        {cliente.nombre || "Sin Nombre"}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {cliente.email && (
                                                            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate max-w-[160px]" title={cliente.email}>
                                                                <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                                                                {cliente.email}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                                                            <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                                                            {cliente.telefono || "—"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* DNI */}
                                        <TableCell>
                                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                                {cliente.dni || <span className="text-slate-300">—</span>}
                                            </span>
                                        </TableCell>

                                        {/* Ubicación */}
                                        <TableCell className="min-w-[160px]">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate" title={cliente.departamento}>
                                                    {cliente.departamento || "—"}
                                                </p>
                                                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate" title={[cliente.provincia, cliente.distrito].filter(Boolean).join(' / ')}>
                                                    {[cliente.provincia, cliente.distrito].filter(Boolean).join(' / ') || '—'}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* Dirección de Entrega */}
                                        <TableCell className="min-w-[260px] max-w-[340px]">
                                            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                <MapPin className="h-4 w-4 mt-0.5 text-violet-500 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <span className="break-words line-clamp-2 font-semibold text-slate-800 dark:text-slate-200" title={cleanDireccion(cliente.direccion)}>
                                                        {cleanDireccion(cliente.direccion)}
                                                    </span>
                                                    {cliente.referencia && (
                                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic mt-0.5 truncate" title={cliente.referencia}>
                                                            Ref: {cliente.referencia}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Mapa */}
                                        <TableCell>
                                            {cliente.link_ubicacion ? (
                                                <a 
                                                    href={cliente.link_ubicacion} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:text-white text-[10px] font-black uppercase tracking-wider bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 hover:bg-violet-600 px-3 py-1.5 rounded-xl transition-all duration-300 shadow-sm"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Mapa
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600 text-xs font-mono">—</span>
                                            )}
                                        </TableCell>

                                        {/* Acciones */}
                                        <TableCell className="pr-8 text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-2 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-600 hover:border-violet-200 transition-all haptic-scale h-9 px-3.5 shadow-sm"
                                            >
                                                <History className="h-3.5 w-3.5 text-violet-500" />
                                                Historial
                                            </Button>
                                        </TableCell>
                                    </m.tr>
                                ))}
                            </AnimatePresence>
                            {filteredClientes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search className="h-10 w-10 stroke-1 text-slate-300" />
                                            <p className="text-base font-medium">No se encontraron clientes.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Status bar inferior */}
                <div className="px-8 py-5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Mostrando {filteredClientes.length} de {stats.total} clientes registrados
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-violet-100/60 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                            Base de Clientes Activa
                        </span>
                    </div>
                </div>
            </m.div>
        </m.div>
    )
}
