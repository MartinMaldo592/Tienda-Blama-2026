"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  autoPlay?: boolean
  intervalMs?: number
  showControls?: boolean
  priority?: boolean
  sizes?: string
  quality?: number
}

export function ProductImageCarousel({
  images,
  alt,
  className,
  autoPlay = false,
  intervalMs = 2500,
  showControls = true,
  priority = false,
  sizes,
  quality,
}: ProductImageCarouselProps) {
  const isLikelyImageUrl = (url: string) => {
    const u = String(url || "").trim().toLowerCase()
    if (!u) return false
    if (u.startsWith("data:")) return u.startsWith("data:image/")
    return !(
      u.endsWith(".mp4") ||
      u.endsWith(".webm") ||
      u.endsWith(".mov") ||
      u.endsWith(".m4v") ||
      u.endsWith(".avi") ||
      u.endsWith(".mkv")
    )
  }

  const cleanImages = useMemo(() => {
    const unique: string[] = []
    for (const img of images || []) {
      const v = String(img || "").trim()
      if (!v) continue
      if (!isLikelyImageUrl(v)) continue
      if (!unique.includes(v)) unique.push(v)
      if (unique.length >= 10) break
    }
    return unique
  }, [images])

  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)

  const pointerStartXRef = useRef<number | null>(null)
  const pointerStartYRef = useRef<number | null>(null)
  const pointerMovedRef = useRef(false)

  useEffect(() => {
    setIndex(0)
    setPrevIndex(null)
  }, [cleanImages.join("|")])

  useEffect(() => {
    if (!autoPlay) return
    if (cleanImages.length <= 1) return

    const id = window.setInterval(() => {
      setIndex((prev) => {
        setPrevIndex(prev)
        return (prev + 1) % cleanImages.length
      })
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [autoPlay, cleanImages.length, intervalMs])

  if (cleanImages.length === 0) return null

  const prev = () =>
    setIndex((i) => {
      setPrevIndex(i)
      return (i - 1 + cleanImages.length) % cleanImages.length
    })
  const next = () =>
    setIndex((i) => {
      setPrevIndex(i)
      return (i + 1) % cleanImages.length
    })

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartXRef.current = e.clientX
    pointerStartYRef.current = e.clientY
    pointerMovedRef.current = false
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const sx = pointerStartXRef.current
    const sy = pointerStartYRef.current
    if (sx == null || sy == null) return

    const dx = e.clientX - sx
    const dy = e.clientY - sy

    // Solo consideramos swipe si el movimiento es mayormente horizontal.
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      pointerMovedRef.current = true
      // Evita selección/drag de la imagen cuando se intenta deslizar.
      if ((e as any).cancelable) e.preventDefault()
    }
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const sx = pointerStartXRef.current
    const sy = pointerStartYRef.current
    pointerStartXRef.current = null
    pointerStartYRef.current = null

    if (sx == null || sy == null) return
    if (!pointerMovedRef.current) return

    const dx = e.clientX - sx
    const dy = e.clientY - sy

    // Umbral para cambiar de imagen.
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
    if (dx > 0) prev()
    else next()
  }

  const activeSrc = cleanImages[index] || ""
  const prevSrc = prevIndex != null ? cleanImages[prevIndex] || "" : ""
  const showPrev = prevSrc && prevSrc !== activeSrc

  return (
    <div
      className={cn("group relative h-full w-full overflow-hidden select-none touch-pan-y", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {showPrev ? (
        <Image
          key={`prev-${prevSrc}`}
          src={prevSrc}
          alt={alt}
          fill
          className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500"
          sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
          quality={quality}
          draggable={false}
        />
      ) : null}

      {activeSrc ? (
        <Image
          key={`active-${activeSrc}`}
          src={activeSrc}
          alt={alt}
          fill
          className="absolute inset-0 object-cover opacity-100 transition-opacity duration-500"
          priority={priority && index === 0}
          sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
          quality={quality}
          draggable={false}
        />
      ) : null}

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
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/85 backdrop-blur border border-border shadow-md flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/85 backdrop-blur border border-border shadow-md flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            {cleanImages.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Ir a imagen ${dotIndex + 1}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setPrevIndex(index)
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
