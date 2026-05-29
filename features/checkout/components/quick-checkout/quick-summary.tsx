"use client"

import { formatCurrency } from "@/lib/utils"
import { Loader2, MapPin, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface QuickSummaryProps {
    shippingMethod: string
    setShippingMethod: (v: string) => void
    total: number
    isSubmitting: boolean
}

export function QuickSummary({ shippingMethod, setShippingMethod, total, isSubmitting }: QuickSummaryProps) {
    const isLimaActive = String(shippingMethod || '').toLowerCase().includes('lima')
    const isProvinciaActive = !isLimaActive && (
        String(shippingMethod || '').toLowerCase() === 'provincia' || 
        String(shippingMethod || '').toLowerCase().includes('provincia') ||
        String(shippingMethod || '').toLowerCase().includes('shalom')
    )

    // Sub-metodos para Lima
    const subMethod = shippingMethod === 'Lima (Retiro en Agencia Shalom)' ? 'shalom' : 'delivery'

    const handleLimaSelect = (type: 'delivery' | 'shalom') => {
        if (type === 'delivery') {
            setShippingMethod('Lima (Entrega a Domicilio)')
        } else {
            setShippingMethod('Lima (Retiro en Agencia Shalom)')
        }
    }

    return (
        <div className="space-y-6">
            {/* Shipping method visual cards */}
            <div className="space-y-3">
                <Label className="text-base font-bold text-foreground">
                    Método de Envío <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <label
                        className={cn(
                            "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-muted/50",
                            isLimaActive ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                            isSubmitting ? "pointer-events-none opacity-50" : ""
                        )}
                    >
                        <input
                            type="radio"
                            name="quick-shipping"
                            value="Lima"
                            checked={isLimaActive}
                            onChange={() => handleLimaSelect('delivery')}
                            className="sr-only"
                            disabled={isSubmitting}
                        />
                        <div className={cn(
                            "rounded-full p-2.5 transition-colors duration-200",
                            isLimaActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5 mt-1">
                            <span className={cn("block text-sm font-bold", isLimaActive ? "text-primary" : "text-foreground")}>Lima</span>
                            <span className="block text-xs text-muted-foreground">Envío local</span>
                        </div>
                        {isLimaActive && (
                            <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                        )}
                    </label>

                    <label
                        className={cn(
                            "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-muted/50",
                            isProvinciaActive ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                            isSubmitting ? "pointer-events-none opacity-50" : ""
                        )}
                    >
                        <input
                            type="radio"
                            name="quick-shipping"
                            value="Provincia"
                            checked={isProvinciaActive}
                            onChange={() => setShippingMethod('Provincia')}
                            className="sr-only"
                            disabled={isSubmitting}
                        />
                        <div className={cn(
                            "rounded-full p-2.5 transition-colors duration-200",
                            isProvinciaActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            <Truck className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5 mt-1">
                            <span className={cn("block text-sm font-bold", isProvinciaActive ? "text-primary" : "text-foreground")}>Provincia</span>
                            <span className="block text-xs text-muted-foreground">Envíos a agencia</span>
                        </div>
                        {isProvinciaActive && (
                            <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                        )}
                    </label>
                </div>
            </div>

            {/* Sub-selector de Lima */}
            {isLimaActive && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-bold text-slate-700">Selecciona la modalidad de envío en Lima:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleLimaSelect('delivery')}
                            disabled={isSubmitting}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all text-left cursor-pointer",
                                subMethod === 'delivery'
                                    ? "bg-white border-primary text-primary shadow-sm"
                                    : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                            )}
                        >
                            <span>🛵 Entrega a Domicilio</span>
                            {subMethod === 'delivery' && <span className="text-primary font-bold">✓</span>}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleLimaSelect('shalom')}
                            disabled={isSubmitting}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all text-left cursor-pointer",
                                subMethod === 'shalom'
                                    ? "bg-white border-primary text-primary shadow-sm"
                                    : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                            )}
                        >
                            <span>📦 Retiro en Agencia Shalom</span>
                            {subMethod === 'shalom' && <span className="text-primary font-bold">✓</span>}
                        </button>
                    </div>
                    {subMethod === 'shalom' && (
                        <p className="text-[10px] text-indigo-700 font-medium leading-relaxed bg-indigo-50/50 p-2.5 rounded-md border border-indigo-100">
                            💡 **Retiro en Agencia**: Recoge tu paquete en la oficina de Shalom de tu preferencia en Lima. El costo del flete se paga en ventanilla al retirar.
                        </p>
                    )}
                </div>
            )}

            {/* Submit */}
            <div className="bg-muted/30 -mx-6 -mb-6 p-4 border-t space-y-3">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl"
                >
                    {isSubmitting
                        ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Procesando...</>
                        : `🛵  Confirmar Pedido — ${formatCurrency(total)}`
                    }
                </Button>
            </div>
        </div>
    )
}
