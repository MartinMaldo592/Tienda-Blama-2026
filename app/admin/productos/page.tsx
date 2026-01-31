/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import { formatCurrency } from "@/lib/utils"

import { Plus, Search, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react"
import { deleteAdminProductoViaApi, fetchAdminProductos, deleteFromR2 } from "@/features/admin"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function ProductosPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")

    const guard = useRoleGuard({ allowedRoles: ['admin'] })

    // 1. Fetching
    const { data: productos = [], isLoading } = useQuery({
        queryKey: ["adminProductos"],
        queryFn: fetchAdminProductos,
        enabled: !guard.loading && !guard.accessDenied
    })

    // 2. Deletion Mutation
    const deleteMutation = useMutation({
        mutationFn: async (producto: any) => {
            const sessionRes = await supabase.auth.getSession()
            const accessToken = sessionRes?.data?.session?.access_token
            if (!accessToken) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.")

            // 1. Delete images and videos from R2 (Cloudflare)
            // Collect all URLs to delete
            const urlsToDelete = [
                producto.imagen_url,
                ...(Array.isArray(producto.imagenes) ? producto.imagenes : []),
                ...(Array.isArray(producto.videos) ? producto.videos : [])
            ].filter(Boolean)

            // Execute deletions in parallel
            await Promise.all(urlsToDelete.map(url => deleteFromR2(url)))

            // 2. Delete from Database
            await deleteAdminProductoViaApi({ accessToken, id: producto.id })

            return producto.id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProductos"] })
        },
        onError: (err: any) => {
            alert("Error al eliminar: " + String(err?.message || 'No se pudo eliminar'))
        }
    })

    const handleDelete = async (producto: any) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${producto.nombre}"? Esto eliminará también todas sus imágenes y videos. esta acción no se puede deshacer.`)) return
        deleteMutation.mutate(producto)
    }

    // 3. Filtering
    const filteredProductos = productos.filter((p: any) =>
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (guard.accessDenied) return <AccessDenied />

    if (guard.loading) {
        return <div className="p-6 text-muted-foreground flex items-center gap-2"><Loader2 className="animate-spin" /> Cargando...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500">Administra el inventario de tu tienda.</p>
                </div>

                <Button asChild className="bg-black text-white gap-2 hover:bg-gray-800">
                    <Link href="/admin/productos/nuevo">
                        <Plus className="h-4 w-4" /> Nuevo Producto
                    </Link>
                </Button>
            </div>

            <div className="flex gap-2 bg-white p-4 rounded-xl shadow-sm border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar producto..."
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
                            <TableHead className="w-[80px]">Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        Cargando inventario...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProductos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    {productos.length === 0 ? "No hay productos registrados." : "No se encontraron productos con ese nombre."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProductos.map((producto: any) => (
                                <TableRow key={producto.id} className={deleteMutation.isPending && deleteMutation.variables?.id === producto.id ? "opacity-50 pointer-events-none" : ""}>
                                    <TableCell>
                                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                                            {producto.imagen_url ? (
                                                <img src={producto.imagen_url} alt={producto.nombre} className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                                    <TableCell>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-semibold">{formatCurrency(producto.precio)}</span>
                                            {producto.precio_antes != null && Number(producto.precio_antes) > Number(producto.precio) && (
                                                <span className="text-xs text-gray-500 line-through">{formatCurrency(producto.precio_antes)}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {producto.stock} un.
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                                            <Link href={`/admin/productos/${producto.id}/editar`} aria-label="Editar">
                                                <Edit className="h-4 w-4 text-gray-600" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-red-50"
                                            onClick={() => handleDelete(producto)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending && deleteMutation.variables?.id === producto.id
                                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                                : <Trash2 className="h-4 w-4 text-red-500" />
                                            }
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
