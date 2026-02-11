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

  // Repeat items enough times to fill wide screens
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div
      className={
        "w-full h-9 bg-indigo-600 text-white flex items-center overflow-hidden relative " +
        (className || "")
      }
      role="status"
      aria-live="polite"
    >
      <div className="marquee-track flex w-max will-change-transform animate-in fade-in duration-1000">
        <div className="marquee-content flex items-center whitespace-nowrap shrink-0">
          {repeated.map((msg, i) => (
            <span key={i} className="marquee-item inline-flex items-center shrink-0">
              <span className="text-[12px] sm:text-[13px] font-bold tracking-wide">
                {msg}
              </span>
              <span className="text-indigo-300 text-[10px] mx-4">✦</span>
            </span>
          ))}
        </div>
        <div className="marquee-content flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
          {repeated.map((msg, i) => (
            <span key={i} className="marquee-item inline-flex items-center shrink-0">
              <span className="text-[12px] sm:text-[13px] font-bold tracking-wide">
                {msg}
              </span>
              <span className="text-indigo-300 text-[10px] mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-move 50s linear infinite;
        }
        @keyframes marquee-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
