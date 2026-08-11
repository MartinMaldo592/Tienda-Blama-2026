"use client"

import { useEffect } from "react"
import { useJsApiLoader } from "@react-google-maps/api"
import { m, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, ArrowRight, Edit2, ShieldCheck, MapPin, User, Truck, Check } from "lucide-react"
import { toast } from "sonner"
import { Controller } from "react-hook-form"

// Modular components
import { CheckoutShipping } from "@/features/checkout/components/checkout-shipping"
import { CheckoutCustomer } from "@/features/checkout/components/checkout-customer"
import { CheckoutAddress } from "@/features/checkout/components/checkout-address"
import { CheckoutPayment } from "@/features/checkout/components/checkout-payment"
import { CulqiPaymentButton } from "@/features/checkout/components/culqi-payment-button"
import { CheckoutStepper } from "@/features/checkout/components/checkout-stepper"
import { CheckoutShopifySummary } from "@/features/checkout/components/checkout-shopify-summary"

// Hook
import { useCheckoutForm } from "@/features/checkout/hooks/useCheckoutForm"

const libraries: ("places")[] = ["places"]

interface CheckoutFormProps {
    items: any[]
    total: number
    onBack: () => void
    onComplete: () => void
    onCompleteCulqi?: () => void
}

export function CheckoutForm({ items, total, onBack, onComplete, onCompleteCulqi }: CheckoutFormProps) {
    useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    })

    return <FormContent items={items} total={total} onBack={onBack} onComplete={onComplete} onCompleteCulqi={onCompleteCulqi} />
}

function FormContent({ items, total, onBack, onComplete, onCompleteCulqi }: CheckoutFormProps) {
    const {
        currentStep,
        validateStep1,
        validateStep2,
        goToStep,
        currentUser,
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

    // Auto-scroll to top when step changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [currentStep])

    const nameValue = watch("name")
    const phoneValue = watch("phone")
    const dniValue = watch("dni")
    const emailValue = watch("email")
    const departmentValue = watch("department")
    const districtValue = watch("district")

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
            <form onSubmit={handleSubmit(onSubmit)} className="outline-none">
                {/* Header con Marca BLAMA & Stepper */}
                <div className="bg-white border-b sticky top-0 z-30 shadow-2xs">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button type="button" variant="ghost" size="icon" onClick={onBack} disabled={isSubmitting} className="h-9 w-9 rounded-xl hover:bg-slate-100">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <span className="font-black text-xl tracking-tight text-slate-900">
                                blama <span className="text-[#FF6FA7] font-medium text-xs tracking-widest uppercase ml-1">FITNESS</span>
                            </span>
                        </div>

                        {/* Stepper Header (3 Pasos Claros) */}
                        <CheckoutStepper currentStep={currentStep} onStepClick={goToStep} />
                    </div>
                </div>

                {/* Main 2-Column Shopify Layout */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Column: Active Step Form (7 Cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            <AnimatePresence mode="wait">
                                {/* PASO 1: DATOS PERSONALES */}
                                {currentStep === 1 && (
                                    <m.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <CheckoutCustomer
                                            register={register}
                                            errors={errors}
                                            watch={watch}
                                            disabled={isSubmitting}
                                        />

                                        <div className="pt-4 flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={validateStep1}
                                                className="h-14 px-8 bg-[#FF6FA7] hover:bg-[#e0558d] text-white font-black rounded-2xl text-base shadow-lg shadow-[#FF6FA7]/20 transition-all flex items-center gap-2 group w-full sm:w-auto"
                                            >
                                                Continuar a Dirección de Envío <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </m.div>
                                )}

                                {/* PASO 2: DIRECCIÓN DE ENVÍO */}
                                {currentStep === 2 && (
                                    <m.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 15 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Summary Box of Step 1 */}
                                        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                                <span className="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                                                    <User className="h-4 w-4 text-[#FF6FA7]" /> Paso 1: Datos Personales
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => goToStep(1)}
                                                    className="h-7 text-[#FF6FA7] font-extrabold gap-1 text-xs hover:bg-[#FFE6EF] rounded-lg"
                                                >
                                                    <Edit2 className="h-3 w-3" /> Editar
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-0.5">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nombre Completo</span>
                                                    <span className="font-extrabold text-slate-900 text-sm block">{nameValue || "—"}</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Celular (WhatsApp)</span>
                                                    <span className="font-extrabold text-slate-900 text-sm block">{phoneValue || "—"}</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">DNI / RUC</span>
                                                    <span className="font-extrabold text-slate-900 text-sm block">{dniValue || "—"}</span>
                                                </div>
                                                {emailValue && (
                                                    <div className="space-y-0.5">
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Correo Electrónico</span>
                                                        <span className="font-extrabold text-slate-900 text-sm truncate block">{emailValue}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <CheckoutAddress
                                            register={register}
                                            errors={errors}
                                            watch={watch}
                                            addressValue={value}
                                            onAddressChange={(val) => setValue(val)}
                                            addressReady={ready}
                                            suggestions={suggestions}
                                            suggestionsStatus={suggestionsStatus}
                                            onSuggestionSelect={handleSelect}
                                            disabled={isSubmitting}
                                            apiKeyMissing={!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                                        />

                                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => goToStep(1)}
                                                className="text-slate-600 font-extrabold gap-1 order-2 sm:order-1 hover:text-slate-900"
                                            >
                                                <ArrowLeft className="h-4 w-4" /> Volver a Datos Personales
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={validateStep2}
                                                className="h-14 px-8 bg-[#FF6FA7] hover:bg-[#e0558d] text-white font-black rounded-2xl text-base shadow-lg shadow-[#FF6FA7]/20 transition-all flex items-center gap-2 group w-full sm:w-auto order-1 sm:order-2"
                                            >
                                                Continuar a Envío y Pago <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </m.div>
                                )}

                                {/* PASO 3: ENVÍO Y PAGO */}
                                {currentStep === 3 && (
                                    <m.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 15 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Summary Box of Steps 1 & 2 */}
                                        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
                                            {/* Datos Personales */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                    <span className="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                                                        <User className="h-4 w-4 text-[#FF6FA7]" /> Paso 1: Datos Personales
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => goToStep(1)}
                                                        className="h-7 text-[#FF6FA7] font-extrabold gap-1 text-xs hover:bg-[#FFE6EF] rounded-lg"
                                                    >
                                                        <Edit2 className="h-3 w-3" /> Editar
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nombre</span>
                                                        <span className="font-extrabold text-slate-900 text-xs block">{nameValue || "—"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Celular</span>
                                                        <span className="font-extrabold text-slate-900 text-xs block">{phoneValue || "—"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">DNI</span>
                                                        <span className="font-extrabold text-slate-900 text-xs block">{dniValue || "—"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dirección de Envío */}
                                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                    <span className="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                                                        <MapPin className="h-4 w-4 text-[#FF6FA7]" /> Paso 2: Dirección de Envío
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => goToStep(2)}
                                                        className="h-7 text-[#FF6FA7] font-extrabold gap-1 text-xs hover:bg-[#FFE6EF] rounded-lg"
                                                    >
                                                        <Edit2 className="h-3 w-3" /> Editar
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ubicación</span>
                                                        <span className="font-extrabold text-slate-900 text-xs block">{districtValue}, {departmentValue}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Dirección</span>
                                                        <span className="font-extrabold text-slate-900 text-xs block truncate">{value || "No especificada"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selección de Método de Envío (Lima vs Provincia / Shalom / Domicilio) */}
                                        <Controller
                                            control={control}
                                            name="shippingMethod"
                                            render={({ field }) => (
                                                <CheckoutShipping value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                                            )}
                                        />

                                        {/* Selección de Método de Pago */}
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

                                        {/* Botón de Finalizar Pedido o Culqi */}
                                        <div className="pt-4 space-y-3">
                                            {paymentMethod === "culqi" ? (
                                                <CulqiPaymentButton
                                                    amount={totalToPay}
                                                    email={watch("email") || "hola@blama.shop"}
                                                    name={nameValue || "Cliente BLAMA"}
                                                    phone={phoneValue || "900000000"}
                                                    title={`Pedido BLAMA Fitness - S/ ${totalToPay}`}
                                                    onBeforeOpen={validateFieldsForCulqi}
                                                    onToken={handleCulqiToken}
                                                    onError={(e: any) => {
                                                        const msg = e.message || JSON.stringify(e)
                                                        if (msg.includes("cancelado")) {
                                                            toast.info("Operación Cancelada", { description: "Has cancelado el proceso de pago." })
                                                        } else {
                                                            toast.error("Error en el pago", { description: msg })
                                                        }
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full h-14 bg-[#FF6FA7] hover:bg-[#e0558d] text-white font-black rounded-2xl text-lg shadow-xl shadow-[#FF6FA7]/25 transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="h-6 w-6 animate-spin" /> Procesando Pedido...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Finalizar Pedido • S/ {totalToPay.toFixed(2)}{" "}
                                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </Button>
                                            )}

                                            <div className="flex justify-start">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => goToStep(2)}
                                                    className="text-slate-600 font-extrabold gap-1 hover:text-slate-900"
                                                >
                                                    <ArrowLeft className="h-4 w-4" /> Volver a Dirección
                                                </Button>
                                            </div>
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Sticky Shopify Summary Panel (5 Cols) */}
                        <div className="lg:col-span-5">
                            <CheckoutShopifySummary
                                items={items}
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
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* Overlay de Redirección */}
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
                                <div className="h-16 w-16 rounded-full border-4 border-rose-100 border-t-[#FF6FA7] animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-2 w-2 bg-[#FF6FA7] rounded-full" />
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
        </div>
    )
}
