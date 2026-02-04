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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, Save, UserCheck, MessageCircle, FileUp, ExternalLink, Trash2, Pencil, Check, RotateCcw, AlertCircle, ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
// import types
import { PedidoRow, PedidoItemRow, ProfileRow, PedidoLog } from "@/features/admin/types"
import { assignPedidoToWorker, fetchAdminWorkers, fetchPedidoDetail, updatePedidoStatusWithStock } from "@/features/admin"
import { supabase } from "@/lib/supabaseClient"

export default function PedidoDetallePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })

    const [pedido, setPedido] = useState<PedidoRow | null>(null)
    const [items, setItems] = useState<PedidoItemRow[]>([])
    const [workers, setWorkers] = useState<ProfileRow[]>([])
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
            toast.error('No tienes permisos para realizar esta acción.')
            return true
        }

        toast.error(fallbackMessage + msg)
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
            setStatus(detail.pedido.status || '')
            setAssignedTo(detail.pedido.asignado_a || 'unassigned')
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
            toast.success("Trabajador asignado correctamente")
        } catch (error: any) {
            showPermissionAlertIfNeeded(error, 'Error al asignar: ')
        }
    }

    const [logs, setLogs] = useState<PedidoLog[]>([])
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

    // --- State for Confirmation Dialogs ---
    const [confirmDeleteGuideOpen, setConfirmDeleteGuideOpen] = useState(false)
    const [confirmDeletePaymentIndex, setConfirmDeletePaymentIndex] = useState<number | null>(null)

    // Partial Return State
    const [returnModalState, setReturnModalState] = useState<{
        isOpen: boolean;
        itemId: number | null;
        maxReturn: number;
        productName: string;
        currentQty: number; // to validate input logic
    }>({ isOpen: false, itemId: null, maxReturn: 0, productName: '', currentQty: 0 })
    const [returnQtyInput, setReturnQtyInput] = useState<string>('')


    // --- Tracking Code Logic ---
    const [trackingCode, setTrackingCode] = useState("")
    const [shalomOrder, setShalomOrder] = useState("")
    const [shalomPass, setShalomPass] = useState("")
    const [useShalomFormat, setUseShalomFormat] = useState(false)
    const [savingTracking, setSavingTracking] = useState(false)

    // --- Client Edit Logic ---
    const [isEditClientOpen, setIsEditClientOpen] = useState(false)
    const [clientForm, setClientForm] = useState({
        nombre: '',
        dni: '',
        telefono: '',
        direccion: '',
        distrito: '',
        provincia: '',
        departamento: '',
        referencia: '',
        metodo_envio: '' // Added field
    })

    useEffect(() => {
        if (pedido) {
            setTrackingCode(pedido.codigo_seguimiento || "")

            // Always use Shalom format variables
            if (pedido.shalom_orden || pedido.shalom_clave) {
                setShalomOrder(pedido.shalom_orden || "")
                setShalomPass(pedido.shalom_clave || "")
            } else {
                // Fallback attempt to parse legacy simple strings if they happen to look like pipe separated
                const parts = (pedido.codigo_seguimiento || "").split('|')
                setShalomOrder(parts[0] || "")
                setShalomPass(parts[1] || "")
            }

            setClientForm({
                nombre: pedido.nombre_contacto || pedido.clientes?.nombre || '',
                dni: pedido.dni_contacto || pedido.clientes?.dni || '',
                telefono: pedido.telefono_contacto || pedido.clientes?.telefono || '',
                direccion: pedido.direccion_calle || pedido.clientes?.direccion || '',
                distrito: pedido.distrito || '',
                provincia: pedido.provincia || '',
                departamento: pedido.departamento || '',
                referencia: pedido.referencia_direccion || '',
                metodo_envio: pedido.metodo_envio || '' // Populate field
            })
        }
    }, [pedido])

    async function handleSaveTracking() {
        setSavingTracking(true)
        try {
            let updatePayload: any = {}
            let logMsg = ""

            // Always save as Shalom format logic
            const combined = `${shalomOrder}|${shalomPass}`
            updatePayload = {
                codigo_seguimiento: combined,
                shalom_orden: shalomOrder,
                shalom_clave: shalomPass
            }
            logMsg = `Tracking: Orden ${shalomOrder}, Clave ${shalomPass}`

            const { error } = await supabase
                .from('pedidos')
                .update(updatePayload)
                .eq('id', id)

            if (error) throw error

            const displayCode = updatePayload.codigo_seguimiento
            setTrackingCode(displayCode)
            await logAction('Tracking Actualizado', logMsg)
            toast.success("Código de seguimiento guardado")
            fetchPedido()
        } catch (error: any) {
            toast.error("Error guardando tracking: " + error.message)
        } finally {
            setSavingTracking(false)
        }
    }

    async function handleSaveClientData() {
        try {
            const { error } = await supabase
                .from('pedidos')
                .update({
                    nombre_contacto: clientForm.nombre,
                    dni_contacto: clientForm.dni,
                    telefono_contacto: clientForm.telefono,
                    direccion_calle: clientForm.direccion,
                    distrito: clientForm.distrito,
                    provincia: clientForm.provincia,
                    departamento: clientForm.departamento,
                    referencia_direccion: clientForm.referencia,
                    metodo_envio: clientForm.metodo_envio // Save field
                })
                .eq('id', id)

            if (error) throw error

            await logAction('Datos Cliente Editados', `Se actualizaron datos de entrega/contacto`)
            toast.success("Datos actualizados correctamente")
            setIsEditClientOpen(false)
            fetchPedido()
        } catch (error: any) {
            toast.error("Error actualizando datos: " + error.message)
        }
    }

    // --- Locking Logic (Security) ---
    const isLocked = (() => {
        if (!pedido || userRole === 'admin') return false

        const terminalStates = ['Entregado', 'Enviado', 'Fallido']
        if (!terminalStates.includes(pedido.status)) return false

        // Check time: 3 days = 72 hours * 60 * 60 * 1000
        const updateTime = new Date(pedido.updated_at || pedido.created_at).getTime()
        const now = Date.now()
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000

        return (now - updateTime) > threeDaysMs
    })()

    // --- Partial Return Logic (Refactored for Dialog) ---
    function openReturnDialog(itemId: number, currentQty: number, alreadyReturned: number, productName: string) {
        if (isLocked) return

        const maxReturn = currentQty - alreadyReturned
        if (maxReturn <= 0) {
            toast.error("Este producto ya fue devuelto en su totalidad.")
            return
        }

        setReturnModalState({
            isOpen: true,
            itemId,
            maxReturn,
            productName,
            currentQty: 1 // default
        })
        setReturnQtyInput('1')
    }

    async function processPartialReturn() {
        const { itemId, maxReturn } = returnModalState
        const qty = parseInt(returnQtyInput)

        if (!itemId || isNaN(qty) || qty <= 0 || qty > maxReturn) {
            toast.error("Cantidad inválida.")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.rpc('admin_procesar_devolucion_parcial', {
                p_item_id: itemId,
                p_cantidad_a_devolver: qty,
                p_usuario_nombre: currentUser,
                p_pedido_id: Number(id)
            })

            if (error) throw error

            toast.success("Devolución procesada correctamente")
            setReturnModalState(prev => ({ ...prev, isOpen: false }))
            fetchPedido()
        } catch (error: any) {
            console.error("Error devolución:", error)
            toast.error("Error al procesar devolución: " + error.message)
        } finally {
            setLoading(false)
        }
    }


    async function handleUpdateStatus() {
        if (!pedido) return
        setUpdating(true)
        const oldStatus = pedido.status
        try {
            await updatePedidoStatusWithStock({
                pedidoId: Number(id),
                nextStatus: status,
                stockDescontado: Boolean(pedido?.stock_descontado),
            })

            await logAction('Cambio de Estado', `De ${oldStatus} a ${status}`)
            toast.success(`Estado actualizado a ${status}`)
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
            toast.success("Guía subida correctamente")
        } catch (error: any) {
            console.error("Error uploading guide:", error)
            toast.error("Error al subir guía: " + error.message)
        } finally {
            setUploadingGuide(false)
        }
    }

    async function performDeleteGuide() {
        setUploadingGuide(true)
        try {
            const { error } = await supabase
                .from('pedidos')
                .update({ guia_archivo_url: null })
                .eq('id', id)

            if (error) throw error
            fetchPedido()
            toast.success("Guía eliminada")
        } catch (error: any) {
            toast.error("Error al eliminar: " + error.message)
        } finally {
            setUploadingGuide(false)
            setConfirmDeleteGuideOpen(false)
        }
    }


    const [uploadingPayment, setUploadingPayment] = useState(false)

    async function handleUploadPayment(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return
        if (!pedido) return

        // Check current count
        const currentFiles = pedido.comprobante_pago_url || []
        if (currentFiles.length >= 2) {
            toast.error("Solo puedes subir máximo 2 comprobantes.")
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
            toast.success("Comprobante subido correctamente")
        } catch (error: any) {
            console.error("Error uploading payment:", error)
            toast.error("Error al subir comprobante: " + error.message)
        } finally {
            setUploadingPayment(false)
            // Reset input
            e.target.value = ''
        }
    }

    async function performDeletePayment() {
        if (confirmDeletePaymentIndex === null || !pedido) return

        setUploadingPayment(true)
        try {
            const currentFiles = pedido.comprobante_pago_url || []
            const updatedList = currentFiles.filter((_: any, idx: number) => idx !== confirmDeletePaymentIndex)

            const { error } = await supabase
                .from('pedidos')
                .update({ comprobante_pago_url: updatedList.length > 0 ? updatedList : null }) // Set to null if empty
                .eq('id', id)

            if (error) throw error
            fetchPedido()
            toast.success("Comprobante eliminado")
        } catch (error: any) {
            toast.error("Error al eliminar: " + error.message)
        } finally {
            setUploadingPayment(false)
            setConfirmDeletePaymentIndex(null)
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
                        <Select value={status} onValueChange={setStatus} disabled={isLocked || updating}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(() => {
                                    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
                                        'Pendiente': ['Pendiente', 'Confirmado', 'Cancelado', 'Fallido'],
                                        'Confirmado': ['Confirmado', 'Enviado', 'Cancelado', 'Fallido', 'Pendiente'],
                                        'Enviado': ['Enviado', 'Entregado', 'Fallido', 'Confirmado', 'Cancelado'],
                                        'Entregado': ['Entregado', 'Enviado', 'Fallido'],
                                        'Cancelado': ['Cancelado', 'Pendiente'],
                                        'Fallido': ['Fallido', 'Pendiente']
                                    }
                                    const available = ALLOWED_TRANSITIONS[pedido.status] || ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Fallido', 'Cancelado']

                                    return (
                                        <>
                                            {available.includes('Pendiente') && <SelectItem value="Pendiente">Pendiente</SelectItem>}
                                            {available.includes('Confirmado') && <SelectItem value="Confirmado">Confirmado</SelectItem>}
                                            {available.includes('Enviado') && <SelectItem value="Enviado">Enviado</SelectItem>}
                                            {available.includes('Entregado') && <SelectItem value="Entregado">Entregado</SelectItem>}
                                            {available.includes('Fallido') && <SelectItem value="Fallido">Fallido</SelectItem>}
                                            {available.includes('Cancelado') && <SelectItem value="Cancelado">Cancelado</SelectItem>}
                                        </>
                                    )
                                })()}
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleUpdateStatus} disabled={isLocked || updating || status === pedido.status}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stepper Visual */}
            <div className="w-full bg-white border rounded-lg p-6 overflow-hidden">
                <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                    {/* Line Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-0"></div>

                    {/* Steps */}
                    {['Pendiente', 'Confirmado', 'Enviado', 'Entregado'].map((stepStatus, index) => {
                        const allStatuses = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado']
                        const currentIndex = allStatuses.indexOf(pedido.status)
                        const stepIndex = allStatuses.indexOf(stepStatus)

                        const isCompleted = stepIndex <= currentIndex
                        const isCurrent = stepIndex === currentIndex
                        const isCancelled = pedido.status === 'Fallido' || pedido.status === 'Cancelado'

                        let circleClass = "bg-white border-2 border-gray-200 text-gray-400"
                        let textClass = "text-gray-400"

                        if (isCancelled) {
                            circleClass = "bg-red-50 border-2 border-red-200 text-red-400"
                            textClass = "text-red-400"
                        } else if (isCompleted) {
                            circleClass = "bg-green-600 border-green-600 text-white"
                            textClass = "text-green-600 font-medium"
                        }

                        return (
                            <div key={stepStatus} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${circleClass}`}>
                                    {isCompleted && !isCancelled ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                                </div>
                                <span className={`text-xs ${textClass}`}>{stepStatus}</span>
                            </div>
                        )
                    })}
                </div>
                {/* Cancelled Alert in Stepper */}
                {(pedido.status === 'Fallido' || pedido.status === 'Cancelado') && (
                    <div className="mt-4 text-center text-red-600 bg-red-50 p-2 rounded text-sm font-medium">
                        ⛔ Pedido Cancelado / Fallido
                    </div>
                )}
            </div>

            {/* Locked Notice */}
            {isLocked && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700">
                                <strong>Edición Bloqueada:</strong> Este pedido fue finalizado hace más de 3 días. Solo un administrador puede modificarlo.
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                                            <img src={item.productos.imagen_url} alt={item.productos.nombre || "Producto"} className="h-full w-full object-cover" />
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
                                        {/* Partial Return Badge */}
                                        {(item.cantidad_devuelta || 0) > 0 && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                Devuelto: {item.cantidad_devuelta}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <p className="font-medium">{formatCurrency((item.precio_unitario || item.productos?.precio || 0) * (item.cantidad || 0))}</p>
                                        <p className="text-xs text-gray-400">{formatCurrency(item.precio_unitario || item.productos?.precio || 0)} c/u</p>

                                        {/* Return Action Button */}
                                        {!isLocked && (item.cantidad - (item.cantidad_devuelta || 0) > 0) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-[10px] text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                title="Devolver parcialmente"
                                                onClick={() => openReturnDialog(item.id, item.cantidad, item.cantidad_devuelta || 0, item.productos?.nombre || 'Producto')}
                                            >
                                                <RotateCcw className="h-3 w-3 mr-1" /> Devolver
                                            </Button>

                                        )}
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

                            {(pedido.descuento || 0) > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>Descuento {pedido.cupon_codigo ? `(${pedido.cupon_codigo})` : ''}</span>
                                    <span>- {formatCurrency(pedido.descuento || 0)}</span>
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
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <User className="h-5 w-5" /> Cliente
                            </h2>
                            <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
                                <DialogTrigger asChild>
                                    {!isLocked && (
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                                        </Button>
                                    )}
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Editar Datos del Pedido</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nombre</Label>
                                                <Input value={clientForm.nombre} onChange={e => setClientForm({ ...clientForm, nombre: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>DNI</Label>
                                                <Input value={clientForm.dni} onChange={e => setClientForm({ ...clientForm, dni: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Método de Envío</Label>
                                            <Select
                                                value={clientForm.metodo_envio}
                                                onValueChange={(val) => setClientForm({ ...clientForm, metodo_envio: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar método" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lima">Lima (Gratis)</SelectItem>
                                                    <SelectItem value="provincia">Provincia (Shalom)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Teléfono</Label>
                                            <Input value={clientForm.telefono} onChange={e => setClientForm({ ...clientForm, telefono: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Dirección</Label>
                                            <Input value={clientForm.direccion} onChange={e => setClientForm({ ...clientForm, direccion: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Referencia</Label>
                                            <Input value={clientForm.referencia} onChange={e => setClientForm({ ...clientForm, referencia: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Dpto</Label>
                                                <Input className="text-xs" value={clientForm.departamento} onChange={e => setClientForm({ ...clientForm, departamento: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">Prov</Label>
                                                <Input className="text-xs" value={clientForm.provincia} onChange={e => setClientForm({ ...clientForm, provincia: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">Dist</Label>
                                                <Input className="text-xs" value={clientForm.distrito} onChange={e => setClientForm({ ...clientForm, distrito: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSaveClientData}>Guardar Cambios</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nombre</p>
                                <p className="font-medium">{pedido.nombre_contacto || pedido.clientes?.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">DNI</p>
                                <p className="font-medium">{pedido.dni_contacto || pedido.clientes?.dni || '—'}</p>
                            </div>
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


                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <MapPin className="h-5 w-5" /> Envío
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setIsEditClientOpen(true)}
                                disabled={isLocked}
                            >
                                <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                            </Button>
                        </div>

                        {/* Shipping Method */}
                        <div className="border-b pb-3">
                            <p className="text-sm text-gray-500">Método</p>
                            <Badge variant="outline" className="mt-1">
                                {pedido.metodo_envio === 'provincia' ? 'Provincia (Shalom)' : pedido.metodo_envio === 'lima' ? 'Lima (Gratis)' : pedido.metodo_envio || 'Estándar'}
                            </Badge>
                        </div>

                        {/* Tracking Code */}
                        <div className="border-b pb-3">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm text-gray-500">Tracking / Clave de Envío</p>
                                {trackingCode && (
                                    <a
                                        href="https://rastrea.shalom.com.pe/"
                                        target="_blank"
                                        className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        Ver en Shalom <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase">Nº Orden</label>
                                    <Input
                                        className="h-8 text-sm"
                                        placeholder="Ej: 9560819"
                                        value={shalomOrder}
                                        onChange={(e) => setShalomOrder(e.target.value)}
                                        disabled={isLocked}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase">Código</label>
                                    <div className="flex gap-2">
                                        <Input
                                            className="h-8 text-sm"
                                            placeholder="Ej: C7P9"
                                            value={shalomPass}
                                            onChange={(e) => setShalomPass(e.target.value)}
                                            disabled={isLocked}
                                        />
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 border hover:bg-blue-50 hover:text-blue-600 shrink-0" onClick={handleSaveTracking} disabled={savingTracking || isLocked}>
                                            {savingTracking ? <span className="animate-spin">⌛</span> : <Save className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="space-y-3 pt-1">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Departamento</p>
                                    <p className="text-sm font-medium text-gray-900">{pedido.departamento || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Provincia</p>
                                    <p className="text-sm font-medium text-gray-900">{pedido.provincia || '—'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Distrito</p>
                                    <p className="text-sm font-medium text-gray-900">{pedido.distrito || '—'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Dirección Exacta</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5 break-words">
                                    {pedido.direccion_calle || pedido.clientes?.direccion || '—'}
                                </p>
                            </div>

                            {pedido.referencia_direccion && (
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                    <p className="text-[10px] font-bold text-amber-700 mb-1 flex items-center gap-1">
                                        📌 REFERENCIA
                                    </p>
                                    <p className="text-xs text-amber-900 leading-relaxed italic">
                                        &quot;{pedido.referencia_direccion}&quot;
                                    </p>
                                </div>
                            )}
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
                                    <Button variant="outline" className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setConfirmDeleteGuideOpen(true)} disabled={isLocked}>
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
                                    disabled={uploadingGuide || isLocked}
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
                                                    <Button variant="outline" size="sm" className="flex-none h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setConfirmDeletePaymentIndex(index)} disabled={isLocked}>
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
                                                disabled={uploadingPayment || isLocked}
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

            {/* --- Dialogs --- */}

            {/* 1. Delete Guide Confirmation */}
            <Dialog open={confirmDeleteGuideOpen} onOpenChange={setConfirmDeleteGuideOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Guía</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-gray-500">¿Estás seguro que deseas eliminar el archivo de la guía de remisión?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteGuideOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={performDeleteGuide}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. Delete Payment Confirmation */}
            <Dialog open={confirmDeletePaymentIndex !== null} onOpenChange={(open) => !open && setConfirmDeletePaymentIndex(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Comprobante</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-gray-500">¿Estás seguro que deseas eliminar este comprobante de pago?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeletePaymentIndex(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={performDeletePayment}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 3. Partial Return Dialog */}
            <Dialog open={returnModalState.isOpen} onOpenChange={(open) => setReturnModalState(prev => ({ ...prev, isOpen: open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Devolución Parcial</DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                            Producto: <strong>{returnModalState.productName}</strong><br />
                            Máximo disponible para devolver: <strong>{returnModalState.maxReturn}</strong>
                        </div>

                        <div className="space-y-2">
                            <Label>Cantidad a devolver</Label>
                            <Input
                                type="number"
                                min="1"
                                max={returnModalState.maxReturn}
                                value={returnQtyInput}
                                onChange={(e) => setReturnQtyInput(e.target.value)}
                            />
                            <p className="text-xs text-gray-400">
                                Esta acción sumará el stock al inventario automáticamente.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReturnModalState(prev => ({ ...prev, isOpen: false }))}>Cancelar</Button>
                        <Button onClick={processPartialReturn}>
                            Confirmar Devolución
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
        'Enviado': 'bg-purple-100 text-purple-800 border-purple-200',
        'Entregado': 'bg-green-100 text-green-800 border-green-200',
        'Cancelado': 'bg-red-100 text-red-800 border-red-200',
        'Fallido': 'bg-red-100 text-red-800 border-red-200',
    }

    const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-200'

    return (
        <Badge variant="outline" className={`${styles[status] || defaultStyle} border`}>
            {status}
        </Badge>
    )
}
