import { MapPin, Save, Copy, RotateCcw, Truck, Pencil, X, Send, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

export function OrderShippingCard({ pedido, isLocked, onLogAction, onRefresh }: OrderShippingCardProps) {
    const [shalomOrder, setShalomOrder] = useState("")
    const [shalomPass, setShalomPass] = useState("")
    const [shalomPin, setShalomPin] = useState("")
    const [agenciaOrigen, setAgenciaOrigen] = useState("")
    const [agenciaDestino, setAgenciaDestino] = useState("")
    const [savingTracking, setSavingTracking] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Determine if fully paid
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
                // Mantener codigo_seguimiento actualizado por si acaso se usa en otro lado (legacy)
                codigo_seguimiento: `${shalomOrder}|${shalomPass}`
            }

            const logMsg = `Tracking: Orden ${shalomOrder}, Código ${shalomPass}, PIN ${shalomPin}`

            const supabase = createClient()
            const { error } = await supabase
                .from('pedidos')
                .update(updatePayload)
                .eq('id', pedido.id)

            if (error) throw error

            await onLogAction('Tracking Actualizado', logMsg)
            toast.success("Datos de envío guardados")
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

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Envío
                </h2>
                {!isLocked && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                    >
                        {isEditing ? (
                            <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        ) : (
                            <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                        )}
                    </Button>
                )}
            </div>

            {/* Method Badge & Status */}
            <div className="border-b pb-3 flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">Método</p>
                    <Badge variant="outline" className="mt-1">
                        {isProvincia ? 'Provincia' : ['lima', 'Lima'].includes(pedido.metodo_envio || '') ? 'Lima' : pedido.metodo_envio || 'Estándar'}
                    </Badge>
                </div>
                {isProvincia && (
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Estado de PIN</p>
                        <Badge variant="secondary" className={`mt-1 gap-1 ${isPaid ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                            {isPaid ? <><Lock className="h-3 w-3" /> Desbloqueado</> : <><Lock className="h-3 w-3" /> Bloqueado</>}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Tracking Logic */}
            <div className="space-y-4 pt-2">
                {isProvincia ? (
                    // PROVINCIA UI
                    <div className="space-y-4">
                        {/* PIN Generator first - Workflow priority */}
                        <div className={`p-3 rounded-lg border space-y-2 transition-colors ${shalomPin ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                    🔐 PIN DE RETIRO (Generar TÚ)
                                </label>
                                {isPaid ? <Badge className="bg-green-500 text-[10px] h-5">Pagado</Badge> : <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-[10px] h-5">Falta Pago</Badge>}
                            </div>

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        className="bg-white h-9 text-lg font-mono tracking-widest text-center font-bold"
                                        placeholder="----"
                                        value={shalomPin}
                                        readOnly
                                    />
                                    {shalomPin && (
                                        <button
                                            className="absolute right-2 top-0 bottom-0 text-gray-400 hover:text-blue-600 px-2"
                                            onClick={() => {
                                                navigator.clipboard.writeText(shalomPin)
                                                toast.success("PIN copiado")
                                            }}
                                            title="Copiar PIN"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                {!isLocked && isEditing && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-9 w-9 p-0 border-dashed border-gray-300"
                                        onClick={() => {
                                            const pin = Math.floor(1000 + Math.random() * 9000).toString()
                                            setShalomPin(pin)
                                            // Handle direct save if needed or rely on main save
                                        }}
                                        title="Generar nuevo PIN"
                                    >
                                        <RotateCcw className="h-4 w-4 text-gray-500" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-500">
                                * Genera este PIN y anótalo en el paquete (o dáselo si lo piden). Es TU candado de seguridad.
                            </p>
                        </div>

                        {/* Shalom Tracking Info */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700">Datos del Ticket Shalom</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Agencia Origen</label>
                                    <Input
                                        className="h-8 text-sm bg-white"
                                        placeholder="Ej: Lima - La Victoria"
                                        value={agenciaOrigen}
                                        onChange={(e) => setAgenciaOrigen(e.target.value)}
                                        disabled={isLocked || !isEditing}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Agencia Destino</label>
                                    <Input
                                        className="h-8 text-sm bg-white"
                                        placeholder="Ej: Trujillo - Centro"
                                        value={agenciaDestino}
                                        onChange={(e) => setAgenciaDestino(e.target.value)}
                                        disabled={isLocked || !isEditing}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Nº Orden</label>
                                    <Input
                                        className="h-8 text-sm bg-white"
                                        placeholder="Ej: 789456"
                                        value={shalomOrder}
                                        onChange={(e) => setShalomOrder(e.target.value)}
                                        disabled={isLocked || !isEditing}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Código</label>
                                    <Input
                                        className="h-8 text-sm bg-white"
                                        placeholder="Ej: 3210"
                                        value={shalomPass}
                                        onChange={(e) => setShalomPass(e.target.value)}
                                        disabled={isLocked || !isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-2">
                            {!isLocked && isEditing && (
                                <Button
                                    className="w-full h-8 text-xs mb-2"
                                    size="sm"
                                    onClick={handleSaveTracking}
                                    disabled={savingTracking}
                                >
                                    <Save className="h-3 w-3 mr-1" />
                                    {savingTracking ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            )}

                            {/* WhatsApp Buttons */}
                            {shalomOrder && shalomPass && (
                                <div className="grid grid-cols-1 gap-2">
                                    {/* Send Guide Button - Always available if data exists */}
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between text-blue-600 border-blue-200 hover:bg-blue-50"
                                        onClick={() => sendWhatsApp('guia')}
                                    >
                                        <span className="flex items-center gap-2"><Send className="h-3 w-3" /> Enviar Guía (Rastreo)</span>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">Sin PIN</Badge>
                                    </Button>

                                    {/* Send PIN Button - Locked logic */}
                                    <Button
                                        variant={isPaid ? "default" : "secondary"}
                                        className={`w-full justify-between ${isPaid ? 'bg-green-600 hover:bg-green-700' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={() => isPaid && sendWhatsApp('pin')}
                                        disabled={!isPaid}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isPaid ? <Lock className="h-3 w-3 text-white" /> : <Lock className="h-3 w-3" />}
                                            Enviar PIN de Retiro
                                        </span>
                                        {isPaid ? (
                                            <Badge className="bg-white/20 text-white hover:bg-white/30 text-[10px]">Habilitado</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-500 text-[10px]">Falta Pago</Badge>
                                        )}
                                    </Button>

                                    {!isPaid && (
                                        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded text-[10px] text-amber-700 border border-amber-100">
                                            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                                            <span>El envío del PIN está bloqueado hasta que el pedido esté PAGADO.</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-gray-400 hover:text-blue-600 gap-1 mt-2"
                                onClick={() => window.open(`https://shalom.com.pe/rastrea`, '_blank')}
                            >
                                <Truck className="h-3 w-3" /> Abrir web de Shalom
                            </Button>
                        </div>
                    </div>
                ) : (
                    // LIMA / ESTÁNDAR UI
                    <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Notas de seguimiento</p>
                            <Input
                                placeholder="Ej: Entregado a motorizado Carlos"
                                value={shalomOrder} // Reusing field as general note for Lima
                                onChange={(e) => setShalomOrder(e.target.value)}
                                disabled={isLocked || !isEditing}
                                className="bg-white"
                            />
                        </div>

                        {!isLocked && isEditing && (
                            <Button
                                className="w-full h-8 text-xs"
                                size="sm"
                                onClick={handleSaveTracking}
                                disabled={savingTracking}
                            >
                                <Save className="h-3 w-3 mr-1" />
                                Guardar
                            </Button>
                        )}

                        <p className="text-xs text-gray-400 italic text-center">
                            Para Lima, gestiona el estado arriba y registra el pago en la tarjeta de pagos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
