import { MapPin, Save, Copy, RotateCcw, Truck, Pencil, X } from "lucide-react"
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
    const [trackingCode, setTrackingCode] = useState("")
    const [shalomOrder, setShalomOrder] = useState("")
    const [shalomPass, setShalomPass] = useState("")
    const [shalomPin, setShalomPin] = useState("")
    const [savingTracking, setSavingTracking] = useState(false)

    const [isEditing, setIsEditing] = useState(false)

    const resetFields = () => {
        if (pedido) {
            setTrackingCode(pedido.codigo_seguimiento || "")
            // Normalize Shalom variables
            if (pedido.shalom_orden || pedido.shalom_clave) {
                setShalomOrder(pedido.shalom_orden || "")
                setShalomPass(pedido.shalom_clave || "")
                setShalomPin(pedido.shalom_pin || "")
            } else {
                const parts = (pedido.codigo_seguimiento || "").split('|')
                setShalomOrder(parts[0] || "")
                setShalomPass(parts[1] || "")
                setShalomPin(pedido.shalom_pin || "")
            }
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

    async function handleSaveTracking() {
        setSavingTracking(true)
        try {
            let updatePayload: any = {}
            let logMsg = ""

            // Combine for legacy
            const combined = `${shalomOrder}|${shalomPass}`
            updatePayload = {
                codigo_seguimiento: combined,
                shalom_orden: shalomOrder,
                shalom_clave: shalomPass,
                shalom_pin: shalomPin
            }
            logMsg = `Tracking: Orden ${shalomOrder}, Código ${shalomPass}, PIN ${shalomPin}`

            const supabase = createClient()
            const { error } = await supabase
                .from('pedidos')
                .update(updatePayload)
                .eq('id', pedido.id)

            if (error) throw error

            setTrackingCode(combined)
            await onLogAction('Tracking Actualizado', logMsg)
            toast.success("Código de seguimiento guardado")
            setIsEditing(false)
            onRefresh()
        } catch (error: any) {
            toast.error("Error guardando tracking: " + error.message)
        } finally {
            setSavingTracking(false)
        }
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

            {/* Method Badge */}
            <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Método</p>
                <Badge variant="outline" className="mt-1">
                    {['provincia', 'Provincia'].includes(pedido.metodo_envio || '') ? 'Provincia' : ['lima', 'Lima'].includes(pedido.metodo_envio || '') ? 'Lima' : pedido.metodo_envio || 'Estándar'}
                </Badge>
            </div>

            {/* Tracking Logic */}
            <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-gray-700">Seguimiento</p>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-blue-700">Orden / Guía</label>
                            <div className="relative">
                                <Input
                                    className="bg-white h-8 text-sm pr-8"
                                    placeholder="Ej: 123456"
                                    value={shalomOrder}
                                    onChange={(e) => setShalomOrder(e.target.value)}
                                    disabled={isLocked || !isEditing}
                                />
                                {shalomOrder && (
                                    <button
                                        className="absolute right-2 top-1.5 text-blue-400 hover:text-blue-600"
                                        onClick={() => {
                                            navigator.clipboard.writeText(shalomOrder)
                                            toast.success("Orden copiada")
                                        }}
                                        title="Copiar Orden"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-blue-700">Código / Clave</label>
                            <div className="relative">
                                <Input
                                    className="bg-white h-8 text-sm pr-8"
                                    placeholder="Ej: 3456"
                                    value={shalomPass}
                                    onChange={(e) => setShalomPass(e.target.value)}
                                    disabled={isLocked || !isEditing}
                                />
                                {shalomPass && (
                                    <button
                                        className="absolute right-2 top-1.5 text-blue-400 hover:text-blue-600"
                                        onClick={() => {
                                            navigator.clipboard.writeText(shalomPass)
                                            toast.success("Clave copiada")
                                        }}
                                        title="Copiar Clave"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-2">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-medium text-blue-700">PIN (Generado)</label>
                            <div className="relative">
                                <Input
                                    className="bg-white h-8 text-sm pr-8 font-mono"
                                    placeholder="----"
                                    value={shalomPin}
                                    readOnly
                                />
                                {shalomPin && (
                                    <button
                                        className="absolute right-2 top-1.5 text-blue-400 hover:text-blue-600"
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
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 bg-blue-200 text-blue-800 hover:bg-blue-300 border-none"
                            onClick={() => {
                                const pin = Math.floor(1000 + Math.random() * 9000).toString()
                                setShalomPin(pin)
                            }}
                            disabled={isLocked || !isEditing}
                            title="Generar nuevo PIN"
                        >
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                    </div>

                    {!isLocked && isEditing && (
                        <Button
                            className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            onClick={handleSaveTracking}
                            disabled={savingTracking}
                        >
                            <Save className="h-3 w-3 mr-1" />
                            {savingTracking ? 'Guardando...' : 'Guardar Tracking'}
                        </Button>
                    )}
                </div>

                {/* Tracking Link Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                        window.open(`https://shalom.com.pe/rastrea`, '_blank')
                    }}
                >
                    <Truck className="h-4 w-4" />
                    Rastrear en Shalom
                </Button>
            </div>
        </div>
    )
}
