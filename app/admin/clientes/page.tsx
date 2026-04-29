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
import { fetchAdminClientes } from "@/features/admin"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function ClientesPage() {
    const guard = useRoleGuard({ allowedRoles: ["admin"] })
    const qc = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")

    const { data: clientes = [], isLoading, isFetching } = useQuery({
        queryKey: ["adminClientes"], queryFn: fetchAdminClientes,
        enabled: !guard.loading && !guard.accessDenied,
    })

    const filteredClientes = useMemo(() => {
        if (!searchTerm) return clientes
        const st = searchTerm.toLowerCase()
        return clientes.filter((c:any) => (
            (c.nombre?.toLowerCase() || "").includes(st) ||
            (c.telefono?.toLowerCase() || "").includes(st) ||
            (c.dni?.toLowerCase() || "").includes(st) ||
            (c.email?.toLowerCase() || "").includes(st) ||
            (c.distrito?.toLowerCase() || "").includes(st)
        ))
    }, [clientes, searchTerm])

    const stats = useMemo(() => ({
        total: clientes.length,
        conEmail: clientes.filter((c:any) => c.email).length,
        sinDireccion: clientes.filter((c:any) => !c.direccion).length
    }), [clientes])

    if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={3} tableColumns={8} tableRows={8} />
    if (guard.accessDenied) return <AccessDenied />

    return (
        <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 max-w-[1600px] mx-auto pb-20">
            <AdminPageHeader icon={<Users size={28} strokeWidth={1.5}/>} iconColor="bg-violet-600" iconShadow="shadow-violet-200" title="Clientes" subtitle="Base de datos de compradores" totalItems={stats.total} totalLabel="clientes registrados" isFetching={isFetching} dotColor="bg-violet-500"
                actions={<Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>qc.invalidateQueries({queryKey:["adminClientes"]})} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar</Button>}
            />

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{l:"Total Clientes",v:stats.total,icon:Users,c:"text-violet-600",bg:"bg-violet-50"},{l:"Con Correo",v:stats.conEmail,icon:UserCheck,c:"text-blue-600",bg:"bg-blue-50"},{l:"Sin Dirección",v:stats.sinDireccion,icon:UserX,c:"text-orange-600",bg:"bg-orange-50"}].map((s,i)=>(
                    <m.div key={s.l} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.05}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                        <div className="flex items-center justify-between">
                            <div><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.l}</p><p className="text-4xl font-black text-slate-900 mt-2">{s.v}</p></div>
                            <div className={`h-14 w-14 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={`h-7 w-7 ${s.c}`}/></div>
                        </div>
                    </m.div>
                ))}
            </m.div>

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
                <div className="relative"><Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-300"/><Input placeholder="Buscar por nombre, teléfono, DNI, correo o distrito..." className="pl-10 rounded-xl h-12 border-slate-200" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div>
            </m.div>

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-16 hover:bg-transparent border-slate-100">
                            {["ID","Nombre","Contacto","DNI","Ubicación","Dirección","Mapa","Acciones"].map((h,i)=>(<TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i===0?'pl-8':''} ${i===7?'pr-8 text-right':''}`}>{h}</TableHead>))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredClientes.map((cliente:any,i:number)=>(
                                <m.tr key={cliente.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:i*0.03}} className="h-[72px] hover:bg-slate-50/80 transition-colors border-slate-50 group">
                                    <TableCell className="pl-8"><span className="font-mono text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">#{cliente.id}</span></TableCell>
                                    <TableCell><span className="font-black text-sm text-slate-800">{cliente.nombre}</span></TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {cliente.email&&<div className="flex items-center gap-2 text-xs text-slate-500"><Mail className="h-3 w-3 text-slate-300 flex-shrink-0"/><span className="truncate max-w-[180px]">{cliente.email}</span></div>}
                                            <div className="flex items-center gap-2 text-xs text-slate-500"><Phone className="h-3 w-3 text-slate-300 flex-shrink-0"/>{cliente.telefono||'—'}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-sm font-bold text-slate-600 tabular-nums">{cliente.dni||<span className="text-slate-300">—</span>}</span></TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            {cliente.departamento&&<p className="text-xs font-bold text-slate-700">{cliente.departamento}</p>}
                                            <p className="text-[10px] text-slate-400">{[cliente.provincia,cliente.distrito].filter(Boolean).join(' / ')||'—'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-2 text-xs text-slate-500 max-w-[220px]">
                                            <MapPin className="h-3 w-3 mt-0.5 text-slate-300 flex-shrink-0"/>
                                            <div><span>{cliente.direccion||'Sin dirección'}</span>{cliente.referencia&&<p className="text-[10px] text-slate-400 italic mt-0.5">{cliente.referencia}</p>}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {cliente.link_ubicacion?(<a href={cliente.link_ubicacion} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-800 text-xs font-black uppercase tracking-wider bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors"><ExternalLink className="h-3 w-3"/>Mapa</a>):<span className="text-slate-300 text-xs">—</span>}
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 hover:border-slate-300 transition-all haptic-scale h-9"><History className="h-3 w-3"/>Pedidos</Button>
                                    </TableCell>
                                </m.tr>
                            ))}
                        </AnimatePresence>
                        {filteredClientes.length===0&&<TableRow><TableCell colSpan={8} className="text-center py-20 text-slate-400">No se encontraron clientes.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </m.div>
        </m.div>
    )
}
