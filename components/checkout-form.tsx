"use client"

import { useState, useEffect, useRef } from "react"
import { useJsApiLoader } from "@react-google-maps/api"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    buildPreOpenUrl,
    buildWhatsAppFinalMessage,
    buildWhatsAppPreviewMessage,
    buildWhatsAppUrl,
    clearCartStorage,
    createCheckoutOrder,
    isCouponRelatedError,
    isInAppBrowser,
    isMobileDevice,
    normalizeDigits,
    normalizeDni,
    setLastOrderSuccessMarker,
    validateCoupon,
} from "@/features/checkout"
import { sendGTMEvent } from "@/lib/gtm"
import { useRouter } from "next/navigation"
import { SuccessCheckmark } from "@/components/ui/success-checkmark"

// New modular components
import { CheckoutShipping } from "@/components/checkout/checkout-shipping"
import { CheckoutCustomer } from "@/components/checkout/checkout-customer"
import { CheckoutAddress } from "@/components/checkout/checkout-address"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { CheckoutPayment } from "@/components/checkout/checkout-payment" // Nuevo
import { CulqiPaymentButton } from "@/components/checkout/culqi-payment-button" // Nuevo

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { identitySchema, checkoutBaseFields } from "@/lib/validations/checkout.schema"

// Define libraries array outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

const checkoutFormSchema = z.object({
    name: identitySchema.name,
    phone: identitySchema.phone,
    dni: identitySchema.document,
    department: checkoutBaseFields.department,
    province: checkoutBaseFields.province,
    district: checkoutBaseFields.district,
    reference: z.string().optional(),
    shippingMethod: z.string(),
    paymentMethod: z.string(),
    email: identitySchema.email,
})

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

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


import { useCheckoutDraft } from "@/features/checkout/hooks/use-checkout-draft"

function FormContent({ items, total, onBack, onComplete, onCompleteCulqi }: CheckoutFormProps) {
    const { draft, loaded, saveDraft, clearDraft } = useCheckoutDraft()
    const router = useRouter()
    const [isRedirecting, setIsRedirecting] = useState(false)

    useEffect(() => {
        // Prefetch success page to speed up transition
        router.prefetch('/checkout/success')
    }, [router])

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            dni: "",
            department: "",
            province: "",
            district: "",
            reference: "",
            shippingMethod: "Lima",
            paymentMethod: "whatsapp",
            email: ""
        }
    })

    const { register, handleSubmit, trigger, control, watch, getValues, setValue: setFormValue, formState: { errors } } = form

    // ── Selectores específicos (evita re-render total en cada keystroke) ──────
    const paymentMethod = watch("paymentMethod")
    const shippingMethod = watch("shippingMethod")
    const [locationLink, setLocationLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [couponCode, setCouponCode] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponApplying, setCouponApplying] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)

    // Scroll hint reference removed as it's no longer a sticky bottom layout


    // Google Maps Hook
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "pe" },
            // Añadir locale y region strict
            language: "es",
            region: "pe",
        },
    })

    // Load draft when ready
    useEffect(() => {
        if (loaded && draft) {
            if (draft.name) setFormValue("name", draft.name)
            if (draft.phone) setFormValue("phone", draft.phone)
            if (draft.dni) setFormValue("dni", draft.dni)
            if (draft.department) setFormValue("department", draft.department)
            if (draft.province) setFormValue("province", draft.province)
            if (draft.district) setFormValue("district", draft.district)
            if (draft.reference) setFormValue("reference", draft.reference)
            if (draft.shippingMethod) setFormValue("shippingMethod", draft.shippingMethod)
            if (draft.paymentMethod) setFormValue("paymentMethod", draft.paymentMethod)
            // Address value is handled by Google Maps hook, we can set it via setValue
            if (draft.address) setValue(draft.address, false)
        }
    }, [loaded, draft, setFormValue, setValue])

    // Save draft on changes — observa solo los campos relevantes, no el form entero
    useEffect(() => {
        if (!loaded) return
        const timeout = setTimeout(() => {
            saveDraft({
                ...getValues(),
                address: value,
            })
        }, 500) // Debounce 500ms
        return () => clearTimeout(timeout)
    }, [paymentMethod, shippingMethod, value, loaded, saveDraft, getValues])

    // Removed unused geoProvince, geoDistrict

    const handleSelect = async (address: string) => {
        setValue(address, false)
        clearSuggestions()

        try {
            const results = await getGeocode({ address })

            // --- NUEVO: AUTOCOMPLETADO INTELIGENTE ---
            const addressComponents = results[0].address_components;

            let departamentoEncontrado = "";
            let provinciaEncontrada = "";
            let distritoEncontrado = "";

            addressComponents.forEach((component: any) => {
                const types = component.types;
                if (types.includes("administrative_area_level_1")) {
                    departamentoEncontrado = component.long_name;
                }
                if (types.includes("administrative_area_level_2")) {
                    provinciaEncontrada = component.long_name;
                }
                if (types.includes("locality") || types.includes("sublocality")) {
                    distritoEncontrado = component.long_name;
                }
            });

            if (departamentoEncontrado) setFormValue("department", departamentoEncontrado, { shouldValidate: true });
            if (provinciaEncontrada) setFormValue("province", provinciaEncontrada, { shouldValidate: true });
            if (distritoEncontrado) setFormValue("district", distritoEncontrado, { shouldValidate: true });
            // ----------------------------------------

            const { lat, lng } = await getLatLng(results[0])
            const link = `https://www.google.com/maps/?q=${lat},${lng}`
            setLocationLink(link)
            console.log("📍 Location Link Generated:", link)
        } catch (error) {
            console.error("Error Geocoding:", error)
            // Fallback: search link
            const encoded = encodeURIComponent(address)
            setLocationLink(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
        }
    }

    const subtotalAmount = Number(total) || 0
    const discountAmount = Math.max(0, Math.min(subtotalAmount, Number(couponDiscount) || 0))
    const totalToPay = Math.max(0, Math.round((subtotalAmount - discountAmount) * 100) / 100)


    const handleApplyCoupon = async () => {
        setCouponError("")
        setCouponApplying(true)
        setCouponApplied(false)
        try {
            const res = await validateCoupon(couponCode, subtotalAmount)
            setCouponDiscount(res.descuento)
            setCouponApplied(res.descuento > 0)
        } catch (err: any) {
            setCouponDiscount(0)
            setCouponApplied(false)
            setCouponError(err?.message || 'No se pudo aplicar el cupón')
        } finally {
            setCouponApplying(false)
        }
    }

    // ── Validation Helper ──
    const validateFieldsForCulqi = async () => {
        const isValid = await trigger()
        if (!isValid) return false

        setCouponError("")

        if (!value || value.length < 5) {
            toast.error("Dirección inválida", {
                description: "Por favor selecciona una dirección válida del mapa antes de continuar.",
                duration: 5000
            })
            return false
        }

        if (couponCode.trim()) {
            try {
                await validateCoupon(couponCode, subtotalAmount)
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                return false
            }
        }
        return true
    }

    // ── Helper para construir Payload (reutilizable) ──
    const getOrderPayload = async (data: CheckoutFormValues) => {
        const normalizedPhone = data.phone.replace(/\D/g, "")
        const normalizedDni = normalizeDni(data.dni)

        // Re-validar cupón para obtener descuento final seguro
        let appliedCouponCode: string | null = null
        let appliedDiscount = discountAmount

        if (couponCode.trim()) {
            try {
                const res = await validateCoupon(couponCode, subtotalAmount)
                appliedCouponCode = res.codigo
                appliedDiscount = res.descuento
            } catch (err) {
                // Si falla aquí, usamos datos previos validos o 0
                console.warn("Coupon re-validation failed silently", err)
            }
        }

        const finalDiscount = Math.max(0, Math.min(subtotalAmount, Number(appliedDiscount) || 0))
        const finalTotal = Math.max(0, Math.round((subtotalAmount - finalDiscount) * 100) / 100)

        const checkoutItems = (Array.isArray(items) ? items : []).map((it: any) => ({
            id: Number(it?.id ?? 0),
            quantity: Number(it?.quantity ?? 0),
            precio: Number(it?.precio ?? 0),
            nombre: String(it?.nombre ?? ''),
            producto_variante_id: (it as any)?.producto_variante_id ?? null,
            variante_nombre: (it as any)?.variante_nombre ?? null,
        }))

        const fullAddress = `${data.department}, ${data.province}, ${data.district}. ${value || ''}`.trim()

        let finalLocationLink = locationLink
        if ((!finalLocationLink || finalLocationLink.trim() === "") && fullAddress) {
            const encoded = encodeURIComponent(fullAddress)
            finalLocationLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`
        }

        // address field for API must be min(5). Use the raw Google Maps street value,
        // falling back to the full composed address.
        const streetForApi = (value || "").trim()
        const addressForApi = streetForApi.length >= 5
            ? streetForApi
            : fullAddress.length >= 5
                ? fullAddress
                : `${data.district || ''} ${data.province || ''}`.trim()

        return {
            name: data.name,
            phone: normalizedPhone,
            dni: normalizedDni,
            email: data.email?.trim() || undefined,
            address: addressForApi,  // Primary address for API (needed for min(5))
            street: streetForApi,    // Raw Google Maps part
            province: data.province,
            district: data.district,
            department: data.department,
            reference: data.reference || undefined,
            locationLink: finalLocationLink || "",
            couponCode: appliedCouponCode || undefined,
            discountAmount: finalDiscount || 0,
            shippingMethod: data.shippingMethod || undefined,
            items: checkoutItems,
            // Computed for logs
            subtotal: subtotalAmount,
            total: finalTotal
        }
    }


    const onSubmit = async (data: CheckoutFormValues) => {
        if (data.paymentMethod === 'culqi') return

        if (!value || value.length < 5) {
            toast.error("Dirección inválida", {
                description: "Por favor selecciona una dirección válida del mapa antes de continuar.",
                duration: 5000
            })
            return
        }

        setIsSubmitting(true)
        setCouponError("")

        if (couponCode.trim()) {
            try {
                await validateCoupon(couponCode, subtotalAmount)
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                setIsSubmitting(false)
                return
            }
        }

        try {
            // 2. Build Payload
            const payload = await getOrderPayload(data)

            // 3. Create Order
            const { orderId: newOrderId } = await createCheckoutOrder(payload)
            const orderIdFormatted = newOrderId.toString().padStart(6, '0')

            // 4. WhatsApp Final Message
            const messageCliente = buildWhatsAppFinalMessage({
                orderIdFormatted,
                name: payload.name,
                dni: payload.dni,
                phone: payload.phone,
                address: payload.street || payload.address,
                department: payload.department,
                province: payload.province,
                district: payload.district,
                reference: payload.reference,
                locationLink: payload.locationLink,
                items: payload.items,
                subtotal: payload.subtotal,
                discount: Number(payload.discountAmount),
                total: payload.total,
                couponCode: payload.couponCode,
                shippingMethod: payload.shippingMethod,
                email: payload.email,
            })

            // Start transition for natural feel
            setIsRedirecting(true)
            setLastOrderSuccessMarker(orderIdFormatted)

            // redirection to success page
            router.push(`/checkout/success?order_id=${newOrderId}&transaction_id=whatsapp`)

            // Side effects in background
            clearCartStorage()
            onComplete()

        } catch (error: any) {
            console.error("Error al procesar:", error)
            const msg = String(error?.message || '')
            if (isCouponRelatedError(msg)) {
                setCouponDiscount(0)
                setCouponApplied(false)
                setCouponError(msg)
            } else {
                toast.error("No se pudo crear el pedido", {
                    description: msg || "Intenta nuevamente o contáctanos por WhatsApp.",
                    duration: 8000
                })
            }
            setIsSubmitting(false)
        }
    }

    // ── CULQI Handler ──
    const handleCulqiToken = async (token: string, email: string) => {
        try {
            const payload = await getOrderPayload(getValues())

            // Asegurar que siempre haya un email válido (fallback si Culqi no lo devuelve)
            const emailToSend = email || "pedidos@blama.shop"

            // Call API
            const res = await fetch("/api/checkout/culqi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...payload,
                    token,
                    email: emailToSend
                })
            })

            const data = await res.json()

            if (!res.ok || !data.ok) {
                // Mejora de debug: Si hay detalles de validación, mostrarlos
                const errorDetails = data.details ? `\nDetalles: ${JSON.stringify(data.details, null, 2)}` : ""
                throw new Error((data.error || "Error al procesar el pago") + errorDetails)
            }

            // Success!
            const orderIdFormatted = String(data.orderId || '0').padStart(6, '0')
            setLastOrderSuccessMarker(orderIdFormatted)
            clearCartStorage()

            // GTM: Track Purchase
            sendGTMEvent({
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderIdFormatted,
                    value: payload.total,
                    currency: 'PEN',
                    coupon: payload.couponCode,
                    items: payload.items.map(item => ({
                        item_id: String(item.id),
                        item_name: item.nombre,
                        price: item.precio,
                        quantity: item.quantity
                    }))
                }
            })

            // Para Culqi: cerrar el carrito directamente (sin pantalla de éxito intermedia)
            // y redirigir a la página de éxito de inmediato.
            if (onCompleteCulqi) {
                onCompleteCulqi()
            } else {
                onComplete()
            }
            router.push(`/checkout/success?order_id=${data.orderId}&transaction_id=${data.transactionId}`)

        } catch (err: any) {
            console.error("Culqi Error:", err)
            const msg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err))
            toast.error("Error al procesar el pago", {
                description: msg || "Ocurrió un error inesperado. Por favor intenta nuevamente.",
                duration: 8000,
                action: {
                    label: "WhatsApp",
                    onClick: () => window.open(`https://api.whatsapp.com/send/?phone=${process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "982432561"}&text=Hola,%20tuve%20un%20problema%20al%20pagar%20con%20tarjeta.%20%C2%BFPueden%20ayudarme?`, "_blank")
                }
            })
            throw err
        }
    }

    // Prevent keyboard from opening automatically on mobile
    useEffect(() => {
        // Aggressively blur any active element when this component mounts
        // This ensures the keyboard doesn't pop up even if the browser tries to auto-focus
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        window.scrollTo(0, 0)
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
                    >
                        <Controller
                            control={control}
                            name="shippingMethod"
                            render={({ field }) => (
                                <CheckoutShipping value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                            )}
                        />

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
                                setLocationLink("")
                            }}
                            addressReady={ready}
                            suggestions={data} suggestionsStatus={status} onSuggestionSelect={handleSelect}
                            disabled={isSubmitting}
                            apiKeyMissing={!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                        />

                        <Controller
                            control={control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <CheckoutPayment
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                        <div className="pt-4 border-t mt-4">
                            <CheckoutSummary
                                subtotal={subtotalAmount}
                                shippingMethod={shippingMethod}
                                discount={discountAmount}
                                total={totalToPay}
                                couponCode={couponCode} setCouponCode={setCouponCode}
                                applyCoupon={handleApplyCoupon} couponApplying={couponApplying} couponApplied={couponApplied} couponError={couponError} setCouponApplied={setCouponApplied} setCouponError={setCouponError}
                                isSubmitting={isSubmitting}

                                // Inyectar botón de Culqi si está seleccionado
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
                    </div>{/* end inner scroll div */}
                </div>{/* end outer relative div */}
            </form>
        </>
    )
}
