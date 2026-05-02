"use client"

import Image from "next/image"
import { CreditCard, ExternalLink, Trash2, Plus, Upload, X, Banknote, Smartphone, Building2, HelpCircle, Eye, EyeOff, CheckCircle2, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase.client"
import { PedidoRow, PedidoPago } from "@/features/admin/types"
import { formatCurrency } from "@/lib/utils"
import { useFileUpload } from "@/hooks/use-file-upload"
import { m, AnimatePresence } from "framer-motion"

interface OrderPaymentCardProps {
    pedido: PedidoRow
    isLocked: boolean
    currentUser: string
    userRole?: string
    onLogAction: (action: string, details: string) => Promise<void>
    onRefresh: () => void
}

const METODO_ICONS: Record<string, React.ReactNode> = {
    'Efectivo': <Banknote className="h-5 w-5" />,
    'Yape': <Smartphone className="h-5 w-5" />,
    'Plin': <Smartphone className="h-5 w-5" />,
    'Transferencia BCP': <Building2 className="h-5 w-5" />,
    'Transferencia Interbank': <Building2 className="h-5 w-5" />,
    'Tarjeta': <CreditCard className="h-5 w-5" />,
    'Pasarela Culqi': <CreditCard className="h-5 w-5" />,
    'Otro': <HelpCircle className="h-5 w-5" />,
}

const METODOS_REQUIEREN_COMPROBANTE = ['Yape', 'Plin', 'Transferencia BCP', 'Transferencia Interbank']

const PAGO_STATUS_STYLES: Record<string, { bg: string, text: string, border: string }> = {
    'Pendiente': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
    'Pago Parcial': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    'Pagado': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    'Pago Contraentrega': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' },
    'Pagado Anticipado': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    'Pagado al Recibir': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
}

export function OrderPaymentCard({ pedido, isLocked, currentUser, userRole = 'worker', onLogAction, onRefresh }: OrderPaymentCardProps) {
    const [pagos, setPagos] = useState<PedidoPago[]>([])
    const [loadingPagos, setLoadingPagos] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    // Form state
    const [monto, setMonto] = useState("")
    const [metodoPago, setMetodoPago] = useState("")
    const [tipoPago, setTipoPago] = useState("")
    const [nota, setNota] = useState("")
    const [comprobanteUrl, setComprobanteUrl] = useState<string | null>(null)
    const [visiblePayments, setVisiblePayments] = useState<Record<number, boolean>>({})

    const togglePaymentVisibility = (id: number) => {
        setVisiblePayments(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    // Upload hook for payment proof
    const comprobanteUpload = useFileUpload({
        bucketName: 'pagos',
        onUploadComplete: async (url) => {
            setComprobanteUrl(url)
        }
    })

    // Fetch payments for this order
    const fetchPagos = useCallback(async () => {
        setLoadingPagos(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('pedido_pagos')
                .select('*')
                .eq('pedido_id', pedido.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            setPagos(data || [])
        } catch (err: any) {
            console.error("Error fetching pagos:", err)
            setPagos([])
        } finally {
            setLoadingPagos(false)
        }
    }, [pedido.id])

    useEffect(() => {
        fetchPagos()
    }, [fetchPagos])

    // Calculate totals
    const totalPagado = pagos.reduce((acc, p) => {
        if (p.tipo_pago === 'Reembolso') return acc - p.monto
        return acc + p.monto
    }, 0)

    const saldoPendiente = Math.max(0, (pedido.total || 0) - totalPagado)
    const porcentajePagado = pedido.total > 0 ? Math.min(100, Math.round((totalPagado / pedido.total) * 100)) : 0

    // Determine current pago status
    const estadoPagoCalculado = totalPagado <= 0
        ? 'Pendiente'
        : totalPagado >= (pedido.total || 0)
            ? (['Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '') ? pedido.pago_status : 'Pagado')
            : 'Pago Parcial'

    const requiresComprobante = METODOS_REQUIEREN_COMPROBANTE.includes(metodoPago)
    const requiresNota = metodoPago === 'Otro'

    const canSubmit = () => {
        const montoNum = parseFloat(monto)
        if (!montoNum || montoNum <= 0) return false
        if (!metodoPago) return false
        if (!tipoPago) return false
        if (requiresComprobante && !comprobanteUrl) return false
        if (requiresNota && !nota.trim()) return false
        return true
    }

    const resetForm = () => {
        setMonto("")
        setMetodoPago("")
        setTipoPago("")
        setNota("")
        setComprobanteUrl(null)
        setShowForm(false)
    }

    const handleFillSaldo = () => {
        setMonto(saldoPendiente.toFixed(2))
        setTipoPago("Pago Final")
    }

    async function handleSubmitPago() {
        if (!canSubmit()) return
        setSaving(true)

        try {
            const montoNum = parseFloat(monto)
            const supabase = createClient()

            // 1. Insert the payment record
            const { error: insertError } = await supabase
                .from('pedido_pagos')
                .insert({
                    pedido_id: pedido.id,
                    monto: montoNum,
                    metodo_pago: metodoPago,
                    tipo_pago: tipoPago,
                    comprobante_url: comprobanteUrl,
                    nota: nota.trim() || null,
                    registrado_por: currentUser,
                })

            if (insertError) throw insertError

            // 2. Calculate new total paid
            const newTotalPagado = tipoPago === 'Reembolso'
                ? totalPagado - montoNum
                : totalPagado + montoNum

            const newEstado = newTotalPagado <= 0
                ? 'Pendiente'
                : newTotalPagado >= (pedido.total || 0)
                    ? (['Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '') ? pedido.pago_status : 'Pagado')
                    : 'Pago Parcial'

            // 3. Update pedido pago_status
            const { error: updateError } = await supabase
                .from('pedidos')
                .update({ pago_status: newEstado })
                .eq('id', pedido.id)

            if (updateError) {
                console.error("Error updating pago_status:", updateError)
                // Non-critical, continue
            }

            // 4. Log action
            await onLogAction(
                'Pago Registrado',
                `${formatCurrency(montoNum)} · ${metodoPago} · ${tipoPago}${nota.trim() ? ` · "${nota.trim()}"` : ''}`
            )

            toast.success(`Pago de ${formatCurrency(montoNum)} registrado`)
            resetForm()
            fetchPagos()
            onRefresh()
        } catch (err: any) {
            console.error("Error registrando pago:", err)
            toast.error("Error al registrar pago: " + err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDeletePago(pagoId: number) {
        setDeletingId(pagoId)
        try {
            const pago = pagos.find(p => p.id === pagoId)
            const supabase = createClient()
            const { error } = await supabase
                .from('pedido_pagos')
                .delete()
                .eq('id', pagoId)

            if (error) throw error

            if (pago) {
                await onLogAction(
                    'Pago Eliminado',
                    `${formatCurrency(pago.monto)} · ${pago.metodo_pago} · ${pago.tipo_pago}`
                )
            }

            // Recalculate status
            const remainingPagos = pagos.filter(p => p.id !== pagoId)
            const newTotal = remainingPagos.reduce((acc, p) => {
                if (p.tipo_pago === 'Reembolso') return acc - p.monto
                return acc + p.monto
            }, 0)

            const newEstado = newTotal <= 0 ? 'Pendiente' : newTotal >= (pedido.total || 0) ? (['Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '') ? pedido.pago_status : 'Pagado') : 'Pago Parcial'
            await supabase.from('pedidos').update({ pago_status: newEstado }).eq('id', pedido.id)

            toast.success("Pago eliminado")
            setConfirmDeleteId(null)
            fetchPagos()
            onRefresh()
        } catch (err: any) {
            toast.error("Error al eliminar pago: " + err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const currentStatusStyle = PAGO_STATUS_STYLES[estadoPagoCalculado || 'Pendiente'] || PAGO_STATUS_STYLES['Pendiente']

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-8 pb-6 border-b border-slate-50">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-500 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                            <Banknote size={22} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Finanzas</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Control de Pagos y Abonos
                            </p>
                        </div>
                    </div>
                    {/* Badge: only render after payments are loaded to avoid 'Pendiente' flash */}
                    {loadingPagos ? (
                        <div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse" />
                    ) : (
                        <div className={`px-4 py-2 rounded-xl border ${currentStatusStyle.bg} ${currentStatusStyle.border}`}>
                            <span className={`text-xs font-black uppercase tracking-widest ${currentStatusStyle.text}`}>
                                {estadoPagoCalculado}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Progress & Stats: skeleton while loading */}
                {loadingPagos ? (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6 animate-pulse">
                        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200">
                            {[0,1,2].map(i => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="h-3 w-16 bg-slate-200 rounded" />
                                    <div className="h-5 w-20 bg-slate-200 rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-slate-200 rounded-full" />
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Monto Total</p>
                                <p className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(pedido.total || 0)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recaudado</p>
                                <p className="text-lg font-black text-emerald-600 tracking-tighter">{formatCurrency(totalPagado)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pendiente</p>
                                <p className={`text-lg font-black tracking-tighter ${saldoPendiente > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                                    {formatCurrency(saldoPendiente)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Progreso de Pago</span>
                                <span className={porcentajePagado >= 100 ? 'text-emerald-600' : ''}>{porcentajePagado}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                <m.div 
                                    className={`h-full rounded-full ${porcentajePagado >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${porcentajePagado}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Additional Info Row */}
                <div className="flex justify-between items-center mt-4 px-2">
                    {pedido.cupon_codigo ? (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Cupón:</span>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">{pedido.cupon_codigo}</span>
                        </div>
                    ) : <div />}
                    
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Inventario:</span>
                        {pedido.stock_descontado ? (
                            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Descontado</span>
                        ) : (
                            <span className="text-amber-600 flex items-center gap-1"><Lock size={12} /> Reservado</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Historial de Transacciones</h3>
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
                        {pagos.length}
                    </Badge>
                </div>

                {loadingPagos ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
                    </div>
                ) : pagos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Banknote size={40} className="text-slate-300 mb-3" strokeWidth={1} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin pagos registrados</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {pagos.map((pago) => {
                                const isRefund = pago.tipo_pago === 'Reembolso';
                                const bgClass = isRefund ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100 hover:border-slate-200';
                                const iconClass = isRefund ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-600';
                                const amountClass = isRefund ? 'text-rose-600' : 'text-slate-900';
                                
                                return (
                                    <m.div 
                                        key={pago.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`p-5 rounded-2xl border transition-all ${bgClass} shadow-sm`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
                                                    {METODO_ICONS[pago.metodo_pago] || <CreditCard size={20} />}
                                                </div>
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className={`text-lg font-black tracking-tighter ${amountClass}`}>
                                                            {isRefund ? '-' : ''}{formatCurrency(pago.monto)}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-sm">
                                                                {pago.metodo_pago}
                                                            </span>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shadow-sm ${isRefund ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-100'}`}>
                                                                {pago.tipo_pago}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        <span>
                                                            {new Date(pago.created_at).toLocaleString('es-PE', {
                                                                day: '2-digit', month: 'short', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="text-slate-500">{pago.registrado_por}</span>
                                                    </div>

                                                    {pago.nota && (
                                                        <p className="text-xs font-medium text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100 mt-2 inline-block">
                                                            📝 {pago.nota}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                {pago.comprobante_url && (
                                                    <>
                                                        <button
                                                            onClick={() => togglePaymentVisibility(pago.id)}
                                                            className={`h-9 px-3 rounded-xl border flex items-center gap-2 transition-all ${visiblePayments[pago.id] ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:text-indigo-600 hover:border-indigo-200'} text-[10px] font-black uppercase tracking-widest shadow-sm`}
                                                        >
                                                            {visiblePayments[pago.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            {visiblePayments[pago.id] ? 'OCULTAR' : 'EVIDENCIA'}
                                                        </button>
                                                        <button
                                                            onClick={() => window.open(pago.comprobante_url!, '_blank')}
                                                            className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                            title="Abrir original"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {(!isLocked && (!pago.registrado_por?.toLowerCase().includes("sistema") || userRole === 'admin')) && (
                                                    <button
                                                        onClick={() => setConfirmDeleteId(pago.id)}
                                                        className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm"
                                                        title="Eliminar pago"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Image Preview */}
                                        <AnimatePresence>
                                            {pago.comprobante_url && visiblePayments[pago.id] && (
                                                <m.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-4 overflow-hidden"
                                                >
                                                    {pago.comprobante_url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) ? (
                                                        <img
                                                            src={pago.comprobante_url}
                                                            alt="Comprobante completo"
                                                            className="w-full h-auto rounded-xl border border-slate-200 shadow-md max-h-[400px] object-contain bg-slate-50"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="p-4 bg-slate-100 rounded-xl text-center">
                                                            <a href={pago.comprobante_url} target="_blank" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                                                                <ExternalLink size={14} /> Descargar Archivo
                                                            </a>
                                                        </div>
                                                    )}
                                                </m.div>
                                            )}
                                        </AnimatePresence>
                                    </m.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Register New Payment Block */}
            {!isLocked && (
                <div className="p-8 pt-0">
                    <AnimatePresence mode="wait">
                        {!showForm ? (
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="w-full h-14 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-2 border-dashed border-slate-200 hover:border-emerald-200 font-black text-xs uppercase tracking-widest transition-all"
                                >
                                    <Plus size={18} className="mr-2" /> AGREGAR TRANSACCIÓN
                                </Button>
                            </m.div>
                        ) : (
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-inner"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                        <Plus className="text-emerald-500" /> Nuevo Registro
                                    </h3>
                                    <button 
                                        onClick={resetForm}
                                        className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Monto & Saldos */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            Monto <span className="text-rose-500">*</span>
                                        </Label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">S/</span>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    placeholder="0.00"
                                                    value={monto}
                                                    onChange={(e) => setMonto(e.target.value)}
                                                    className="pl-10 h-14 bg-white border-none rounded-2xl text-xl font-black focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
                                                    disabled={saving}
                                                />
                                            </div>
                                            {saldoPendiente > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={handleFillSaldo}
                                                    disabled={saving}
                                                    className="px-6 h-14 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                                                >
                                                    LIQUIDAR SALDO
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selectores */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                Vía de Pago <span className="text-rose-500">*</span>
                                            </Label>
                                            <Select value={metodoPago} onValueChange={setMetodoPago} disabled={saving}>
                                                <SelectTrigger className="h-14 bg-white border-none rounded-2xl font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/10">
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                                    <SelectItem value="Efectivo" className="font-bold py-3">💵 Efectivo</SelectItem>
                                                    <SelectItem value="Yape" className="font-bold py-3">📱 Yape</SelectItem>
                                                    <SelectItem value="Plin" className="font-bold py-3">📱 Plin</SelectItem>
                                                    <SelectItem value="Transferencia BCP" className="font-bold py-3">🏦 Transfer. BCP</SelectItem>
                                                    <SelectItem value="Transferencia Interbank" className="font-bold py-3">🏦 Transfer. Interbank</SelectItem>
                                                    <SelectItem value="Tarjeta" className="font-bold py-3">💳 Tarjeta</SelectItem>
                                                    <SelectItem value="Pasarela Culqi" className="font-bold py-3">💳 Culqi Web</SelectItem>
                                                    <SelectItem value="Otro" className="font-bold py-3">📝 Otro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                Clasificación <span className="text-rose-500">*</span>
                                            </Label>
                                            <Select value={tipoPago} onValueChange={setTipoPago} disabled={saving}>
                                                <SelectTrigger className="h-14 bg-white border-none rounded-2xl font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/10">
                                                    <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                                    <SelectItem value="Adelanto" className="font-bold py-3">Adelanto</SelectItem>
                                                    <SelectItem value="Abono" className="font-bold py-3">Abono parcial</SelectItem>
                                                    <SelectItem value="Pago Final" className="font-bold py-3">Pago Final</SelectItem>
                                                    <SelectItem value="Reembolso" className="font-bold py-3 text-rose-600">Reembolso (Resta)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Comprobante */}
                                    {metodoPago && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    Evidencia Visual
                                                </Label>
                                                {requiresComprobante ? (
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-100 text-rose-600">Requerido</span>
                                                ) : (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Opcional</span>
                                                )}
                                            </div>

                                            {comprobanteUrl ? (
                                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                                    {comprobanteUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                                                        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                                            <Image src={comprobanteUrl} alt="Comprobante" fill className="object-contain" sizes="300px" />
                                                        </div>
                                                    )}
                                                    <div className="flex gap-3">
                                                        <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-bold" onClick={() => window.open(comprobanteUrl!, '_blank')}>
                                                            VER ORIGINAL
                                                        </Button>
                                                        <Button variant="outline" className="h-10 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200" onClick={() => setComprobanteUrl(null)}>
                                                            <X className="h-4 w-4 mr-1" /> QUITAR
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="comprobante-pago-upload"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) {
                                                                comprobanteUpload.upload(
                                                                    e.target.files[0],
                                                                    `pago_${pedido.id}_${Date.now()}.${e.target.files[0].name.split('.').pop()}`
                                                                )
                                                            }
                                                            e.target.value = ''
                                                        }}
                                                        disabled={comprobanteUpload.isUploading || saving}
                                                    />
                                                    <label
                                                        htmlFor="comprobante-pago-upload"
                                                        className={`flex flex-col items-center justify-center gap-2 h-32 w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                                                            requiresComprobante ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
                                                        }`}
                                                    >
                                                        {comprobanteUpload.isUploading ? (
                                                            <Loader2 size={24} className="animate-spin" />
                                                        ) : (
                                                            <Upload size={24} className="opacity-50" />
                                                        )}
                                                        <span className="text-xs font-black uppercase tracking-widest mt-1">
                                                            {comprobanteUpload.isUploading ? 'CARGANDO...' : 'SELECCIONAR CAPTURA'}
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Nota */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                Observaciones
                                            </Label>
                                            {requiresNota && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-100 text-rose-600">Requerido</span>}
                                        </div>
                                        <Textarea
                                            placeholder="Detalles adicionales del pago..."
                                            value={nota}
                                            onChange={(e) => setNota(e.target.value)}
                                            className="h-24 bg-white border-none rounded-2xl resize-none font-medium text-sm p-4 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
                                            disabled={saving}
                                        />
                                    </div>

                                    {/* Submit Action */}
                                    <Button
                                        className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-200 transition-all haptic-scale mt-4"
                                        onClick={handleSubmitPago}
                                        disabled={saving || !canSubmit() || comprobanteUpload.isUploading}
                                    >
                                        {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                                        {saving ? 'PROCESANDO...' : `CONFIRMAR INGRESO DE ${monto ? formatCurrency(parseFloat(monto) || 0) : 'S/0.00'}`}
                                    </Button>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Legacy Vouchers (if any) */}
            {pedido.comprobante_pago_url && Array.isArray(pedido.comprobante_pago_url) && pedido.comprobante_pago_url.length > 0 && (
                <div className="px-8 pb-8 pt-4 border-t border-slate-50 bg-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Histórico de Vouchers (Legacy)</p>
                    <div className="flex flex-wrap gap-2">
                        {pedido.comprobante_pago_url.map((url: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => window.open(url, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm text-xs font-bold text-slate-600"
                            >
                                <ExternalLink size={14} /> Voucher {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">Anular Transacción</DialogTitle>
                    </DialogHeader>
                    <div className="py-6">
                        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                            <p className="text-sm font-medium text-rose-800 leading-relaxed">
                                ¿Estás seguro que deseas eliminar permanentemente este registro de pago? Los saldos y el estado del pedido se recalcularán automáticamente.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setConfirmDeleteId(null)} disabled={deletingId !== null} className="h-14 px-8 rounded-2xl font-bold">
                            CANCELAR
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => confirmDeleteId && handleDeletePago(confirmDeleteId)} 
                            disabled={deletingId !== null}
                            className="h-14 px-10 rounded-2xl font-black bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 haptic-scale"
                        >
                            {deletingId !== null ? 'ANULANDO...' : 'CONFIRMAR ANULACIÓN'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
