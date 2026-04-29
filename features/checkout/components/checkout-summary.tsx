import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Tag, X, ChevronDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { memo, useState } from "react"

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
    customButton?: React.ReactNode
}

export const CheckoutSummary = memo(function CheckoutSummary({
    subtotal, shippingMethod, discount, total,
    couponCode, setCouponCode, applyCoupon, couponApplying, couponApplied, couponError, setCouponApplied, setCouponError,
    isSubmitting,
    customButton
}: CheckoutSummaryProps) {
    const [showCoupon, setShowCoupon] = useState(false)

    return (
        <div className="space-y-4 mb-4">

            {/* Coupon toggle button */}
            {!showCoupon ? (
                <button
                    type="button"
                    onClick={() => setShowCoupon(true)}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                >
                    <Tag className="h-4 w-4" />
                    <span>¿Tienes un cupón de descuento?</span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                </button>
            ) : (
                <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                            <Tag className="h-4 w-4 text-primary" /> Cupón de descuento
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCoupon(false)
                                setCouponCode("")
                                setCouponApplied(false)
                                setCouponError("")
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            id="coupon"
                            placeholder="Ej: PROMO10"
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase())
                                setCouponApplied(false)
                                setCouponError("")
                            }}
                            disabled={isSubmitting || couponApplied}
                            className="h-11 bg-background font-mono tracking-widest uppercase"
                        />
                        <Button
                            type="button"
                            variant={couponApplied ? "secondary" : "outline"}
                            onClick={applyCoupon}
                            disabled={isSubmitting || couponApplying || !couponCode.trim() || couponApplied}
                            className="shrink-0 h-11"
                        >
                            {couponApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : couponApplied ? "✓ Aplicado" : "Aplicar"}
                        </Button>
                    </div>
                    {couponError && (
                        <p className="text-xs text-destructive font-medium flex items-center gap-1">
                            <X className="h-3 w-3" /> {couponError}
                        </p>
                    )}
                    {couponApplied && !couponError && (
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            ✓ Cupón aplicado — descuento de {formatCurrency(discount)}
                        </p>
                    )}
                </div>
            )}

            {/* Totals */}
            <div className="text-sm font-medium space-y-1 py-2 border-y border-border/50">
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Envío:</span>
                    <span>{(shippingMethod === 'Provincia' || shippingMethod === 'provincia') ? 'Precio a calcular' : 'Gratis'}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-semibold">
                        <span>Descuento:</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-base">Total a Pagar:</span>
                    <span className="text-xl font-bold">{formatCurrency(total)}</span>
                </div>
            </div>

            {/* Submit button */}
            {customButton ? (
                customButton
            ) : (
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-bold shadow-sm" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : "🛵  Confirmar Pedido"}
                </Button>
            )}
        </div>
    )
})
