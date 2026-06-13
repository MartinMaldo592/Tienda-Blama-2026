"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { useFileUpload } from "@/hooks/use-file-upload"
import { OrderItemsCard } from "@/features/admin/components/orders/order-items-card"
import { OrderHistoryCard } from "@/features/admin/components/orders/order-history-card"
import { OrderCustomerCard } from "@/features/admin/components/orders/order-customer-card"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
import { 
    ArrowLeft, User, Calendar, FileUp, Check, Save, 
    AlertCircle, Camera, Box, ChevronLeft, MapPin, 
    CreditCard, History, FileText, Settings2, Loader2,
    CheckCircle2, ChevronRight, X, User2, MapPinned, FileSearch,
    Send, Lock, Truck
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { OrderShippingCard } from "@/features/admin/components/orders/order-shipping-card"
import { OrderFileCard } from "@/features/admin/components/orders/order-file-card"
import { OrderPaymentCard } from "@/features/admin/components/orders/order-payment-card"
import { PedidoRow, PedidoItemRow, ProfileRow, PedidoLog } from "@/features/admin/types"
import { assignPedidoToWorker, fetchAdminWorkers, fetchPedidoDetail, updatePedidoStatusWithStock } from "@/features/admin"
import { createClient } from "@/lib/supabase.client"
import { OrderNotesCard } from "@/features/admin/components/orders/order-notes-card"
import { OrderLabelGenerator } from "@/features/admin/components/orders/order-label-generator"
import { m, AnimatePresence } from "framer-motion"

export default function PedidoDetallePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin", "worker"] })

    const [pedido, setPedido] = useState<PedidoRow | null>(null)
    const [items, setItems] = useState<PedidoItemRow[]>([])
    const [workers, setWorkers] = useState<ProfileRow[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [status, setStatus] = useState("")
    const [assignedTo, setAssignedTo] = useState<string>("unassigned")
    const [userRole, setUserRole] = useState<string>('worker')
    const [totalPagado, setTotalPagado] = useState(0)

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

        if (lower.includes('stock insuficiente')) {
            toast.error('⚠️ No hay stock suficiente para confirmar este pedido.')
            return true
        }

        toast.error(fallbackMessage + msg)
        return false
    }

    const fetchPedido = useCallback(async (showSkeleton = false) => {
        if (showSkeleton) setLoading(true)
        try {
            const pedidoId = Number(id)
            if (!pedidoId) {
                setPedido(null)
                setItems([])
                if (showSkeleton) setLoading(false)
                return
            }

            const detail = await fetchPedidoDetail(pedidoId)
            setPedido(detail.pedido)
            setStatus(detail.pedido.status || '')
            setAssignedTo(detail.pedido.asignado_a || 'unassigned')
            setItems(detail.items)
            
            const supabase = createClient()
            const { data: pagosData } = await supabase
                .from('pedido_pagos')
                .select('monto, tipo_pago')
                .eq('pedido_id', pedidoId)
            
            if (pagosData) {
                const total = pagosData.reduce((acc, p) => {
                    if (p.tipo_pago === 'Reembolso') return acc - Number(p.monto)
                    return acc + Number(p.monto)
                }, 0)
                setTotalPagado(total)
            }
        } catch (error) {
            console.error("Error fetching pedido:", error)
            setPedido(null)
            setItems([])
        }
        if (showSkeleton) setLoading(false)
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
                await fetchPedido(true)
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
        fetchLogs()
        getUserName()
    }, [id])

    useEffect(() => {
        if (!id) return

        const supabase = createClient()
        const channel = supabase
            .channel(`pedido-cambio-${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'pedidos',
                    filter: `id=eq.${id}`
                },
                (payload: any) => {
                    console.log('Realtime update received:', payload)
                    toast.info(`🔔 Este pedido ha sido modificado en tiempo real por otro usuario. Los datos se actualizaron automáticamente.`)
                    fetchPedido()
                    fetchLogs()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [id, fetchPedido])

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
            .eq('pedido_id', Number(id))
            .order('created_at', { ascending: false })
        if (data) {
            setLogs(
                data.map((log) => ({
                    ...log,
                    usuario_nombre: log.usuario_nombre || "Sistema",
                    detalles: log.detalles || "",
                }))
            )
        }
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

    const [returnModalState, setReturnModalState] = useState<{
        isOpen: boolean;
        itemId: number | null;
        maxReturn: number;
        productName: string;
        currentQty: number;
    }>({ isOpen: false, itemId: null, maxReturn: 0, productName: '', currentQty: 0 })
    const [returnQtyInput, setReturnQtyInput] = useState<string>('')

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
            
            // Si el método de envío cambia a 'Provincia' (o Shalom) y no tiene PIN asignado, autogenerar uno
            let newPin = pedido?.shalom_pin
            const wasProv = ['provincia', 'Provincia'].includes(pedido?.metodo_envio || '') || 
                          String(pedido?.metodo_envio || '').toLowerCase().includes('provincia') ||
                          String(pedido?.metodo_envio || '').toLowerCase().includes('shalom')
            const isProv = ['provincia', 'Provincia'].includes(clientForm.metodo_envio || '') || 
                         String(clientForm.metodo_envio || '').toLowerCase().includes('provincia') ||
                         String(clientForm.metodo_envio || '').toLowerCase().includes('shalom')

            if (isProv && !wasProv && !pedido?.shalom_pin) {
                newPin = Math.floor(1000 + Math.random() * 9000).toString()
                toast.info(`Envío cambiado a Provincia. Se autogeneró el PIN Shalom de retiro: ${newPin}`, {
                    duration: 6000
                })
            }

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
                    metodo_envio: clientForm.metodo_envio,
                    shalom_pin: newPin
                })
                .eq('id', Number(id))
            if (error) throw error
            await logAction('Datos Cliente Editados', `Se actualizaron datos de entrega/contacto y envío`)
            toast.success("Datos actualizados correctamente")
            setIsEditClientOpen(false)
            fetchPedido()
        } catch (error: any) {
            toast.error("Error actualizando datos: " + error.message)
        }
    }

    const isLocked = (() => {
        if (!pedido || (userRole === 'admin' || userRole === 'superadmin')) return false
        const terminalStates = ['Entregado', 'Enviado', 'Fallido']
        if (!terminalStates.includes(pedido.status || '')) return false
        const updateTime = new Date(pedido.updated_at || pedido.created_at).getTime()
        const now = Date.now()
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000
        return (now - updateTime) > threeDaysMs
    })()

    function openReturnDialog(itemId: number, currentQty: number, alreadyReturned: number, productName: string) {
        if (isLocked) return
        const maxReturn = currentQty - alreadyReturned
        if (maxReturn <= 0) {
            toast.error("Este producto ya fue devuelto en su totalidad.")
            return
        }
        setReturnModalState({ isOpen: true, itemId, maxReturn, productName, currentQty: 1 })
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

        // Validación y Confirmación Visual para envíos a provincia por Agencia Shalom
        const isProv = ['provincia', 'Provincia'].includes(pedido.metodo_envio || '') || 
                     String(pedido.metodo_envio || '').toLowerCase().includes('provincia') ||
                     String(pedido.metodo_envio || '').toLowerCase().includes('shalom')
        if (status === 'Enviado' && isProv) {
            const pinVal = (pedido.shalom_pin || '').trim()
            const orderVal = (pedido.shalom_orden || '').trim()
            const passVal = (pedido.shalom_clave || '').trim()
            
            if (!orderVal || !passVal) {
                toast.error("⚠️ Para cambiar a 'Enviado', debes ingresar primero el Nº Orden y Código de Orden en la pestaña de LOGÍSTICA.")
                return
            }

            const confirmed = window.confirm(
                `🛡️ CONFIRMACIÓN DE ENVÍO POR AGENCIA SHALOM\n\n` +
                `Por favor, verifica minuciosamente que los datos ingresados coincidan exactamente con la guía física de Shalom para evitar pérdidas:\n\n` +
                `• Nº Orden Shalom: ${orderVal}\n` +
                `• Código de Orden: ${passVal}\n` +
                `• PIN de Retiro: ${pinVal ? pinVal : '⚠️ SIN PIN (Asegúrate de que no requiera PIN o ingresarlo si está pagado)'}\n\n` +
                `¿Confirmas que toda la información es correcta y deseas proceder con el envío de notificaciones automáticas?`
            )
            if (!confirmed) return
        }

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

    const guideUpload = useFileUpload({
        bucketName: 'guias',
        onUploadComplete: async (url) => {
            const supabase = createClient()
            const { error } = await supabase.from('pedidos').update({ guia_archivo_url: url }).eq('id', Number(id))
            if (error) throw error
            fetchPedido()
        },
        onDeleteComplete: async () => {
            const supabase = createClient()
            const { error } = await supabase.from('pedidos').update({ guia_archivo_url: null }).eq('id', Number(id))
            if (error) throw error
            fetchPedido()
        }
    })

    const deliveryUpload = useFileUpload({
        bucketName: 'guias',
        onUploadComplete: async (url) => {
            const supabase = createClient()
            const { error } = await supabase.from('pedidos').update({ evidencia_entrega_url: url }).eq('id', Number(id))
            if (error) throw error
            fetchPedido()
        },
        onDeleteComplete: async () => {
            const supabase = createClient()
            const { error } = await supabase.from('pedidos').update({ evidencia_entrega_url: null }).eq('id', Number(id))
            if (error) throw error
            fetchPedido()
        }
    })

    const displayedShippingMethod = isEditClientOpen ? clientForm.metodo_envio : (pedido?.metodo_envio || '')

    if (guard.loading || loading) {
        return (
            <div className="space-y-10 max-w-6xl mx-auto p-6 pt-10">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-4 w-40 rounded-lg" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full rounded-[2rem]" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                    <Skeleton className="h-[400px] md:col-span-2 w-full rounded-[2.5rem]" />
                </div>
            </div>
        )
    }

    if (!pedido) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Box size={64} className="text-slate-200" />
            <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Pedido no encontrado</h2>
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl font-bold">VOLVER ATRÁS</Button>
        </div>
    )

    return (
        <div className="space-y-10 pb-20 max-w-6xl mx-auto animate-in fade-in duration-700">
            {/* --- TOP NAVIGATION & ACTIONS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pt-4">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm hover:shadow-md transition-all haptic-scale"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Orden <span className="text-blue-600">#{pedido.id.toString().padStart(6, '0')}</span>
                            </h1>
                            <StatusBadge status={pedido.status || 'Pendiente'} />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                            Registrado el {new Date(pedido.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {(userRole === 'admin' || userRole === 'superadmin') && (
                        <div className="flex items-center gap-2 bg-white px-4 h-14 rounded-2xl border border-slate-100 shadow-sm">
                            <User size={16} className="text-slate-400" />
                            <Select value={assignedTo} onValueChange={handleAssignWorker} disabled={isLocked}>
                                <SelectTrigger className="w-[160px] border-none shadow-none focus:ring-0 font-bold text-xs text-slate-600">
                                    <SelectValue placeholder="Libre" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                    <SelectItem value="unassigned" className="font-bold py-3">Libre</SelectItem>
                                    {workers.map((w) => (
                                        <SelectItem key={w.id} value={w.id} className="font-bold py-3">{w.nombre || 'Trabajador'}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex items-center gap-3 bg-slate-900 p-2 pl-4 rounded-2xl shadow-xl shadow-slate-200">
                        <Select value={status} onValueChange={setStatus} disabled={isLocked || updating}>
                            <SelectTrigger className={`w-[160px] h-10 border-none shadow-none focus:ring-0 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all ${
                                status === 'Pendiente' ? 'bg-amber-400 text-amber-950' :
                                status === 'Confirmado' ? 'bg-sky-400 text-sky-950' :
                                status === 'Preparando' ? 'bg-orange-400 text-orange-950' :
                                status === 'Enviado' ? 'bg-indigo-400 text-indigo-950' :
                                status === 'Llegó a Agencia' ? 'bg-teal-400 text-teal-950' :
                                status === 'Entregado' ? 'bg-emerald-400 text-emerald-950' :
                                status === 'Devuelto' ? 'bg-purple-400 text-purple-950' :
                                status === 'Fallido' ? 'bg-red-400 text-red-950' :
                                'bg-slate-400 text-slate-950'
                            }`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                {['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Llegó a Agencia', 'Entregado', 'Devuelto', 'Fallido', 'Cancelado'].map(s => (
                                    <SelectItem key={s} value={s} className="font-bold text-xs py-3">{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                            size="sm" 
                            onClick={handleUpdateStatus} 
                            disabled={isLocked || updating || status === pedido.status}
                            className="h-10 px-6 rounded-xl bg-blue-600 text-white font-black text-xs tracking-tighter hover:bg-blue-700 transition-all haptic-scale"
                        >
                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            ACTUALIZAR
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- STEPPER PROGRESS --- */}
            <m.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white border border-slate-100 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
            >
                <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto">
                    <div className="absolute left-0 top-[16px] w-full h-[2px] bg-slate-100 -z-0"></div>
                    {(() => {
                        const isAgencia = ['provincia', 'Provincia'].includes(pedido.metodo_envio || '') || String(pedido.metodo_envio || '').toLowerCase().includes('shalom')
                        const allStatuses = isAgencia
                            ? ['Pendiente', 'Confirmado', 'Enviado', 'Llegó a Agencia', 'Entregado']
                            : ['Pendiente', 'Confirmado', 'Enviado', 'Entregado']

                        return allStatuses.map((stepStatus, index) => {
                            const currentIndex = allStatuses.indexOf(pedido.status || '')
                            const stepIndex = allStatuses.indexOf(stepStatus)
                            const isCompleted = stepIndex <= currentIndex
                            const isCancelled = pedido.status === 'Fallido' || pedido.status === 'Cancelado'

                            return (
                                <div key={stepStatus} className="relative z-10 flex flex-col items-center gap-2 bg-white px-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-700 shadow-sm ${
                                        isCancelled ? "bg-rose-50 text-rose-400 border border-rose-100" :
                                        isCompleted ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : 
                                        "bg-white border-2 border-slate-100 text-slate-300"
                                    }`}>
                                        {isCompleted && !isCancelled ? <Check className="w-4 h-4" strokeWidth={3} /> : <span className="font-black text-xs">{index + 1}</span>}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isCompleted && !isCancelled ? 'text-slate-900' : 'text-slate-300'}`}>
                                        {stepStatus}
                                    </span>
                                </div>
                            )
                        })
                    })()}
                </div>
                {(pedido.status === 'Fallido' || pedido.status === 'Cancelado') && (
                    <m.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 flex items-center justify-center gap-3 py-3 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 font-bold text-sm"
                    >
                        <AlertCircle size={16} />
                        ORDEN CANCELADA O FALLIDA
                    </m.div>
                )}
            </m.div>

            {/* --- LOCKED NOTICE --- */}
            {isLocked && (
                <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-center gap-4">
                    <div className="h-12 w-12 bg-amber-200 rounded-2xl flex items-center justify-center text-amber-700 shadow-inner">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Archivo Histórico (Bloqueado)</p>
                        <p className="text-xs text-amber-700 font-medium">Esta orden fue finalizada hace más de 72 horas. Solo Administración puede revertir cambios.</p>
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT TABS --- */}
            <Tabs defaultValue="resumen" className="w-full">
                <TabsList className="flex gap-2 p-1 bg-slate-100/50 border border-slate-100 rounded-[2rem] mb-10 w-fit mx-auto lg:mx-0">
                    {[
                        { id: 'resumen', label: 'GENERAL', icon: Box },
                        { id: 'logistica', label: 'LOGÍSTICA', icon: MapPin },
                        { id: 'finanzas', label: 'FINANZAS', icon: CreditCard },
                        { id: 'documentos', label: 'REPORTES', icon: FileText },
                        { id: 'historial', label: 'AUDITORÍA', icon: History }
                    ].map(tab => (
                        <TabsTrigger 
                            key={tab.id} 
                            value={tab.id}
                            className="flex items-center gap-3 px-8 py-4 rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200 transition-all"
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="resumen" className="space-y-8 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-8">
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
                        </div>
                        <div className="lg:col-span-2">
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

                <TabsContent value="logistica" className="space-y-8 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Columna izquierda: solo logística */}
                        <div className="space-y-8">
                            <OrderShippingCard
                                pedido={pedido}
                                isLocked={isLocked}
                                onLogAction={logAction}
                                onRefresh={fetchPedido}
                            />
                        </div>
                        {/* Columna derecha: Guías Oficiales arriba, Confirmación Visual abajo */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-6">
                                    <FileUp className="text-indigo-500" /> Guías Oficiales
                                </h3>
                                <OrderFileCard
                                    title="Guía de Remisión"
                                    icon={<FileUp size={20} />}
                                    fileUrl={pedido.guia_archivo_url || null}
                                    isLocked={isLocked}
                                    isUploading={guideUpload.isUploading}
                                    onUpload={(file) => guideUpload.upload(file, `pedido_${id}_${Date.now()}.${file.name.split('.').pop()}`)}
                                    onDelete={guideUpload.remove}
                                    uploadLabel={guideUpload.isUploading ? 'Procesando...' : 'Vincular Guía'}
                                    uploadSubLabel="PDF o Imagen (Shalom/Olva)"
                                    accept="image/*,.pdf"
                                    accentColor="blue"
                                />
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-6">
                                    <Camera className="text-blue-500" /> Confirmación Visual
                                </h3>
                                <OrderFileCard
                                    title="Evidencia de Entrega"
                                    icon={<Camera size={20} />}
                                    fileUrl={pedido.evidencia_entrega_url || null}
                                    isLocked={isLocked}
                                    isUploading={deliveryUpload.isUploading}
                                    onUpload={(file) => deliveryUpload.upload(file, `entrega_${id}_${Date.now()}.${file.name.split('.').pop()}`)}
                                    onDelete={deliveryUpload.remove}
                                    uploadLabel={deliveryUpload.isUploading ? 'Procesando...' : 'Subir Evidencia'}
                                    uploadSubLabel="Requerido para cierre de entrega"
                                    accept="image/*"
                                    accentColor="green"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fila completa: Notificar al Cliente (solo para pedidos de Provincia con datos de tracking) */}
                    {['provincia', 'Provincia'].includes(pedido.metodo_envio || '') && pedido.shalom_orden && pedido.shalom_clave && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                                <Send size={16} className="text-sky-500" /> Notificar al Cliente
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        const phone = pedido.telefono_contacto || pedido.clientes?.telefono
                                        if (!phone) { toast.error('El cliente no tiene teléfono'); return }
                                        const nombre = (pedido.nombre_contacto || pedido.clientes?.nombre || 'Cliente').split(' ')[0]
                                        const orderId = pedido.id.toString().padStart(6, '0')
                                        const msg = `Hola ${nombre}! 👋\nTu pedido #${orderId} ya fue enviado por Shalom.\n\n📦 Datos para rastreo:\nNº de Orden: ${pedido.shalom_orden}\nCódigo de Orden: ${pedido.shalom_clave}\n${pedido.agencia_origen ? `📍 Origen: ${pedido.agencia_origen}\n` : ''}${pedido.agencia_destino ? `📍 Destino: ${pedido.agencia_destino}\n` : ''}🔗 Rastrea aquí: https://rastrea.shalom.com.pe\n\nPara recibir tu clave de retiro, por favor cancela el saldo pendiente.\n¡Gracias por tu compra en Blama! 🛍️`
                                        window.open(`https://wa.me/51${phone}?text=${encodeURIComponent(msg)}`, '_blank')
                                    }}
                                    className="flex items-center justify-between h-14 px-5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-100 rounded-2xl transition-all haptic-scale group"
                                >
                                    <span className="flex items-center gap-3 font-black text-xs uppercase tracking-wider">
                                        <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                        Enviar Guía de Rastreo
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-sky-200 text-sky-800 rounded-lg">SIN PIN</span>
                                </button>

                                <button
                                    onClick={() => {
                                        const isPaid = ['Pagado', 'Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '')
                                        if (!isPaid) return
                                        const phone = pedido.telefono_contacto || pedido.clientes?.telefono
                                        if (!phone) { toast.error('El cliente no tiene teléfono'); return }
                                        const nombre = (pedido.nombre_contacto || pedido.clientes?.nombre || 'Cliente').split(' ')[0]
                                        const orderId = pedido.id.toString().padStart(6, '0')
                                        const msg = `Hola ${nombre}! ✅\n¡Tu pago ha sido confirmado! Aquí están tus datos para recoger tu pedido #${orderId} en Shalom:\n\n📦 Nº de Orden: ${pedido.shalom_orden}\n📦 Código de Orden: ${pedido.shalom_clave}\n${pedido.agencia_destino ? `📍 Agencia Destino: ${pedido.agencia_destino}\n` : ''}🔐 Clave de Retiro: ${pedido.shalom_pin}\n\nYa puedes recoger tu paquete en la agencia Shalom de tu ciudad.\n¡Gracias por tu compra en Blama! 🛍️`
                                        window.open(`https://wa.me/51${phone}?text=${encodeURIComponent(msg)}`, '_blank')
                                    }}
                                    disabled={!['Pagado', 'Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '')}
                                    className={`flex items-center justify-between h-14 px-5 border rounded-2xl transition-all font-black text-xs uppercase tracking-wider group ${
                                        ['Pagado', 'Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '')
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-100 haptic-scale'
                                            : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Lock size={16} /> Enviar PIN de Retiro
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                                        ['Pagado', 'Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '') ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {['Pagado', 'Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '') ? 'HABILITADO' : 'BLOQUEADO'}
                                    </span>
                                </button>
                            </div>
                            <button
                                onClick={() => window.open('https://shalom.com.pe/rastrea', '_blank')}
                                className="mt-4 w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <Truck size={14} /> Portal de Rastreo Shalom
                            </button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="finanzas" className="space-y-8 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <OrderPaymentCard
                                pedido={pedido}
                                isLocked={pedido.status === 'Entregado' || pedido.status === 'Cancelado'}
                                currentUser={currentUser}
                                userRole={userRole}
                                onLogAction={logAction}
                                onRefresh={fetchPedido}
                            />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 border border-slate-700/50">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-emerald-400">Balance Contable</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-5">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Objetivo Total</p>
                                            <p className="text-2xl font-black tracking-tighter">{formatCurrency(pedido.total || 0)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/5 pb-5">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Recaudado</p>
                                            <p className="text-2xl font-black tracking-tighter text-emerald-400">{formatCurrency(totalPagado)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Saldo por Cobrar</p>
                                            <p className={`text-3xl font-black tracking-tighter ${((pedido.total || 0) - (totalPagado || 0)) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {formatCurrency(Math.max(0, (pedido.total || 0) - (totalPagado || 0)))}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] font-bold leading-relaxed text-slate-400 uppercase tracking-widest italic">
                                        * Los pagos registrados afectan la liquidación final y el estado de entrega.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100/50 flex flex-col items-center text-center gap-4">
                                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                                    <CheckCircle2 className="text-emerald-500 h-8 w-8" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Control Seguro</h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">Todas las transacciones son auditadas y vinculadas al usuario activo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="documentos" className="outline-none">
                    <OrderLabelGenerator pedido={pedido} items={items} isLocked={isLocked} />
                </TabsContent>

                <TabsContent value="historial" className="outline-none">
                    <OrderHistoryCard logs={logs} />
                </TabsContent>
            </Tabs>

            {/* --- PARTIAL RETURN DIALOG --- */}
            <Dialog open={returnModalState.isOpen} onOpenChange={(open) => setReturnModalState(prev => ({ ...prev, isOpen: open }))}>
                <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">Devolución Parcial</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-6">
                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Producto Seleccionado</p>
                            <p className="text-lg font-bold text-slate-900">{returnModalState.productName}</p>
                            <p className="text-xs text-blue-600 mt-1 font-medium">Disponible para devolución: <span className="font-black">{returnModalState.maxReturn} und.</span></p>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Cantidad a Retornar al Inventario</Label>
                            <Input
                                type="number"
                                min="1"
                                max={returnModalState.maxReturn}
                                value={returnQtyInput}
                                onChange={(e) => setReturnQtyInput(e.target.value)}
                                className="h-14 bg-slate-50 border-none rounded-2xl text-lg font-bold"
                            />
                            <p className="text-[10px] text-slate-400 font-medium">
                                * Esta acción sumará automáticamente las unidades al stock global.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setReturnModalState(prev => ({ ...prev, isOpen: false }))} className="h-14 px-8 rounded-2xl font-bold">CANCELAR</Button>
                        <Button onClick={processPartialReturn} className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-200 haptic-scale">
                            CONFIRMAR RETORNO
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Pendiente': 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_2px_10px_-3px_rgba(251,191,36,0.2)]',
        'Confirmado': 'bg-sky-50 text-sky-700 border-sky-100 shadow-[0_2px_10px_-3px_rgba(14,165,233,0.2)]',
        'Enviado': 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_2px_10px_-3px_rgba(79,70,229,0.2)]',
        'Llegó a Agencia': 'bg-teal-50 text-teal-700 border-teal-100 shadow-[0_2px_10px_-3px_rgba(13,148,136,0.2)]',
        'Entregado': 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]',
        'Cancelado': 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)]',
        'Fallido': 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)]',
    }

    return (
        <Badge variant="outline" className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${styles[status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {status}
        </Badge>
    )
}

