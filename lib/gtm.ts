import { MarketingEventBus, MarketingEventPayload, MarketingItem } from "@/lib/marketing/event-bus"

export type GA4Product = MarketingItem

export type GTMEvent = MarketingEventPayload

export const sendGTMEvent = (data: GTMEvent) => {
  MarketingEventBus.emit(data)
}
