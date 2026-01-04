"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  autoPlay?: boolean
  intervalMs?: number
  showControls?: boolean
}

export function ProductImageCarousel({
  images,
  alt,
  className,
  autoPlay = false,
  intervalMs = 2500,
  showControls = true,
}: ProductImageCarouselProps) {
  const cleanImages = useMemo(() => {
    const unique: string[] = []
    for (const img of images || []) {
      const v = String(img || "").trim()
      if (!v) continue
      if (!unique.includes(v)) unique.push(v)
      if (unique.length >= 10) break
    }
    return unique
  }, [images])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [cleanImages.join("|")])

  useEffect(() => {
    if (!autoPlay) return
    if (cleanImages.length <= 1) return

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % cleanImages.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [autoPlay, cleanImages.length, intervalMs])

  if (cleanImages.length === 0) return null

  const prev = () => setIndex((i) => (i - 1 + cleanImages.length) % cleanImages.length)
  const next = () => setIndex((i) => (i + 1) % cleanImages.length)

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {cleanImages.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            i === index ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          draggable={false}
        />
      ))}

      {showControls && cleanImages.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prev()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/70 backdrop-blur border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              next()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/70 backdrop-blur border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {cleanImages.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Ir a imagen ${dotIndex + 1}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIndex(dotIndex)
                }}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  dotIndex === index ? "bg-primary" : "bg-foreground/30"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
