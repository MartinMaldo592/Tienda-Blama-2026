"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import Link from "next/link"
import { m, AnimatePresence } from "framer-motion"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { AdminPageHeader } from "@/components/admin/page-header"
import { AdminPageSkeleton } from "@/components/admin/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Search, Plus, ImageIcon, Trash2, Edit, RefreshCw, Box, ArrowRight } from "lucide-react"
import { fetchAdminProductos, deleteFromR2 } from "@/features/admin"
import { deleteProductAction } from "@/features/admin/actions/products"
import { Producto } from "@/features/admin/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function ProductosPage() {
    const guard = useRoleGuard({ allowedRoles: ['admin'] })
    const qc = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")

    const { data: productos = [], isLoading, isFetching } = useQuery({
        queryKey: ["adminProductos"], queryFn: fetchAdminProductos,
        enabled: !guard.loading && !guard.accessDenied
    })

    const deleteMut = useMutation<number, Error, Producto>({
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
            toast.success("Producto eliminado")
            qc.invalidateQueries({ queryKey: ["adminProductos"] })
        },
        onError: (err: Error) => {
            toast.error(err.message || "Error al eliminar")
        }
    })

    const handleDelete = async (producto: Producto) => {
        if (!confirm(`¿Eliminar permanentemente "${producto.nombre}"?`)) return
        deleteMut.mutate(producto)
    }

    const filtered = useMemo(() => {
        if (!searchTerm) return productos
        const st = searchTerm.toLowerCase()
        return productos.filter((p: Producto) => p.nombre?.toLowerCase().includes(st))
    }, [productos, searchTerm])

    if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={0} tableColumns={5} tableRows={8} />
    if (guard.accessDenied) return <AccessDenied />

    return (
        <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            <AdminPageHeader icon={<Box size={28} strokeWidth={1.5}/>} iconColor="bg-blue-600" iconShadow="shadow-blue-200" title="Productos" subtitle="Catálogo principal de la tienda" totalItems={productos.length} totalLabel="productos registrados" isFetching={isFetching} dotColor="bg-blue-500"
                actions={<>
                    <Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-2xl h-14 px-6 font-bold" onClick={()=>qc.invalidateQueries({queryKey:["adminProductos"]})} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar
                    </Button>
                    <Button asChild className="gap-2 haptic-scale shadow-lg rounded-2xl h-14 px-6 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                        <Link href="/admin/productos/nuevo"><Plus className="h-5 w-5"/>Nuevo Ítem</Link>
                    </Button>
                </>}
            />

            <m.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-300"/>
                    <Input placeholder="Buscar producto por nombre..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-12 h-12 border-0 bg-slate-50 rounded-[1.25rem] font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-200"/>
                </div>
            </m.div>

            <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-16 hover:bg-transparent border-slate-100">
                            {["Imagen","Producto","Precio Actual","Inventario","Gestión"].map((h,i)=>(<TableHead key={h} className={`font-black text-[11px] uppercase tracking-widest text-slate-400 ${i===0?'pl-8':i===4?'pr-8 text-right':''}`}>{h}</TableHead>))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((producto: Producto, index: number) => (
                                <m.tr key={producto.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:index*0.03}} className={`h-[88px] group hover:bg-slate-50/80 transition-colors border-slate-50 ${deleteMut.isPending&&deleteMut.variables?.id===producto.id?"opacity-50 pointer-events-none":""}`}>
                                    <TableCell className="pl-8">
                                        <div className="relative h-14 w-14 bg-slate-100 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-md transition-all duration-500">
                                            {producto.imagen_url ? (
                                                <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="56px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-5 w-5 text-slate-300"/></div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col"><span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{producto.nombre}</span><span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">ID: #{producto.id}</span></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col"><span className="text-lg font-black text-slate-900 tracking-tight">{formatCurrency(producto.precio)}</span>{producto.precio_antes!=null&&Number(producto.precio_antes)>Number(producto.precio)&&(<span className="text-xs text-slate-400 line-through font-medium">{formatCurrency(producto.precio_antes)}</span>)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-16 rounded-full overflow-hidden bg-slate-100"><div className={`h-full transition-all duration-1000 ${producto.stock>10?'bg-emerald-500':producto.stock>0?'bg-amber-500':'bg-rose-500'}`} style={{width:`${Math.min(100,(producto.stock/20)*100)}%`}}/></div>
                                            <span className={`text-xs font-black uppercase tracking-widest ${producto.stock>10?'text-emerald-600':producto.stock>0?'text-amber-600':'text-rose-600'}`}>{producto.stock} uds</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" className="h-10 px-4 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold gap-2 transition-all group/btn">
                                                <Link href={`/admin/productos/${producto.id}/editar`}><Edit className="h-4 w-4"/><span className="hidden sm:inline">Editar</span><ArrowRight className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 translate-x-[-4px] group-hover/btn:translate-x-0 transition-all"/></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all" onClick={()=>handleDelete(producto)} disabled={deleteMut.isPending}>
                                                {deleteMut.isPending&&deleteMut.variables?.id===producto.id?<Loader2 className="h-4 w-4 animate-spin"/>:<Trash2 className="h-4 w-4"/>}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </m.tr>
                            ))}
                        </AnimatePresence>
                        {filtered.length===0&&<TableRow><TableCell colSpan={5} className="text-center py-20"><div className="flex flex-col items-center gap-3 text-slate-400"><Search size={40} strokeWidth={1}/><p className="text-lg font-medium">No se encontraron productos.</p></div></TableCell></TableRow>}
                    </TableBody>
                </Table>
                {filtered.length>0&&<div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mostrando {filtered.length} de {productos.length} ítems</p></div>}
            </m.div>
        </m.div>
    )
}
