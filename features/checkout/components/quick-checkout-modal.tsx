"use client"
import { useRouter } from "next/navigation"
import { SuccessCheckmark } from "@/components/ui/success-checkmark"

import Image from "next/image"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import usePlacesAutocomplete from "use-places-autocomplete"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Loader2,
} from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import {
    buildWhatsAppFinalMessage,
    buildWhatsAppPreviewMessage,
    buildWhatsAppUrl,
    createCheckoutOrder,
    isMobileDevice,
    setLastOrderSuccessMarker,
} from "@/features/checkout"
import { useCheckoutDraft } from "@/features/checkout/hooks/use-checkout-draft"
import { sendGTMEvent } from "@/lib/gtm"
import { QuickCustomer } from "@/features/checkout/components/quick-checkout/quick-customer"
import { QuickAddress } from "@/features/checkout/components/quick-checkout/quick-address"
import { QuickSummary } from "@/features/checkout/components/quick-checkout/quick-summary"
import { useJsApiLoader } from "@react-google-maps/api"

const libraries: ("places")[] = ["places"];

interface QuickCheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    product: any
    variant: any
    initialQuantity?: number
}

export function QuickCheckoutModal({ isOpen, onClose, product, variant, initialQuantity = 1 }: QuickCheckoutModalProps) {
    useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md w-full p-0 gap-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="overflow-y-auto flex-1 p-6" data-lenis-prevent>
                    <DialogHeader className="mb-4 text-center">
                        <DialogTitle className="text-base font-bold uppercase leading-tight">
                            Envíos contraentrega en Lima y <br /> otras provincias envíos por agencia
                        </DialogTitle>
                    </DialogHeader>

                    {/* Product Summary */}
                    <div className="mb-6 rounded-lg border bg-blue-50/50 p-3 flex gap-3 items-center">
                        <div className="h-16 w-16 shrink-0 bg-white rounded-md border p-1 relative">
                            {product?.imagen_url && (
                                <Image
                                    src={product.imagen_url}
                                    alt={product.nombre}
                                    fill
                                    className="object-contain"
                                    sizes="64px"
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground line-clamp-2">
                                {product?.nombre}
                                {variant && ` - ${variant.etiqueta}`}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    ENVÍO GRATIS
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            {product?.precio_antes && product.precio_antes > product.precio && (
                                <div className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(product.precio_antes)}
                                </div>
                            )}
                            <div className="text-lg font-bold text-foreground">
                                {formatCurrency(variant?.precio ?? product?.precio)}
                            </div>
                        </div>
                    </div>

                    <QuickForm
                        product={product}
                        variant={variant}
                        onClose={onClose}
                        initialQuantity={initialQuantity}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function QuickForm({ product, variant, onClose, initialQuantity = 1 }: { product: any; variant: any; onClose: () => void; initialQuantity?: number }) {
    const router = useRouter()
    const [isRedirecting, setIsRedirecting] = useState(false)

    useEffect(() => {
        router.prefetch('/checkout/success')
    }, [router])

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [dni, setDni] = useState("")
    const [address, setAddress] = useState("") // Google Maps Address
    const [reference, setReference] = useState("")
    const [department, setDepartment] = useState("")
    const [province, setProvince] = useState("")
    const [district, setDistrict] = useState("")
    const [shippingMethod, setShippingMethod] = useState("")
    const [email, setEmail] = useState("")
    const [locationLink, setLocationLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived values & state for chosen pack
    const [chosenQty, setChosenQty] = useState(initialQuantity)
    const [timeLeft, setTimeLeft] = useState(600) // 10 mins

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const unitPrice = Number(variant?.precio ?? product?.precio ?? 0)
    const pack1Total = unitPrice
    const pack2Total = Math.round(unitPrice * 2 * 0.85) // 15% desc.
    const pack3Total = Math.round(unitPrice * 3 * 0.70) // 30% desc.

    const total = chosenQty === 1
        ? pack1Total
        : chosenQty === 2
            ? pack2Total
            : Math.round(unitPrice * chosenQty * 0.70)

    const { draft, loaded, saveDraft, clearDraft } = useCheckoutDraft()

    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "pe" },
            language: "es",
            region: "pe",
        },
        debounce: 300,
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
            if (draft.email) setEmail(draft.email)
            // Address value handling
            if (draft.address) {
                setValue(draft.address, false)
                setAddress(draft.address)
            }
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
                email,
                address: value || address
            })
        }, 500) // Debounce 500ms
        return () => clearTimeout(timeout)
    }, [name, phone, dni, department, province, district, reference, shippingMethod, email, value, address, loaded, saveDraft])

    // Auto-ajustar a Provincia si el departamento no es Lima o Callao (Prevención de Lima-Falso)
    useEffect(() => {
        if (!loaded) return
        const deptClean = (department || "").trim().toLowerCase()
        if (deptClean.length > 2) {
            const isLimaOrCallao = deptClean.includes("lima") || deptClean.includes("callao")
            if (!isLimaOrCallao && shippingMethod && (shippingMethod === "Lima" || shippingMethod.includes("Lima"))) {
                setShippingMethod("Provincia")
                toast.info("Ajuste de Cobertura", {
                    description: `Detectamos que tu dirección está en ${department}. El método de envío se ha configurado automáticamente a Provincia.`,
                    duration: 6000
                })
            }
        }
    }, [department, loaded, shippingMethod])

    const handleAddressSelect = async (addr: string) => {
        setValue(addr, false)
        clearSuggestions()
        setAddress(addr)

        try {
            const { getGeocode } = await import("use-places-autocomplete");
            const results = await getGeocode({ address: addr })
            const addressComponents = results[0].address_components;

            let prop_department = "";
            let prop_province = "";
            let prop_district = "";

            addressComponents.forEach((component: any) => {
                const types = component.types;
                if (types.includes("administrative_area_level_1")) {
                    prop_department = component.long_name;
                }
                if (types.includes("administrative_area_level_2")) {
                    prop_province = component.long_name;
                }
                if (types.includes("locality") || types.includes("sublocality")) {
                    prop_district = component.long_name;
                }
            });

            if (prop_department) setDepartment(prop_department);
            if (prop_province) setProvince(prop_province);
            if (prop_district) setDistrict(prop_district);

            // Generate Google Maps GPS link from coordinates
            try {
                const { getLatLng } = await import("use-places-autocomplete");
                const { lat, lng } = await getLatLng(results[0])
                setLocationLink(`https://www.google.com/maps/?q=${lat},${lng}`)
            } catch (geoErr) {
                // Fallback to search URL
                const encoded = encodeURIComponent(addr)
                setLocationLink(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
            }
        } catch (error) {
            console.error("Error Quick Geocoding:", error)
            // Fallback to search URL
            const encoded = encodeURIComponent(addr)
            setLocationLink(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Basic Validation
        if (!shippingMethod) {
            toast.error("Selecciona un método de envío (Lima o Provincia)")
            setIsSubmitting(false)
            return
        }
        const phoneClean = phone.replace(/\D/g, "")
        if (phoneClean.length !== 9) {
            toast.error("El celular debe tener 9 dígitos")
            setIsSubmitting(false)
            return
        }
        const dniClean = dni.replace(/\D/g, "")
        if (dniClean.length > 0 && dniClean.length !== 8) {
            toast.error("El DNI debe tener exactamente 8 dígitos si se completa")
            setIsSubmitting(false)
            return
        }

        // Prepare Payload
        const items = [{
            id: Number(product.id),
            quantity: chosenQty,
            precio: unitPrice,
            nombre: String(product.nombre),
            producto_variante_id: variant?.id ? Number(variant.id) : null,
            variante_nombre: variant?.etiqueta ? String(variant.etiqueta) : null
        }]

        const fullAddress = `${department}, ${province}, ${district}. ${value || address}`.trim()

        // Use geocoded GPS link, fallback to search URL if empty
        const finalLocationLink = locationLink ||
            (value || address
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
                : "")

        const phoneNumberClienteInit = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "958279604"

        try {
            // Create Order in Background
            const { orderId } = await createCheckoutOrder({
                name,
                phone: phoneClean,
                dni: dniClean,
                email: email.trim() || undefined,
                address: fullAddress,
                department, // Department
                provinceName: province, // Province
                district: district, // District
                street: value || address,
                reference,
                locationLink: finalLocationLink,
                items,
                shippingMethod
            })

            const orderIdFormatted = String(orderId).padStart(6, '0')

            sendGTMEvent({
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderIdFormatted,
                    value: total,
                    currency: 'PEN',
                    items: items.map(item => ({
                        item_id: String(item.id),
                        item_name: item.nombre,
                        price: item.precio,
                        quantity: item.quantity,
                        item_variant: item.variante_nombre || undefined
                    }))
                }
            })

            // Start transition for natural feel
            setIsRedirecting(true)
            clearDraft()
            setName("")
            setPhone("")
            setDni("")
            setAddress("")
            setValue("")
            setReference("")
            setDepartment("")
            setProvince("")
            setDistrict("")
            setShippingMethod("")
            setEmail("")

            // Redirect to success page as fast as possible
            router.push(`/checkout/success?order_id=${orderId}&transaction_id=whatsapp`)
            onClose()

        } catch (err: any) {
            toast.error("Error al procesar: " + err.message)
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Urgency Countdown Timer */}
            {timeLeft > 0 && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/50 rounded-xl p-3 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <span className="text-sm">⏰</span>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                        Tu oferta y stock están reservados por <span className="text-orange-600 dark:text-orange-400 font-black tabular-nums">{formatTime(timeLeft)}</span>
                    </span>
                </div>
            )}

            {/* Pack Selector — AOV Booster */}
            <div className="space-y-2">
                <h4 className="font-bold text-sm text-foreground text-center">¿Cuántas unidades deseas llevar?</h4>
                <div className="grid grid-cols-1 gap-2">
                    {/* Pack 1 */}
                    <button
                        type="button"
                        onClick={() => setChosenQty(1)}
                        disabled={isSubmitting}
                        className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                            chosenQty === 1
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:bg-muted/50"
                        }`}
                    >
                        <div>
                            <span className="text-sm font-bold text-foreground">1 Unidad</span>
                            <span className="block text-xs text-muted-foreground">Precio regular</span>
                        </div>
                        <span className="text-base font-black text-foreground">{formatCurrency(pack1Total)}</span>
                        {chosenQty === 1 && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />}
                    </button>

                    {/* Pack 2 — Recommended */}
                    <button
                        type="button"
                        onClick={() => setChosenQty(2)}
                        disabled={isSubmitting}
                        className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                            chosenQty === 2
                                ? "border-emerald-500 bg-emerald-500/5 shadow-md ring-1 ring-emerald-500/20"
                                : "border-border hover:bg-muted/50"
                        }`}
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground">2 Unidades</span>
                                <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">⭐ Recomendado</span>
                            </div>
                            <span className="block text-xs text-emerald-600 font-semibold">Ahorras {formatCurrency(unitPrice * 2 - pack2Total)}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[11px] text-muted-foreground line-through">{formatCurrency(unitPrice * 2)}</span>
                            <span className="text-base font-black text-emerald-600">{formatCurrency(pack2Total)}</span>
                        </div>
                        {chosenQty === 2 && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />}
                    </button>

                    {/* Pack 3 */}
                    <button
                        type="button"
                        onClick={() => setChosenQty(3)}
                        disabled={isSubmitting}
                        className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                            chosenQty === 3
                                ? "border-violet-500 bg-violet-500/5 shadow-md ring-1 ring-violet-500/20"
                                : "border-border hover:bg-muted/50"
                        }`}
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground">3 Unidades</span>
                                <span className="bg-violet-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">🔥 Mega Ahorro</span>
                            </div>
                            <span className="block text-xs text-violet-600 font-semibold">Ahorras {formatCurrency(unitPrice * 3 - pack3Total)}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[11px] text-muted-foreground line-through">{formatCurrency(unitPrice * 3)}</span>
                            <span className="text-base font-black text-violet-600">{formatCurrency(pack3Total)}</span>
                        </div>
                        {chosenQty === 3 && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-violet-500 ring-4 ring-violet-500/20" />}
                    </button>
                </div>
            </div>

            <div className="pt-2 pb-1">
                <h3 className="text-center font-bold text-lg">Ingrese su dirección de envío</h3>
            </div>

            <QuickCustomer
                name={name} setName={setName}
                phone={phone} setPhone={setPhone}
                dni={dni} setDni={setDni}
                email={email} setEmail={setEmail}
                disabled={isSubmitting}
                shippingMethod={shippingMethod}
            />

            {/* Alerta de envíos a provincia */}
            {['provincia', 'Provincia'].includes(shippingMethod || '') && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-300">
                    <span className="text-sm shrink-0">💡</span>
                    <span>Envíos a Provincia: Todos los paquetes se envían para retiro en la oficina o agencia principal de Shalom de tu distrito o ciudad.</span>
                </div>
            )}

            <QuickAddress
                department={department} setDepartment={setDepartment}
                province={province} setProvince={setProvince}
                district={district} setDistrict={setDistrict}
                addressValue={value} setAddressValue={setValue}
                reference={reference} setReference={setReference}
                ready={ready} suggestionsStatus={status} suggestionsData={data} onSuggestionSelect={handleAddressSelect}
                disabled={isSubmitting}
            />

            <QuickSummary
                shippingMethod={shippingMethod} setShippingMethod={setShippingMethod}
                total={total} isSubmitting={isSubmitting}
            />
        </form>
    )
}
