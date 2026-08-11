"use client"

import { CustomerProfile } from "@/app/cuenta/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Award, MapPin, ArrowRight, ShoppingBag, Truck, Calendar } from "lucide-react"
import Link from "next/link"

interface OverviewTabProps {
    profile: CustomerProfile
    orders: any[]
    onNavigateTab: (tab: "orders" | "profile" | "points") => void
}

export function OverviewTab({ profile, orders, onNavigateTab }: OverviewTabProps) {
    const totalOrders = orders.length
    const latestOrder = orders.length > 0 ? orders[0] : null

    // Calcular puntos acumulados basados en compras pagadas (S/ 10 = 1 punto)
    const pointsFromOrders = orders
        .filter((o) => o.pago_status === "pagado" || o.status === "entregado")
        .reduce((sum, o) => sum + Math.floor(Number(o.total || 0) / 10), 0)

    const totalPoints = (profile.puntos || 0) + pointsFromOrders

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "entregado":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Entregado</Badge>
            case "enviado":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">En Camino</Badge>
            case "en_proceso":
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">En Preparación</Badge>
            case "cancelado":
                return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">Cancelado</Badge>
            default:
                return <Badge className="bg-slate-500/10 text-slate-600 border-slate-200">Pendiente</Badge>
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Welcome Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                <div className="relative z-10 space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        <Award className="h-3.5 w-3.5 text-amber-400" /> Cliente BLAMA VIP
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        ¡Hola, {profile.nombre}! 👋
                    </h1>
                    <p className="text-sm text-slate-300 max-w-xl">
                        Bienvenido a tu panel personal. Revisa tus pedidos, da seguimiento a tus envíos y gestiona tus direcciones guardadas.
                    </p>
                </div>

                {/* Decorative BG Blob */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pedidos Realizados</p>
                            <h3 className="text-2xl font-black text-slate-900">{totalOrders}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Puntos Acumulados</p>
                            <h3 className="text-2xl font-black text-slate-900">{totalPoints} pts</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dirección Principal</p>
                            <h3 className="text-sm font-bold text-slate-900 truncate max-w-[180px]">
                                {profile.distrito ? `${profile.distrito}, ${profile.departamento}` : "No configurada"}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Latest Order Widget */}
            <Card className="rounded-3xl border border-slate-200/80 shadow-sm">
                <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-blue-600" /> Último Pedido
                        </CardTitle>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Estado y seguimiento de tu compra más reciente
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onNavigateTab("orders")} className="text-blue-600 font-bold gap-1">
                        Ver todos <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    {latestOrder ? (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900 text-lg">
                                            Pedido #{latestOrder.id}
                                        </span>
                                        {getStatusBadge(latestOrder.status)}
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(latestOrder.created_at).toLocaleDateString("es-PE", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 font-medium block">Total</span>
                                    <span className="text-xl font-black text-slate-900">
                                        S/ {Number(latestOrder.total).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Tracking info if available */}
                            {(latestOrder.codigo_seguimiento || latestOrder.shalom_orden) && (
                                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                                        Seguimiento de Envío ({latestOrder.metodo_envio || "Agencia"})
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Código/Guía: <span className="font-bold text-blue-900">{latestOrder.codigo_seguimiento || latestOrder.shalom_orden}</span>
                                    </p>
                                </div>
                            )}

                            {/* Products preview */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                    Productos ({latestOrder.pedido_items?.length || 0})
                                </span>
                                <div className="space-y-2">
                                    {latestOrder.pedido_items?.slice(0, 3).map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border">
                                                {item.productos?.imagen_url ? (
                                                    <img src={item.productos.imagen_url} alt={item.producto_nombre} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ShoppingBag className="h-5 w-5 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{item.producto_nombre}</p>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    Cant: {item.cantidad} {item.variante_nombre ? `• ${item.variante_nombre}` : ""}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">
                                                S/ {Number(item.precio_unitario * item.cantidad).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center space-y-3">
                            <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
                            <div>
                                <h4 className="font-bold text-slate-800">Aún no has realizado ninguna compra</h4>
                                <p className="text-sm text-slate-500 font-medium">Explora nuestro catálogo y equipa tu entrenamiento.</p>
                            </div>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                                <Link href="/productos">Ir a la Tienda</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
