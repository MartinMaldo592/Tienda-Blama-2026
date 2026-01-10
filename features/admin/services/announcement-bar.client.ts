import { supabase } from "@/lib/supabaseClient"

export type AnnouncementBarConfig = {
  enabled: boolean
  interval_ms: number
  messages: string[]
}

async function getAccessToken() {
  const res = await supabase.auth.getSession()
  const token = res?.data?.session?.access_token || ""
  return token
}

export async function fetchAnnouncementBarConfigViaApi() {
  const token = await getAccessToken()
  if (!token) throw new Error("No autorizado")

  const res = await fetch("/api/admin/announcement-bar", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  let json: any = null
  try {
    json = await res.json()
  } catch (e) {
    json = null
  }

  if (!res.ok || !json?.ok) {
    throw new Error(String(json?.error || "No se pudo obtener la configuración"))
  }

  const data = (json?.data || {}) as any
  return {
    enabled: Boolean(data.enabled),
    interval_ms: Number(data.interval_ms) || 3500,
    messages: Array.isArray(data.messages) ? (data.messages as string[]) : [],
  } as AnnouncementBarConfig
}

export async function saveAnnouncementBarConfigViaApi(config: AnnouncementBarConfig) {
  const token = await getAccessToken()
  if (!token) throw new Error("No autorizado")

  const res = await fetch("/api/admin/announcement-bar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  })

  let json: any = null
  try {
    json = await res.json()
  } catch (e) {
    json = null
  }

  if (!res.ok || !json?.ok) {
    throw new Error(String(json?.error || "No se pudo guardar"))
  }

  return json
}
