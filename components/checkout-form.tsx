"use client"

import { useState, useEffect } from "react"
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
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

// New modular components
import { CheckoutShipping } from "@/components/checkout/checkout-shipping"
import { CheckoutCustomer } from "@/components/checkout/checkout-customer"
import { CheckoutAddress } from "@/components/checkout/checkout-address"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"

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


function FormContent({ items, total, onBack, onComplete }: CheckoutFormProps) {
    const [name, setName] = useState("")
    const [shippingMethod, setShippingMethod] = useState("lima")
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        setCouponError("")
        setDniError("")

        const normalizedPhone = phone.replace(/\D/g, "")
        if (normalizedPhone.length !== 9) {
            setPhoneError('El celular debe tener 9 dígitos')
            setIsSubmitting(false)
            return
        }

        const normalizedDni = normalizeDni(dni)
        if (normalizedDni.length !== 8) {
            setDniError('El DNI debe tener 8 dígitos')
            setIsSubmitting(false)
            return
        }

        let appliedCouponCode: string | null = null
        let appliedDiscount = discountAmount
        if (couponCode.trim()) {
            try {
                const res = await validateCoupon(couponCode, subtotalAmount)
                appliedCouponCode = res.codigo
                appliedDiscount = res.descuento
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                setIsSubmitting(false)
                return
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

        // Generar link de respaldo si no se usó el autocompletado del mapa
        let finalLocationLink = locationLink

        if ((!finalLocationLink || finalLocationLink.trim() === "") && fullAddress) {
            const encoded = encodeURIComponent(fullAddress)
            finalLocationLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`
        }

        const messageClientePreview = buildWhatsAppPreviewMessage({
            name: name || 'Cliente',
            dni: normalizedDni,
            phone,
            address: fullAddress,
            reference,
            locationLink: finalLocationLink,
            items: checkoutItems,
            subtotal: subtotalAmount,
            discount: finalDiscount,
            total: finalTotal,
            couponCode: appliedCouponCode,
            shippingMethod,
        })

        const phoneNumberClienteInit = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "982432561";

        // Abrimos WhatsApp DIRECTO por API (sin páginas intermedias) en una pestaña nueva
        // para que la tienda no se cierre.
        // Pre-abrimos la pestaña en blanco durante el click del usuario para minimizar bloqueos.
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
            const normalizedPhone = normalizeDigits(phone)

            const { orderId: newOrderId } = await createCheckoutOrder({
                name,
                phone: normalizedPhone,
                dni: normalizedDni,
                address: fullAddress,
                street: value,
                provinceName: province, // Mapped to provinceName in type
                district: district,
                department: department, // Added department
                reference,
                locationLink: finalLocationLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
                couponCode: appliedCouponCode,
                discountAmount: finalDiscount,
                shippingMethod,
                items: checkoutItems.map((it) => ({
                    id: it.id,
                    quantity: it.quantity,
                    precio: it.precio,
                    nombre: it.nombre,
                    producto_variante_id: it.producto_variante_id ?? null,
                    variante_nombre: it.variante_nombre ?? null,
                })),
            })

            // E. WhatsApp mensaje al cliente
            const phoneNumberCliente = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "982432561"
            const orderIdFormatted = newOrderId.toString().padStart(6, '0')

            const messageCliente = buildWhatsAppFinalMessage({
                orderIdFormatted,
                name,
                dni: normalizedDni,
                phone,
                address: fullAddress,
                reference,
                locationLink: finalLocationLink,
                items: checkoutItems,
                subtotal: subtotalAmount,
                discount: finalDiscount,
                total: finalTotal,
                couponCode: appliedCouponCode,
                shippingMethod,
            })



            // GTM: Track Purchase
            sendGTMEvent({
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderIdFormatted,
                    value: finalTotal,
                    tax: 0,
                    shipping: 0,
                    currency: 'PEN',
                    coupon: appliedCouponCode,
                    items: checkoutItems.map(item => ({
                        item_id: String(item.id),
                        item_name: item.nombre,
                        price: item.precio,
                        quantity: item.quantity
                    }))
                }
            })

            // G. Preparar enlace de WhatsApp final (incluye id de pedido).
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
                setCouponDiscount(0)
                setCouponApplied(false)
                setCouponError(
                    `El cupón ya no está disponible o no es válido en este momento. ` +
                    `Vuelve a intentar aplicar el cupón o usa otro.\n\nDetalle: ${msg}`
                )
            } else {
                alert("Error al procesar el pedido: " + msg)
            }
        } finally {
            setIsSubmitting(false)
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
                        addressValue={value} onAddressChange={setValue} addressReady={ready}
                        suggestions={data} suggestionsStatus={status} onSuggestionSelect={handleSelect}
                        disabled={isSubmitting}
                        apiKeyMissing={!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
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
