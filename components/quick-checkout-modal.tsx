"use client"

import { toast } from "sonner"

import { useState, useMemo } from "react"
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Loader2,
    MapPin,
    User,
    CreditCard,
    Phone,
    ShoppingCart,
} from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import {
    buildPreOpenUrl,
    buildWhatsAppFinalMessage,
    buildWhatsAppPreviewMessage,
    buildWhatsAppUrl,
    clearCartStorage,
    createCheckoutOrder,
    isInAppBrowser,
    isMobileDevice,
    normalizeDigits,
    normalizeDni,
    setLastOrderSuccessMarker,
} from "@/features/checkout"
import { sendGTMEvent } from "@/lib/gtm"

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
                        <div className="h-16 w-16 shrink-0 bg-white rounded-md border p-1">
                            {product?.imagen_url && (
                                <img
                                    src={product.imagen_url}
                                    alt={product.nombre}
                                    className="h-full w-full object-contain"
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

// Input Icon Wrapper
const IconInput = ({ icon: Icon, ...props }: any) => (
    <div className="flex w-full items-center rounded-md border text-sm overflow-hidden h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex h-full w-10 items-center justify-center bg-muted/50 border-r">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
            {...props}
            className={`flex h-full w-full bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}
        />
    </div>
)

function QuickForm({ product, variant, onClose }: { product: any; variant: any; onClose: () => void }) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [dni, setDni] = useState("")
    const [address, setAddress] = useState("") // Google Maps Address
    const [reference, setReference] = useState("")
    const [department, setDepartment] = useState("")
    const [district, setDistrict] = useState("")
    const [urbanDistrict, setUrbanDistrict] = useState("")
    const [shippingMethod, setShippingMethod] = useState("lima")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived values
    const unitPrice = Number(variant?.precio ?? product?.precio ?? 0)
    // We assume 1 unit for "Buy Now" quick action ??? 
    // Wait, the user said "solo que muestre el producto".
    // Usually quick buy is 1 unit.
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



            <div className="space-y-1">
                <Label className="text-sm font-bold">Nombre y Apellidos <span className="text-destructive">*</span></Label>
                <IconInput icon={User} required placeholder="Ej: Juan Pérez" value={name} onChange={(e: any) => setName(e.target.value)} />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">DNI <span className="text-destructive">*</span></Label>
                <IconInput
                    icon={CreditCard}
                    required
                    placeholder="DNI"
                    maxLength={8}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={dni}
                    onChange={(e: any) => setDni(e.target.value.replace(/\D/g, ''))}
                />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Teléfono / Whatsapp <span className="text-destructive">*</span></Label>
                <IconInput
                    icon={Phone}
                    required
                    placeholder="Ej: 999 999 999"
                    maxLength={11}
                    inputMode="numeric"
                    value={phone}
                    onChange={(e: any) => {
                        // Remove non-digits
                        const raw = e.target.value.replace(/\D/g, '')
                        // Format with spaces for display only
                        let formatted = raw
                        if (raw.length > 3) {
                            formatted = raw.slice(0, 3) + ' ' + raw.slice(3)
                        }
                        if (raw.length > 6) {
                            formatted = formatted.slice(0, 7) + ' ' + raw.slice(6)
                        }
                        setPhone(formatted)
                    }}
                />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Departamento <span className="text-destructive">*</span></Label>
                <IconInput icon={MapPin} required placeholder="Ej: Lima" value={department} onChange={(e: any) => setDepartment(e.target.value)} />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Provincia <span className="text-destructive">*</span></Label>
                <IconInput icon={MapPin} required placeholder="Ej: Cañete" value={district} onChange={(e: any) => setDistrict(e.target.value)} />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Distrito <span className="text-destructive">*</span></Label>
                <IconInput icon={MapPin} required placeholder="Ej: Miraflores" value={urbanDistrict} onChange={(e: any) => setUrbanDistrict(e.target.value)} />
            </div>

            <div className="space-y-1 relative">
                <Label className="text-sm font-bold">Dirección <span className="text-destructive">*</span></Label>
                <div className="flex w-full items-center rounded-md border text-sm overflow-hidden h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <div className="flex h-full w-10 items-center justify-center bg-muted/50 border-r">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={!ready}
                        placeholder="Ej: Av. Larco 123"
                        className="flex h-full w-full bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                {status === "OK" && (
                    <ul className="absolute z-10 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                        {data.map(({ place_id, description }) => (
                            <li key={place_id} onClick={() => handleAddressSelect(description)} className="px-4 py-2 hover:bg-muted cursor-pointer text-xs">
                                {description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Referencia</Label>
                <IconInput icon={MapPin} placeholder="Ej: Al costado del grifo" value={reference} onChange={(e: any) => setReference(e.target.value)} />
            </div>

            {/* Shipping Method Radios */}
            <div>
                <Label className="mb-2 block text-sm font-bold">Método de envío <span className="text-destructive">*</span></Label>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input
                            type="radio"
                            name="shipping"
                            value="lima"
                            checked={shippingMethod === 'lima'}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="h-4 w-4 accent-black"
                        />
                        <span className="text-sm font-medium">Lima</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input
                            type="radio"
                            name="shipping"
                            value="provincia"
                            checked={shippingMethod === 'provincia'}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="h-4 w-4 accent-black"
                        />
                        <span className="text-sm font-medium">Provincia</span>
                    </label>
                </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-muted/30 -mx-6 -mb-6 p-4 mt-6 border-t space-y-3">
                {/* <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Envío</span>
                        <span>{shippingMethod === 'provincia' ? 'Precio a calcular' : 'Gratis'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div> */}

                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold bg-black hover:bg-gray-800 text-white shadow-lg">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : `CONFIRMO MI PEDIDO POR - ${formatCurrency(total)}`}
                </Button>
            </div>
        </form >
    )
}
