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
    const isLima = shippingMethod === 'Lima'
    const isProvincia = shippingMethod === 'Provincia'

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
                            isLima ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                            isSubmitting ? "pointer-events-none opacity-50" : ""
                        )}
                    >
                        <input
                            type="radio"
                            name="quick-shipping"
                            value="Lima"
                            checked={isLima}
                            onChange={() => setShippingMethod('Lima')}
                            className="sr-only"
                            disabled={isSubmitting}
                        />
                        <div className={cn(
                            "rounded-full p-2.5 transition-colors duration-200",
                            isLima ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5 mt-1">
                            <span className={cn("block text-sm font-bold", isLima ? "text-primary" : "text-foreground")}>Lima</span>
                            <span className="block text-xs text-muted-foreground">Envío local</span>
                        </div>
                        {isLima && (
                            <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                        )}
                    </label>

                    <label
                        className={cn(
                            "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-muted/50",
                            isProvincia ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                            isSubmitting ? "pointer-events-none opacity-50" : ""
                        )}
                    >
                        <input
                            type="radio"
                            name="quick-shipping"
                            value="Provincia"
                            checked={isProvincia}
                            onChange={() => setShippingMethod('Provincia')}
                            className="sr-only"
                            disabled={isSubmitting}
                        />
                        <div className={cn(
                            "rounded-full p-2.5 transition-colors duration-200",
                            isProvincia ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            <Truck className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5 mt-1">
                            <span className={cn("block text-sm font-bold", isProvincia ? "text-primary" : "text-foreground")}>Provincia</span>
                            <span className="block text-xs text-muted-foreground">Envíos a agencia</span>
                        </div>
                        {isProvincia && (
                            <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                        )}
                    </label>
                </div>
            </div>

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
