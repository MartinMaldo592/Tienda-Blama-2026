"use client"

import Image from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { m, AnimatePresence } from "framer-motion"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Search, Plus, ImageIcon, Trash2, Edit, RefreshCw, Box, ArrowRight, LayoutGrid, List } from "lucide-react"
import { fetchAdminProductosPaginated, deleteFromR2 } from "@/features/admin"
import { deleteProductAction } from "@/features/admin/actions/products"
import { Producto } from "@/features/admin/types"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "sonner"

export default function ProductosPage() {
    const guard = useRoleGuard({ allowedRoles: ['superadmin', 'admin'] })
    const qc = useQueryClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [viewMode, setViewMode] = useState<"table" | "grid">("table")

    const currentPage = Number(searchParams.get("page")) || 1
    const itemsPerPage = 10

    // Debounce del término de búsqueda para no saturar la base de datos
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 300)
        return () => clearTimeout(handler)
    }, [searchTerm])

    const handlePageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newPage > 1) params.set("page", newPage.toString())
        else params.delete("page")
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [searchParams, pathname, router])

    // Cambiar de página al buscar para evitar páginas vacías
    useEffect(() => {
        handlePageChange(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, handlePageChange])

    const { data: queryResult, isLoading, isFetching } = useQuery({
        queryKey: ["adminProductos", currentPage, debouncedSearch],
        queryFn: () => fetchAdminProductosPaginated({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
        enabled: !guard.loading && !guard.accessDenied,
        placeholderData: keepPreviousData
    })

    const productos = queryResult?.productos || []
    const totalItems = queryResult?.totalCount || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1

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

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)
            if (currentPage <= 3) { start = 2; end = 4 }
            else if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1 }
            if (start > 2) pages.push('...')
            for (let i = start; i <= end; i++) pages.push(i)
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    const startIndexDisplay = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const endIndexDisplay = Math.min(totalItems, currentPage * itemsPerPage)

    if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={0} tableColumns={5} tableRows={8} />
    if (guard.accessDenied) return <AccessDenied />

    return (
        <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            <AdminPageHeader icon={<Box size={28} strokeWidth={1.5}/>} iconColor="bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700" iconShadow="shadow-blue-500/20" title="Productos" subtitle="Catálogo principal de la tienda" totalItems={totalItems} totalLabel="productos registrados" isFetching={isFetching} dotColor="bg-blue-500"
                actions={<>
                    <Button variant="outline" className="gap-2 haptic-scale shadow-sm rounded-xl h-11 px-5 font-bold border-slate-200 dark:border-slate-800" onClick={()=>qc.invalidateQueries({queryKey:["adminProductos"]})} disabled={isFetching}>
                        <RefreshCw className={`h-4 w-4 ${isFetching?'animate-spin':''}`}/>Sincronizar
                    </Button>
                    <Button asChild className="gap-2 haptic-scale shadow-lg shadow-blue-600/20 rounded-xl h-11 px-5 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                        <Link href="/admin/productos/nuevo"><Plus className="h-4 w-4"/>Nuevo Ítem</Link>
                    </Button>
                </>}
            />

            <m.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-300"/>
                    <Input placeholder="Buscar producto por nombre..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-12 h-12 border-0 bg-slate-50 dark:bg-slate-800 rounded-[1.25rem] font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-200"/>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0 self-end sm:self-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-9 px-3 rounded-xl font-bold text-xs gap-1.5 ${viewMode === "table" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}
                        onClick={() => setViewMode("table")}
                    >
                        <List size={16} /> Tabla
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-9 px-3 rounded-xl font-bold text-xs gap-1.5 ${viewMode === "grid" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}
                        onClick={() => setViewMode("grid")}
                    >
                        <LayoutGrid size={16} /> Rejilla
                    </Button>
                </div>
            </m.div>

            {viewMode === "grid" ? (
                <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productos.map((producto: Producto, index: number) => (
                        <m.div key={producto.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:index*0.04}} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between">
                            <div className="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                {producto.imagen_url ? (
                                    <Image src={producto.imagen_url} alt={producto.nombre} fill loader={cloudinaryLoader} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 300px" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                                )}
                                <span className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-md ${producto.stock > 10 ? 'bg-emerald-500/90 text-white' : producto.stock > 0 ? 'bg-amber-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                                    {producto.stock} uds
                                </span>
                            </div>
                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors text-base">{producto.nombre}</h3>
                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">ID: #{producto.id}</span>
                                </div>

                                <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(producto.precio)}</span>
                                        {producto.precio_antes != null && Number(producto.precio_antes) > Number(producto.precio) && (
                                            <span className="text-xs text-slate-400 line-through block font-medium">{formatCurrency(producto.precio_antes)}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600">
                                            <Link href={`/admin/productos/${producto.id}/editar`}><Edit size={16} /></Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600" onClick={()=>handleDelete(producto)} disabled={deleteMut.isPending}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    ))}
                </m.div>
            ) : (
                <m.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="h-16 hover:bg-transparent border-slate-100">
                                {["Imagen","Producto","Precio Actual","Inventario","Gestión"].map((h,i)=>(<TableHead key={h} className={`font-black text-[11px] uppercase tracking-widest text-slate-400 ${i===0?'pl-8':i===4?'pr-8 text-right':''}`}>{h}</TableHead>))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {productos.map((producto: Producto, index: number) => (
                                    <m.tr key={producto.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{delay:index*0.03}} className={`h-[88px] group hover:bg-slate-50/80 transition-colors border-slate-50 ${deleteMut.isPending&&deleteMut.variables?.id===producto.id?"opacity-50 pointer-events-none":""}`}>
                                        <TableCell className="pl-8">
                                            <div className="relative h-14 w-14 bg-slate-100 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-md transition-all duration-500">
                                                {producto.imagen_url ? (
                                                    <Image src={producto.imagen_url} alt={producto.nombre} fill loader={cloudinaryLoader} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="56px" />
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
                            {productos.length===0&&<TableRow><TableCell colSpan={5} className="text-center py-20"><div className="flex flex-col items-center gap-3 text-slate-400"><Search size={40} strokeWidth={1}/><p className="text-lg font-medium">No se encontraron productos.</p></div></TableCell></TableRow>}
                        </TableBody>
                    </Table>

                    {/* Sección de Paginación */}
                    {totalPages > 1 && (
                        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Mostrando {startIndexDisplay}-{endIndexDisplay} de {totalItems} productos
                            </p>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-xl font-bold text-xs"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                {getPageNumbers().map((p, idx) => (
                                    <Button
                                        key={idx}
                                        variant={p === currentPage ? "default" : "outline"}
                                        size="sm"
                                        className={`h-9 w-9 rounded-xl font-bold text-xs ${p === '...' ? 'pointer-events-none border-none' : ''}`}
                                        onClick={() => typeof p === 'number' && handlePageChange(p)}
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-xl font-bold text-xs"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}
                    {productos.length > 0 && totalPages <= 1 && (
                        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Mostrando {productos.length} de {totalItems} productos
                            </p>
                        </div>
                    )}
                </m.div>
            )}
        </m.div>
    )
}
