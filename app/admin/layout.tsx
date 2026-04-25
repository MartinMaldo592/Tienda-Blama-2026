"use client"

import { usePathname } from "next/navigation"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Bell, ArrowRight, Menu, Loader2, WifiOff, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase.client"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CommandPalette } from "@/components/admin/command-palette"

// Force redeploy
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const guard = useRoleGuard({ allowedRoles: ["admin", "worker"] })
    const isTicketRoute = pathname?.includes('/admin/pedidos/') && pathname?.endsWith('/ticket')
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const offlineToastId = useRef<string | number | null>(null)

    useEffect(() => {
        const handleOnline = () => {
            if (offlineToastId.current) {
                toast.dismiss(offlineToastId.current)
                offlineToastId.current = null
            }
            toast.success("Conexión restablecida", { icon: <Wifi className="h-4 w-4" /> })
        }
        
        const handleOffline = () => {
            if (!offlineToastId.current) {
                offlineToastId.current = toast.error("Sin conexión a internet", { 
                    icon: <WifiOff className="h-4 w-4" />, 
                    duration: Infinity 
                })
            }
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        const channel = supabase
            .channel('global_orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'pedidos' },
                (payload) => {
                    const newOrder = payload.new
                    toast.success("¡Nuevo Pedido Recibido!", {
                        description: `Orden #${newOrder.id} - ${newOrder.nombre_contacto || 'Cliente'}`,
                        icon: <Bell className="h-4 w-4 text-green-600" />,
                        action: {
                            label: "Ver Detalles",
                            onClick: () => router.push(`/admin/pedidos`)
                        },
                        duration: 8000,
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    if (guard.loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Verificando acceso...</p>
                </div>
            </div>
        )
    }

    if (guard.accessDenied) {
        return <AccessDenied />
    }

    if (isTicketRoute) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar - Visible on Large screens only */}
            <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
                <AdminSidebar role={guard.role || 'worker'} />
            </div>

            {/* Mobile/Tablet Header & Sidebar (Sheet) - Visible on screens smaller than Large */}
            <div className="lg:hidden fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            {/* Accessibility Title */}
                            <div className="sr-only">
                                <SheetTitle>Menú de Navegación</SheetTitle>
                            </div>
                            <div onClick={() => setIsSheetOpen(false)} className="h-full">
                                <AdminSidebar role={guard.role || 'worker'} />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CRM Pro
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full lg:pl-64 pt-20 lg:pt-0">
                {/* pt-20 on mobile to account for fixed header, p-8 on desktop */}
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            
            {/* Command Palette */}
            <CommandPalette />
        </div>
    )
}
