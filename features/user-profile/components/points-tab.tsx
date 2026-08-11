"use client"

import { CustomerProfile } from "@/app/cuenta/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Sparkles, ShoppingBag, ShieldCheck, Zap, ArrowUpRight } from "lucide-react"

interface PointsTabProps {
    profile: CustomerProfile
    orders: any[]
}

export function PointsTab({ profile, orders }: PointsTabProps) {
    // Puntos generados por compras pagadas
    const pointsFromOrders = orders
        .filter((o) => o.pago_status === "pagado" || o.status === "entregado")
        .reduce((sum, o) => sum + Math.floor(Number(o.total || 0) / 10), 0)

    const totalPoints = (profile.puntos || 0) + pointsFromOrders

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-xl font-black text-slate-900">Mis Puntos BLAMA</h2>
                <p className="text-xs text-slate-500 font-medium">
                    Acumula puntos con cada compra realizada y recompensas exclusivas
                </p>
            </div>

            {/* Total Points Card */}
            <Card className="rounded-3xl border-0 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white shadow-xl overflow-hidden relative">
                <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-amber-100 border border-white/30">
                            <Sparkles className="h-3.5 w-3.5 text-amber-200" /> Programa de Fidelidad
                        </span>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-100">
                            Saldo Actual de Puntos
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                            {totalPoints} <span className="text-2xl font-bold text-amber-200">PTS</span>
                        </h1>
                        <p className="text-xs text-amber-100/90 font-medium max-w-sm">
                            Equivalente a S/ {(totalPoints * 0.5).toFixed(2)} acumulados en compras acumuladas.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 text-xs space-y-2 max-w-xs">
                        <span className="font-bold text-white uppercase tracking-wider block flex items-center gap-1">
                            <Zap className="h-4 w-4 text-amber-300" /> ¿Cómo ganar más?
                        </span>
                        <p className="text-amber-100 font-medium leading-relaxed">
                            Por cada S/ 10.00 en compras confirmadas, ganas 1 punto de manera automática en tu cuenta.
                        </p>
                    </div>
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </Card>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base">1. Realiza tus Compras</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Inicia sesión antes de pagar en el checkout para que tus compras queden registradas.
                    </p>
                </Card>

                <Card className="rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Award className="h-5 w-5" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base">2. Acumula Puntos</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Tus puntos se acreditan inmediatamente cuando tu pedido es confirmado y despachado.
                    </p>
                </Card>

                <Card className="rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base">3. Beneficios VIP</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Accede a descuentos exclusivos, lanzamientos prioritarios y soporte personalizado.
                    </p>
                </Card>
            </div>
        </div>
    )
}
