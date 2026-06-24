"use client"
import { useRouter } from "next/navigation"
import { SuccessCheckmark } from "@/components/ui/success-checkmark"

import Image from "next/image"
import { toast } from "sonner"
import { useState, useEffect, useRef } from "react"
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
interface QuickCheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    product: any
    variant: any
    initialQuantity?: number
}

export function QuickCheckoutModal({ isOpen, onClose, product, variant, initialQuantity = 1 }: QuickCheckoutModalProps) {

    const [chosenQty, setChosenQty] = useState(1)
    const [hasAppliedDiscount, setHasAppliedDiscount] = useState(false)
    const [hasOfferedPromo, setHasOfferedPromo] = useState(false)
    const [showPromoModal, setShowPromoModal] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const showPromoModalRef = useRef(showPromoModal)
    const onCloseRef = useRef(onClose)

    useEffect(() => {
        showPromoModalRef.current = showPromoModal
    }, [showPromoModal])

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        if (typeof window === "undefined") return
        if (!isOpen) return

        const handleHashChange = () => {
            const hash = window.location.hash
            if (hash === "#promo-10") {
                setShowPromoModal(true)
            } else if (hash === "#compra-rapida") {
                setShowPromoModal(false)
            } else {
                // Cualquier otro hash (vacío, # o navegación externa)
                setShowPromoModal(false)
                setHasOfferedPromo(false)
                onCloseRef.current()
            }
        }

        // Si el modal se abre y el hash no está establecido, lo ponemos
        if (window.location.hash !== "#compra-rapida" && window.location.hash !== "#promo-10") {
            window.location.hash = "compra-rapida"
        }

        window.addEventListener("hashchange", handleHashChange)

        return () => {
            window.removeEventListener("hashchange", handleHashChange)
            
            // Al cerrarse el modal (isOpen pasa a false o se desmonta), limpiamos el hash de la URL de forma limpia
            if (window.location.hash === "#compra-rapida" || window.location.hash === "#promo-10") {
                window.history.replaceState(null, "", window.location.pathname + window.location.search)
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (typeof window === "undefined" || !isOpen) return

        // Si la promo se abre y no tiene el hash de la promo, lo actualizamos
        if (showPromoModal && window.location.hash !== "#promo-10") {
            window.location.hash = "promo-10"
        }

        // Si la promo se cierra programáticamente pero el modal sigue abierto, regresamos al hash del formulario
        if (!showPromoModal && window.location.hash === "#promo-10") {
            window.location.hash = "compra-rapida"
        }
    }, [showPromoModal, isOpen])

    useEffect(() => {
        if (isOpen) {
            setChosenQty(1)
            setHasAppliedDiscount(false)
            setHasOfferedPromo(false)
            setShowPromoModal(false)

            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0
            }
            const timer = setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0
                }
            }, 50)
            return () => clearTimeout(timer)
        } else {
            setShowPromoModal(false)
            setHasOfferedPromo(false)
        }
    }, [isOpen, initialQuantity])

    const closeModal = () => {
        setShowPromoModal(false)
        setHasOfferedPromo(false)
        onClose()
    }

    const handleClose = () => {
        const isFormHash = typeof window !== "undefined" && window.location.hash === "#compra-rapida"
        if (isFormHash && chosenQty === 1 && !hasAppliedDiscount && !hasOfferedPromo) {
            setHasOfferedPromo(true)
            setShowPromoModal(true)
        } else {
            closeModal()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                handleClose()
            }
        }}>
            <DialogContent
                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 max-w-md w-full p-0 gap-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col [&>button]:hidden"
            >
                <div 
                    ref={scrollContainerRef}
                    className={`overflow-y-auto flex-1 p-6 ${showPromoModal ? 'overflow-hidden pointer-events-none' : ''}`} 
                    data-lenis-prevent
                >
                    {/* Elemento oculto para capturar el foco inicial de Radix Dialog y evitar que la vista haga scroll al final */}
                    <div tabIndex={0} className="sr-only" aria-hidden="true" />
                    <DialogHeader className="mb-4 text-center relative px-8">
                        <DialogTitle className="text-base font-bold uppercase leading-tight">
                            🚚 Envíos contraentrega en todo el Perú 🇵🇪 <br /> (Pagas solo al recibir tu pedido) 🤝
                        </DialogTitle>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                            aria-label="Cerrar modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
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
                                {formatCurrency(hasAppliedDiscount && chosenQty === 1 ? Math.round((variant?.precio ?? product?.precio ?? 0) * 0.90 * 100) / 100 : (variant?.precio ?? product?.precio))}
                            </div>
                        </div>
                    </div>

                    <QuickForm
                        product={product}
                        variant={variant}
                        onClose={closeModal}
                        chosenQty={chosenQty}
                        setChosenQty={setChosenQty}
                        hasAppliedDiscount={hasAppliedDiscount}
                        setHasAppliedDiscount={setHasAppliedDiscount}
                    />
                </div>

                {/* EXIT PROMO MODAL OVERLAY */}
                {showPromoModal && (
                    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-[340px] rounded-[2rem] p-6 relative flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200">
                            <button
                                onClick={() => {
                                    closeModal()
                                }}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <span className="text-xl font-black text-slate-900 mb-0.5 leading-none">¡Espera!</span>
                            <span className="text-xs font-semibold text-slate-500 mb-4 leading-none">¡Tenemos una oferta para ti!</span>

                            <h4 className="text-[13px] font-black text-slate-800 tracking-tight uppercase max-w-[240px] leading-tight mb-2">
                                Obtén un descuento extra en tu pedido:
                            </h4>

                            <div className="relative my-3 flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-32 h-32 text-rose-500 drop-shadow-md animate-pulse" fill="currentColor">
                                    <path d="M50 2 L55.5 13 L67.3 9.4 L67.5 21.8 L79.3 22.3 L75.3 34.1 L85.8 40.5 L78.4 50.4 L85.8 60.3 L75.3 66.7 L79.3 78.5 L67.5 79 L67.3 91.4 L55.5 87.8 L50 98.8 L44.5 87.8 L32.7 91.4 L32.5 79 L20.7 78.5 L24.7 66.7 L14.2 60.3 L21.6 50.4 L14.2 40.5 L24.7 34.1 L20.7 22.3 L32.5 21.8 L32.7 9.4 L44.5 13 Z" />
                                </svg>
                                <span className="absolute text-white font-black text-3xl tracking-tight select-none">10%</span>
                            </div>

                            <span className="text-xs font-bold text-slate-800 mb-5 leading-tight max-w-[200px]">
                                ¿Quieres completar tu pedido?
                            </span>

                            <button
                                onClick={() => {
                                    setHasAppliedDiscount(true)
                                    setShowPromoModal(false)
                                    toast.success("¡10% de descuento adicional aplicado!")
                                }}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs uppercase rounded-full shadow-lg shadow-pink-500/20 hover:from-rose-600 hover:to-pink-700 transition-all duration-200 haptic-scale mb-2.5 cursor-pointer leading-tight"
                            >
                                Completa tu pedido con 10% de descuento
                            </button>

                            <button
                                onClick={() => {
                                    closeModal()
                                }}
                                className="w-full py-3.5 border-2 border-black bg-white text-black font-black text-xs uppercase rounded-full hover:bg-slate-50 transition-all duration-200 haptic-scale cursor-pointer leading-none"
                            >
                                No gracias
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function QuickForm({
    product,
    variant,
    onClose,
    chosenQty,
    setChosenQty,
    hasAppliedDiscount,
    setHasAppliedDiscount
}: {
    product: any
    variant: any
    onClose: () => void
    chosenQty: number
    setChosenQty: (qty: number) => void
    hasAppliedDiscount: boolean
    setHasAppliedDiscount: (v: boolean) => void
}) {
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
    const [isExpanded, setIsExpanded] = useState(false)

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
    const pack2Total = Math.round(unitPrice * 2 * 0.85) // 15% desc. (Entero)
    const pack3Total = Math.round(unitPrice * 3 * 0.70) // 30% desc. (Entero)

    let total = chosenQty === 1
        ? pack1Total
        : chosenQty === 2
            ? pack2Total
            : Math.round(unitPrice * chosenQty * 0.70)

    if (chosenQty === 1 && hasAppliedDiscount) {
        total = Math.round(pack1Total * 0.90 * 100) / 100
    }

    const { draft, loaded, saveDraft, clearDraft } = useCheckoutDraft()

    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)

    const loadGoogleMapsScript = () => {
        if (typeof window === "undefined") return
        if (window.google?.maps) {
            setGoogleMapsLoaded(true)
            return
        }
        const existingScript = document.getElementById("google-maps-sdk")
        if (existingScript) {
            const handleLoad = () => setGoogleMapsLoaded(true)
            existingScript.addEventListener("load", handleLoad)
            return
        }
        const script = document.createElement("script")
        script.id = "google-maps-sdk"
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}&libraries=places&language=es&region=pe`
        script.async = true
        script.defer = true
        script.onload = () => setGoogleMapsLoaded(true)
        document.head.appendChild(script)
    }

    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
        init,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "pe" },
            language: "es",
            region: "pe",
        },
        debounce: 300,
        initOnMount: false,
    })

    useEffect(() => {
        if (googleMapsLoaded) {
            init()
        }
    }, [googleMapsLoaded, init])

    useEffect(() => {
        if (typeof window !== "undefined" && window.google?.maps) {
            setGoogleMapsLoaded(true)
        }
    }, [])

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
                // Si la dirección del borrador existe, forzamos la carga del script para que el autocomplete se sincronice
                loadGoogleMapsScript()
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
        if (phoneClean.length !== 9 || !phoneClean.startsWith("9")) {
            toast.error("El celular debe tener 9 dígitos y empezar con 9")
            setIsSubmitting(false)
            return
        }
        const addressClean = (value || address || "").trim()
        if (addressClean.length < 1) {
            toast.error("La dirección es obligatoria")
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
                shippingMethod,
                isQuickCheckout: true,
                couponCode: (chosenQty === 1 && hasAppliedDiscount) ? "EXIT10" : undefined
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
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 bg-white border-2 rounded-xl transition-all duration-200 group cursor-pointer ${
                        chosenQty === 1
                            ? "border-primary bg-primary/[0.02]"
                            : chosenQty === 2
                                ? "border-emerald-500 bg-emerald-500/[0.02]"
                                : "border-violet-500 bg-violet-500/[0.02]"
                    }`}
                >
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                                {chosenQty === 1 ? "1 Unidad" : chosenQty === 2 ? "2 Unidades" : `${chosenQty} Unidades`}
                            </span>
                            {chosenQty === 2 && (
                                <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    ⭐ Recomendado
                                </span>
                            )}
                            {chosenQty === 3 && (
                                <span className="bg-violet-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    🔥 Mega Ahorro
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">
                            {chosenQty === 1 
                                ? (hasAppliedDiscount ? "¡10% descuento extra aplicado!" : "Precio regular")
                                : chosenQty === 2
                                    ? `Ahorras ${formatCurrency(unitPrice * 2 - pack2Total)}`
                                    : `Ahorras ${formatCurrency(unitPrice * 3 - pack3Total)}`
                            }
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                        <div className="flex flex-col items-end">
                            {chosenQty > 1 && (
                                <span className="text-[10px] text-muted-foreground line-through leading-none mb-0.5">
                                    {formatCurrency(unitPrice * chosenQty)}
                                </span>
                            )}
                            <span className={`text-base font-black leading-none ${
                                chosenQty === 2 
                                    ? "text-emerald-600" 
                                    : chosenQty === 3 
                                        ? "text-violet-600" 
                                        : "text-foreground"
                            }`}>
                                {formatCurrency(total)}
                            </span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* Contenedor de Packs Colapsable con transición */}
                <div className={`grid grid-cols-1 gap-2 transition-all duration-300 ease-in-out origin-top ${
                    isExpanded 
                        ? "max-h-[500px] opacity-100 scale-y-100 mt-2" 
                        : "max-h-0 opacity-0 scale-y-95 overflow-hidden pointer-events-none"
                }`}>
                    {/* Pack 1 */}
                    <button
                        type="button"
                        onClick={() => {
                            setChosenQty(1)
                            setIsExpanded(false)
                        }}
                        disabled={isSubmitting}
                        className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 cursor-pointer ${
                            chosenQty === 1
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:bg-muted/50"
                        }`}
                    >
                        <div>
                            <span className="text-sm font-bold text-foreground">1 Unidad</span>
                            <span className="block text-xs text-muted-foreground">
                                {hasAppliedDiscount ? "¡10% descuento extra aplicado!" : "Precio regular"}
                            </span>
                        </div>
                        <span className="text-base font-black text-foreground">
                            {formatCurrency(hasAppliedDiscount ? Math.round(pack1Total * 0.90 * 100) / 100 : pack1Total)}
                        </span>
                        {chosenQty === 1 && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />}
                    </button>

                    {/* Pack 2 — Recommended */}
                    <button
                        type="button"
                        onClick={() => {
                            setChosenQty(2)
                            setIsExpanded(false)
                        }}
                        disabled={isSubmitting}
                        className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 cursor-pointer ${
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
                        onClick={() => {
                            setChosenQty(3)
                            setIsExpanded(false)
                        }}
                        disabled={isSubmitting}
                        className={`relative flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 cursor-pointer ${
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
                onFocus={loadGoogleMapsScript}
            />

            <QuickSummary
                shippingMethod={shippingMethod} setShippingMethod={setShippingMethod}
                total={total} isSubmitting={isSubmitting}
            />
        </form>
    )
}
