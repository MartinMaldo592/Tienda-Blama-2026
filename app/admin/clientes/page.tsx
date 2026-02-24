
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Search, MapPin, Phone, History, Mail } from "lucide-react"
import { fetchAdminClientes } from "@/features/admin"

export default function ClientesPage() {
    const [clientes, setClientes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchClientes()
    }, [])

    async function fetchClientes() {
        setLoading(true)
        try {
            const data = await fetchAdminClientes()
            setClientes(data)
        } catch (err) {
            setClientes([])
        }
        setLoading(false)
    }

    const filteredClientes = clientes.filter(cliente => {
        if (!searchTerm) return true
        const st = searchTerm.toLowerCase()
        return (
            (cliente.nombre?.toLowerCase() || "").includes(st) ||
            (cliente.telefono?.toLowerCase() || "").includes(st) ||
            (cliente.dni?.toLowerCase() || "").includes(st) ||
            (cliente.email?.toLowerCase() || "").includes(st)
        )
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                    <p className="text-gray-500">Base de datos de tus compradores.</p>
                </div>
            </div>

            <div className="flex gap-2 bg-white p-4 rounded-xl shadow-sm border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nombre, teléfono, DNI o correo..."
                        className="pl-9 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>DNI</TableHead>
                            <TableHead>Departamento</TableHead>
                            <TableHead>Provincia</TableHead>
                            <TableHead>Distrito</TableHead>
                            <TableHead>Dirección Registrada</TableHead>
                            <TableHead>Referencia</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead className="text-right">Historial</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={12} className="text-center py-10">Cargando...</TableCell>
                            </TableRow>
                        ) : filteredClientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} className="text-center py-10">
                                    {searchTerm ? "No se encontraron clientes que coincidan con la búsqueda." : "No hay clientes aún."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell className="font-mono text-xs text-gray-500 font-medium">#{cliente.id}</TableCell>
                                    <TableCell className="font-bold text-gray-800">{cliente.nombre}</TableCell>
                                    <TableCell>
                                        {cliente.email ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate max-w-[180px]" title={cliente.email}>{cliente.email}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-3 w-3" /> {cliente.telefono}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600 font-medium">{cliente.dni || '—'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {cliente.departamento || '—'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {cliente.provincia || '—'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {cliente.distrito || '—'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-2 text-sm text-gray-500">
                                            <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                                            <span>{cliente.direccion || 'Sin dirección'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-500 max-w-[200px] italic">
                                            {cliente.referencia || '—'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {cliente.link_ubicacion ? (
                                            <a
                                                href={cliente.link_ubicacion}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium"
                                            >
                                                <MapPin className="h-3 w-3" /> Ver Mapa
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <History className="h-3 w-3" /> Ver Pedidos
                                        </Button>
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
