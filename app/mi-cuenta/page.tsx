"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCustomerProfileAction, getCustomerOrdersAction, logoutCustomerAction, CustomerProfile } from "@/app/cuenta/actions"
import { OverviewTab } from "@/features/user-profile/components/overview-tab"
import { OrdersTab } from "@/features/user-profile/components/orders-tab"
import { ProfileTab } from "@/features/user-profile/components/profile-tab"
import { PointsTab } from "@/features/user-profile/components/points-tab"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutDashboard, Package, User, Award, LogOut, ArrowLeft, Loader2, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CustomerDashboardPage() {
    const router = useRouter()
    
    const [profile, setProfile] = useState<CustomerProfile | null>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile" | "points">("overview")
    const [loggingOut, setLoggingOut] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const [profileRes, ordersRes] = await Promise.all([
                getCustomerProfileAction(),
                getCustomerOrdersAction(),
            ])

            if (!profileRes.profile) {
                // Si no hay sesión, redirigimos a login
                router.push("/cuenta/login")
                return
            }

            setProfile(profileRes.profile)
            setOrders(ordersRes.orders || [])
        } catch (err) {
            console.error("Error cargando dashboard:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleLogout = async () => {
        setLoggingOut(true)
        await logoutCustomerAction()
        router.push("/")
        router.refresh()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-64 rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Skeleton className="h-64 rounded-3xl" />
                        <div className="md:col-span-3 space-y-4">
                            <Skeleton className="h-40 rounded-3xl" />
                            <Skeleton className="h-64 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
            {/* Header Top Nav bar */}
            <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                            B
                        </div>
                        <span className="font-black text-lg tracking-tight">
                            BLAMA <span className="text-blue-600 font-medium">FITNESS</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex font-bold gap-1 text-slate-600">
                            <Link href="/productos">
                                <ShoppingBag className="h-4 w-4" /> Ir a la Tienda
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 font-bold gap-1.5"
                        >
                            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <aside className="space-y-4">
                        <Card className="rounded-3xl border border-slate-200/80 shadow-sm p-4 bg-white">
                            <div className="p-3 mb-2 flex items-center gap-3 border-b pb-4">
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                                    {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-slate-900 text-sm truncate">{profile.nombre}</h3>
                                    <p className="text-xs text-slate-500 truncate font-medium">{profile.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        activeTab === "overview"
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <LayoutDashboard className="h-4 w-4" /> Resumen
                                </button>

                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        activeTab === "orders"
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Package className="h-4 w-4" /> Mis Pedidos
                                    </div>
                                    {orders.length > 0 && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                            activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                                        }`}>
                                            {orders.length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        activeTab === "profile"
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <User className="h-4 w-4" /> Mis Datos & Dirección
                                </button>

                                <button
                                    onClick={() => setActiveTab("points")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        activeTab === "points"
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <Award className="h-4 w-4 text-amber-500" /> Mis Puntos
                                </button>
                            </nav>
                        </Card>
                    </aside>

                    {/* Tab Panels */}
                    <section className="md:col-span-3">
                        {activeTab === "overview" && (
                            <OverviewTab
                                profile={profile}
                                orders={orders}
                                onNavigateTab={(tab) => setActiveTab(tab)}
                            />
                        )}

                        {activeTab === "orders" && (
                            <OrdersTab orders={orders} />
                        )}

                        {activeTab === "profile" && (
                            <ProfileTab
                                profile={profile}
                                onProfileUpdated={() => loadData()}
                            />
                        )}

                        {activeTab === "points" && (
                            <PointsTab profile={profile} orders={orders} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}
