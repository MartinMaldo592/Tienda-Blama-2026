"use client"

import Image from "next/image"
import { toast } from "sonner"

import { useState } from "react"
import { useLoadScript } from "@react-google-maps/api"
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
import { sendGTMEvent } from "@/lib/gtm"
import { QuickCustomer } from "@/components/checkout/quick-checkout/quick-customer"
import { QuickAddress } from "@/components/checkout/quick-checkout/quick-address"
import { QuickSummary } from "@/components/checkout/quick-checkout/quick-summary"

const libraries: ("places")[] = ["places"]

interface QuickCheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    product: any
    variant: any
}

export function QuickCheckoutModal({ isOpen, onClose, product, variant }: QuickCheckoutModalProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    })

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md w-full p-0 gap-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-5"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="overflow-y-auto flex-1 p-6">
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

                    {isLoaded ? (
                        <QuickForm
                            product={product}
                            variant={variant}
                            onClose={onClose}
                        />
                    ) : (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function QuickForm({ product, variant, onClose }: { product: any; variant: any; onClose: () => void }) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [dni, setDni] = useState("")
    const [address, setAddress] = useState("") // Google Maps Address
    const [reference, setReference] = useState("")
    const [department, setDepartment] = useState("")
    const [district, setDistrict] = useState("")
    const [urbanDistrict, setUrbanDistrict] = useState("")
    const [shippingMethod, setShippingMethod] = useState("Lima")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived values
    const unitPrice = Number(variant?.precio ?? product?.precio ?? 0)
    const quantity = 1
    const total = unitPrice * quantity

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

    const handleAddressSelect = async (addr: string) => {
        setValue(addr, false)
        clearSuggestions()
        setAddress(addr)
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
        if (dniClean.length !== 8) {
            toast.error("El DNI debe tener 8 dígitos")
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

        const fullAddress = `${department}, ${district}, ${urbanDistrict}. ${value || address}`.trim()
        const locationLink = "" // Can be added if we do Geocode

        const messageCliente = buildWhatsAppPreviewMessage({
            name,
            dni: dniClean,
            phone: phoneClean,
            address: fullAddress,
            reference,
            locationLink,
            items,
            subtotal: total,
            discount: 0,
            total: total,
            shippingMethod
        })

        const phoneNumberClienteInit = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "982432561"

        try {
            // Create Order in Background
            const { orderId } = await createCheckoutOrder({
                name,
                phone: phoneClean,
                dni: dniClean,
                address: fullAddress,
                department, // Department
                provinceName: district, // Province
                district: urbanDistrict, // District
                street: value || address,
                reference,
                locationLink,
                items,
                shippingMethod
            })

            const orderIdFormatted = String(orderId).padStart(6, '0')

            const finalMessage = buildWhatsAppFinalMessage({
                orderIdFormatted,
                name,
                dni: dniClean,
                phone: phoneClean,
                address: fullAddress,
                reference,
                locationLink,
                items,
                subtotal: total,
                discount: 0,
                total: total,
                shippingMethod
            })

            const url = buildWhatsAppUrl(phoneNumberClienteInit, finalMessage)

            setLastOrderSuccessMarker(orderIdFormatted)

            // GTM: Track Purchase
            sendGTMEvent({
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderIdFormatted,
                    value: total,
                    tax: 0,
                    shipping: 0,
                    currency: 'PEN',
                    items: items.map(item => ({
                        item_id: String(item.id),
                        item_name: item.nombre,
                        price: item.precio,
                        quantity: item.quantity
                    }))
                }
            })

            // Redirect
            if (isMobileDevice()) {
                window.location.href = url
            } else {
                window.open(url, '_blank')
            }
            onClose()

        } catch (err: any) {
            toast.error("Error al procesar: " + err.message)
        } finally {
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
                disabled={isSubmitting}
            />

            <QuickAddress
                department={department} setDepartment={setDepartment}
                district={district} setDistrict={setDistrict}
                urbanDistrict={urbanDistrict} setUrbanDistrict={setUrbanDistrict}
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
