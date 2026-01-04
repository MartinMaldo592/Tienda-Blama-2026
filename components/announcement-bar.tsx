"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

type AnnouncementBarProps = {
  messages?: string[]
  intervalMs?: number
  className?: string
}

export function AnnouncementBar({
  messages,
  intervalMs = 3500,
  className,
}: AnnouncementBarProps) {
  const defaultMessages = useMemo(
    () => [
      "Envío gratis en pedidos seleccionados",
      "Aprovecha descuentos en productos destacados",
      "Entrega rápida contraentrega en tu ciudad",
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
        "w-full h-8 bg-accent text-accent-foreground flex items-center justify-center px-4 border-b border-border " +
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
      <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase font-semibold">
        <span key={index} className="animate-in fade-in duration-300">
          {items[index]}
        </span>
        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
      </div>
    </div>
  )
}
