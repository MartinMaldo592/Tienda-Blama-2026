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
                            onChange={() => setShippingMethod('Lima')}
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



            {/* Submit */}
            <div className="sticky bottom-0 z-50 bg-background/95 backdrop-blur-sm p-4 pb-5 border-t space-y-3 mt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-auto min-h-[3.5rem] py-3 px-4 text-sm sm:text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl transition-all duration-200 hover:scale-[1.01] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 whitespace-normal break-words leading-tight"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" /> Procesando...
                        </span>
                    ) : (
                        <>
                            <span>Confirmar Pedido</span>
                            <span className="hidden sm:inline text-green-300">•</span>
                            <span>Pago al Recibir</span>
                            <span className="text-green-200 font-extrabold">{formatCurrency(total)}</span>
                        </>
                    )}
                </Button>
                <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">🔒 Datos protegidos</span>
                    <span className="flex items-center gap-1">📦 Envío gratis</span>
                    <span className="flex items-center gap-1">🤝 Compra garantizada</span>
                </div>
            </div>
        </div>
    )
}
