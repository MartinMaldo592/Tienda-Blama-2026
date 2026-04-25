import { create } from 'zustand'

/**
 * Zustand store for WhatsApp checkout flow state.
 * Canonical location: features/checkout/store/whatsapp.ts
 */
interface WhatsAppState {
    customMessage: string | null
    setCustomMessage: (msg: string | null) => void
}

export const useWhatsAppStore = create<WhatsAppState>((set) => ({
    customMessage: null,
    setCustomMessage: (msg) => set({ customMessage: msg }),
}))
