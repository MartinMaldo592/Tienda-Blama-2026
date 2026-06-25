"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete"
import { toast } from "sonner"

import {
    buildWhatsAppFinalMessage,
    clearCartStorage,
    createCheckoutOrder,
    isCouponRelatedError,
    normalizeDni,
    setLastOrderSuccessMarker,
    validateCoupon,
    identitySchema,
    checkoutBaseFields,
} from "@/features/checkout"
import { useCheckoutDraft } from "@/features/checkout/hooks/use-checkout-draft"
import { sendGTMEvent } from "@/lib/gtm"

const checkoutFormSchema = z.object({
    name: identitySchema.name,
    phone: identitySchema.phone,
    dni: identitySchema.document,
    department: checkoutBaseFields.department,
    province: checkoutBaseFields.province,
    district: checkoutBaseFields.district,
    reference: z.string().optional(),
    shippingMethod: z.string(),
    paymentMethod: z.string(),
    email: identitySchema.email,
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

interface UseCheckoutFormOptions {
    items: any[]
    total: number
    onComplete: () => void
    onCompleteCulqi?: () => void
}

export function useCheckoutForm({ items, total, onComplete, onCompleteCulqi }: UseCheckoutFormOptions) {
    const { draft, loaded, saveDraft, clearDraft } = useCheckoutDraft()
    const router = useRouter()
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [locationLink, setLocationLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Coupon states
    const [couponCode, setCouponCode] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponApplying, setCouponApplying] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)

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
            paymentMethod: "whatsapp",
            email: ""
        }
    })

    const { register, handleSubmit, trigger, control, watch, getValues, setValue: setFormValue, formState: { errors } } = form

    const paymentMethod = watch("paymentMethod")
    const shippingMethod = watch("shippingMethod")
    const department = watch("department")

    // Google Maps Places Autocomplete
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
            if (draft.address) setValue(draft.address, false)
        }
    }, [loaded, draft, setFormValue, setValue])

    // Save draft on changes (Debounced)
    useEffect(() => {
        if (!loaded) return
        const timeout = setTimeout(() => {
            saveDraft({
                ...getValues(),
                address: value,
            })
        }, 500)
        return () => clearTimeout(timeout)
    }, [paymentMethod, shippingMethod, value, loaded, saveDraft, getValues])

    // Auto-ajustar a Provincia si el departamento no es Lima o Callao
    useEffect(() => {
        if (!loaded) return
        const deptClean = (department || "").trim().toLowerCase()
        if (deptClean.length > 2) {
            const isLimaOrCallao = deptClean.includes("lima") || deptClean.includes("callao")
            const currentShipping = getValues("shippingMethod")

            if (!isLimaOrCallao && currentShipping === "Lima") {
                setFormValue("shippingMethod", "Provincia", { shouldValidate: true })
                toast.info("Ajuste de Cobertura", {
                    description: `Detectamos que tu dirección está en ${department}. El método de envío se ha configurado automáticamente a Provincia.`,
                    duration: 6000
                })
            }
        }
    }, [department, loaded, setFormValue, getValues])

    // Selection handler from google maps
    const handleSelect = async (address: string) => {
        setValue(address, false)
        clearSuggestions()

        try {
            const results = await getGeocode({ address })
            const addressComponents = results[0].address_components

            let departamentoEncontrado = ""
            let provinciaEncontrada = ""
            let distritoEncontrado = ""

            addressComponents.forEach((component: any) => {
                const types = component.types
                if (types.includes("administrative_area_level_1")) {
                    departamentoEncontrado = component.long_name
                }
                if (types.includes("administrative_area_level_2")) {
                    provinciaEncontrada = component.long_name
                }
                if (types.includes("locality") || types.includes("sublocality")) {
                    distritoEncontrado = component.long_name
                }
            })

            if (departamentoEncontrado) setFormValue("department", departamentoEncontrado, { shouldValidate: true })
            if (provinciaEncontrada) setFormValue("province", provinciaEncontrada, { shouldValidate: true })
            if (distritoEncontrado) setFormValue("district", distritoEncontrado, { shouldValidate: true })

            const { lat, lng } = await getLatLng(results[0])
            const link = `https://www.google.com/maps/?q=${lat},${lng}`
            setLocationLink(link)
        } catch (error) {
            console.error("Error Geocoding:", error)
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
            const currentEmail = getValues("email")?.trim() || null
            const res = await validateCoupon(couponCode, subtotalAmount, currentEmail)
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

    const validateFieldsForCulqi = async () => {
        const isValid = await trigger()
        if (!isValid) return false

        setCouponError("")

        if (!value || value.length < 1) {
            toast.error("Dirección inválida", {
                description: "Por favor selecciona una dirección válida del mapa antes de continuar.",
                duration: 5000
            })
            return false
        }

        if (couponCode.trim()) {
            try {
                const currentEmail = getValues("email")?.trim() || null
                await validateCoupon(couponCode, subtotalAmount, currentEmail)
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                return false
            }
        }
        return true
    }

    const getOrderPayload = useCallback(async (data: CheckoutFormValues) => {
        const normalizedPhone = data.phone.replace(/\D/g, "")
        const normalizedDni = normalizeDni(data.dni)

        let appliedCouponCode: string | null = null
        let appliedDiscount = discountAmount

        if (couponCode.trim()) {
            try {
                const res = await validateCoupon(couponCode, subtotalAmount, data.email?.trim() || null)
                appliedCouponCode = res.codigo
                appliedDiscount = res.descuento
            } catch (err) {
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

        const streetForApi = (value || "").trim()
        const addressForApi = streetForApi.length >= 1
            ? streetForApi
            : fullAddress.length >= 1
                ? fullAddress
                : `${data.district || ''} ${data.province || ''}`.trim()

        return {
            name: data.name,
            phone: normalizedPhone,
            dni: normalizedDni,
            email: data.email?.trim() || undefined,
            address: addressForApi,
            street: streetForApi,
            province: data.province,
            district: data.district,
            department: data.department,
            reference: data.reference || undefined,
            locationLink: finalLocationLink || "",
            couponCode: appliedCouponCode || undefined,
            discountAmount: finalDiscount || 0,
            shippingMethod: data.shippingMethod || undefined,
            items: checkoutItems,
            subtotal: subtotalAmount,
            total: finalTotal
        }
    }, [items, subtotalAmount, discountAmount, couponCode, value, locationLink])

    const onSubmit = async (data: CheckoutFormValues) => {
        if (data.paymentMethod === 'culqi') return

        if (!value || value.length < 1) {
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
                await validateCoupon(couponCode, subtotalAmount, data.email?.trim() || null)
            } catch (err: any) {
                setCouponError(err?.message || 'Cupón inválido')
                setIsSubmitting(false)
                return
            }
        }

        try {
            const payload = await getOrderPayload(data)
            const { orderId: newOrderId } = await createCheckoutOrder(payload)
            const orderIdFormatted = newOrderId.toString().padStart(6, '0')

            buildWhatsAppFinalMessage({
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
                email: payload.email,
            })

            sendGTMEvent({
                event: 'purchase',
                email: payload.email || undefined,
                phone: payload.phone || undefined,
                ecommerce: {
                    transaction_id: orderIdFormatted,
                    value: payload.total,
                    currency: 'PEN',
                    coupon: payload.couponCode || undefined,
                    items: payload.items.map(item => ({
                        item_id: String(item.id),
                        item_name: item.nombre,
                        price: item.precio,
                        quantity: item.quantity,
                        item_variant: item.variante_nombre || undefined
                    }))
                }
            })

            setIsRedirecting(true)
            setLastOrderSuccessMarker(orderIdFormatted)
            clearDraft()
            form.reset()
            router.push(`/checkout/success?order_id=${newOrderId}&transaction_id=whatsapp`)

            clearCartStorage()
            onComplete()
        } catch (error: any) {
            console.error("Error al procesar:", error)
            const msg = String(error?.message || '')
            if (isCouponRelatedError(msg)) {
                setCouponDiscount(0)
                setCouponApplied(false)
                setCouponError(msg)
            } else {
                toast.error("No se pudo crear el pedido", {
                    description: msg || "Intenta nuevamente o contáctanos por WhatsApp.",
                    duration: 8000
                })
            }
            setIsSubmitting(false)
        }
    }

    const handleCulqiToken = async (token: string, email: string) => {
        try {
            const payload = await getOrderPayload(getValues())
            const emailToSend = email || ["pedidos", "blama.shop"].join("@")

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
                const errorDetails = data.details ? `\nDetalles: ${JSON.stringify(data.details, null, 2)}` : ""
                throw new Error((data.error || "Error al procesar el pago") + errorDetails)
            }

            const orderIdFormatted = String(data.orderId || '0').padStart(6, '0')
            setLastOrderSuccessMarker(orderIdFormatted)
            clearDraft()
            form.reset()
            clearCartStorage()
            setIsRedirecting(true)

            sendGTMEvent({
                event: 'purchase',
                ecommerce: {
                    transaction_id: orderIdFormatted,
                    value: payload.total,
                    currency: 'PEN',
                    coupon: payload.couponCode || undefined,
                    items: payload.items.map(item => ({
                        item_id: String(item.id),
                        item_name: item.nombre,
                        price: item.precio,
                        quantity: item.quantity,
                        item_variant: item.variante_nombre || undefined
                    }))
                }
            })

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

    return {
        register,
        handleSubmit,
        trigger,
        control,
        watch,
        getValues,
        setFormValue,
        errors,
        paymentMethod,
        shippingMethod,
        department,
        isRedirecting,
        locationLink,
        isSubmitting,
        couponCode,
        setCouponCode,
        couponDiscount,
        couponApplying,
        couponError,
        couponApplied,
        setCouponApplied,
        setCouponError,
        ready,
        value,
        setValue,
        suggestions: data,
        suggestionsStatus: status,
        clearSuggestions,
        handleSelect,
        subtotalAmount,
        discountAmount,
        totalToPay,
        handleApplyCoupon,
        validateFieldsForCulqi,
        onSubmit,
        handleCulqiToken,
    }
}
