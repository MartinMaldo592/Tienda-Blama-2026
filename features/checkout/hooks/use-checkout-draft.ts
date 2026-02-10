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
}

const STORAGE_KEY = "checkout_draft_v1"

export function useCheckoutDraft() {
    const [draft, setDraft] = useState<CheckoutDraft>({})
    const [loaded, setLoaded] = useState(false)

    // Load on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setDraft(parsed || {})
            }
        } catch (e) {
            console.error("Failed to load checkout draft", e)
        } finally {
            setLoaded(true)
        }
    }, [])

    // Save logic
    const saveDraft = (newValues: Partial<CheckoutDraft>) => {
        setDraft(prev => {
            const updated = { ...prev, ...newValues }
            // Debounce save slightly or just save immediately, localStorage is synchronous but fast enough for small text
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            } catch (e) {
                console.error("Failed to save draft", e)
            }
            return updated
        })
    }

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY)
        setDraft({})
    }

    return { draft, loaded, saveDraft, clearDraft }
}
