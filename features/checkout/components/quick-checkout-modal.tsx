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
}

export function QuickCheckoutModal({ isOpen, onClose, product, variant }: QuickCheckoutModalProps) {
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
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function QuickForm({ product, variant, onClose }: { product: any; variant: any; onClose: () => void }) {
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
    const [shippingMethod, setShippingMethod] = useState("Lima")
    const [email, setEmail] = useState("")
    const [locationLink, setLocationLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived values
    const unitPrice = Number(variant?.precio ?? product?.precio ?? 0)
    const quantity = 1
    const total = unitPrice * quantity

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
            if (!isLimaOrCallao && (shippingMethod === "Lima" || shippingMethod.includes("Lima"))) {
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
            quantity: quantity,
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
            setShippingMethod("Lima")
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

            <div className="pt-2 pb-1">
                <h3 className="text-center font-bold text-lg">Ingrese su dirección de envío</h3>
            </div>

            <QuickCustomer
                name={name} setName={setName}
                phone={phone} setPhone={setPhone}
                dni={dni} setDni={setDni}
                email={email} setEmail={setEmail}
                disabled={isSubmitting}
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
