"use client"

import Image from "next/image"
import { CreditCard, ExternalLink, Trash2, Plus, Upload, X, Banknote, Smartphone, Building2, HelpCircle } from "lucide-react"
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

interface OrderPaymentCardProps {
    pedido: PedidoRow
    isLocked: boolean
    currentUser: string
    onLogAction: (action: string, details: string) => Promise<void>
    onRefresh: () => void
}

const METODO_ICONS: Record<string, React.ReactNode> = {
    'Efectivo': <Banknote className="h-4 w-4" />,
    'Yape': <Smartphone className="h-4 w-4" />,
    'Plin': <Smartphone className="h-4 w-4" />,
    'Transferencia BCP': <Building2 className="h-4 w-4" />,
    'Transferencia Interbank': <Building2 className="h-4 w-4" />,
    'Otro': <HelpCircle className="h-4 w-4" />,
}

const METODOS_REQUIEREN_COMPROBANTE = ['Yape', 'Plin', 'Transferencia BCP', 'Transferencia Interbank']

const PAGO_STATUS_STYLES: Record<string, string> = {
    'Pendiente': 'bg-red-100 text-red-800 border-red-200',
    'Pago Parcial': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Pagado': 'bg-green-100 text-green-800 border-green-200',
    'Pago Contraentrega': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pagado Anticipado': 'bg-green-100 text-green-800 border-green-200',
    'Pagado al Recibir': 'bg-green-100 text-green-800 border-green-200',
}

export function OrderPaymentCard({ pedido, isLocked, currentUser, onLogAction, onRefresh }: OrderPaymentCardProps) {
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
            ? 'Pagado'
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
                    ? 'Pagado'
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

            const newEstado = newTotal <= 0 ? 'Pendiente' : newTotal >= (pedido.total || 0) ? 'Pagado' : 'Pago Parcial'
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

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Control de Pagos
            </h2>

            {/* Summary Bar */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total del Pedido</span>
                    <span className="font-bold">{formatCurrency(pedido.total || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Pagado</span>
                    <span className="font-bold text-green-700">{formatCurrency(totalPagado)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Saldo Pendiente</span>
                    <span className={`font-bold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(saldoPendiente)}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${porcentajePagado >= 100
                                ? 'bg-green-500'
                                : porcentajePagado > 0
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-200'
                                }`}
                            style={{ width: `${porcentajePagado}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">{porcentajePagado}%</span>
                        <Badge variant="outline" className={`text-xs ${PAGO_STATUS_STYLES[estadoPagoCalculado] || 'bg-gray-100 text-gray-800'}`}>
                            {estadoPagoCalculado}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Coupon Info */}
            {pedido.cupon_codigo && (
                <div className="pt-2 border-t">
                    <p className="text-sm text-gray-500">Cupón aplicado</p>
                    <p className="font-mono text-sm font-bold text-green-700">{pedido.cupon_codigo}</p>
                </div>
            )}

            {/* Stock Info */}
            <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">Stock</p>
                <p className="text-sm">
                    {pedido.stock_descontado ?
                        <span className="text-green-600 flex items-center gap-1">✔ Descontado</span> :
                        <span className="text-amber-600">⚠ No descontado</span>
                    }
                </p>
            </div>

            {/* Payment History */}
            <div className="pt-3 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Historial de Pagos</p>

                {loadingPagos ? (
                    <p className="text-xs text-gray-400 text-center py-4">Cargando pagos...</p>
                ) : pagos.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-sm text-gray-400">No hay pagos registrados</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pagos.map((pago) => (
                            <div key={pago.id} className={`p-3 rounded-lg border ${pago.tipo_pago === 'Reembolso' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1 min-w-0">
                                        <div className={`mt-0.5 p-1.5 rounded ${pago.tipo_pago === 'Reembolso' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {METODO_ICONS[pago.metodo_pago] || <CreditCard className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`font-bold text-sm ${pago.tipo_pago === 'Reembolso' ? 'text-red-700' : 'text-gray-900'}`}>
                                                    {pago.tipo_pago === 'Reembolso' ? '-' : ''}{formatCurrency(pago.monto)}
                                                </span>
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                    {pago.metodo_pago}
                                                </Badge>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {pago.tipo_pago}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {new Date(pago.created_at).toLocaleString('es-PE', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })} — {pago.registrado_por}
                                            </p>
                                            {pago.nota && (
                                                <p className="text-xs text-gray-500 mt-1 italic">📝 {pago.nota}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        {pago.comprobante_url && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700"
                                                onClick={() => window.open(pago.comprobante_url!, '_blank')}
                                                title="Ver comprobante"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                        {!isLocked && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                                                onClick={() => setConfirmDeleteId(pago.id)}
                                                title="Eliminar pago"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnail if image */}
                                {pago.comprobante_url && pago.comprobante_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                                    <div className="relative w-full h-24 bg-gray-100 rounded-md overflow-hidden border mt-2 cursor-pointer"
                                        onClick={() => window.open(pago.comprobante_url!, '_blank')}>
                                        <Image
                                            src={pago.comprobante_url}
                                            alt="Comprobante"
                                            fill
                                            className="object-cover"
                                            sizes="300px"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Register Payment Form */}
            {!isLocked && (
                <div className="pt-3 border-t">
                    {!showForm ? (
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-dashed"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus className="h-4 w-4" /> Registrar Nuevo Pago
                        </Button>
                    ) : (
                        <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-blue-900">Nuevo Pago</p>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={resetForm}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Monto */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Monto <span className="text-destructive">*</span></Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0.00"
                                        value={monto}
                                        onChange={(e) => setMonto(e.target.value)}
                                        className="bg-white"
                                        disabled={saving}
                                    />
                                    {saldoPendiente > 0 && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="shrink-0 text-xs"
                                            onClick={handleFillSaldo}
                                            disabled={saving}
                                        >
                                            Saldo: {formatCurrency(saldoPendiente)}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Método de Pago */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Método de Pago <span className="text-destructive">*</span></Label>
                                <Select value={metodoPago} onValueChange={setMetodoPago} disabled={saving}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Efectivo">💵 Efectivo</SelectItem>
                                        <SelectItem value="Yape">📱 Yape</SelectItem>
                                        <SelectItem value="Plin">📱 Plin</SelectItem>
                                        <SelectItem value="Transferencia BCP">🏦 Transferencia BCP</SelectItem>
                                        <SelectItem value="Transferencia Interbank">🏦 Transferencia Interbank</SelectItem>
                                        <SelectItem value="Otro">📝 Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tipo de Pago */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Tipo <span className="text-destructive">*</span></Label>
                                <Select value={tipoPago} onValueChange={setTipoPago} disabled={saving}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Adelanto">Adelanto</SelectItem>
                                        <SelectItem value="Abono">Abono</SelectItem>
                                        <SelectItem value="Pago Final">Pago Final</SelectItem>
                                        <SelectItem value="Reembolso">Reembolso (resta)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Comprobante Upload */}
                            {metodoPago && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">
                                        Comprobante {requiresComprobante && <span className="text-destructive">* Obligatorio</span>}
                                        {!requiresComprobante && <span className="text-gray-400">(opcional)</span>}
                                    </Label>

                                    {comprobanteUrl ? (
                                        <div className="space-y-2">
                                            {comprobanteUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                                                <div className="relative w-full h-28 bg-gray-100 rounded-lg overflow-hidden border">
                                                    <Image src={comprobanteUrl} alt="Comprobante" fill className="object-cover" sizes="300px" />
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => window.open(comprobanteUrl!, '_blank')}>
                                                    Ver Comprobante
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs text-red-600 hover:bg-red-50" onClick={() => setComprobanteUrl(null)}>
                                                    <X className="h-3 w-3 mr-1" /> Quitar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="comprobante-pago-upload"
                                                className="hidden"
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
                                                className={`cursor-pointer block w-full text-center border border-dashed rounded-lg p-3 transition-colors ${requiresComprobante
                                                    ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Upload className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                                                <span className="text-xs font-medium text-blue-600">
                                                    {comprobanteUpload.isUploading ? 'Subiendo...' : '📷 Subir captura / voucher'}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Nota */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">
                                    Nota {requiresNota && <span className="text-destructive">* Obligatoria</span>}
                                    {!requiresNota && <span className="text-gray-400">(opcional)</span>}
                                </Label>
                                <Textarea
                                    placeholder="Ej: Cliente yapeó desde otro número..."
                                    value={nota}
                                    onChange={(e) => setNota(e.target.value)}
                                    className="bg-white min-h-[60px] text-sm"
                                    disabled={saving}
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                className="w-full gap-2"
                                onClick={handleSubmitPago}
                                disabled={saving || !canSubmit() || comprobanteUpload.isUploading}
                            >
                                {saving ? 'Registrando...' : `✅ Registrar Pago${monto ? ` — ${formatCurrency(parseFloat(monto) || 0)}` : ''}`}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Legacy payment vouchers (backward compat) */}
            {pedido.comprobante_pago_url && Array.isArray(pedido.comprobante_pago_url) && pedido.comprobante_pago_url.length > 0 && (
                <div className="pt-3 border-t">
                    <p className="text-xs text-gray-400 mb-2">Comprobantes anteriores (legacy)</p>
                    {pedido.comprobante_pago_url.map((url: string, index: number) => (
                        <div key={index} className="p-2 border rounded bg-gray-50 flex items-center gap-2 mb-2">
                            <ExternalLink className="h-4 w-4 text-green-600" />
                            <span className="text-xs flex-1">Voucher {index + 1}</span>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.open(url, '_blank')}>
                                Ver
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Payment Confirmation */}
            <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Pago</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-gray-500">¿Estás seguro que deseas eliminar este registro de pago? Esta acción no se puede deshacer.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteId(null)} disabled={deletingId !== null}>Cancelar</Button>
                        <Button variant="destructive" onClick={() => confirmDeleteId && handleDeletePago(confirmDeleteId)} disabled={deletingId !== null}>
                            {deletingId !== null ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
