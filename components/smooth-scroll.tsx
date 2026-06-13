"use client"

import React, { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // 1. Check for prefers-reduced-motion (Accessibility fallback)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    
    if (mediaQuery.matches) {
      console.log("[Lenis] User prefers reduced motion. Skipping smooth scroll.")
      return
    }

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    // 3. Animation loop (RAF)
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Listener for changes in accessibility preferences during the session
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy()
        cancelAnimationFrame(rafId)
        lenisRef.current = null
        console.log("[Lenis] User enabled reduced motion during session. Destroyed Lenis instance.")
      }
    }
    
    mediaQuery.addEventListener("change", handleMotionChange)

    // 4. Cleanup
    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
      mediaQuery.removeEventListener("change", handleMotionChange)
      lenisRef.current = null
    }
  }, [])

  // 5. Reset scroll position on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  return <>{children}</>
}
