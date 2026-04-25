"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase.client"
import { fetchAuditLogs, AuditLog } from "@/features/admin/services/audit.client"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Activity, RefreshCw, User, Database, Clock, Eye, Filter } from "lucide-react"
import { TableRowsSkeleton } from "@/components/admin/skeleton-previews"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AuditPage() {
    const queryClient = useQueryClient()
    const guard = useRoleGuard({ allowedRoles: ['admin'] })
    const [isLive, setIsLive] = useState(true)

    const { data: logs = [], isLoading, isFetching } = useQuery({
        queryKey: ["auditLogs"],
        queryFn: fetchAuditLogs,
        refetchInterval: isLive ? 10000 : false, // Auto-refresh every 10s if live
    })

    // Real-time subscription
    useEffect(() => {
        if (!isLive) return

        const supabase = createClient()
        const channel = supabase
            .channel('system_audit_logs_changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'system_audit_logs' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["auditLogs"] })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [isLive, queryClient])

    if (guard.accessDenied) return <AccessDenied />
    if (guard.loading) return <TableRowsSkeleton columns={5} rows={10} />

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'INSERT': return <Badge className="bg-green-100 text-green-700 border-green-200">INSERTAR</Badge>
            case 'UPDATE': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">ACTUALIZAR</Badge>
            case 'DELETE': return <Badge className="bg-red-100 text-red-700 border-red-200">ELIMINAR</Badge>
            default: return <Badge variant="outline">{action}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-blue-600" />
                        Panel de Auditoría
                    </h1>
                    <p className="text-gray-500">Monitoreo de actividad del sistema en tiempo real.</p>
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant={isLive ? "default" : "outline"}
                        className={`gap-2 haptic-scale ${isLive ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => setIsLive(!isLive)}
                    >
                        <Activity className={`h-4 w-4 ${isLive ? 'animate-pulse' : ''}`} />
                        {isLive ? 'Live Tracking ON' : 'Live Tracking OFF'}
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2 haptic-scale"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["auditLogs"] })}
                        disabled={isFetching}
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        Refrescar
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead>Tabla / ID</TableHead>
                            <TableHead className="text-right">Detalles</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <TableRowsSkeleton columns={5} rows={10} hasCheckbox={false} />
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">
                                        No se han registrado acciones aún.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="hover:bg-gray-50 transition-colors border-b last:border-0"
                                    >
                                        <TableCell className="font-medium text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                {format(new Date(log.changed_at), "HH:mm:ss", { locale: es })}
                                                <span className="text-[10px] text-gray-300 ml-1">
                                                    {format(new Date(log.changed_at), "dd/MM/yy", { locale: es })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{log.usuario?.nombre || 'Sistema'}</span>
                                                    <span className="text-[10px] text-gray-400">{log.usuario?.email || 'automated@blama.com'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getActionBadge(log.action)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700 capitalize">
                                                    <Database className="h-3 w-3 text-gray-400" />
                                                    {log.table_name}
                                                </div>
                                                <span className="text-[10px] text-gray-400">ID: {log.record_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 haptic-scale">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
