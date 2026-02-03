
"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, Save, UserCheck, MessageCircle, FileUp, ExternalLink, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { assignPedidoToWorker, fetchAdminWorkers, fetchPedidoDetail, updatePedidoStatusWithStock } from "@/features/admin"
import { supabase } from "@/lib/supabaseClient"

export default function PedidoDetallePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })

    const [pedido, setPedido] = useState<any>(null)
    const [items, setItems] = useState<any[]>([])
    const [workers, setWorkers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [status, setStatus] = useState("")
    const [assignedTo, setAssignedTo] = useState<string>("unassigned")
    const [userRole, setUserRole] = useState<string>('worker')

    function showPermissionAlertIfNeeded(error: any, fallbackMessage: string) {
        const code = String((error as any)?.code || '')
        const msg = String((error as any)?.message || '')
        const lower = msg.toLowerCase()

        if (
            code === '42501' ||
            lower.includes('permission denied') ||
            lower.includes('row level security') ||
            lower.includes('violates row-level security')
        ) {
            alert('No tienes permisos para realizar esta acción.')
            return true
        }

        alert(fallbackMessage + msg)
        return false
    }

    const fetchPedido = useCallback(async () => {
        setLoading(true)

        try {
            const pedidoId = Number(id)
            if (!pedidoId) {
                setPedido(null)
                setItems([])
                setLoading(false)
                return
            }

            const detail = await fetchPedidoDetail(pedidoId)
            setPedido(detail.pedido)
            setStatus(String((detail.pedido as any)?.status || ''))
            setAssignedTo(String((detail.pedido as any)?.asignado_a || 'unassigned'))
            setItems(detail.items)
        } catch (error) {
            console.error("Error fetching pedido:", error)
            setPedido(null)
            setItems([])
        }

        setLoading(false)
    }, [id])

    useEffect(() => {
        if (!id) return
        if (guard.loading || guard.accessDenied) return

        const role = String(guard.role || 'worker')
        setUserRole(role)

            ; (async () => {
                if (role === 'admin') {
                    try {
                        const workersData = await fetchAdminWorkers()
                        setWorkers(workersData)
                    } catch (err) {
                        setWorkers([])
                    }
                } else {
                    setWorkers([])
                }

                await fetchPedido()
            })()
    }, [id, guard.loading, guard.accessDenied, guard.role, fetchPedido])

    async function handleAssignWorker(workerId: string) {
        const assignValue = workerId === 'unassigned' ? null : workerId

        try {
            await assignPedidoToWorker({ pedidoId: Number(id), workerId: assignValue })
            setAssignedTo(workerId)
            fetchPedido()
        } catch (error: any) {
            showPermissionAlertIfNeeded(error, 'Error al asignar: ')
        }
    }

    const [logs, setLogs] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<string>('Sistema')

    useEffect(() => {
        if (!id) return
        fetchPedido()
        fetchLogs()
        getUserName()
    }, [id])

    async function getUserName() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.email) {
            // Try to find profile name or fallback to email part
            const { data: profile } = await supabase.from('profiles').select('nombre').eq('id', user.id).single()
            setCurrentUser(profile?.nombre || user.email.split('@')[0])
        }
    }

    async function fetchLogs() {
        const { data } = await supabase
            .from('pedido_logs')
            .select('*')
            .eq('pedido_id', id)
            .order('created_at', { ascending: false })
        if (data) setLogs(data)
    }

    async function logAction(accion: string, detalles: string) {
        await supabase.from('pedido_logs').insert({
            pedido_id: Number(id),
            usuario_nombre: currentUser,
            accion,
            detalles
        })
        fetchLogs()
    }

    async function handleUpdateStatus() {
        if (!pedido) return
        setUpdating(true)
        const oldStatus = pedido.status
        try {
            await updatePedidoStatusWithStock({
                pedidoId: Number(id),
                nextStatus: status,
                stockDescontado: Boolean((pedido as any)?.stock_descontado),
            })

            await logAction('Cambio de Estado', `De ${oldStatus} a ${status}`)
            alert("Estado actualizado correctamente")
            fetchPedido()
        } catch (err: any) {
            console.error("Error updating status:", err)
            showPermissionAlertIfNeeded(err, 'Error al actualizar: ')
        }
        setUpdating(false)
    }

    const [uploadingGuide, setUploadingGuide] = useState(false)

    async function handleUploadGuide(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        setUploadingGuide(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `pedido_${id}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload to Supabase Storage "guias"
            const { error: uploadError } = await supabase.storage
                .from('guias')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('guias')
                .getPublicUrl(filePath)

            // 3. Update Pedido Row
            const { error: updateError } = await supabase
                .from('pedidos')
                .update({ guia_archivo_url: publicUrl })
                .eq('id', id)

            if (updateError) throw updateError

            fetchPedido()
            alert("Guía subida correctamente")
        } catch (error: any) {
            console.error("Error uploading guide:", error)
            alert("Error al subir guía: " + error.message)
        } finally {
            setUploadingGuide(false)
        }
    }

    async function handleDeleteGuide() {
        if (!confirm("¿Seguró que deseas eliminar la guía?")) return
        setUploadingGuide(true)
        try {
            // We only clear the URL from the DB for now. 
            // Deleting from storage requires parsing the path which we can skip for MVP simplicity or implement if needed.
            const { error } = await supabase
                .from('pedidos')
                .update({ guia_archivo_url: null })
                .eq('id', id)

            if (error) throw error
            fetchPedido()
        } catch (error: any) {
            alert("Error al eliminar: " + error.message)
        } finally {
            setUploadingGuide(false)
        }
    }

    const [uploadingPayment, setUploadingPayment] = useState(false)

    async function handleUploadPayment(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        // Check current count
        const currentFiles = pedido.comprobante_pago_url || []
        if (currentFiles.length >= 2) {
            alert("Solo puedes subir máximo 2 comprobantes.")
            return
        }

        const file = e.target.files[0]
        setUploadingPayment(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `pago_${id}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload to Supabase Storage "pagos"
            const { error: uploadError } = await supabase.storage
                .from('pagos')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('pagos')
                .getPublicUrl(filePath)

            // 3. Update Pedido Row (Append to Array)
            // Ideally we do this atomically but for now update via read-modify-write pattern with state
            const updatedList = [...currentFiles, publicUrl]

            const { error: updateError } = await supabase
                .from('pedidos')
                .update({ comprobante_pago_url: updatedList })
                .eq('id', id)

            if (updateError) throw updateError

            fetchPedido()
            alert("Comprobante subido correctamente")
        } catch (error: any) {
            console.error("Error uploading payment:", error)
            alert("Error al subir comprobante: " + error.message)
        } finally {
            setUploadingPayment(false)
            // Reset input
            e.target.value = ''
        }
    }

    async function handleDeletePayment(indexToDelete: number) {
        if (!confirm("¿Seguró que deseas eliminar este comprobante?")) return
        setUploadingPayment(true)
        try {
            const currentFiles = pedido.comprobante_pago_url || []
            const updatedList = currentFiles.filter((_: any, idx: number) => idx !== indexToDelete)

            const { error } = await supabase
                .from('pedidos')
                .update({ comprobante_pago_url: updatedList.length > 0 ? updatedList : null }) // Set to null if empty
                .eq('id', id)

            if (error) throw error
            fetchPedido()
        } catch (error: any) {
            alert("Error al eliminar: " + error.message)
        } finally {
            setUploadingPayment(false)
        }
    }

    if (guard.loading) return <div className="p-10">Cargando...</div>
    if (guard.accessDenied) return <AccessDenied />

    if (loading) return <div className="p-10 text-center">Cargando pedido...</div>
    if (!pedido) return <div className="p-10 text-center">Pedido no encontrado</div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Pedido #{pedido.id.toString().padStart(6, '0')}
                        <StatusBadge status={pedido.status} />
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Realizado el {new Date(pedido.created_at).toLocaleString()}
                    </p>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/pedidos/${id}/ticket`)}
                    >
                        Descargar ticket
                    </Button>

                    <div className="flex gap-2 items-center bg-white p-2 rounded-lg border shadow-sm">
                        <span className="text-sm font-medium">Estado del pedido:</span>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="Confirmado">Confirmado</SelectItem>
                                <SelectItem value="Enviado">Enviado</SelectItem>
                                <SelectItem value="Entregado">Entregado</SelectItem>
                                <SelectItem value="Fallido">Fallido / Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleUpdateStatus} disabled={updating || status === pedido.status}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Items & History */}
                <div className="md:col-span-2 space-y-6">
                    {/* Products Card */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <ShoppingBagIcon className="h-5 w-5" /> Productos
                        </h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        {item.productos?.imagen_url ? (
                                            <img src={item.productos.imagen_url} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.productos?.nombre || 'Producto eliminado'}</p>
                                        <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                                        {item.variante_nombre && (
                                            <p className="text-xs text-gray-400">Variante: {item.variante_nombre}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency((item.precio_unitario || item.productos?.precio || 0) * (item.cantidad || 0))}</p>
                                        <p className="text-xs text-gray-400">{formatCurrency(item.precio_unitario || item.productos?.precio || 0)} c/u</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Financial Summary */}
                        <div className="mt-6 pt-4 border-t space-y-2">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(pedido.subtotal || pedido.total)}</span>
                            </div>

                            {pedido.descuento > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>Descuento {pedido.cupon_codigo ? `(${pedido.cupon_codigo})` : ''}</span>
                                    <span>- {formatCurrency(pedido.descuento)}</span>
                                </div>
                            )}

                            {/* Shipping Cost Logic Display */}
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Costo de Envío</span>
                                <span>
                                    {pedido.metodo_envio === 'provincia' ? 'Por Pagar (Shalom/Agencia)' : 'Gratis'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(pedido.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity History Card */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Historial de Actividad
                        </h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {logs.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No hay actividad registrada aún.</p>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <div className="text-[10px] font-bold">LOG</div>
                                        </div>

                                        {/* Content Card */}
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-900 text-sm">{log.accion}</div>
                                                <time className="font-caveat font-medium text-xs text-indigo-500">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </time>
                                            </div>
                                            <div className="text-slate-500 text-sm">{log.detalles}</div>
                                            <div className="text-slate-400 text-xs mt-1">Por: {log.usuario_nombre || 'Sistema'}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <User className="h-5 w-5" /> Cliente
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nombre</p>
                                <p className="font-medium">{pedido.nombre_contacto || pedido.clientes?.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">DNI</p>
                                <p className="font-medium">{pedido.dni_contacto || pedido.clientes?.dni || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <a href={`tel:${pedido.telefono_contacto || pedido.clientes?.telefono}`} className="font-medium text-blue-600 hover:underline">
                                        {pedido.telefono_contacto || pedido.clientes?.telefono}
                                    </a>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2 gap-2 text-green-700 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-800"
                                    onClick={() => {
                                        const phone = pedido.telefono_contacto || pedido.clientes?.telefono
                                        if (phone) {
                                            // Ensure clean number and add country code if needed (assuming PE +51)
                                            const clean = String(phone).replace(/\D/g, '')
                                            window.open(`https://wa.me/51${clean}`, '_blank')
                                        }
                                    }}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Chat WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <MapPin className="h-5 w-5" /> Envío
                        </h2>

                        {/* Shipping Method */}
                        <div className="border-b pb-3">
                            <p className="text-sm text-gray-500">Método</p>
                            <Badge variant="outline" className="mt-1">
                                {pedido.metodo_envio === 'provincia' ? 'Provincia (Shalom)' : pedido.metodo_envio === 'lima' ? 'Lima (Gratis)' : pedido.metodo_envio || 'Estándar'}
                            </Badge>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Dirección</p>
                            <div className="font-medium text-sm mt-1 space-y-1">
                                {pedido.direccion_calle ? (
                                    <>
                                        <p>{pedido.direccion_calle}</p>
                                        {(pedido.distrito || pedido.departamento || pedido.provincia) && (
                                            <p className="text-gray-500 text-xs">
                                                {Array.from(new Set([pedido.distrito, pedido.provincia, pedido.departamento].filter(Boolean))).join(", ")}
                                            </p>
                                        )}
                                        {pedido.referencia_direccion && (
                                            <p className="text-gray-500 text-xs italic">Ref: {pedido.referencia_direccion}</p>
                                        )}
                                    </>
                                ) : (
                                    <p>{pedido.clientes?.direccion}</p>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-xs" onClick={() => {
                            const link = pedido.link_ubicacion
                            if (link && link.startsWith('http')) {
                                window.open(link, '_blank')
                            } else {
                                const query = pedido.direccion_calle
                                    ? `${pedido.direccion_calle}, ${pedido.distrito || ''}, ${pedido.departamento || ''}, Peru`
                                    : pedido.clientes?.direccion
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || '')}`, '_blank')
                            }
                        }}>
                            Ver en Google Maps
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <FileUp className="h-5 w-5" /> Evidencia de Envío
                        </h2>
                        {pedido.guia_archivo_url ? (
                            <div className="space-y-3">
                                <div className="p-3 border rounded-lg bg-gray-50 flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded text-blue-600">
                                        <FileUp className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">Guía de Remisión</p>
                                        <p className="text-xs text-gray-500">Documento adjunto</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 gap-2" onClick={() => window.open(pedido.guia_archivo_url || '', '_blank')}>
                                        <ExternalLink className="h-4 w-4" /> Ver
                                    </Button>
                                    <Button variant="outline" className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDeleteGuide}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 border-2 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                                <input
                                    type="file"
                                    id="guide-upload"
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={handleUploadGuide}
                                    disabled={uploadingGuide}
                                />
                                <label htmlFor="guide-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                        <FileUp className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-medium text-blue-600">
                                        {uploadingGuide ? 'Subiendo...' : 'Subir Foto de Guía'}
                                    </span>
                                    <span className="text-xs text-gray-400">PDF o Imagen (Shalom/Olva)</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <CreditCard className="h-5 w-5" /> Pago
                        </h2>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm text-gray-500">Estado de pago</p>
                                <Badge variant="secondary" className="mt-1">
                                    {pedido.pago_status}
                                </Badge>
                            </div>
                            {pedido.cupon_codigo && (
                                <div className="mt-2 pt-2 border-t">
                                    <p className="text-sm text-gray-500">Cupón aplicado</p>
                                    <p className="font-mono text-sm font-bold text-green-700">{pedido.cupon_codigo}</p>
                                </div>
                            )}
                            <div className="mt-2 pt-2 border-t">
                                <p className="text-sm text-gray-500">Stock</p>
                                <p className="text-sm">
                                    {pedido.stock_descontado ?
                                        <span className="text-green-600 flex items-center gap-1">✔ Descontado</span> :
                                        <span className="text-amber-600">⚠ No descontado</span>
                                    }
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-2">Comprobantes de Pago</p>

                                <div className="space-y-3">
                                    {pedido.comprobante_pago_url && Array.isArray(pedido.comprobante_pago_url) && pedido.comprobante_pago_url.length > 0 ? (
                                        pedido.comprobante_pago_url.map((url: string, index: number) => (
                                            <div key={index} className="space-y-2">
                                                <div className="p-2 border rounded bg-gray-50 flex items-center gap-2">
                                                    <div className="bg-green-100 p-1.5 rounded text-green-600">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium truncate">Voucher {index + 1}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => window.open(url, '_blank')}>
                                                        Ver Voucher
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="flex-none h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeletePayment(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : null}

                                    {/* Upload Button - Only show if less than 2 files */}
                                    {(!pedido.comprobante_pago_url || pedido.comprobante_pago_url.length < 2) && (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="payment-upload"
                                                className="hidden"
                                                accept="image/*,.pdf"
                                                onChange={handleUploadPayment}
                                                disabled={uploadingPayment}
                                            />
                                            <label htmlFor="payment-upload" className="cursor-pointer block w-full text-center border border-dashed rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                                <span className="text-xs font-medium text-blue-600">
                                                    {uploadingPayment ? 'Subiendo...' : '+ Subir Voucher/Foto'}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Worker Assignment - Admin Only */}
                    {userRole === 'admin' && (
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <UserCheck className="h-5 w-5" /> Asignación
                            </h2>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Trabajador asignado</p>
                                <Select value={assignedTo} onValueChange={handleAssignWorker}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {pedido.asignado_perfil?.nombre || pedido.asignado_perfil?.email || (
                                                <span className="text-orange-600">Sin asignar</span>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">
                                            <span className="text-gray-500">Sin asignar</span>
                                        </SelectItem>
                                        {workers.map(w => (
                                            <SelectItem key={w.id} value={w.id}>
                                                {w.nombre || w.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {pedido.fecha_asignacion && (
                                <p className="text-xs text-gray-400">
                                    Asignado el {new Date(pedido.fecha_asignacion).toLocaleString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Show assigned worker for workers (read-only) */}
                    {userRole === 'worker' && pedido.asignado_perfil && (
                        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                            <p className="text-xs text-blue-600 font-medium">Este pedido te fue asignado</p>
                            {pedido.fecha_asignacion && (
                                <p className="text-xs text-blue-500 mt-1">
                                    {new Date(pedido.fecha_asignacion).toLocaleString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
        'Entregado': 'bg-green-100 text-green-800 border-green-200',
        'Cancelado': 'bg-red-100 text-red-800 border-red-200',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    )
}

function ShoppingBagIcon({ className }: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
}
