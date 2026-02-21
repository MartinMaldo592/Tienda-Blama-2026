"use client"

import { useState, useEffect } from "react"
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
}

export function CheckoutForm({ items, total, onBack, onComplete }: CheckoutFormProps) {
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

    return <FormContent items={items} total={total} onBack={onBack} onComplete={onComplete} />
}


import { useCheckoutDraft } from "@/features/checkout/hooks/use-checkout-draft"

function FormContent({ items, total, onBack, onComplete }: CheckoutFormProps) {
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

    const { register, handleSubmit, trigger, control, watch, setValue: setFormValue, formState: { errors } } = form
    const formValues = watch()
    const paymentMethod = formValues.paymentMethod
    const [locationLink, setLocationLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [waPromptOpen, setWaPromptOpen] = useState(false)
    const [waUrl, setWaUrl] = useState<string | null>(null)
    const [couponCode, setCouponCode] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponApplying, setCouponApplying] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)

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

    // Save draft on changes
    useEffect(() => {
        if (!loaded) return
        const timeout = setTimeout(() => {
            saveDraft({
                ...formValues,
                address: value,
            })
        }, 500) // Debounce 500ms
        return () => clearTimeout(timeout)
    }, [formValues, value, loaded, saveDraft])

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
            alert("Por favor ingresa una dirección de mapa válida")
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

        return {
            name: data.name,
            phone: normalizedPhone,
            dni: normalizedDni,
            address: fullAddress, // Full Address string
            street: value, // Google Maps clean part
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
            alert("Por favor ingresa una dirección de mapa válida")
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
            address: payload.address,
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
                address: payload.address,
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
                alert("Error al procesar el pedido: " + msg)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── CULQI Handler ──
    const handleCulqiToken = async (token: string, email: string) => {
        try {
            const payload = await getOrderPayload(formValues)

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

            onComplete()
            // Redirect to success page
            router.push(`/checkout/success?order_id=${data.orderId}&transaction_id=${data.transactionId}`)

        } catch (err: any) {
            console.error("Culqi Error:", err)
            // Format error nicely if it's an object
            let msg = err.message
            if (!msg && typeof err === 'object') {
                msg = JSON.stringify(err)
            }
            alert("Error procesando el pago: " + (msg || "Desconocido"))
            // Re-throw to stop button loader if needed
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

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <Controller
                        control={control}
                        name="shippingMethod"
                        render={({ field }) => (
                            <CheckoutShipping value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                        )}
                    />

                    <CheckoutCustomer
                        register={register} errors={errors}
                        disabled={isSubmitting}
                    />

                    <CheckoutAddress
                        register={register} errors={errors}
                        addressValue={value}
                        onAddressChange={(val) => {
                            setValue(val)
                            setLocationLink("") // Clear specific link on manual edit to force fallback generation
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
                </div>

                <div className="p-4 border-t mt-auto bg-popover">
                    <CheckoutSummary
                        subtotal={subtotalAmount}
                        shippingMethod={formValues.shippingMethod}
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
