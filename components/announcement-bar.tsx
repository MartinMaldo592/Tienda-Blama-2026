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
      "📦🚚 Envío GRATIS para todos los pedidos",
      "⚡🏷️ Descuentos en productos destacados",
      "⏱️📍 Entrega rápida + contraentrega en 24 horas (solo Lima Metropolitana)",
    ],
    []
  )

  const items = messages && messages.length > 0 ? messages : defaultMessages

  // Build the marquee text by joining all messages with a separator
  const marqueeText = items.join("  —  ") + "  —  "

  return (
    <>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className={
          "w-full bg-indigo-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-indigo-700 " +
          (className || "")
        }
        role="status"
        aria-live="polite"
      >
        <div
          className="inline-block"
          style={{
            animation: "marquee 25s linear infinite",
          }}
        >
          <span className="inline-block px-4 text-[12px] sm:text-[13px] tracking-wide uppercase font-extrabold">
            {marqueeText}
          </span>
          <span className="inline-block px-4 text-[12px] sm:text-[13px] tracking-wide uppercase font-extrabold">
            {marqueeText}
          </span>
        </div>
      </div>
    </>
  )
}
