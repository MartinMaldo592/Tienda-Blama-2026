"use client"

import { usePathname } from "next/navigation"

import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Footer } from "@/components/footer"

type LayoutShellProps = {
  children: React.ReactNode
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isAuth = pathname?.startsWith("/auth")

  if (isAdmin || isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <AnnouncementBar className="sticky top-16 z-40" intervalMs={3000} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  )
}
