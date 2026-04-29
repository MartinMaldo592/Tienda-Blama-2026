import { MapPin, Save, Copy, RotateCcw, Truck, Pencil, X, Send, Lock, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase.client"
import { PedidoRow } from "@/features/admin/types"

interface OrderShippingCardProps {
    pedido: PedidoRow
    isLocked: boolean
    onLogAction: (action: string, details: string) => Promise<void>
    onRefresh: () => void
}

function FieldGroup({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
            {children}
        </div>
    )
}

export function OrderShippingCard({ pedido, isLocked, onLogAction, onRefresh }: OrderShippingCardProps) {
    const [shalomOrder, setShalomOrder] = useState("")
    const [shalomPass, setShalomPass] = useState("")
    const [shalomPin, setShalomPin] = useState("")
    const [agenciaOrigen, setAgenciaOrigen] = useState("")
    const [agenciaDestino, setAgenciaDestino] = useState("")
    const [savingTracking, setSavingTracking] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const isPaid = ['Pagado', 'Pagado Anticipado', 'Pagado al Recibir'].includes(pedido.pago_status || '')
    const isProvincia = ['provincia', 'Provincia'].includes(pedido.metodo_envio || '')

    const resetFields = () => {
        if (pedido) {
            setShalomOrder(pedido.shalom_orden || "")
            setShalomPass(pedido.shalom_clave || "")
            setShalomPin(pedido.shalom_pin || "")
            setAgenciaOrigen(pedido.agencia_origen || "")
            setAgenciaDestino(pedido.agencia_destino || "")
        }
    }

    useEffect(() => {
        resetFields()
        setIsEditing(false)
    }, [pedido])

    const handleCancel = () => {
        resetFields()
        setIsEditing(false)
    }

    const handleSaveTracking = async () => {
        setSavingTracking(true)
        try {
            const updatePayload = {
                shalom_orden: shalomOrder,
                shalom_clave: shalomPass,
                shalom_pin: shalomPin,
                agencia_origen: agenciaOrigen,
                agencia_destino: agenciaDestino,
                codigo_seguimiento: `${shalomOrder}|${shalomPass}`
            }
            const logMsg = `Tracking: Orden ${shalomOrder}, Código ${shalomPass}, PIN ${shalomPin}`
            const supabase = createClient()
            const { error } = await supabase.from('pedidos').update(updatePayload).eq('id', pedido.id)
            if (error) throw error
            await onLogAction('Tracking Actualizado', logMsg)
            toast.success("Datos de envío guardados correctamente")
            setIsEditing(false)
            onRefresh()
        } catch (error: any) {
            toast.error("Error guardando tracking: " + error.message)
        } finally {
            setSavingTracking(false)
        }
    }

    const sendWhatsApp = (type: 'guia' | 'pin') => {
        const phone = pedido.telefono_contacto || pedido.clientes?.telefono
        if (!phone) {
            toast.error("El cliente no tiene teléfono registrado")
            return
        }
        const nombre = (pedido.nombre_contacto || pedido.clientes?.nombre || 'Cliente').split(' ')[0]
        const orderId = pedido.id.toString().padStart(6, '0')

        let message = ''
        if (type === 'guia') {
            message = `Hola ${nombre}! 👋\n` +
                `Tu pedido #${orderId} ya fue enviado por Shalom.\n\n` +
                `📦 Datos para rastreo:\n` +
                `Nº de Orden: ${shalomOrder}\n` +
                `Código de Orden: ${shalomPass}\n` +
                (agenciaOrigen ? `📍 Origen: ${agenciaOrigen}\n` : '') +
                (agenciaDestino ? `📍 Destino: ${agenciaDestino}\n` : '') +
                `🔗 Rastrea aquí: https://rastrea.shalom.com.pe\n\n` +
                `Para recibir tu clave de retiro, por favor cancela el saldo pendiente.\n` +
                `¡Gracias por tu compra en Blama! 🛍️`
        } else {
            message = `Hola ${nombre}! ✅\n` +
                `¡Tu pago ha sido confirmado! Aquí están tus datos para recoger tu pedido #${orderId} en Shalom:\n\n` +
                `📦 Nº de Orden: ${shalomOrder}\n` +
                `📦 Código de Orden: ${shalomPass}\n` +
                (agenciaDestino ? `📍 Agencia Destino: ${agenciaDestino}\n` : '') +
                `🔐 Clave de Retiro: ${shalomPin}\n\n` +
                `Ya puedes recoger tu paquete en la agencia Shalom de tu ciudad.\n` +
                `¡Gracias por tu compra en Blama! 🛍️`
        }

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/51${phone}?text=${encodedMessage}`, '_blank')
        onLogAction('WhatsApp Enviado', `Envió ${type === 'guia' ? 'Guía de Rastreo' : 'PIN de Retiro'} al cliente`)
    }

    const inputClass = (editing: boolean) =>
        `h-12 font-bold text-sm rounded-xl border-none transition-all focus:ring-4 focus:ring-slate-900/5 ${editing ? 'bg-slate-50' : 'bg-transparent text-slate-900 cursor-default'}`

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-[1rem] flex items-center justify-center text-white shadow-lg ${isProvincia ? 'bg-indigo-600 shadow-indigo-100' : 'bg-blue-600 shadow-blue-100'}`}>
                        <Truck size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Logística</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {isProvincia ? 'Shalom / Agencia' : ['lima', 'Lima'].includes(pedido.metodo_envio || '') ? 'Lima / Delivery' : pedido.metodo_envio || 'Estándar'}
                            </span>
                            {isProvincia && (
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {isPaid ? '🔓 PIN Desbloqueado' : '🔒 PIN Bloqueado'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {!isLocked && (
                    <button
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 transition-all haptic-scale ${isEditing ? 'bg-rose-50 hover:bg-rose-100 text-rose-500 border-rose-100' : 'bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'}`}
                    >
                        {isEditing ? <X size={16} /> : <Pencil size={16} />}
                    </button>
                )}
            </div>

            {/* Tracking Content */}
            <div className="space-y-6">
                {isProvincia ? (
                    <>
                        {/* PIN Block */}
                        <div className={`p-6 rounded-2xl border transition-all duration-500 ${shalomPin ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    🔐 PIN de Retiro (Propio)
                                </p>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isPaid ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-100 text-amber-700'}`}>
                                    {isPaid ? 'Pagado ✓' : 'Falta Pago'}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input
                                        className={`w-full h-14 text-center font-black text-3xl tracking-[0.4em] rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 outline-none ${shalomPin ? 'bg-white text-emerald-700' : 'bg-white/60 text-slate-300'}`}
                                        placeholder="—"
                                        value={shalomPin}
                                        readOnly
                                    />
                                    {shalomPin && (
                                        <button
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                                            onClick={() => { navigator.clipboard.writeText(shalomPin); toast.success("PIN copiado") }}
                                        >
                                            <Copy size={18} />
                                        </button>
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => setShalomPin(Math.floor(1000 + Math.random() * 9000).toString())}
                                        className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm haptic-scale"
                                        title="Generar nuevo PIN"
                                    >
                                        <RotateCcw size={18} />
                                    </button>
                                )}
                            </div>

                            <p className="text-[10px] font-medium text-slate-400 mt-3 leading-relaxed">
                                * Anota este PIN en el paquete antes de enviarlo. Es el candado de seguridad para el retiro en agencia.
                            </p>
                        </div>

                        {/* Shalom Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <FieldGroup label="Agencia Origen">
                                <Input
                                    className={inputClass(isEditing)}
                                    placeholder="Lima - La Victoria"
                                    value={agenciaOrigen}
                                    onChange={(e) => setAgenciaOrigen(e.target.value)}
                                    disabled={isLocked || !isEditing}
                                />
                            </FieldGroup>
                            <FieldGroup label="Agencia Destino">
                                <Input
                                    className={inputClass(isEditing)}
                                    placeholder="Trujillo - Centro"
                                    value={agenciaDestino}
                                    onChange={(e) => setAgenciaDestino(e.target.value)}
                                    disabled={isLocked || !isEditing}
                                />
                            </FieldGroup>
                            <FieldGroup label="Nº Orden Shalom">
                                <Input
                                    className={inputClass(isEditing)}
                                    placeholder="789456"
                                    value={shalomOrder}
                                    onChange={(e) => setShalomOrder(e.target.value)}
                                    disabled={isLocked || !isEditing}
                                />
                            </FieldGroup>
                            <FieldGroup label="Código de Orden">
                                <Input
                                    className={inputClass(isEditing)}
                                    placeholder="3210"
                                    value={shalomPass}
                                    onChange={(e) => setShalomPass(e.target.value)}
                                    disabled={isLocked || !isEditing}
                                />
                            </FieldGroup>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <Button
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black tracking-tight shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all haptic-scale"
                                onClick={handleSaveTracking}
                                disabled={savingTracking}
                            >
                                {savingTracking ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                                GUARDAR TRACKING
                            </Button>
                        )}

                        {/* WhatsApp Actions */}
                        {shalomOrder && shalomPass && (
                            <div className="space-y-3 pt-2 border-t border-slate-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notificar al Cliente</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => sendWhatsApp('guia')}
                                        className="w-full flex items-center justify-between h-14 px-5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-100 rounded-2xl transition-all haptic-scale group"
                                    >
                                        <span className="flex items-center gap-3 font-black text-xs uppercase tracking-wider">
                                            <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                            Enviar Guía de Rastreo
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-sky-200 text-sky-800 rounded-lg">SIN PIN</span>
                                    </button>

                                    <button
                                        onClick={() => isPaid && sendWhatsApp('pin')}
                                        disabled={!isPaid}
                                        className={`w-full flex items-center justify-between h-14 px-5 border rounded-2xl transition-all font-black text-xs uppercase tracking-wider group ${
                                            isPaid
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-100 haptic-scale'
                                                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                        }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Lock size={16} />
                                            Enviar PIN de Retiro
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isPaid ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {isPaid ? 'HABILITADO' : 'BLOQUEADO'}
                                        </span>
                                    </button>

                                    {!isPaid && (
                                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-wide">
                                                El envío del PIN queda desbloqueado automáticamente cuando el pedido esté marcado como pagado.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => window.open('https://shalom.com.pe/rastrea', '_blank')}
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <Truck size={14} /> Portal de Rastreo Shalom
                        </button>
                    </>
                ) : (
                    /* Lima / Standard */
                    <div className="space-y-6">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notas de Seguimiento</p>
                            <Input
                                placeholder="Ej: Entregado a motorizado Carlos"
                                value={shalomOrder}
                                onChange={(e) => setShalomOrder(e.target.value)}
                                disabled={isLocked || !isEditing}
                                className="h-12 bg-white border-none rounded-xl font-bold focus:ring-4 focus:ring-slate-900/5"
                            />
                        </div>

                        {isEditing && (
                            <Button
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-200 haptic-scale"
                                onClick={handleSaveTracking}
                                disabled={savingTracking}
                            >
                                {savingTracking ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                                GUARDAR NOTA
                            </Button>
                        )}

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Entrega Lima — Registra el estado arriba y los pagos en la sección de pagos.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
