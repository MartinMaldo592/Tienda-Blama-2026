import { create } from 'zustand'

interface WhatsAppState {
    customMessage: string | null
    setCustomMessage: (msg: string | null) => void
}

export const useWhatsAppStore = create<WhatsAppState>((set) => ({
    customMessage: null,
    setCustomMessage: (msg) => set({ customMessage: msg }),
}))
