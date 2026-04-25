
"use client"

import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
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
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, Plus, ImageIcon, Trash2, Edit, RefreshCw, Box, ArrowRight } from "lucide-react"
import { fetchAdminProductos, deleteFromR2 } from "@/features/admin"
import { deleteProductAction } from "@/features/admin/actions/products"
import { Producto } from "@/features/admin/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ProductRowSkeleton } from "@/components/admin/skeleton-previews"

export default function ProductosPage() {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")

    const guard = useRoleGuard({ allowedRoles: ['admin'] })

    const { data: productos = [], isLoading } = useQuery({
        queryKey: ["adminProductos"],
        queryFn: fetchAdminProductos,
        enabled: !guard.loading && !guard.accessDenied
    })

    const deleteMutation = useMutation<number, Error, Producto>({
        mutationFn: async (producto: Producto) => {
            const urlsToDelete = [
                producto.imagen_url,
                ...(Array.isArray(producto.imagenes) ? producto.imagenes : []),
                ...(Array.isArray(producto.videos) ? (producto.videos as string[]) : [])
            ].filter((u): u is string => Boolean(u))

            if (urlsToDelete.length > 0) {
                await Promise.all(urlsToDelete.map(url => deleteFromR2(url)))
            }

            const result = await deleteProductAction(producto.id)
            if (result.error) throw new Error(result.error)

            return producto.id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProductos"] })
        },
        onError: (err: Error) => {
            alert("Error al eliminar: " + String(err?.message || 'No se pudo eliminar'))
        }
    })

    const handleDelete = async (producto: Producto) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${producto.nombre}"? Esto eliminará también todas sus imágenes y videos.`)) return
        deleteMutation.mutate(producto)
    }

    const filteredProductos = productos.filter((p: Producto) =>
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (guard.accessDenied) return <AccessDenied />

    if (guard.loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-xl" />
                        <div className="h-4 w-64 bg-slate-100 animate-pulse rounded-lg" />
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-[100px] h-14 pl-8"></TableHead>
                                <TableHead className="h-14"></TableHead>
                                <TableHead className="h-14"></TableHead>
                                <TableHead className="h-14"></TableHead>
                                <TableHead className="h-14 pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <ProductRowSkeleton count={8} />
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                            <Box size={20} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Productos</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Gestiona tu inventario con precisión quirúrgica.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 w-full md:w-auto"
                >
                    <Button
                        variant="outline"
                        className="flex-1 md:flex-none gap-2 h-12 px-6 rounded-2xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all font-bold haptic-scale"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["adminProductos"] })}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Sincronizar
                    </Button>
                    <Button asChild className="flex-1 md:flex-none h-12 px-6 rounded-2xl bg-slate-900 text-white gap-2 hover:bg-blue-600 transition-all font-bold shadow-xl shadow-slate-200 hover:shadow-blue-200 haptic-scale">
                        <Link href="/admin/productos/nuevo">
                            <Plus className="h-5 w-5" /> Nuevo Ítem
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* --- SEARCH & FILTERS --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative group"
            >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <Input
                    placeholder="Busca cualquier producto por su nombre..."
                    className="h-16 pl-12 pr-4 bg-white border-slate-100 rounded-[1.25rem] shadow-sm text-lg font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </motion.div>

            {/* --- TABLE CONTAINER --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
            >
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[100px] h-14 font-bold text-slate-400 uppercase tracking-widest text-[10px] pl-8">Imagen</TableHead>
                            <TableHead className="h-14 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Producto</TableHead>
                            <TableHead className="h-14 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Precio Actual</TableHead>
                            <TableHead className="h-14 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Inventario</TableHead>
                            <TableHead className="h-14 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right pr-8">Gestión</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <ProductRowSkeleton />
                            ) : filteredProductos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Search size={40} strokeWidth={1} />
                                            <p className="text-lg font-medium">No se encontraron resultados para tu búsqueda.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProductos.map((producto: Producto, index: number) => (
                                    <motion.tr 
                                        key={producto.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`group hover:bg-slate-50/50 transition-colors border-slate-50 ${deleteMutation.isPending && deleteMutation.variables?.id === producto.id ? "opacity-50 pointer-events-none" : ""}`}
                                    >
                                        <TableCell className="pl-8 py-4">
                                            <div className="relative h-14 w-14 bg-slate-100 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-md transition-all duration-500">
                                                {producto.imagen_url ? (
                                                    <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="56px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="h-5 w-5 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{producto.nombre}</span>
                                                <span className="text-xs text-slate-400 font-medium tracking-wide">ID: #{producto.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-slate-900 tracking-tight">{formatCurrency(producto.precio)}</span>
                                                {producto.precio_antes != null && Number(producto.precio_antes) > Number(producto.precio) && (
                                                    <span className="text-xs text-slate-400 line-through font-medium">{formatCurrency(producto.precio_antes)}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-16 rounded-full overflow-hidden bg-slate-100`}>
                                                    <div 
                                                        className={`h-full transition-all duration-1000 ${producto.stock > 10 ? 'bg-green-500' : producto.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min(100, (producto.stock / 20) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-black uppercase tracking-widest ${producto.stock > 10 ? 'text-green-600' : producto.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                                    {producto.stock} uds
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild variant="ghost" className="h-10 px-4 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold gap-2 transition-all group/btn">
                                                    <Link href={`/admin/productos/${producto.id}/editar`}>
                                                        <Edit className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Editar</span>
                                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 translate-x-[-4px] group-hover/btn:translate-x-0 transition-all" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                                    onClick={() => handleDelete(producto)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    {deleteMutation.isPending && deleteMutation.variables?.id === producto.id
                                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                                        : <Trash2 className="h-4 w-4" />
                                                    }
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    )
}
