import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
    Search, Plus, Trash2, Loader2, AlertCircle, 
    UploadCloud, User, MapPin, ShoppingCart, CreditCard 
} from "lucide-react"
import { toast } from "sonner"
import { 
    fetchActiveProductsForOrder, 
    createManualPedido, 
    ManualPedidoItem 
} from "@/features/admin/services/pedidos.client"
import { uploadToR2 } from "@/features/admin/services/storage.client"
import { formatCurrency } from "@/lib/utils"

interface CreateOrderModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

interface SelectedItem {
    id: string // unique React key (productId + variantId)
    producto_id: number
    producto_variante_id: number | null
    producto_nombre: string
    variante_nombre: string | null
    cantidad: number
    precio_unitario: number
    maxStock: number
    imagen_url?: string | null
}

export function CreateOrderModal({ open, onOpenChange, onSuccess }: CreateOrderModalProps) {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)

    // Form states
    const [clienteNombre, setClienteNombre] = useState("")
    const [clienteTelefono, setClienteTelefono] = useState("")
    const [clienteDni, setClienteDni] = useState("")
    const [clienteEmail, setClienteEmail] = useState("")
    const [clienteDireccion, setClienteDireccion] = useState("")
    const [clienteDepartamento, setClienteDepartamento] = useState("")
    const [clienteProvincia, setClienteProvincia] = useState("")
    const [clienteDistrito, setClienteDistrito] = useState("")
    const [clienteReferencia, setClienteReferencia] = useState("")
    const [clienteLinkUbicacion, setClienteLinkUbicacion] = useState("")

    const [origen, setOrigen] = useState("Manual")
    const [status, setStatus] = useState("Confirmado")
    const [pagoStatus, setPagoStatus] = useState("Pagado")
    const [metodoEnvio, setMetodoEnvio] = useState("Lima Contraentrega")
    const [metodoPago, setMetodoPago] = useState("Yape")
    const [costoEnvio, setCostoEnvio] = useState(0)
    const [descuento, setDescuento] = useState(0)

    // Items list
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

    // Product search inside modal
    const [searchTerm, setSearchTerm] = useState("")
    const [showResults, setShowResults] = useState(false)

    // Voucher files upload
    const [vouchers, setVouchers] = useState<string[]>([])
    const [uploadingVoucher, setUploadingVoucher] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    useEffect(() => {
        if (open) {
            loadProducts()
            resetForm()
        }
    }, [open])

    const loadProducts = async () => {
        try {
            setLoadingProducts(true)
            const data = await fetchActiveProductsForOrder()
            setProducts(data)
        } catch (err) {
            console.error("Error loading products:", err)
            toast.error("No se pudieron cargar los productos.")
        } finally {
            setLoadingProducts(false)
        }
    }

    const resetForm = () => {
        setClienteNombre("")
        setClienteTelefono("")
        setClienteDni("")
        setClienteEmail("")
        setClienteDireccion("")
        setClienteDepartamento("")
        setClienteProvincia("")
        setClienteDistrito("")
        setClienteReferencia("")
        setClienteLinkUbicacion("")
        setOrigen("Manual")
        setStatus("Confirmado")
        setPagoStatus("Pagado")
        setMetodoEnvio("Lima Contraentrega")
        setMetodoPago("Yape")
        setCostoEnvio(0)
        setDescuento(0)
        setSelectedItems([])
        setVouchers([])
        setSearchTerm("")
        setShowResults(false)
    }

    // Filter products based on search term
    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddItem = (product: any, variant: any = null) => {
        const itemId = variant ? `${product.id}-${variant.id}` : `${product.id}-null`
        
        // Check if already added
        const exists = selectedItems.find(item => item.id === itemId)
        if (exists) {
            toast.warning("Este producto ya está agregado. Puedes ajustar la cantidad en la lista.")
            return
        }

        const maxStock = variant ? variant.stock : product.stock
        const price = variant && variant.precio ? variant.precio : product.precio
        const variantName = variant ? variant.etiqueta : null

        const newItem: SelectedItem = {
            id: itemId,
            producto_id: product.id,
            producto_variante_id: variant ? variant.id : null,
            producto_nombre: product.nombre,
            variante_nombre: variantName,
            cantidad: 1,
            precio_unitario: price,
            maxStock: maxStock,
            imagen_url: product.imagen_url
        }

        setSelectedItems([...selectedItems, newItem])
        setSearchTerm("")
        setShowResults(false)
        toast.success("Producto agregado al pedido.")
    }

    const handleQuantityChange = (id: string, val: number) => {
        setSelectedItems(selectedItems.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, val)
                return { ...item, cantidad: newQty }
            }
            return item
        }))
    }

    const handlePriceChange = (id: string, val: number) => {
        setSelectedItems(selectedItems.map(item => {
            if (item.id === id) {
                return { ...item, precio_unitario: Math.max(0, val) }
            }
            return item
        }))
    }

    const handleRemoveItem = (id: string) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id))
    }

    const handleVoucherUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingVoucher(true)
        setUploadProgress(10)

        try {
            const file = files[0]
            const url = await uploadToR2(file, (percent) => {
                setUploadProgress(percent)
            })

            if (url) {
                setVouchers([...vouchers, url])
                toast.success("Comprobante subido correctamente.")
            } else {
                toast.error("Error al subir el comprobante.")
            }
        } catch (err) {
            console.error("Voucher upload error:", err)
            toast.error("Error en la subida del comprobante.")
        } finally {
            setUploadingVoucher(false)
            setUploadProgress(0)
        }
    }

    const handleRemoveVoucher = (index: number) => {
        setVouchers(vouchers.filter((_, i) => i !== index))
    }

    // Calculations
    const subtotal = selectedItems.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0)
    const total = Math.max(0, subtotal - descuento + Number(costoEnvio))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!clienteNombre.trim()) return toast.error("El nombre del cliente es obligatorio.")
        if (!clienteTelefono.trim()) return toast.error("El teléfono del cliente es obligatorio.")
        if (!clienteDni.trim()) return toast.error("El DNI/Documento del cliente es obligatorio.")
        if (!clienteDireccion.trim()) return toast.error("La dirección de entrega es obligatoria.")
        if (!clienteDepartamento.trim()) return toast.error("El departamento es obligatorio.")
        if (!clienteProvincia.trim()) return toast.error("La provincia es obligatoria.")
        if (!clienteDistrito.trim()) return toast.error("El distrito es obligatorio.")
        if (selectedItems.length === 0) return toast.error("Debes agregar al menos un producto al pedido.")

        try {
            setLoading(true)

            const formattedItems: ManualPedidoItem[] = selectedItems.map(item => ({
                producto_id: item.producto_id,
                producto_variante_id: item.producto_variante_id,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                producto_nombre: item.producto_nombre,
                variante_nombre: item.variante_nombre
            }))

            await createManualPedido({
                cliente_nombre: clienteNombre,
                cliente_telefono: clienteTelefono,
                cliente_dni: clienteDni,
                cliente_email: clienteEmail,
                cliente_direccion: clienteDireccion,
                cliente_departamento: clienteDepartamento,
                cliente_provincia: clienteProvincia,
                cliente_distrito: clienteDistrito,
                cliente_referencia: clienteReferencia,
                cliente_link_ubicacion: clienteLinkUbicacion,
                origen,
                status,
                pago_status: pagoStatus,
                metodo_envio: metodoEnvio,
                metodo_pago: metodoPago,
                comprobante_pago_url: vouchers,
                costo_envio: Number(costoEnvio),
                descuento: Number(descuento),
                subtotal,
                total,
                items: formattedItems
            })

            toast.success("¡Pedido manual creado exitosamente!")
            onSuccess()
            onOpenChange(false)
        } catch (err: any) {
            console.error("Error creating manual order:", err)
            toast.error(err.message || "No se pudo crear el pedido.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 border-slate-100 bg-white"
                data-lenis-prevent
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Plus className="h-6 w-6 text-indigo-600" /> Crear Pedido Manual
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulario para ingresar de manera manual la información de un nuevo pedido en el panel de administración.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8 mt-4">
                    {/* SECTION 1: DATOS CLIENTE */}
                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <User className="h-5 w-5 text-slate-400" />
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Datos del Cliente (Nuevo Registro)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Nombre Completo *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Teléfono *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteTelefono} onChange={e => setClienteTelefono(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">DNI / Documento *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteDni} onChange={e => setClienteDni(e.target.value)} required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-3">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email (Opcional)</label>
                                <input 
                                    type="email" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteEmail} onChange={e => setClienteEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: DIRECCION ENVIO */}
                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <MapPin className="h-5 w-5 text-slate-400" />
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Dirección de Envío</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Departamento *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteDepartamento} onChange={e => setClienteDepartamento(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Provincia *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteProvincia} onChange={e => setClienteProvincia(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Distrito *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteDistrito} onChange={e => setClienteDistrito(e.target.value)} required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Dirección (Calle, Av., Mz/Lt) *</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteDireccion} onChange={e => setClienteDireccion(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Referencia de Dirección</label>
                                <input 
                                    type="text" 
                                    className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                    value={clienteReferencia} onChange={e => setClienteReferencia(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Link de Ubicación (Google Maps)</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                value={clienteLinkUbicacion} onChange={e => setClienteLinkUbicacion(e.target.value)}
                                placeholder="https://maps.google.com/..."
                            />
                        </div>
                    </div>

                    {/* SECTION 3: PRODUCT SELECTOR */}
                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <ShoppingCart className="h-5 w-5 text-slate-400" />
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Productos Seleccionados</h3>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                placeholder="Escribe el nombre del producto..."
                                value={searchTerm}
                                onChange={e => {
                                    setSearchTerm(e.target.value)
                                    setShowResults(true)
                                }}
                                onFocus={() => setShowResults(true)}
                            />

                            {showResults && searchTerm.trim().length > 0 && (
                                <div className="absolute z-30 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2">
                                    {loadingProducts ? (
                                        <div className="p-4 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Cargando catálogo...</div>
                                    ) : filteredProducts.length === 0 ? (
                                        <div className="p-4 text-center text-xs font-bold text-slate-400">No se encontraron productos.</div>
                                    ) : (
                                        filteredProducts.map((p) => (
                                            <div key={p.id} className="border-b border-slate-50 last:border-0 pb-1">
                                                {p.variants && p.variants.length > 0 ? (
                                                    p.variants.map((v: any) => (
                                                        <button
                                                            key={v.id}
                                                            type="button"
                                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-all"
                                                            onClick={() => handleAddItem(p, v)}
                                                        >
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                                                                <p className="text-xs text-slate-400 font-medium">{v.etiqueta}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs font-black text-indigo-600">{formatCurrency(v.precio || p.precio)}</p>
                                                                <p className={`text-[10px] font-bold ${v.stock <= 0 ? 'text-rose-500':'text-emerald-500'}`}>Stock: {v.stock}</p>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-all"
                                                        onClick={() => handleAddItem(p)}
                                                    >
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                                                            <p className="text-xs text-slate-400 font-medium">Estándar</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-black text-indigo-600">{formatCurrency(p.precio)}</p>
                                                            <p className={`text-[10px] font-bold ${p.stock <= 0 ? 'text-rose-500':'text-emerald-500'}`}>Stock: {p.stock}</p>
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Selected items table */}
                        {selectedItems.length === 0 ? (
                            <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
                                <AlertCircle className="h-8 w-8 text-slate-300" />
                                No has agregado ningún producto todavía. Usa el buscador de arriba.
                            </div>
                        ) : (
                            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Producto</th>
                                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-[120px]">Precio Unitario</th>
                                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-[100px]">Cantidad</th>
                                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-[120px]">Total</th>
                                            <th className="p-4 w-[60px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {item.imagen_url && (
                                                            <img 
                                                                src={item.imagen_url} 
                                                                alt="" 
                                                                className="h-10 w-10 object-cover rounded-lg border border-slate-100" 
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm">{item.producto_nombre}</p>
                                                            {item.variante_nombre && (
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.variante_nombre}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-slate-400 text-xs font-bold">S/</span>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                                                            value={item.precio_unitario}
                                                            onChange={e => handlePriceChange(item.id, Number(e.target.value))}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <input 
                                                        type="number" 
                                                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                                                        value={item.cantidad}
                                                        onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-4 font-black text-slate-900 text-sm">
                                                    {formatCurrency(item.precio_unitario * item.cantidad)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        type="button" 
                                                        className="text-rose-500 hover:text-rose-700 transition-colors"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* SECTION 4: DETALLES DE VENTA Y PAGO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column: payment & shipment options */}
                        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <CreditCard className="h-5 w-5 text-slate-400" />
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Detalles de Venta y Pago</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Canal de Venta *</label>
                                    <select 
                                        className="w-full mt-1 px-3 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                        value={origen} onChange={e => setOrigen(e.target.value)}
                                    >
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="TikTok">TikTok Chat</option>
                                        <option value="Instagram">Instagram DM</option>
                                        <option value="Messenger">Facebook Messenger</option>
                                        <option value="Manual">Manual / Físico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Estado Pedido *</label>
                                    <select 
                                        className="w-full mt-1 px-3 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                        value={status} onChange={e => setStatus(e.target.value)}
                                    >
                                        <option value="Confirmado">Confirmado</option>
                                        <option value="Preparando">Preparando</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Llegó a Agencia">Llegó a Agencia</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Pendiente">Pendiente (No descontar stock)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Estado Pago *</label>
                                    <select 
                                        className="w-full mt-1 px-3 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                        value={pagoStatus} onChange={e => setPagoStatus(e.target.value)}
                                    >
                                        <option value="Pagado">Pagado</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Pago Contraentrega">Pago Contraentrega</option>
                                        <option value="Pago Parcial">Pago Parcial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Método Pago *</label>
                                    <select 
                                        className="w-full mt-1 px-3 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                        value={metodoPago} onChange={e => setMetodoPago(e.target.value)}
                                    >
                                        <option value="Yape">Yape</option>
                                        <option value="Plin">Plin</option>
                                        <option value="Transferencia BCP">Transferencia BCP</option>
                                        <option value="Transferencia Interbank">Transferencia Interbank</option>
                                        <option value="Transferencia BBVA">Transferencia BBVA</option>
                                        <option value="Efectivo / Contraentrega">Efectivo</option>
                                        <option value="Culqi / Tarjeta">Tarjeta de Crédito</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Método Envío *</label>
                                    <select 
                                        className="w-full mt-1 px-3 h-12 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                        value={metodoEnvio} onChange={e => setMetodoEnvio(e.target.value)}
                                    >
                                        <option value="Lima Contraentrega">Lima Contraentrega</option>
                                        <option value="Provincia - Shalom (Pago en destino)">Provincia - Shalom (Pago Destino)</option>
                                        <option value="Provincia - Shalom (Pago anticipado)">Provincia - Shalom (Pago Anticipado)</option>
                                        <option value="Provincia - Olva Courier">Provincia - Olva Courier</option>
                                    </select>
                                </div>
                            </div>

                            {/* Vouchers section */}
                            <div className="pt-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Comprobantes de Pago (Yape/Plin/Voucher)</label>
                                <div className="mt-2 flex flex-wrap gap-2 items-center">
                                    {vouchers.map((url, i) => (
                                        <div key={i} className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-200">
                                            <img src={url} alt="" className="h-full w-full object-cover" />
                                            <button 
                                                type="button" 
                                                className="absolute top-0 right-0 bg-rose-500 text-white rounded-bl-lg p-0.5"
                                                onClick={() => handleRemoveVoucher(i)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    <label className={`h-14 w-14 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all ${uploadingVoucher ? 'pointer-events-none opacity-50':''}`}>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleVoucherUpload}
                                            disabled={uploadingVoucher}
                                        />
                                        {uploadingVoucher ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="animate-spin h-4 w-4" />
                                                <span className="text-[8px] font-black mt-0.5">{uploadProgress}%</span>
                                            </div>
                                        ) : (
                                            <UploadCloud className="h-5 w-5" />
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right column: summary card */}
                        <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl shadow-slate-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">Resumen del Pedido</h3>
                                
                                <div className="space-y-3 mt-6">
                                    <div className="flex justify-between text-sm font-medium text-slate-300">
                                        <span>Subtotal ({selectedItems.reduce((acc, item) => acc + item.cantidad, 0)} items)</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                                        <span>Descuento Manual</span>
                                        <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-700">
                                            <span className="text-[10px] text-slate-400 font-bold">S/</span>
                                            <input 
                                                type="number" 
                                                className="w-16 bg-transparent border-0 text-white text-xs font-bold focus:outline-none focus:ring-0 p-0 text-right"
                                                value={descuento}
                                                onChange={e => setDescuento(Math.max(0, Number(e.target.value)))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                                        <span>Costo de Envío</span>
                                        <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-700">
                                            <span className="text-[10px] text-slate-400 font-bold">S/</span>
                                            <input 
                                                type="number" 
                                                className="w-16 bg-transparent border-0 text-white text-xs font-bold focus:outline-none focus:ring-0 p-0 text-right"
                                                value={costoEnvio}
                                                onChange={e => setCostoEnvio(Math.max(0, Number(e.target.value)))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-800 pt-6 mt-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total a Cobrar</span>
                                    <span className="text-3xl font-black tracking-tight text-white">{formatCurrency(total)}</span>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full mt-6 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-tight rounded-2xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 text-base haptic-scale"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5" /> Registrando Pedido...
                                        </>
                                    ) : (
                                        "Guardar Pedido"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
