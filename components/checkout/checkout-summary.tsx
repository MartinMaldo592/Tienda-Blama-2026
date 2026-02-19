import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface CheckoutSummaryProps {
    subtotal: number
    shippingMethod: string
    discount: number
    total: number

    // Coupon
    couponCode: string
    setCouponCode: (val: string) => void
    applyCoupon: () => void
    couponApplying: boolean
    couponApplied: boolean
    couponError: string
    setCouponApplied: (val: boolean) => void
    setCouponError: (val: string) => void

    isSubmitting: boolean
    customButton?: React.ReactNode // Nuevo prop para inyectar botón (Culqi)
}

import { memo } from "react"

// ... imports ...

export const CheckoutSummary = memo(function CheckoutSummary({
    subtotal, shippingMethod, discount, total,
    couponCode, setCouponCode, applyCoupon, couponApplying, couponApplied, couponError, setCouponApplied, setCouponError,
    isSubmitting,
    customButton
}: CheckoutSummaryProps) {
    return (
        <div className="space-y-4 mb-4">
            <div className="space-y-2">
                <Label htmlFor="coupon">Cupón de descuento (Opcional)</Label>
                <div className="flex gap-2">
                    <Input
                        id="coupon"
                        placeholder="Ej: PROMO10"
                        value={couponCode}
                        onChange={(e) => {
                            setCouponCode(e.target.value)
                            setCouponApplied(false)
                            setCouponError("")
                        }}
                        disabled={isSubmitting}
                    />
                    <Button type="button" variant="outline" onClick={applyCoupon} disabled={isSubmitting || couponApplying}>
                        {couponApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                    </Button>
                </div>
                {couponError && (
                    <p className="text-xs text-destructive">{couponError}</p>
                )}
                {couponApplied && !couponError && (
                    <p className="text-xs text-green-600">Cupón aplicado</p>
                )}
            </div>

            <div className="text-sm font-medium space-y-1 py-2 border-y border-border/50">
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Envío:</span>
                    <span>{shippingMethod === 'provincia' ? 'Precio a calcular' : 'Gratis'}</span>
                </div>
                <div className="flex justify-between items-center text-red-500">
                    <span>Descuento:</span>
                    <span>-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-base">Total a Pagar:</span>
                    <span className="text-xl font-bold">{formatCurrency(total)}</span>
                </div>
            </div>

            {/* Renderizar botón personalizado (Culqi) o botón por defecto (WhatsApp) */}
            {customButton ? (
                customButton
            ) : (
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-bold shadow-sm" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : "Confirmar Pedido en WhatsApp"}
                </Button>
            )}
        </div>
    )
})
