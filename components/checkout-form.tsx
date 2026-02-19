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

// Define libraries array outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

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

    const [paymentMethod, setPaymentMethod] = useState("whatsapp") // Nuevo estado
    const [name, setName] = useState("")
    const [shippingMethod, setShippingMethod] = useState("Lima")
    const [phone, setPhone] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [dni, setDni] = useState("")
    const [dniError, setDniError] = useState("")
    const [reference, setReference] = useState("")
    const [department, setDepartment] = useState("")
    const [province, setProvince] = useState("")
    const [district, setDistrict] = useState("")
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
            if (draft.name) setName(draft.name)
            if (draft.phone) setPhone(draft.phone)
            if (draft.dni) setDni(draft.dni)
            if (draft.department) setDepartment(draft.department)
            if (draft.province) setProvince(draft.province)
            if (draft.district) setDistrict(draft.district)
            if (draft.reference) setReference(draft.reference)
            if (draft.shippingMethod) setShippingMethod(draft.shippingMethod)
            if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod) // Recuperar del draft si existe
            // Address value is handled by Google Maps hook, we can set it via setValue
            if (draft.address) setValue(draft.address, false)
        }
    }, [loaded, draft, setValue])

    // Save draft on changes
    useEffect(() => {
        if (!loaded) return
        const timeout = setTimeout(() => {
            saveDraft({
                name,
                phone,
                dni,
                department,
                province,
                district,
                reference,
                shippingMethod,
                address: value,
                paymentMethod // Guardar preferencia
            })
        }, 500) // Debounce 500ms
        return () => clearTimeout(timeout)
    }, [name, phone, dni, department, province, district, reference, shippingMethod, value, loaded, saveDraft])

    // Removed unused geoProvince, geoDistrict

    const handleSelect = async (address: string) => {
        setValue(address, false)
        clearSuggestions()

        try {
            const results = await getGeocode({ address })
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
    const validateFields = async () => {
        setPhoneError("")
        setDniError("")
        setCouponError("")

        // 1. Validar Celular
        const normalizedPhone = phone.replace(/\D/g, "")
        if (normalizedPhone.length !== 9) {
            setPhoneError('El celular debe tener 9 dígitos')
            return false
        }

        // 2. Validar DNI
        const normalizedDni = normalizeDni(dni)
        if (normalizedDni.length !== 8) {
            setDniError('El DNI debe tener 8 dígitos')
            return false
        }

        // 3. Validar Dirección (Simple check)
        if (!value || value.length < 5) {
            alert("Por favor ingresa una dirección válida")
            return false
        }

        // 4. Validar Cupón (Si hay uno escrito pero no aplicado)
        if (couponCode.trim()) {
            try {
                // Re-validar para asegurar precio
                await validateCoupon(couponCode, subtotalAmount)
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                return false
            }
        }

        return true
    }

    // ── Helper para construir Payload (reutilizable) ──
    const getOrderPayload = async () => {
        const normalizedPhone = phone.replace(/\D/g, "")
        const normalizedDni = normalizeDni(dni)

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

        const fullAddress = `${department}, ${province}, ${district}. ${value || ''}`.trim()

        let finalLocationLink = locationLink
        if ((!finalLocationLink || finalLocationLink.trim() === "") && fullAddress) {
            const encoded = encodeURIComponent(fullAddress)
            finalLocationLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`
        }

        return {
            name,
            phone: normalizedPhone,
            dni: normalizedDni,
            address: fullAddress, // Full Address string
            street: value, // Google Maps clean part
            province: province, // Corregido: Coincide con schema Zod (antes provinceName)
            district,
            department,
            reference: reference || undefined,
            locationLink: finalLocationLink || "",
            couponCode: appliedCouponCode || undefined,
            discountAmount: finalDiscount || 0,
            shippingMethod: shippingMethod || undefined,
            items: checkoutItems,
            // Computed for logs
            subtotal: subtotalAmount,
            total: finalTotal
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (paymentMethod === 'culqi') return // Block submit if Culqi is selected (button handles it)

        setIsSubmitting(true)

        // 1. Validate
        const isValid = await validateFields()
        if (!isValid) {
            setIsSubmitting(false)
            return
        }

        // 2. Build Payload
        const payload = await getOrderPayload()

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
            const payload = await getOrderPayload()

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
                onSubmit={handleSubmit}
                className="flex flex-col h-full outline-none"
            >
                <div className="p-4 border-b flex items-center gap-2 bg-popover">
                    <Button type="button" variant="ghost" size="icon" onClick={onBack} disabled={isSubmitting} className="h-8 w-8 hover:bg-popover/80">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold text-foreground">Datos de Envío</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <CheckoutShipping value={shippingMethod} onChange={setShippingMethod} disabled={isSubmitting} />

                    <CheckoutCustomer
                        name={name} setName={setName}
                        phone={phone} setPhone={setPhone} phoneError={phoneError} setPhoneError={setPhoneError}
                        dni={dni} setDni={setDni} dniError={dniError} setDniError={setDniError}
                        disabled={isSubmitting}
                    />

                    <CheckoutAddress
                        department={department} setDepartment={setDepartment}
                        province={province} setProvince={setProvince}
                        district={district} setDistrict={setDistrict}
                        reference={reference} setReference={setReference}
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

                    <CheckoutPayment
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        disabled={isSubmitting}
                    />
                </div>

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
                                onBeforeOpen={validateFields}
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
