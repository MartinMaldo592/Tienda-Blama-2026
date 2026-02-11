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
      <div className="marquee-track">
        <div className="marquee-content">
          {repeated.map((msg, i) => (
            <span key={i} className="marquee-item">
              <span className="text-[12px] sm:text-[13px] font-bold tracking-wide">
                {msg}
              </span>
              <span className="text-indigo-300 text-[10px] mx-4">✦</span>
            </span>
          ))}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {repeated.map((msg, i) => (
            <span key={i} className="marquee-item">
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
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marquee-move 50s linear infinite;
          transform: translateZ(0); /* Hardware acceleration */
        }
        .marquee-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .marquee-item {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        @keyframes marquee-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
