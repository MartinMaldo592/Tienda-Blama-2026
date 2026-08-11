"use client"

import { useEffect, useState } from "react"

export interface CheckoutDraft {
    name?: string
    phone?: string
    dni?: string
    department?: string
    province?: string
    district?: string
    address?: string
    reference?: string
    shippingMethod?: string
    paymentMethod?: string
    email?: string
}

const STORAGE_KEY = "checkout_draft_v1"
const COOKIE_MARKER_KEY = "checkout_draft_marker"
const COOKIE_DATA_KEY = "checkout_draft_data"

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === " ") c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
    return null
}

function setCookie(name: string, value: string, days = 30) {
    if (typeof document === "undefined") return
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = "; expires=" + date.toUTCString()
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax"
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") return
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax"
}

export function useCheckoutDraft() {
    const [draft, setDraft] = useState<CheckoutDraft>({})
    const [loaded, setLoaded] = useState(false)

    // Load on mount (Verifica si las cookies fueron borradas)
    useEffect(() => {
        try {
            const hasCookieMarker = getCookie(COOKIE_MARKER_KEY)
            const cookieData = getCookie(COOKIE_DATA_KEY)

            // Si el usuario borró sus cookies de la página, limpiamos también el borrador de localStorage
            if (!hasCookieMarker) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem(STORAGE_KEY)
                }
                deleteCookie(COOKIE_DATA_KEY)
                setDraft({})
            } else {
                // Intentar recuperar desde cookie o localStorage
                let parsed: any = null
                if (cookieData) {
                    try { parsed = JSON.parse(cookieData) } catch (e) { }
                }
                if (!parsed && typeof window !== "undefined") {
                    const stored = localStorage.getItem(STORAGE_KEY)
                    if (stored) {
                        try { parsed = JSON.parse(stored) } catch (e) { }
                    }
                }
                setDraft(parsed || {})
            }
        } catch (e) {
            console.error("Failed to load checkout draft", e)
        } finally {
            setLoaded(true)
        }
    }, [])

    // Save logic en Cookies y LocalStorage simultáneamente
    const saveDraft = (newValues: Partial<CheckoutDraft>) => {
        setDraft(prev => {
            const updated = { ...prev, ...newValues }
            try {
                const jsonStr = JSON.stringify(updated)
                if (typeof window !== "undefined") {
                    localStorage.setItem(STORAGE_KEY, jsonStr)
                }
                // Guardar marcador y datos en Cookies
                setCookie(COOKIE_MARKER_KEY, "1", 30)
                setCookie(COOKIE_DATA_KEY, jsonStr, 30)
            } catch (e) {
                console.error("Failed to save draft", e)
            }
            return updated
        })
    }

    const clearDraft = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY)
        }
        deleteCookie(COOKIE_MARKER_KEY)
        deleteCookie(COOKIE_DATA_KEY)
        setDraft({})
    }

    return { draft, loaded, saveDraft, clearDraft }
}
