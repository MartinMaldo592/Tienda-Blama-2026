"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRoleGuard } from "@/lib/use-role-guard"
import { useFileUpload } from "@/hooks/use-file-upload"
import { OrderItemsCard } from "@/components/admin/orders/order-items-card"
import { OrderHistoryCard } from "@/components/admin/orders/order-history-card"
import { OrderCustomerCard } from "@/components/admin/orders/order-customer-card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, FileUp, Check, Save, AlertCircle, Camera } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { OrderShippingCard } from "@/components/admin/orders/order-shipping-card"
import { OrderFileCard } from "@/components/admin/orders/order-file-card"
import { OrderPaymentCard } from "@/components/admin/orders/order-payment-card"
import { OrderAssignmentCard } from "@/components/admin/orders/order-assignment-card"
// import types
import { PedidoRow, PedidoItemRow, ProfileRow, PedidoLog } from "@/features/admin/types"
import { assignPedidoToWorker, fetchAdminWorkers, fetchPedidoDetail, updatePedidoStatusWithStock } from "@/features/admin"
import { createClient } from "@/lib/supabase.client"
import { OrderNotesCard } from "@/components/admin/orders/order-notes-card"
import { OrderLabelGenerator } from "@/components/admin/orders/order-label-generator"

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
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.email) {
            const { data: profile } = await supabase.from('usuarios').select('nombre').eq('id', user.id).single()
            setCurrentUser(profile?.nombre || user.email.split('@')[0])
        }
    }

    async function fetchLogs() {
        const supabase = createClient()
        const { data } = await supabase
            .from('pedido_logs')
            .select('*')
            .eq('pedido_id', id)
            .order('created_at', { ascending: false })
        if (data) setLogs(data)
    }

    async function logAction(accion: string, detalles: string) {
        const supabase = createClient()
        await supabase.from('pedido_logs').insert({
            pedido_id: Number(id),
            usuario_nombre: currentUser,
            accion,
            detalles
        })
        fetchLogs()
    }

    // --- State for Confirmation Dialogs ---
    // --- State for Confirmation Dialogs ---
    // Moved dialogs to sub-components, kept here only if needed for global issues
    // const [confirmDeleteGuideOpen, setConfirmDeleteGuideOpen] = useState(false)
    // const [confirmDeleteDeliveryOpen, setConfirmDeleteDeliveryOpen] = useState(false)
    // const [confirmDeletePaymentIndex, setConfirmDeletePaymentIndex] = useState<number | null>(null)

    // Partial Return State
    const [returnModalState, setReturnModalState] = useState<{
        isOpen: boolean;
        itemId: number | null;
        maxReturn: number;
        productName: string;
        currentQty: number; // to validate input logic
    }>({ isOpen: false, itemId: null, maxReturn: 0, productName: '', currentQty: 0 })
    const [returnQtyInput, setReturnQtyInput] = useState<string>('')


    // --- Tracking Logic Moved to Component ---

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
        metodo_envio: ''
    })

    useEffect(() => {
        if (pedido) {
            setClientForm({
                nombre: pedido.nombre_contacto || pedido.clientes?.nombre || '',
                dni: pedido.dni_contacto || pedido.clientes?.dni || '',
                telefono: pedido.telefono_contacto || pedido.clientes?.telefono || '',
                direccion: pedido.direccion_calle || pedido.clientes?.direccion || '',
                distrito: pedido.distrito || '',
                provincia: pedido.provincia || '',
                departamento: pedido.departamento || '',
                referencia: pedido.referencia_direccion || '',
                metodo_envio: pedido.metodo_envio || ''
            })
        }
    }, [pedido])

    async function handleSaveClientData() {
        try {
            const supabase = createClient()
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
            const supabase = createClient()
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


    // --- File Upload Hooks ---

    const guideUpload = useFileUpload({
        bucketName: 'guias',
        onUploadComplete: async (url) => {
            const supabase = createClient()
            const { error } = await supabase
                .from('pedidos')
                .update({ guia_archivo_url: url })
                .eq('id', id)
            if (error) throw error
            fetchPedido()
        },
        onDeleteComplete: async () => {
            const supabase = createClient()
            const { error } = await supabase
                .from('pedidos')
                .update({ guia_archivo_url: null })
                .eq('id', id)
            if (error) throw error
            fetchPedido()
        }
    })

    const deliveryUpload = useFileUpload({
        bucketName: 'guias', // Reusing guias bucket as per original code
        onUploadComplete: async (url) => {
            const supabase = createClient()
            const { error } = await supabase
                .from('pedidos')
                .update({ evidencia_entrega_url: url })
                .eq('id', id)
            if (error) throw error
            fetchPedido()
        },
        onDeleteComplete: async () => {
            const supabase = createClient()
            const { error } = await supabase
                .from('pedidos')
                .update({ evidencia_entrega_url: null })
                .eq('id', id)
            if (error) throw error
            fetchPedido()
        }
    })

    const displayedShippingMethod = isEditClientOpen ? clientForm.metodo_envio : (pedido?.metodo_envio || '')

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

            {/* Tabs Layout */}
            <Tabs defaultValue="resumen" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="resumen">Resumen General</TabsTrigger>
                    <TabsTrigger value="logistica">Logística y Pagos</TabsTrigger>
                    <TabsTrigger value="documentos">Documentos</TabsTrigger>
                    <TabsTrigger value="historial">Historial y Auditoría</TabsTrigger>
                </TabsList>

                {/* TAB 1: RESUMEN (Atención al Cliente) */}
                <TabsContent value="resumen" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Columna Izquierda: Cliente y Notas */}
                        <div className="space-y-6">
                            <OrderCustomerCard
                                pedido={pedido}
                                isLocked={isLocked}
                                isEditOpen={isEditClientOpen}
                                onEditOpenChange={setIsEditClientOpen}
                                form={clientForm}
                                setForm={setClientForm}
                                onSave={handleSaveClientData}
                            />
                            <OrderNotesCard
                                pedidoId={Number(pedido.id)}
                                isLocked={isLocked}
                                onLogAction={logAction}
                            />
                            <OrderAssignmentCard
                                pedido={pedido}
                                userRole={userRole}
                                workers={workers}
                                assignedTo={assignedTo}
                                onAssign={handleAssignWorker}
                            />
                        </div>

                        {/* Columna Derecha: Productos (Más ancho) */}
                        <div className="md:col-span-2 space-y-6">
                            <OrderItemsCard
                                items={items}
                                pedido={pedido}
                                isLocked={isLocked}
                                displayedShippingMethod={displayedShippingMethod}
                                onReturnClick={(item) => openReturnDialog(item.id, item.cantidad, item.cantidad_devuelta || 0, item.productos?.nombre || 'Producto')}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: LOGÍSTICA (Operaciones) */}
                <TabsContent value="logistica" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna Izquierda: Pagos y Evidencia */}
                        <div className="space-y-6">
                            <OrderPaymentCard
                                pedido={pedido}
                                isLocked={isLocked}
                                currentUser={currentUser}
                                onLogAction={logAction}
                                onRefresh={fetchPedido}
                            />

                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pt-4">
                                <Camera className="h-5 w-5" /> Confirmación de Recepción
                            </h3>
                            <OrderFileCard
                                title="Evidencia de Entrega"
                                icon={<Camera className="h-5 w-5" />}
                                fileUrl={pedido.evidencia_entrega_url || null}
                                isLocked={isLocked}
                                isUploading={deliveryUpload.isUploading}
                                onUpload={(file) => deliveryUpload.upload(file, `entrega_${id}_${Date.now()}.${file.name.split('.').pop()}`)}
                                onDelete={deliveryUpload.remove}
                                uploadLabel={deliveryUpload.isUploading ? 'Subiendo...' : 'Subir Foto de Entrega'}
                                uploadSubLabel="Imagen (Motorizado)"
                                accept="image/*"
                                accentColor="green"
                            />
                        </div>

                        {/* Columna Derecha: Envío y Guías */}
                        <div className="space-y-6">
                            <OrderShippingCard
                                pedido={pedido}
                                isLocked={isLocked}
                                onLogAction={logAction}
                                onRefresh={fetchPedido}
                            />

                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pt-4">
                                <FileUp className="h-5 w-5" /> Guías de Remisión
                            </h3>
                            <OrderFileCard
                                title="Guía de Remisión"
                                icon={<FileUp className="h-5 w-5" />}
                                fileUrl={pedido.guia_archivo_url || null}
                                isLocked={isLocked}
                                isUploading={guideUpload.isUploading}
                                onUpload={(file) => guideUpload.upload(file, `pedido_${id}_${Date.now()}.${file.name.split('.').pop()}`)}
                                onDelete={guideUpload.remove}
                                uploadLabel={guideUpload.isUploading ? 'Subiendo...' : 'Subir Foto de Guía'}
                                uploadSubLabel="PDF o Imagen (Shalom/Olva)"
                                accept="image/*,.pdf"
                                accentColor="blue"
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 3: DOCUMENTOS (Nuevo) */}
                <TabsContent value="documentos" className="animate-in fade-in-50 duration-300">
                    <OrderLabelGenerator pedido={pedido} isLocked={isLocked} />
                </TabsContent>

                {/* TAB 4: HISTORIAL (Auditoría) */}
                <TabsContent value="historial" className="animate-in fade-in-50 duration-300">
                    <OrderHistoryCard logs={logs} />
                </TabsContent>
            </Tabs>

            {/* --- Dialogs --- */}

            {/* 1. Delete Guide Confirmation - Deprecated, moved to component */}
            {/* 1.5. Delete Delivery Evidence Confirmation - Deprecated, moved to component */}
            {/* 2. Delete Payment Confirmation - Deprecated, moved to component */}

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
