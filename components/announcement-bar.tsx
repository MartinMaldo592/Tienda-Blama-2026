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
      "✨ BLAMA | FITNESS • PILATES • LIFESTYLE",
      "💖 TU MEJOR VERSIÓN, TODOS LOS DÍAS ♡",
      "🚚 ENVÍOS EXPRESS EN LIMA Y A TODO EL PERÚ",
      "💳 PAGO CONTRAENTREGA DISPONIBLE",
      "🌸 FUERTE • SEGURA • IMPARABLE",
    ],
    []
  )

  const items = messages && messages.length > 0 ? messages : defaultMessages

  // Repeat items enough times to fill wide screens
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div
      className={
        "w-full h-9 bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7] text-white flex items-center overflow-hidden relative shadow-xs " +
        (className || "")
      }
      role="status"
      aria-live="polite"
    >
      <div className="marquee-track flex w-max will-change-transform animate-in fade-in duration-1000">
        <div className="marquee-content flex items-center whitespace-nowrap shrink-0">
          {repeated.map((msg, i) => (
            <span key={i} className="marquee-item inline-flex items-center shrink-0">
              <span className="text-[12px] sm:text-[13px] font-extrabold tracking-wider">
                {msg}
              </span>
              <span className="text-white/80 text-[10px] mx-4">♡</span>
            </span>
          ))}
        </div>
        <div className="marquee-content flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
          {repeated.map((msg, i) => (
            <span key={i} className="marquee-item inline-flex items-center shrink-0">
              <span className="text-[12px] sm:text-[13px] font-extrabold tracking-wider">
                {msg}
              </span>
              <span className="text-white/80 text-[10px] mx-4">♡</span>
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
