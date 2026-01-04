"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
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

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ProductForm } from "@/components/admin/product-form"

import { formatCurrency } from "@/lib/utils"

import { Plus, Search, Edit, Trash2, Image as ImageIcon, ShieldAlert } from "lucide-react"

export default function ProductosPage() {
    const router = useRouter()
    const [productos, setProductos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [accessDenied, setAccessDenied] = useState(false)

    useEffect(() => {
        checkAccess()
    }, [])

    async function checkAccess() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/auth/login')
            return
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        const role = profile?.role || 'worker'
        setUserRole(role)

        // Workers don't have access to inventory
        if (role === 'worker') {
            setAccessDenied(true)
            setLoading(false)
            return
        }

        fetchProductos()
    }

    async function fetchProductos() {
        setLoading(true)
        const { data } = await supabase
            .from('productos')
            .select('*')
            .order('id', { ascending: true })
        if (data) setProductos(data)
        setLoading(false)
    }

    const handleProductSaved = () => {
        setIsSheetOpen(false)
        setEditingProduct(null)
        fetchProductos()
    }

    const handleEdit = (producto: any) => {
        setEditingProduct(producto)
        setIsSheetOpen(true)
    }

    const handleNew = () => {
        setEditingProduct(null)
        setIsSheetOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return

        const { error } = await supabase.from('productos').delete().eq('id', id)

        if (error) {
            alert("Error al eliminar: " + error.message)
        } else {
            fetchProductos()
        }
    }

    // Access Denied View for Workers
    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
                <p className="text-gray-500 max-w-md mb-6">
                    No tienes permisos para acceder al inventario. Esta sección está disponible solo para administradores.
                </p>
                <Button onClick={() => router.push('/admin/dashboard')}>
                    Volver al Dashboard
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500">Administra el inventario de tu tienda.</p>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                    setIsSheetOpen(open)
                    if (!open) setEditingProduct(null)
                }}>
                    <SheetTrigger asChild>
                        <Button className="bg-black text-white gap-2 hover:bg-gray-800" onClick={handleNew}>
                            <Plus className="h-4 w-4" /> Nuevo Producto
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto sm:max-w-lg">
                        <SheetHeader>
                            <SheetTitle>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</SheetTitle>
                        </SheetHeader>
                        <ProductForm
                            productToEdit={editingProduct}
                            onSuccess={handleProductSaved}
                            onCancel={() => setIsSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex gap-2 bg-white p-4 rounded-xl shadow-sm border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar produto..." className="pl-9 border-gray-200" />
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Cargando...</TableCell>
                            </TableRow>
                        ) : productos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">No hay productos.</TableCell>
                            </TableRow>
                        ) : (
                            productos.map((producto) => (
                                <TableRow key={producto.id}>
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
                                    <TableCell>{formatCurrency(producto.precio)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {producto.stock} un.
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => handleEdit(producto)}>
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDelete(producto.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
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
