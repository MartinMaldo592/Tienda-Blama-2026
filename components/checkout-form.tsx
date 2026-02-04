"use client"

import { useState, useEffect } from "react"
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, MapPin } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
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

    const [geoProvince, setGeoProvince] = useState("")
    const [geoDistrict, setGeoDistrict] = useState("")

    const handleSelect = async (address: string) => {
        setValue(address, false)
        clearSuggestions()

        try {
            const results = await getGeocode({ address })
            const { lat, lng } = await getLatLng(results[0])
            setLocationLink(`https://www.google.com/maps/?q=${lat},${lng}`)
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 9)
        setPhone(raw)
        if (phoneError) setPhoneError("")
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
        const messageClientePreview = buildWhatsAppPreviewMessage({
            name: name || 'Cliente',
            dni: normalizedDni,
            phone,
            address: fullAddress,
            reference,
            locationLink,
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
                department: department, // Added department if variable exists in scope, otherwise remove or verify source
                reference,
                locationLink,
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
                locationLink,
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
        const container = document.getElementById('checkout-form-container')
        if (container) {
            container.focus()
        }
    }, [])

    return (
        <>
            <form
                id="checkout-form-container"
                tabIndex={-1}
                onSubmit={handleSubmit}
                className="flex flex-col h-full outline-none"
            >
                <div className="p-4 border-b flex items-center gap-2 bg-popover">
                    <Button type="button" variant="ghost" size="icon" onClick={onBack} disabled={isSubmitting} className="h-8 w-8 hover:bg-popover/80">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold text-foreground">Datos de Envío</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="space-y-3">
                        <Label className="text-base">Método de envío <span className="text-destructive">*</span></Label>
                        <div className="flex flex-col gap-2 pl-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="lima"
                                    checked={shippingMethod === 'lima'}
                                    onChange={(e) => setShippingMethod(e.target.value)}
                                    className="accent-black h-4 w-4"
                                />
                                <span className="text-sm font-medium">Lima (Gratis)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="provincia"
                                    checked={shippingMethod === 'provincia'}
                                    onChange={(e) => setShippingMethod(e.target.value)}
                                    className="accent-black h-4 w-4"
                                />
                                <span className="text-sm font-medium">Provincia (Shalom)</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" required placeholder="Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Celular</Label>
                        <Input
                            id="phone"
                            required
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]{9}"
                            minLength={9}
                            maxLength={9}
                            placeholder="999 999 999"
                            value={phone}
                            onChange={handlePhoneChange}
                            disabled={isSubmitting}
                            onInvalid={(e) => {
                                e.currentTarget.setCustomValidity('Ingresa un número de celular válido de 9 dígitos')
                            }}
                            onInput={(e) => {
                                e.currentTarget.setCustomValidity('')
                            }}
                        />
                        {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            required
                            inputMode="numeric"
                            pattern="[0-9]{8}"
                            minLength={8}
                            maxLength={8}
                            placeholder="12345678"
                            value={dni}
                            onChange={(e) => {
                                const next = e.target.value.replace(/\D/g, '').slice(0, 8)
                                setDni(next)
                                if (dniError) setDniError("")
                            }}
                            onInvalid={(e) => {
                                e.currentTarget.setCustomValidity('Ingresa un DNI válido de 8 dígitos')
                            }}
                            onInput={(e) => {
                                e.currentTarget.setCustomValidity('')
                            }}
                            disabled={isSubmitting}
                        />
                        {dniError && <p className="text-xs text-destructive">{dniError}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="province">Departamento <span className="text-destructive">*</span></Label>
                        <Input
                            id="province"
                            required
                            placeholder="Ej: Lima"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="district">Provincia <span className="text-destructive">*</span></Label>
                        <Input
                            id="district"
                            required
                            placeholder="Ej: Cañete"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="urbanDistrict">Distrito <span className="text-destructive">*</span></Label>
                        <Input
                            id="urbanDistrict"
                            required
                            placeholder="Ej: Miraflores"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <Label htmlFor="address">Dirección (Google Maps)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="address"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={!ready || isSubmitting}
                                placeholder="Escribe tu dirección..."
                                className="pl-9"
                                autoComplete="off"
                            />
                        </div>
                        {status === "OK" && (
                            <ul className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                {data.map(({ place_id, description }) => (
                                    <li key={place_id} onClick={() => handleSelect(description)} className="px-4 py-2 hover:bg-popover cursor-pointer text-sm text-muted-foreground">
                                        {description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference">Referencia (Opcional)</Label>
                        <Input id="reference" placeholder="Frente al parque, casa azul..." value={reference} onChange={(e) => setReference(e.target.value)} disabled={isSubmitting} />
                    </div>

                    {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">⚠️ Nota: Autocompletado deshabilitado. Falta API Key.</div>
                    )}
                </div>

                <div className="p-4 border-t mt-auto bg-popover">
                    <div className="space-y-3 mb-4">
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
                                <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isSubmitting || couponApplying}>
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

                        <div className="text-sm font-medium space-y-1">
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(subtotalAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Envío:</span>
                                <span>{shippingMethod === 'provincia' ? 'Precio a calcular' : 'Gratis'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Descuento:</span>
                                <span>-{formatCurrency(discountAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Total a Pagar:</span>
                                <span className="text-lg font-bold">{formatCurrency(totalToPay)}</span>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-bold" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : "Confirmar Pedido en WhatsApp"}
                    </Button>
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
