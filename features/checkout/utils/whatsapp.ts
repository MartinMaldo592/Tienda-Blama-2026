import { formatCurrency } from "@/lib/utils"

import type { CheckoutItem } from "@/features/checkout/types"

export function normalizeDigits(value: unknown) {
    return String(value ?? "").replace(/\D/g, "")
}

export function normalizeDni(value: unknown) {
    return normalizeDigits(value).slice(0, 8)
}

export function buildWhatsAppPreviewMessage(input: {
    name: string
    dni: string
    phone: string
    address: string
    department?: string
    province?: string
    district?: string
    reference?: string
    locationLink?: string
    items: CheckoutItem[]
    subtotal: number
    discount: number
    total: number
    couponCode?: string | null
    shippingMethod?: string
    email?: string
}) {
    const {
        name, dni, phone, address,
        department, province, district,
        reference, locationLink, items,
        subtotal, discount, total,
        couponCode, shippingMethod, email
    } = input

    let message = `*✨ ¡NUEVO PEDIDO REGISTRADO! ✨*\n`
    message += `*BLAMA SHOP* 🛍️\n\n`
    message += `Hola, quiero confirmar mi compra con los siguientes datos:\n\n`
    
    message += `👤 *DATOS PERSONALES:*\n`
    message += `• *Cliente:* ${name || "(Por completar)"}\n`
    message += `• *Teléfono:* ${phone || "(Por completar)"}\n`
    message += `• *DNI:* ${dni && dni.trim() !== "" ? dni : "No especificado"}\n`
    if (email) message += `• *Email:* ${email}\n`
    message += `\n`

    message += `📍 *DATOS DE ENVÍO:*\n`
    if (shippingMethod) {
        const methodLabel = shippingMethod.toLowerCase().includes('lima') ? '🚚 Contraentrega (Lima/Callao)' : '📦 Agencia de Envío (Provincias)'
        message += `• *Método:* ${methodLabel}\n`
    }
    if (department) message += `• *Departamento:* ${department}\n`
    if (province) message += `• *Provincia:* ${province}\n`
    if (district) message += `• *Distrito:* ${district}\n`
    message += `• *Dirección:* ${address || "(Por completar)"}\n`
    if (reference) message += `• *Referencia:* ${reference}\n`
    if (locationLink) message += `• *Ubicación GPS:* ${locationLink}\n`
    message += `\n`

    message += `🛒 *DETALLE DEL PEDIDO:*\n`
    items.forEach((item) => {
        const qty = item.quantity ?? (item as any).cantidad ?? 1
        const price = item.precio ?? (item as any).precio_unitario ?? 0
        const nameVal = item.nombre ?? (item as any).producto_nombre ?? ""
        const vName = item.variante_nombre ? ` (${String(item.variante_nombre)})` : ""
        message += `• ${qty}x *${nameVal}${vName}* - ${formatCurrency(qty * price)}\n`
    })
    message += `\n`

    if (discount > 0) {
        message += `• *Subtotal:* ${formatCurrency(subtotal)}\n`
        if (couponCode) {
            message += `• *Cupón (${couponCode}):* -${formatCurrency(discount)}\n`
        } else {
            message += `• *Descuento:* -${formatCurrency(discount)}\n`
        }
    }
    
    message += `💰 *TOTAL A PAGAR:* *${formatCurrency(total)}*\n`

    const isProv = shippingMethod?.toLowerCase() === 'provincia' || 
                   shippingMethod?.toLowerCase().includes('provincia') || 
                   shippingMethod?.toLowerCase().includes('shalom')
    if (isProv) {
        message += `\n*Envío:* Flete por Pagar en Destino (Agencia)\n`
        message += `\n_💡 Nota: El costo del envío lo cobra la agencia al retirar. Un asesor se comunicará contigo para definir los detalles de tu envío._`
    }

    return message
}

export function buildWhatsAppFinalMessage(input: {
    orderIdFormatted: string
    name: string
    dni: string
    phone: string
    address: string
    department?: string
    province?: string
    district?: string
    reference?: string
    locationLink?: string
    items: CheckoutItem[]
    subtotal: number
    discount: number
    total: number
    couponCode?: string | null
    shippingMethod?: string
    email?: string
}) {
    const {
        orderIdFormatted, name, dni, phone, address,
        department, province, district,
        reference, locationLink, items,
        subtotal, discount, total,
        couponCode, shippingMethod, email
    } = input

    let message = `*✨ ¡NUEVO PEDIDO REGISTRADO! ✨*\n`
    message += `*BLAMA SHOP* 🛍️\n\n`
    message += `Hola, quiero confirmar mi compra con los siguientes datos:\n\n`
    
    message += `🆔 *CÓDIGO DE PEDIDO:* \`#${orderIdFormatted}\`\n\n`
    
    message += `👤 *DATOS PERSONALES:*\n`
    message += `• *Cliente:* ${name}\n`
    message += `• *Teléfono:* ${phone}\n`
    message += `• *DNI:* ${dni && dni.trim() !== "" ? dni : "No especificado"}\n`
    if (email) message += `• *Email:* ${email}\n`
    message += `\n`

    message += `📍 *DATOS DE ENVÍO:*\n`
    if (shippingMethod) {
        const methodLabel = shippingMethod.toLowerCase().includes('lima') ? '🚚 Contraentrega (Lima/Callao)' : '📦 Agencia de Envío (Provincias)'
        message += `• *Método:* ${methodLabel}\n`
    }
    if (department) message += `• *Departamento:* ${department}\n`
    if (province) message += `• *Provincia:* ${province}\n`
    if (district) message += `• *Distrito:* ${district}\n`
    message += `• *Dirección:* ${address}\n`
    if (reference) message += `• *Referencia:* ${reference}\n`
    if (locationLink) message += `• *Ubicación GPS:* ${locationLink}\n`
    message += `\n`

    message += `🛒 *DETALLE DEL PEDIDO:*\n`
    items.forEach((item) => {
        const qty = item.quantity ?? (item as any).cantidad ?? 1
        const price = item.precio ?? (item as any).precio_unitario ?? 0
        const nameVal = item.nombre ?? (item as any).producto_nombre ?? ""
        const vName = item.variante_nombre ? ` (${String(item.variante_nombre)})` : ""
        message += `• ${qty}x *${nameVal}${vName}* - ${formatCurrency(qty * price)}\n`
    })
    message += `\n`

    if (discount > 0) {
        message += `• *Subtotal:* ${formatCurrency(subtotal)}\n`
        if (couponCode) {
            message += `• *Cupón (${couponCode}):* -${formatCurrency(discount)}\n`
        } else {
            message += `• *Descuento:* -${formatCurrency(discount)}\n`
        }
    }
    
    message += `💰 *TOTAL A PAGAR:* *${formatCurrency(total)}*\n`

    const isProv = shippingMethod?.toLowerCase() === 'provincia' || 
                   shippingMethod?.toLowerCase().includes('provincia') || 
                   shippingMethod?.toLowerCase().includes('shalom')
    if (isProv) {
        message += `\n🚛 *Costo de Envío:* Flete por Pagar en Destino (Agencia)\n`
        message += `\n_💡 Nota: El costo del envío lo cobra la agencia al retirar. Un asesor se comunicará contigo para definir los detalles de tu envío._`
    }

    return message
}

export function buildWhatsAppUrl(phone: string, text: string) {
    let cleanPhone = String(phone || "").replace(/\D/g, "")
    // Prepend '51' country code if the number has 9 digits and starts with 9 (Peru)
    if (cleanPhone.length === 9 && cleanPhone.startsWith("9")) {
        cleanPhone = "51" + cleanPhone
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

export function buildPreOpenUrl(phone: string, text: string) {
    return `/open-wa?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&auto=1`
}

export function setLastOrderSuccessMarker(orderIdFormatted: string) {
    try {
        localStorage.setItem("blama_last_order_success", JSON.stringify({ orderId: orderIdFormatted, ts: Date.now() }))
    } catch (err) {
    }

    try {
        const payload = encodeURIComponent(JSON.stringify({ orderId: orderIdFormatted, ts: Date.now() }))
        const isHttps = typeof window !== "undefined" && window.location.protocol === "https:"
        document.cookie = `blama_last_order_success=${payload}; Max-Age=${60 * 30}; Path=/; SameSite=Lax${isHttps ? "; Secure" : ""}`
    } catch (err) {
    }
}

export function clearCartStorage() {
    try {
        localStorage.removeItem("cart-storage")
    } catch (err) {
    }
}
