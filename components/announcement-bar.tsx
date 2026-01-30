"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type AnnouncementBarProps = {
  messages?: string[]
  intervalMs?: number
  className?: string
}

export function AnnouncementBar({
  messages,
  intervalMs = 3000,
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

  const [index, setIndex] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (items.length <= 1) return

    const id = window.setInterval(() => {
      if (pausedRef.current) return
      setIndex((prev) => (prev + 1) % items.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [intervalMs, items.length])

  return (
    <div
      className={
        "w-full h-10 sm:h-9 min-h-[40px] sm:min-h-[36px] bg-blue-600 text-white flex items-center justify-center px-4 border-b border-blue-700 " +
        (className || "")
      }
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center text-center text-[12px] sm:text-[13px] tracking-wide uppercase font-extrabold animate-pulse">
        <span key={index} className="animate-in fade-in duration-300 text-center">
          {items[index]}
        </span>
      </div>
    </div>
  )
}
