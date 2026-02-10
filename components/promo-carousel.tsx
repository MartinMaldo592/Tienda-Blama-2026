"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase.client"

type PromoSlide = {
  id: string
  title: string
  subtitle?: string
  cta?: string
  href: string
  gradientFrom?: string
  gradientTo?: string
}

export function PromoCarousel() {
  const fallbackSlides: PromoSlide[] = useMemo(
    () => [
      {
        id: "fallback-1",
        title: "Promociones",
        subtitle: "Configura tus banners desde el panel admin",
        cta: "Ir a productos",
        href: "/productos",
        gradientFrom: "#2563eb",
        gradientTo: "#06b6d4",
      },
    ],
    []
  )

  const [slides, setSlides] = useState<PromoSlide[]>(fallbackSlides)
  const [loadingSlides, setLoadingSlides] = useState(true)

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadingSlides(true)

      const supabase = createClient()
      const { data, error } = await supabase
        .from("home_banners")
        .select(
          "id, title, subtitle, cta, href, orden, activo"
        )
        .eq("activo", true)
        .order("orden", { ascending: true })
        .order("id", { ascending: true })

      if (cancelled) return

      if (error) {
        setSlides(fallbackSlides)
        setLoadingSlides(false)
        return
      }

      const rows = (data as any[]) || []
      const mapped: PromoSlide[] = rows
        .map((r) => {
          const id = String(r?.id ?? "")
          const title = String(r?.title || "")
          const subtitle = r?.subtitle ? String(r.subtitle) : undefined
          const cta = r?.cta ? String(r.cta) : undefined
          const href = String(r?.href || "")

          if (!id || !href) return null

          return {
            id,
            title: title || "Promociones",
            subtitle,
            cta,
            href,
            gradientFrom: "#111827",
            gradientTo: "#2563eb",
          } as PromoSlide
        })
        .filter(Boolean) as PromoSlide[]

      setSlides(mapped.length > 0 ? mapped : fallbackSlides)
      setLoadingSlides(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [fallbackSlides])

  useEffect(() => {
    setIndex(0)
  }, [slides.map((s) => s.id).join("|")])

  const count = slides.length

  const prev = () => setIndex((i) => (i - 1 + count) % count)
  const next = () => setIndex((i) => (i + 1) % count)

  useEffect(() => {
    if (paused) return
    if (count <= 1) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 4500)

    return () => window.clearInterval(id)
  }, [paused, count])

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null
    touchDeltaX.current = 0
    setPaused(true)
  }

  const onTouchMove = (e: TouchEvent) => {
    const start = touchStartX.current
    if (start === null) return
    const x = e.touches?.[0]?.clientX
    if (typeof x !== "number") return
    touchDeltaX.current = x - start
  }

  const onTouchEnd = () => {
    const dx = touchDeltaX.current
    touchStartX.current = null
    touchDeltaX.current = 0

    if (Math.abs(dx) > 50) {
      if (dx > 0) prev()
      else next()
    }

    window.setTimeout(() => setPaused(false), 350)
  }

  if (loadingSlides) {
    return (
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden rounded-2xl shadow-xl bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChevronRight className="h-8 w-8 text-gray-300 animate-bounce" />
        </div>
      </div>
    )
  }

  if (slides.length === 0) return null

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="relative min-w-full block"
              aria-label={s.title}
            >
              <div
                className="relative w-full h-[180px] sm:h-[220px] md:h-[260px]"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${s.gradientFrom || "#111827"} 0%, ${s.gradientTo || "#2563eb"
                    } 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
                  <div className="max-w-[520px]">
                    <div className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                      {s.title}
                    </div>
                    {s.subtitle ? (
                      <div className="mt-2 text-white/90 text-sm sm:text-base md:text-lg">
                        {s.subtitle}
                      </div>
                    ) : null}
                  </div>

                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-white/95 px-4 py-2 text-sm font-bold text-gray-900 shadow">
                      {s.cta || "Ver más"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={(e) => {
                e.preventDefault()
                prev()
              }}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
                "bg-white/90 backdrop-blur border border-border flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Siguiente"
              onClick={(e) => {
                e.preventDefault()
                next()
              }}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
                "bg-white/90 backdrop-blur border border-border flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Ir al slide ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setIndex(i)
                  }}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === index ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
