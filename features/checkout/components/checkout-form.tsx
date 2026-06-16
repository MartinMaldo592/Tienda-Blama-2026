"use client"

import { useEffect } from "react"
import { useJsApiLoader } from "@react-google-maps/api"
import { m, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Controller } from "react-hook-form"

// Modular components
import { CheckoutShipping } from "@/features/checkout/components/checkout-shipping"
import { CheckoutCustomer } from "@/features/checkout/components/checkout-customer"
import { CheckoutAddress } from "@/features/checkout/components/checkout-address"
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary"
import { CheckoutPayment } from "@/features/checkout/components/checkout-payment"
import { CulqiPaymentButton } from "@/features/checkout/components/culqi-payment-button"

// Hook
import { useCheckoutForm } from "@/features/checkout/hooks/useCheckoutForm"

const libraries: ("places")[] = ["places"]

interface CheckoutFormProps {
    items: any[]
    total: number
    onBack: () => void
    onComplete: () => void
    /** Callback específica para el flujo Culqi (tarjeta). Si se pasa, cierra el
     *  carrito directamente en lugar de mostrar la pantalla de éxito intermedia. */
    onCompleteCulqi?: () => void
}

export function CheckoutForm({ items, total, onBack, onComplete, onCompleteCulqi }: CheckoutFormProps) {
    // Usamos el hook de forma no bloqueante.
    // Como ya existe un cargador global en Providers, esto solo se asegura de que este componente tenga acceso si es necesario.
    useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    })

    return <FormContent items={items} total={total} onBack={onBack} onComplete={onComplete} onCompleteCulqi={onCompleteCulqi} />
}

function FormContent({ items, total, onBack, onComplete, onCompleteCulqi }: CheckoutFormProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        errors,
        paymentMethod,
        shippingMethod,
        isRedirecting,
        isSubmitting,
        couponCode,
        setCouponCode,
        couponDiscount,
        couponApplying,
        couponError,
        couponApplied,
        setCouponApplied,
        setCouponError,
        ready,
        value,
        setValue,
        suggestions,
        suggestionsStatus,
        handleSelect,
        subtotalAmount,
        discountAmount,
        totalToPay,
        handleApplyCoupon,
        validateFieldsForCulqi,
        onSubmit,
        handleCulqiToken,
    } = useCheckoutForm({ items, total, onComplete, onCompleteCulqi })

    // Prevent keyboard from opening automatically on mobile
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
            }
            window.scrollTo(0, 0)
        }
    }, [])

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col h-full outline-none"
            >
                <div className="p-4 border-b flex items-center gap-2 bg-popover">
                    <Button type="button" variant="ghost" size="icon" onClick={onBack} disabled={isSubmitting} className="h-8 w-8 hover:bg-popover/80">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold text-foreground">Datos de Envío</h3>
                </div>

                {/* Scroll area */}
                <div className="relative flex-1 min-h-0">
                    <div
                        className="h-full overflow-y-auto p-4 space-y-6 scroll-smooth pb-8"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--border)) transparent' }}
                        data-lenis-prevent
                    >
                        <CheckoutCustomer
                            register={register}
                            errors={errors}
                            watch={watch}
                            disabled={isSubmitting}
                        />

                        <CheckoutAddress
                            register={register}
                            errors={errors}
                            watch={watch}
                            addressValue={value}
                            onAddressChange={(val) => {
                                setValue(val)
                            }}
                            addressReady={ready}
                            suggestions={suggestions}
                            suggestionsStatus={suggestionsStatus}
                            onSuggestionSelect={handleSelect}
                            disabled={isSubmitting}
                            apiKeyMissing={!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                        />

                        <Controller
                            control={control}
                            name="shippingMethod"
                            render={({ field }) => (
                                <CheckoutShipping value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                            )}
                        />

                        <Controller
                            control={control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <CheckoutPayment
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isSubmitting}
                                    shippingMethod={shippingMethod}
                                />
                            )}
                        />

                        <div className="pt-4 border-t mt-4">
                            <CheckoutSummary
                                subtotal={subtotalAmount}
                                shippingMethod={shippingMethod}
                                discount={discountAmount}
                                total={totalToPay}
                                couponCode={couponCode}
                                setCouponCode={setCouponCode}
                                applyCoupon={handleApplyCoupon}
                                couponApplying={couponApplying}
                                couponApplied={couponApplied}
                                couponError={couponError}
                                setCouponApplied={setCouponApplied}
                                setCouponError={setCouponError}
                                isSubmitting={isSubmitting}
                                customButton={paymentMethod === 'culqi' ? (
                                    <CulqiPaymentButton
                                        amount={totalToPay}
                                        email={watch("email") || "pedidos@blama.shop"}
                                        title={`Pedido Blama Shop - S/ ${totalToPay}`}
                                        onBeforeOpen={validateFieldsForCulqi}
                                        onToken={handleCulqiToken}
                                        onError={(e: any) => {
                                            const msg = e.message || JSON.stringify(e)
                                            if (msg.includes("cancelado")) {
                                                toast.info("Operación Cancelada", { description: "Has cancelado el proceso de pago. Puedes intentarlo de nuevo cuando desees." })
                                            } else {
                                                toast.error("Error en el pago", { description: msg })
                                            }
                                        }}
                                        disabled={isSubmitting}
                                    />
                                ) : undefined}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <AnimatePresence>
                {isRedirecting && (
                    <m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl"
					>
						<m.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="flex flex-col items-center gap-4 text-center"
						>
							<div className="relative">
								<div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="h-2 w-2 bg-blue-600 rounded-full" />
								</div>
							</div>
							<div>
								<h2 className="text-xl font-bold text-gray-900">Procesando tu pedido...</h2>
								<p className="text-gray-500 text-sm">Estamos finalizando tu compra de forma segura.</p>
							</div>
						</m.div>
					</m.div>
                )}
            </AnimatePresence>
        </>
    )
}
