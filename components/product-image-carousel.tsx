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
  imageFit?: "cover" | "contain"
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
  imageFit = "contain",
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

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)

  const pointerIdRef = useRef<number | null>(null)
  const pointerStartXRef = useRef<number | null>(null)
  const pointerStartYRef = useRef<number | null>(null)
  const pointerMovedRef = useRef(false)
  const pointerLastXRef = useRef<number | null>(null)
  const pointerLastTRef = useRef<number | null>(null)
  const pointerVxRef = useRef(0)

  useEffect(() => {
    setIndex(0)
    setDragX(0)
    setIsDragging(false)
  }, [cleanImages.join("|")])

  useEffect(() => {
    if (!autoPlay) return
    if (cleanImages.length <= 1) return
    if (isDragging) return

    const id = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= cleanImages.length - 1) return 0
        return prev + 1
      })
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [autoPlay, cleanImages.length, intervalMs, isDragging])

  if (cleanImages.length === 0) return null

  const lastIndex = Math.max(0, cleanImages.length - 1)

  const rubberBand = (dx: number, width: number) => {
    if (!width) return dx * 0.35
    const constant = 0.55
    const abs = Math.abs(dx)
    const sign = dx < 0 ? -1 : 1
    return sign * (width * constant * abs) / (width + constant * abs)
  }

  const prev = () => {
    setDragX(0)
    setIndex((i) => Math.max(0, i - 1))
  }

  const next = () => {
    setDragX(0)
    setIndex((i) => Math.min(lastIndex, i + 1))
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (cleanImages.length <= 1) return
    pointerIdRef.current = e.pointerId
    pointerStartXRef.current = e.clientX
    pointerStartYRef.current = e.clientY
    pointerLastXRef.current = e.clientX
    pointerLastTRef.current = Date.now()
    pointerVxRef.current = 0
    pointerMovedRef.current = false
    setIsDragging(true)
    setDragX(0)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {
    }
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

      const now = Date.now()
      const lx = pointerLastXRef.current
      const lt = pointerLastTRef.current
      if (lx != null && lt != null) {
        const dt = Math.max(1, now - lt)
        pointerVxRef.current = (e.clientX - lx) / dt
      }
      pointerLastXRef.current = e.clientX
      pointerLastTRef.current = now

      const width = containerRef.current?.getBoundingClientRect().width || 0
      if (index === 0 && dx > 0) setDragX(rubberBand(dx, width))
      else if (index === lastIndex && dx < 0) setDragX(rubberBand(dx, width))
      else setDragX(dx)
    }
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const sx = pointerStartXRef.current
    const sy = pointerStartYRef.current
    const pid = pointerIdRef.current
    pointerStartXRef.current = null
    pointerStartYRef.current = null
    pointerIdRef.current = null
    setIsDragging(false)

    if (sx == null || sy == null) return
    if (!pointerMovedRef.current) {
      setDragX(0)
      if (pid != null) {
        try {
          e.currentTarget.releasePointerCapture(pid)
        } catch (err) {
        }
      }
      return
    }

    const dx = e.clientX - sx
    const dy = e.clientY - sy

    const width = containerRef.current?.getBoundingClientRect().width || 0
    const distanceThreshold = Math.max(60, width * 0.18)
    const velocity = pointerVxRef.current
    const velocityThreshold = 0.7

    const shouldSnapByVelocity = Math.abs(velocity) >= velocityThreshold && Math.abs(dx) >= 10
    const shouldSnapByDistance = Math.abs(dx) >= distanceThreshold

    if ((!shouldSnapByVelocity && !shouldSnapByDistance) || Math.abs(dx) < Math.abs(dy)) {
      setDragX(0)
      if (pid != null) {
        try {
          e.currentTarget.releasePointerCapture(pid)
        } catch (err) {
        }
      }
      return
    }
    const dir = shouldSnapByVelocity ? (velocity > 0 ? 1 : -1) : (dx > 0 ? 1 : -1)
    if (dir > 0) prev()
    else next()

    setDragX(0)
    if (pid != null) {
      try {
        e.currentTarget.releasePointerCapture(pid)
      } catch (err) {
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("group relative h-full w-full overflow-hidden select-none touch-pan-y", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className={cn(
          "flex h-full w-full",
          isDragging ? "" : "transition-transform duration-300 ease-out"
        )}
        style={{
          transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
        }}
      >
        {cleanImages.map((src, i) => (
          <div key={src} className="relative h-full w-full flex-none overflow-hidden">
            {/* Background Blur for aesthetics - Optimized with Next/Image */}
            <Image
              src={src}
              alt=""
              fill
              className="object-cover opacity-30 blur-2xl scale-125 saturate-150 -z-10"
              quality={10}
              aria-hidden="true"
              draggable={false}
            />

            <Image
              src={src}
              alt={alt}
              fill
              className={cn("absolute inset-0 z-10", imageFit === "cover" ? "object-cover" : "object-contain")}
              priority={priority && i === 0}
              sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
              quality={quality}
              draggable={false}
            />

          </div>
        ))}
      </div>

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
                  setIndex(dotIndex)
                  setDragX(0)
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
