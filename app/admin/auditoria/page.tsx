"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase.client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Eye, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<Record<string, string>>({})

    // Filtros
    const [tableFilter, setTableFilter] = useState("all")
    const [actionFilter, setActionFilter] = useState("all")

    useEffect(() => {
        fetchLogs()
    }, [])

    async function fetchLogs() {
        setLoading(true)

        // 1. Get Users mapping
        const supabase = createClient()
        const { data: userData } = await supabase.from('usuarios').select('id, email, nombre')
        const userMap: Record<string, string> = {}
        userData?.forEach((u: any) => {
            userMap[u.id] = u.nombre || u.email || 'Desconocido'
        })
        setUsers(userMap)

        // 2. Get Logs
        const { data, error } = await supabase
            .from('system_audit_logs')
            .select('*')
            .order('changed_at', { ascending: false })
            .limit(100)

        if (data) setLogs(data)
        setLoading(false)
    }

    const filteredLogs = logs.filter(log => {
        if (tableFilter !== 'all' && log.table_name !== tableFilter) return false
        if (actionFilter !== 'all' && log.action !== actionFilter) return false
        return true
    })

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Auditoría del Sistema (Audit Logs)</h1>
                <Button variant="outline" onClick={fetchLogs}>Refrescar</Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Select value={tableFilter} onValueChange={setTableFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por Tabla" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las tablas</SelectItem>
                        <SelectItem value="productos">Productos</SelectItem>
                        <SelectItem value="categorias">Categorías</SelectItem>
                        <SelectItem value="cupones">Cupones</SelectItem>
                        <SelectItem value="home_banners">Banners</SelectItem>
                        <SelectItem value="announcement_bar">Anuncios</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por Acción" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las acciones</SelectItem>
                        <SelectItem value="INSERT">Creación (INSERT)</SelectItem>
                        <SelectItem value="UPDATE">Edición (UPDATE)</SelectItem>
                        <SelectItem value="DELETE">Eliminación (DELETE)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha / Hora</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead>Tabla</TableHead>
                            <TableHead>ID Registro</TableHead>
                            <TableHead className="text-right">Detalles</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Cargando logs...</TableCell></TableRow>
                        ) : filteredLogs.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">No se encontraron registros de auditoría aún.</TableCell></TableRow>
                        ) : (
                            filteredLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium text-xs">
                                        {format(new Date(log.changed_at), "dd MMM yyyy HH:mm:ss", { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{users[log.changed_by] || 'Sistema / Desconocido'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            log.action === 'INSERT' ? "bg-green-50 text-green-700 border-green-200" :
                                                log.action === 'UPDATE' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                    "bg-red-50 text-red-700 border-red-200"
                                        }>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize text-sm">{log.table_name.replace('_', ' ')}</TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">{log.record_id}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Detalle del Cambio</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Antes (Old Data)</h4>
                                                        <pre className="text-xs overflow-auto max-h-[400px]">
                                                            {log.old_data ? JSON.stringify(log.old_data, null, 2) : <span className="text-gray-400">N/A (Es creación)</span>}
                                                        </pre>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                                                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Después (New Data)</h4>
                                                        <pre className="text-xs overflow-auto max-h-[400px]">
                                                            {log.new_data ? JSON.stringify(log.new_data, null, 2) : <span className="text-gray-400">N/A (Es eliminación)</span>}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
