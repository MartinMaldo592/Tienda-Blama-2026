"use client"

import { useMemo } from "react"

type AnnouncementBarProps = {
  messages?: string[]
  intervalMs?: number
  className?: string
}

export function AnnouncementBar({
  messages,
  className,
}: AnnouncementBarProps) {
  const defaultMessages = useMemo(
    () => [
      "🚚 ENVÍO GRATIS en Lima Metropolitana",
      "💳 PAGO CONTRAENTREGA disponible",
      "⚡ ENTREGA EN 24 HORAS",
      "🏷️ NUEVOS PRODUCTOS CADA SEMANA",
    ],
    []
  )

  const items = messages && messages.length > 0 ? messages : defaultMessages

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className={
          "w-full bg-indigo-600 text-white py-2 overflow-hidden whitespace-nowrap " +
          (className || "")
        }
        role="status"
        aria-live="polite"
      >
        <div
          className="inline-block"
          style={{ animation: "marquee-scroll 30s linear infinite" }}
        >
          {/* Render the items twice for seamless loop */}
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {items.map((msg, i) => (
                <span key={`${copy}-${i}`} className="inline-flex items-center">
                  <span className="text-[12px] sm:text-[13px] font-bold tracking-wide px-4">
                    {msg}
                  </span>
                  <span className="text-indigo-300 text-[10px]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
