"use client"

import { useEffect } from "react"

const ATTRIBUTION_PARAMS = [
  { urlParam: "utm_source", cookieName: "blama_utm_source" },
  { urlParam: "utm_medium", cookieName: "blama_utm_medium" },
  { urlParam: "utm_campaign", cookieName: "blama_utm_campaign" },
  { urlParam: "utm_content", cookieName: "blama_utm_content" },
  { urlParam: "utm_term", cookieName: "blama_utm_term" },
  { urlParam: "fbclid", cookieName: "blama_fbclid" },
  { urlParam: "ttclid", cookieName: "blama_ttclid" },
  { urlParam: "gclid", cookieName: "blama_gclid" }
]

export function AttributionTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const searchParams = new URLSearchParams(window.location.search)
      const isHttps = window.location.protocol === "https:"

      ATTRIBUTION_PARAMS.forEach(({ urlParam, cookieName }) => {
        const value = searchParams.get(urlParam)
        if (value && value.trim() !== "") {
          // Guardar cookie con duración de 30 días
          const maxAge = 60 * 60 * 24 * 30 // 30 días en segundos
          const cookieString = `${cookieName}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${isHttps ? "; Secure" : ""}`
          document.cookie = cookieString
        }
      })
    } catch (error) {
      console.error("Error capturando cookies de atribución:", error)
    }
  }, [])

  return null
}
