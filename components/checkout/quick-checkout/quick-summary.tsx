"use client"

import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface QuickSummaryProps {
    shippingMethod: string
    setShippingMethod: (v: string) => void
    total: number
    isSubmitting: boolean
}

export function QuickSummary({ shippingMethod, setShippingMethod, total, isSubmitting }: QuickSummaryProps) {
    return (
        <div className="space-y-6">
            <div>
                <Label className="mb-2 block text-sm font-bold">Método de envío <span className="text-destructive">*</span></Label>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input
                            type="radio"
                            name="shipping"
                            value="lima"
                            checked={shippingMethod === 'lima'}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="h-4 w-4 accent-black"
                            disabled={isSubmitting}
                        />
                        <span className="text-sm font-medium">Lima</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input
                            type="radio"
                            name="shipping"
                            value="provincia"
                            checked={shippingMethod === 'provincia'}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="h-4 w-4 accent-black"
                            disabled={isSubmitting}
                        />
                        <span className="text-sm font-medium">Provincia</span>
                    </label>
                </div>
            </div>

            <div className="bg-muted/30 -mx-6 -mb-6 p-4 border-t space-y-3">
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold bg-black hover:bg-gray-800 text-white shadow-lg">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : `CONFIRMO MI PEDIDO POR - ${formatCurrency(total)}`}
                </Button>
            </div>
        </div>
    )
}
