"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useWhatsAppStore } from "@/features/checkout"
import { sendGTMEvent } from "@/lib/gtm"

import { Header } from "@/components/header"

import { AnnouncementBar } from "@/components/announcement-bar"
import { Footer } from "@/components/footer"

type AnnouncementData = {
  enabled: boolean
  intervalMs: number
  messages: string[]
} | null

type LayoutShellProps = {
  children: React.ReactNode
  announcementData?: AnnouncementData
}

export function LayoutShell({ children, announcementData }: LayoutShellProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isAuth = pathname?.startsWith("/auth")
  const isOpenWa = pathname?.startsWith("/open-wa")

  const [visible, setVisible] = useState(true)

  const hasAnnouncement = useMemo(() => {
    return announcementData?.enabled === true && announcementData.messages.length > 0
  }, [announcementData])

  const isHome = pathname === "/"
  const headerHeight = isAdmin || isAuth ? 0 : (isHome ? 36 : (hasAnnouncement ? 100 : 64))

  const headerRef = useRef<HTMLDivElement>(null)
  const prevScrollY = useRef(0)
  const ticking = useRef(false)

  // Resetear el estado del header al cambiar de ruta para evitar
  // que quede oculto/inert tras una navegación client-side (bug en WebViews de TikTok)
  useEffect(() => {
    setVisible(true)
    prevScrollY.current = 0
    ticking.current = false
  }, [pathname])

  // Lógica de scroll: compatible con Lenis
  useEffect(() => {
    if (isAdmin || isAuth) return

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        // Lenis actualiza window.scrollY / document.documentElement.scrollTop
        const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0)

        // Si estamos cerca del top, siempre mostrar
        if (y < 60) {
          setVisible(true)
          prevScrollY.current = y
          ticking.current = false
          return
        }

        const delta = y - prevScrollY.current

        // Umbral de 5px para filtrar micro-movimientos
        if (delta > 5) {
          setVisible(false) // Scroll abajo → ocultar
        } else if (delta < -5) {
          setVisible(true) // Scroll arriba → mostrar
        }

        prevScrollY.current = y
        ticking.current = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isAdmin, isAuth])

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "51999999999"
  const { customMessage } = useWhatsAppStore()
  const message = customMessage || encodeURIComponent("Hola, quisiera información sobre sus productos.")
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(whatsappNumber)}&text=${message}`

  const isProductPage = useMemo(() => {
    return pathname ? pathname.startsWith("/productos/") && pathname !== "/productos" : false
  }, [pathname])

  const [stickyBarActive, setStickyBarActive] = useState(false)

  useEffect(() => {
    if (!isProductPage) {
      setStickyBarActive(false)
      return
    }
    const handleStickyBarChange = (e: Event) => {
      setStickyBarActive((e as CustomEvent).detail)
    }
    window.addEventListener("sticky-bar-change", handleStickyBarChange)
    return () => window.removeEventListener("sticky-bar-change", handleStickyBarChange)
  }, [isProductPage])

  if (isAdmin || isAuth) {
    return <>{children}</>
  }

  const containerClasses = isProductPage
    ? `fixed ${stickyBarActive ? "bottom-5" : "bottom-6"} right-4 md:bottom-8 md:right-6 z-50 flex items-center justify-center group h-14 w-14 transition-all duration-500`
    : "fixed bottom-6 right-4 md:bottom-8 md:right-6 z-50 flex items-center justify-center group h-16 w-16 md:h-[72px] md:w-[72px] transition-all duration-500"

  const buttonClasses = isProductPage
    ? "relative inline-flex h-full w-full items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
    : "relative inline-flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-green-600 via-green-500 to-emerald-400 text-white shadow-[0_8px_30px_rgba(22,163,74,0.3)] border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(22,163,74,0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"

  const svgClasses = isProductPage
    ? "h-7 w-7 drop-shadow-sm"
    : "h-[52%] w-[52%] drop-shadow-sm"

  return (
    <>
      {/* Header FIJO — position fixed con AnnouncementBar arriba */}
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
        aria-hidden={!visible}
      >
        {/* 1. AnnouncementBar en la PARTE SUPERIOR */}
        <AnnouncementBar
          className="z-50"
          intervalMs={announcementData?.intervalMs || 3500}
          messages={announcementData?.messages}
        />

        {/* 2. Header (Navbar) justo debajo del AnnouncementBar */}
        <Header />
      </div>

      {/* Espaciador para compensar la altura del header fijo */}
      <div style={{ height: headerHeight }} aria-hidden="true" />

      <div className="flex-1">{children}</div>
      <Footer />

      {!isOpenWa && (
        <div className={containerClasses}>
          {/* Pulsing Ring Animation */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping duration-1000 group-hover:duration-75"></span>

          {/* Main Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir chat de WhatsApp"
            onClick={() => {
              sendGTMEvent({
                event: 'click_whatsapp',
                whatsapp_type: 'boton_flotante_contacto'
              })
            }}
            className={buttonClasses}
          >
            <svg
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
              className={svgClasses}
            >
              <path d="M19.11 17.22c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.86-.86 1.04-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.2-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.93 2.95 4.69 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.59-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
              <path d="M16.03 2.67c-7.16 0-12.98 5.82-12.98 12.98 0 2.29.61 4.53 1.77 6.51L3 29.33l7.35-1.92c1.91 1.05 4.06 1.6 6.26 1.6h.01c7.16 0 12.98-5.82 12.98-12.98 0-3.47-1.35-6.73-3.8-9.18-2.45-2.45-5.71-3.8-9.18-3.8zm0 23.99h-.01c-1.95 0-3.86-.52-5.53-1.51l-.4-.24-4.36 1.14 1.16-4.25-.26-.43c-1.07-1.72-1.64-3.71-1.64-5.76 0-6.12 4.98-11.1 11.1-11.1 2.97 0 5.76 1.15 7.86 3.25 2.1 2.1 3.25 4.89 3.25 7.86 0 6.12-4.98 11.1-11.1 11.1z" />
            </svg>
          </a>
        </div>
      )}
    </>
  )
}

