import { createClient } from "@/lib/supabase.client"

export type AnnouncementBarConfig = {
  enabled: boolean
  interval_ms: number
  messages: string[]
}

