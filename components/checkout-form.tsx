"use client"

import { useState, useEffect, useRef } from "react"
import { useLoadScript } from "@react-google-maps/api"
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
import { useRouter } from "next/navigation" // Nuevo hook

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

// Define libraries array outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

const checkoutFormSchema = z.object({
    name: z.string().min(2, "Obligatorio"),
    phone: z.string().length(9, "Debe tener 9 dígitos"),
    dni: z.string().length(8, "Debe tener 8 dígitos"),
    department: z.string().min(2, "Requerido"),
    province: z.string().min(2, "Requerido"),
    district: z.string().min(2, "Requerido"),
    reference: z.string().optional(),
    shippingMethod: z.string(),
    paymentMethod: z.string(),
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
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    })

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Cargando mapa...</p>
            </div>
        )
    }

    return <FormContent items={items} total={total} onBack={onBack} onComplete={onComplete} onCompleteCulqi={onCompleteCulqi} />
}


import { useCheckoutDraft } from "@/features/checkout/hooks/use-checkout-draft"

function FormContent({ items, total, onBack, onComplete, onCompleteCulqi }: CheckoutFormProps) {
    const { draft, loaded, saveDraft, clearDraft } = useCheckoutDraft()
    const router = useRouter()

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
            paymentMethod: "whatsapp"
        }
    })

    const { register, handleSubmit, trigger, control, watch, getValues, setValue: setFormValue, formState: { errors } } = form

    // ── Selectores específicos (evita re-render total en cada keystroke) ──────
    const paymentMethod = watch("paymentMethod")
    const shippingMethod = watch("shippingMethod")
    const [locationLink, setLocationLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [waPromptOpen, setWaPromptOpen] = useState(false)
    const [waUrl, setWaUrl] = useState<string | null>(null)
    const [couponCode, setCouponCode] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponApplying, setCouponApplying] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)

    // Scroll hint
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showScrollHint, setShowScrollHint] = useState(true)
    const handleScroll = () => {
        const el = scrollRef.current
        if (!el) return
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30
        setShowScrollHint(!atBottom)
    }

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
        if (data.paymentMethod === 'culqi') return // Block submit if Culqi is selected (button handles it)

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
                // Re-validar cupón
                await validateCoupon(couponCode, subtotalAmount)
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                setIsSubmitting(false)
                return
            }
        }

        // 2. Build Payload
        const payload = await getOrderPayload(data)

        // 3. WhatsApp Logic
        const messageClientePreview = buildWhatsAppPreviewMessage({
            name: payload.name,
            dni: payload.dni,
            phone: payload.phone,
            address: payload.street || payload.address, // Send only street/number if possible for clarity
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
        })

        const phoneNumberClienteInit = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "958279604";
        const inApp = isInAppBrowser()
        const isMobile = isMobileDevice()
        let popup: Window | null = null
        if (!inApp && isMobile) {
            const preUrl = buildPreOpenUrl(phoneNumberClienteInit, messageClientePreview)
            popup = window.open(preUrl, '_blank', 'noopener,noreferrer')
            if (popup) {
                try {
                    ; (popup as any).opener = null
                } catch (err) {
                }
            }
        }

        try {
            const { orderId: newOrderId } = await createCheckoutOrder(payload)

            // E. WhatsApp mensaje al cliente
            const orderIdFormatted = newOrderId.toString().padStart(6, '0')

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
            })

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

            // G. Preparar enlace de WhatsApp final
            const phoneNumberCliente = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "958279604"
            const urlCliente = buildWhatsAppUrl(phoneNumberCliente, messageCliente)

            setLastOrderSuccessMarker(orderIdFormatted)
            clearCartStorage()

            onComplete()

            try {
                if (inApp || !isMobile) {
                    window.location.href = urlCliente
                } else if (popup && !popup.closed) {
                    popup.location.href = urlCliente
                } else {
                    const opened = window.open(urlCliente, '_blank')
                    if (!opened) {
                        setWaUrl(urlCliente)
                        setWaPromptOpen(true)
                    }
                }
            } catch (err) {
                setWaUrl(urlCliente)
                setWaPromptOpen(true)
            }

        } catch (error: any) {
            console.error("Error al procesar:", error)
            const msg = String(error?.message || '')
            if (isCouponRelatedError(msg)) {
                setCouponDiscount(0) // Reset discount if invalid
                setCouponApplied(false)
                setCouponError(msg)
            } else {
                toast.error("No se pudo crear el pedido", {
                    description: msg || "Intenta nuevamente o contáctanos por WhatsApp.",
                    duration: 8000
                })
            }
        } finally {
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

                {/* Scroll area with fade indicator */}
                <div className="relative flex-1 min-h-0">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="h-full overflow-y-auto p-4 space-y-6 scroll-smooth"
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
                    </div>{/* end inner scroll div */}

                    {/* Scroll fade + bounce indicator */}
                    {showScrollHint && (
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 flex flex-col items-center justify-end pb-3 gap-1"
                            style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.97) 100%)' }}
                        >
                            <span className="text-xs font-semibold text-muted-foreground bg-white/80 backdrop-blur-sm border border-border rounded-full px-3 py-1 shadow-sm">
                                Desliza para ver más
                            </span>
                            <div className="animate-bounce text-muted-foreground mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>{/* end outer relative div */}

                <div className="p-4 border-t mt-auto bg-popover">
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
                                email="pedidos@blama.shop" // Email interno por ahora
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
            </form>
            {waPromptOpen && waUrl && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-card border border-border rounded-lg shadow-lg p-4">
                        <h3 className="text-lg font-semibold text-foreground">Abrir WhatsApp</h3>
                        <p className="text-sm text-muted-foreground mt-2">Pulsa el botón para abrir tu pedido en WhatsApp.</p>
                        <div className="mt-4 flex gap-3">
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md">Abrir WhatsApp</a>
                            <button onClick={() => { setWaPromptOpen(false); setWaUrl(null) }} className="px-4 py-2 border border-border rounded-md">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
