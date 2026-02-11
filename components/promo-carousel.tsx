"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState, useCallback, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react"
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
  countdownEnd?: string | null
}

/* ── Countdown Hook ── */
function useCountdown(endDate: string | null | undefined) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    if (!endDate) { setTimeLeft(null); return }

    const target = new Date(endDate).getTime()
    if (isNaN(target)) { setTimeLeft(null); return }

    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setTimeLeft(null); return }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endDate])

  return timeLeft
}

/* ── Countdown Badge ── */
function CountdownBadge({ endDate }: { endDate: string | null | undefined }) {
  const t = useCountdown(endDate)
  if (!t) return null

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-white/20">
      <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
      <div className="flex items-center gap-1 text-white font-mono text-xs sm:text-sm font-bold tracking-wider">
        {t.days > 0 && (
          <>
            <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(t.days)}</span>
            <span className="text-amber-300 text-[10px]">d</span>
          </>
        )}
        <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(t.hours)}</span>
        <span className="text-amber-300 animate-pulse">:</span>
        <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(t.minutes)}</span>
        <span className="text-amber-300 animate-pulse">:</span>
        <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(t.seconds)}</span>
      </div>
    </div>
  )
}

/* ── Progress Bar ── */
function SlideProgress({ current, total, intervalMs }: { current: number; total: number; intervalMs: number }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-4 pb-3 z-20">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
          {i === current && (
            <div
              className="h-full bg-white rounded-full"
              style={{
                animation: `slideProgress ${intervalMs}ms linear forwards`,
              }}
            />
          )}
          {i < current && <div className="h-full bg-white rounded-full w-full" />}
        </div>
      ))}
    </div>
  )
}

/* ── Main Component ── */
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
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left")
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  const INTERVAL_MS = 5000

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadingSlides(true)

      const supabase = createClient()
      const { data, error } = await supabase
        .from("home_banners")
        .select("id, title, subtitle, cta, href, orden, activo, countdown_end")
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
          const countdownEnd = r?.countdown_end || null

          if (!id || !href) return null

          return {
            id,
            title: title || "Promociones",
            subtitle,
            cta,
            href,
            gradientFrom: "#111827",
            gradientTo: "#2563eb",
            countdownEnd,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.map((s) => s.id).join("|")])

  const count = slides.length

  const goTo = useCallback((newIndex: number, direction?: "left" | "right") => {
    setSlideDirection(direction || (newIndex > index ? "left" : "right"))
    setIndex(newIndex)
  }, [index])

  const prev = useCallback(() => {
    setSlideDirection("right")
    setIndex((i) => (i - 1 + count) % count)
  }, [count])

  const next = useCallback(() => {
    setSlideDirection("left")
    setIndex((i) => (i + 1) % count)
  }, [count])

  useEffect(() => {
    if (paused) return
    if (count <= 1) return

    const id = window.setInterval(() => {
      setSlideDirection("left")
      setIndex((i) => (i + 1) % count)
    }, INTERVAL_MS)

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
      <div className="relative w-full h-[200px] sm:h-[240px] md:h-[300px] overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-400 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (slides.length === 0) return null

  return (
    <>
      {/* Keyframe injection */}
      <style jsx global>{`
                @keyframes slideProgress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(-60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

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
            className="flex transition-transform duration-600 ease-out"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {slides.map((s, slideIdx) => {
              const isActive = slideIdx === index
              const animDir = slideDirection === "left" ? "slideInLeft" : "slideInRight"

              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className="relative min-w-full block"
                  aria-label={s.title}
                >
                  <div
                    className="relative w-full h-[200px] sm:h-[240px] md:h-[300px] overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${s.gradientFrom || "#111827"} 0%, ${s.gradientTo || "#2563eb"} 100%)`,
                    }}
                  >
                    {/* Animated background particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full bg-white/10"
                          style={{
                            width: `${20 + i * 15}px`,
                            height: `${20 + i * 15}px`,
                            left: `${10 + i * 16}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animation: `floatParticle ${3 + i * 0.7}s ease-in-out infinite ${i * 0.5}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        style={{
                          animation: "shimmer 4s ease-in-out infinite",
                        }}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                    <div className="absolute inset-0 p-5 sm:p-7 md:p-8 flex flex-col justify-between relative z-10">
                      <div className="max-w-[560px] space-y-3">
                        {/* Title with animation */}
                        <div
                          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-lg"
                          style={isActive ? {
                            animation: `${animDir} 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                          } : { opacity: 1 }}
                        >
                          {s.title}
                        </div>

                        {/* Subtitle */}
                        {s.subtitle && (
                          <div
                            className="text-white/90 text-sm sm:text-base md:text-lg max-w-md drop-shadow"
                            style={isActive ? {
                              animation: `fadeInUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms forwards`,
                              opacity: 0,
                            } : { opacity: 1 }}
                          >
                            {s.subtitle}
                          </div>
                        )}

                        {/* Countdown timer */}
                        {s.countdownEnd && (
                          <div
                            style={isActive ? {
                              animation: `fadeInUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 250ms forwards`,
                              opacity: 0,
                            } : { opacity: 1 }}
                          >
                            <CountdownBadge endDate={s.countdownEnd} />
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div
                        style={isActive ? {
                          animation: `scaleIn 500ms cubic-bezier(0.16, 1, 0.3, 1) 350ms forwards`,
                          opacity: 0,
                        } : { opacity: 1 }}
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-gray-900 shadow-lg hover:shadow-xl transition-shadow group/cta">
                          {s.cta || "Ver más"}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Progress bar (replaces dots) */}
          {count > 1 && <SlideProgress current={index} total={count} intervalMs={INTERVAL_MS} />}

          {count > 1 && (
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
                  "bg-white/90 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg",
                  "opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
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
                  "bg-white/90 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg",
                  "opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
