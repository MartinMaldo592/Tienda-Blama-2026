export type MarketingItem = {
  item_id: string | number
  item_name: string
  price: number
  quantity: number
  item_category?: string
  item_variant?: string
}

export type MarketingEventPayload = {
  event: string
  ecommerce?: {
    currency?: string
    value?: number
    transaction_id?: string
    coupon?: string
    items: MarketingItem[]
  }
  email?: string
  phone?: string
  [key: string]: any
}

type EventListener = (payload: MarketingEventPayload) => void

const recentEvents = new Map<string, number>()

class MarketingEventBusImpl {
  private listeners: Set<EventListener> = new Set()

  public constructor() {
    this.setupDefaultAdapters()
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public emit(payload: MarketingEventPayload): void {
    if (typeof window === "undefined") return

    // Asynchronous non-blocking dispatch
    const dispatch = () => {
      const normalizedPayload = this.normalizePayload(payload)

      // Deduplication check (500ms window)
      try {
        const eventKey = JSON.stringify(normalizedPayload)
        const now = Date.now()
        const lastSent = recentEvents.get(eventKey)
        if (lastSent && now - lastSent < 500) {
          return
        }
        recentEvents.set(eventKey, now)
        if (recentEvents.size > 100) {
          for (const [key, timestamp] of recentEvents.entries()) {
            if (now - timestamp > 5000) recentEvents.delete(key)
          }
        }
      } catch (e) {
        // Fallback if serialization fails
      }

      this.listeners.forEach((listener) => {
        try {
          listener(normalizedPayload)
        } catch (err) {
          console.error("⚠️ Marketing Event Bus Listener Error:", err)
        }
      })
    }

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(dispatch)
    } else {
      setTimeout(dispatch, 0)
    }
  }

  private normalizePayload(payload: MarketingEventPayload): MarketingEventPayload {
    const copy = { ...payload }

    if (copy.phone) {
      const clean = String(copy.phone).replace(/\D/g, "")
      if (clean.length === 9 && clean.startsWith("9")) {
        copy.phone = `+51${clean}`
      } else if (clean.startsWith("51") && clean.length === 11) {
        copy.phone = `+${clean}`
      } else if (clean.length > 0) {
        copy.phone = String(copy.phone).startsWith("+") ? copy.phone : `+${clean}`
      }
    }

    return copy
  }

  private setupDefaultAdapters(): void {
    if (typeof window === "undefined") return

    // Adapter 1: GTM / DataLayer
    this.subscribe((payload) => {
      const win = window as any
      win.dataLayer = win.dataLayer || []
      win.dataLayer.push({ ecommerce: null })
      win.dataLayer.push(payload)
    })

    // Adapter 2: Meta Pixel (Facebook) Direct
    this.subscribe((payload) => {
      const win = window as any
      if (typeof win.fbq === "function") {
        if (payload.event === "purchase") {
          win.fbq("track", "Purchase", {
            value: payload.ecommerce?.value || 0,
            currency: payload.ecommerce?.currency || "PEN",
            content_type: "product",
            contents: payload.ecommerce?.items.map((i) => ({ id: i.item_id, quantity: i.quantity })),
          })
        } else if (payload.event === "add_to_cart") {
          win.fbq("track", "AddToCart", {
            value: payload.ecommerce?.value || 0,
            currency: payload.ecommerce?.currency || "PEN",
          })
        }
      }
    })

    // Adapter 3: TikTok Pixel Direct + Advanced Matching
    this.subscribe((payload) => {
      const win = window as any
      if (typeof win.ttq === "object" && typeof win.ttq.track === "function") {
        if (payload.email || payload.phone) {
          win.ttq.identify({
            email: payload.email,
            phone_number: payload.phone,
          })
        }
        if (payload.event === "purchase") {
          win.ttq.track("CompletePayment", {
            value: payload.ecommerce?.value || 0,
            currency: payload.ecommerce?.currency || "PEN",
            contents: payload.ecommerce?.items.map((i) => ({
              content_id: String(i.item_id),
              quantity: i.quantity,
              price: i.price,
            })),
          })
        }
      }
    })
  }
}

export const MarketingEventBus = new MarketingEventBusImpl()
