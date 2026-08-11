"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Tag, Loader2, Truck, ChevronDown, ChevronUp, Lock } from "lucide-react"

interface CheckoutShopifySummaryProps {
    items: any[]
    subtotal: number
    shippingMethod: string
    discount: number
    total: number
    couponCode: string
    setCouponCode: (val: string) => void
    applyCoupon: () => void
    couponApplying: boolean
    couponApplied: boolean
    couponError: string
    setCouponApplied: (val: boolean) => void
    setCouponError: (val: string) => void
    isSubmitting?: boolean
    customButton?: React.ReactNode
}

export function CheckoutShopifySummary({
    items,
    subtotal,
    shippingMethod,
    discount,
    total,
    couponCode,
    setCouponCode,
    applyCoupon,
    couponApplying,
    couponApplied,
    couponError,
    setCouponApplied,
    setCouponError,
    isSubmitting,
    customButton,
}: CheckoutShopifySummaryProps) {
    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

    // Determinar costo estimado de envío según el método seleccionado
    const getShippingCost = () => {
        if (!shippingMethod) return "Calculando..."
        const clean = shippingMethod.toLowerCase()
        if (clean.includes("express") || clean.includes("olva")) return 15
        if (clean.includes("domicilio")) return 10
        if (clean.includes("shalom") && clean.includes("lima")) return 8
        if (clean.includes("shalom") && clean.includes("provincia")) return "Pago en destino"
        return "Gratis"
    }

    const shippingCost = getShippingCost()

    return (
        <div className="space-y-6">
            {/* Mobile Summary Collapsible Header Button */}
            <div className="lg:hidden bg-slate-900 text-white rounded-2xl p-4 shadow-md">
                <button
                    type="button"
                    onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold"
                >
                    <div className="flex items-center gap-2 text-slate-200">
                        <ShoppingBag className="h-4 w-4 text-[#FF6FA7]" />
                        <span>{mobileSummaryOpen ? "Ocultar resumen del pedido" : "Mostrar resumen del pedido"}</span>
                        {mobileSummaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                    <span className="text-base font-black text-white">
                        S/ {total.toFixed(2)}
                    </span>
                </button>

                {mobileSummaryOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-300">
                        <ProductsList items={items} />
                        <CouponSection
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            applyCoupon={applyCoupon}
                            couponApplying={couponApplying}
                            couponApplied={couponApplied}
                            couponError={couponError}
                            setCouponApplied={setCouponApplied}
                            setCouponError={setCouponError}
                            isSubmitting={isSubmitting}
                            darkTheme
                        />
                        <TotalsBreakdown
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            discount={discount}
                            total={total}
                            darkTheme
                        />
                    </div>
                )}
            </div>

            {/* Desktop Sticky Summary Panel */}
            <div className="hidden lg:block bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[#FF6FA7]" /> Resumen de Compra
                    </h3>
                    <Badge variant="outline" className="font-extrabold bg-[#FFE6EF] text-[#FF6FA7] border-[#FF6FA7]/30">
                        {items.reduce((sum, item) => sum + item.quantity, 0)} artículos
                    </Badge>
                </div>

                {/* Items List */}
                <ProductsList items={items} />

                {/* Coupon Code Section */}
                <CouponSection
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    applyCoupon={applyCoupon}
                    couponApplying={couponApplying}
                    couponApplied={couponApplied}
                    couponError={couponError}
                    setCouponApplied={setCouponApplied}
                    setCouponError={setCouponError}
                    isSubmitting={isSubmitting}
                />

                {/* Totals Breakdown */}
                <TotalsBreakdown
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    discount={discount}
                    total={total}
                />

                {/* Custom Action Button (Culqi or Submit if present) */}
                {customButton && <div className="pt-2">{customButton}</div>}

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-600 font-bold">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <Lock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span>Pago 100% Seguro</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <Truck className="h-4 w-4 text-[#FF6FA7] flex-shrink-0" />
                        <span>Envíos Garantizados</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProductsList({ items }: { items: any[] }) {
    return (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1" data-lenis-prevent>
            {items.map((item) => (
                <div key={`${item.id}-${item.producto_variante_id ?? "base"}`} className="flex items-center gap-3.5 group">
                    <div className="relative h-14 w-14 rounded-xl bg-slate-50 border border-slate-200/90 flex-shrink-0 overflow-hidden shadow-2xs">
                        {item.imagen_url ? (
                            <img
                                src={item.imagen_url}
                                alt={item.nombre}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        )}
                        {/* Quantity Badge on Top-Right Thumbnail */}
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#FF6FA7] text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                            {item.quantity}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 truncate group-hover:text-[#FF6FA7] transition-colors">
                            {item.nombre}
                        </h4>
                        {item.variante_nombre && (
                            <p className="text-[11px] font-medium text-slate-500">{item.variante_nombre}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <span className="text-xs font-black text-slate-900">
                            S/ {(item.precio * item.quantity).toFixed(2)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

function CouponSection({
    couponCode,
    setCouponCode,
    applyCoupon,
    couponApplying,
    couponApplied,
    couponError,
    setCouponApplied,
    setCouponError,
    isSubmitting,
    darkTheme,
}: any) {
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className={`absolute left-3 top-3 h-4 w-4 ${darkTheme ? "text-slate-400" : "text-slate-400"}`} />
                    <Input
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase())
                            setCouponError("")
                        }}
                        disabled={couponApplying || couponApplied || isSubmitting}
                        className={`pl-9 h-10 text-xs font-bold uppercase tracking-wider rounded-xl ${
                            darkTheme
                                ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:border-[#FF6FA7]"
                                : "bg-slate-50 border-slate-200 text-slate-900 focus-visible:border-[#FF6FA7]"
                        }`}
                    />
                </div>
                {couponApplied ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setCouponApplied(false)
                            setCouponCode("")
                        }}
                        className="h-10 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
                    >
                        Quitar
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="sm"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim() || couponApplying || isSubmitting}
                        className="h-10 px-4 text-xs font-bold bg-[#FF6FA7] hover:bg-[#e0558d] text-white rounded-xl shadow-xs transition-colors"
                    >
                        {couponApplying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Aplicar"}
                    </Button>
                )}
            </div>

            {couponApplied && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-between">
                    <span>¡Cupón {couponCode} aplicado!</span>
                </div>
            )}

            {couponError && (
                <p className="text-xs font-medium text-rose-500">{couponError}</p>
            )}
        </div>
    )
}

function TotalsBreakdown({ subtotal, shippingCost, discount, total, darkTheme }: any) {
    return (
        <div className={`space-y-2 text-xs font-medium ${darkTheme ? "text-slate-300" : "text-slate-600"}`}>
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">S/ {subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Descuento Cupón</span>
                    <span>- S/ {discount.toFixed(2)}</span>
                </div>
            )}

            <div className="flex justify-between">
                <span>Envío estimado</span>
                <span className="font-bold text-slate-900 dark:text-white">
                    {typeof shippingCost === "number" ? `S/ ${shippingCost.toFixed(2)}` : shippingCost}
                </span>
            </div>

            <div className={`pt-3 border-t flex justify-between items-center ${darkTheme ? "border-slate-800" : "border-slate-200"}`}>
                <span className="text-sm font-black text-slate-900 dark:text-white">Total</span>
                <div className="text-right">
                    <span className="text-xs font-medium text-slate-400 mr-1">PEN</span>
                    <span className="text-xl font-black text-[#FF6FA7]">
                        S/ {total.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    )
}
