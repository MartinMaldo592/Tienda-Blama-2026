"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase.client"
import { fetchAuditLogs, AuditLog } from "@/features/admin/services/audit.client"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { AdminPageHeader } from "@/components/admin/page-header"
import { AdminPageSkeleton } from "@/components/admin/page-skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Activity, RefreshCw, User, Database, Clock, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AuditPage() {
    const qc = useQueryClient()
    const guard = useRoleGuard({ allowedRoles: ['admin'] })
    const [isLive, setIsLive] = useState(true)

    const { data: logs = [], isLoading, isFetching } = useQuery({
        queryKey: ["auditLogs"], queryFn: fetchAuditLogs,
        refetchInterval: isLive ? 10000 : false,
    })

    useEffect(() => {
        if (!isLive) return
        const supabase = createClient()
        const channel = supabase.channel('system_audit_logs_changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_audit_logs' }, () => { qc.invalidateQueries({ queryKey: ["auditLogs"] }) }).subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [isLive, qc])

    if (guard.accessDenied) return <AccessDenied />
    if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={0} tableColumns={5} tableRows={10} />

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'INSERT': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 rounded-full">INSERTAR</Badge>
            case 'UPDATE': return <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full">ACTUALIZAR</Badge>
            case 'DELETE': return <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full">ELIMINAR</Badge>
            default: return <Badge variant="outline" className="rounded-full">{action}</Badge>
        }
    }

    return (
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-10 max-w-[1600px] mx-auto">
            <AdminPageHeader icon={<ShieldAlert size={28} strokeWidth={1.5} />} iconColor="bg-slate-800" iconShadow="shadow-slate-300" title="Auditoría" subtitle="Monitoreo de actividad del sistema en tiempo real" isFetching={isFetching} dotColor={isLive ? "bg-emerald-500" : "bg-slate-300"}
                actions={<>
                    <Button variant={isLive ? "default" : "outline"} className={`gap-2 haptic-scale rounded-2xl h-14 px-6 font-bold ${isLive ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg' : ''}`} onClick={() => setIsLive(!isLive)}>
                        <Activity className={`h-4 w-4 ${isLive ? 'animate-pulse' : ''}`} />{isLive ? 'Live ON' : 'Live OFF'}
                    </Button>
                    <Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={() => qc.invalidateQueries({ queryKey: ["auditLogs"] })} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />Refrescar
                    </Button>
                </>}
            />

            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-16 hover:bg-transparent border-slate-100">
                            {["Fecha y Hora", "Usuario", "Acción", "Tabla / ID", "Detalles"].map((h, i) => (
                                <TableHead key={h} className={`text-slate-400 font-black text-[11px] uppercase tracking-widest ${i === 0 ? 'pl-8' : ''} ${i === 4 ? 'pr-8 text-right' : ''}`}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {logs.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">No se han registrado acciones aún.</TableCell></TableRow>
                            ) : (
                                logs.map((log) => (
                                    <m.tr key={log.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="h-[72px] hover:bg-slate-50/80 transition-colors border-slate-50">
                                        <TableCell className="pl-8">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-slate-300" />
                                                <span className="font-bold text-slate-700">{format(new Date(log.changed_at), "HH:mm:ss", { locale: es })}</span>
                                                <span className="text-[10px] text-slate-300 ml-1">{format(new Date(log.changed_at), "dd/MM/yy", { locale: es })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-500 border border-slate-200"><User className="h-4 w-4" /></div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{log.usuario?.nombre || 'Sistema'}</span>
                                                    <span className="text-[10px] text-slate-400">{log.usuario?.email || 'automated@blama.com'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getActionBadge(log.action)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-xs font-mono font-black text-slate-700 capitalize"><Database className="h-3.5 w-3.5 text-slate-300" />{log.table_name}</div>
                                                <span className="text-[10px] text-slate-300">ID: {log.record_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <Button variant="ghost" size="sm" className="h-9 w-9 haptic-scale rounded-xl"><Eye className="h-4 w-4 text-slate-400" /></Button>
                                        </TableCell>
                                    </m.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </m.div>
        </m.div>
    )
}
