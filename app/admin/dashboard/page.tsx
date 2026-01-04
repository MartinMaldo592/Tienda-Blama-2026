"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, Package, ClipboardList } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalVentas: 0,
        pedidosPendientes: 0,
        pedidosAsignados: 0,
        totalClientes: 0,
        productosLowStock: 0
    })
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState<string>('worker')
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        initDashboard()
    }, [])

    async function initDashboard() {
        // Get user role
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            setUserId(session.user.id)
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()
            setUserRole(profile?.role || 'worker')
            await fetchStats(profile?.role || 'worker', session.user.id)
        } else {
            await fetchStats('worker', '')
        }
    }

    async function fetchStats(role: string, currentUserId: string) {
        setLoading(true)

        // Fetch pedidos
        const { data: pedidos } = await supabase
            .from('pedidos')
            .select('total, status, asignado_a')

        // Stats for admins
        const validSales = pedidos?.filter(p => !['Fallido', 'Devuelto'].includes(p.status)) || []
        const totalVentas = validSales.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
        const pedidosPendientes = pedidos?.filter(p => p.status === 'Pendiente').length || 0

        // Stats for workers - count their assigned orders
        const pedidosAsignados = pedidos?.filter(p => p.asignado_a === currentUserId).length || 0

        // Clientes (admin only stat)
        let totalClientes = 0
        if (role === 'admin') {
            const { count } = await supabase
                .from('clientes')
                .select('*', { count: 'exact', head: true })
            totalClientes = count || 0
        }

        // Productos Stock Bajo (admin only)
        let productosLowStock = 0
        if (role === 'admin') {
            const { count } = await supabase
                .from('productos')
                .select('*', { count: 'exact', head: true })
                .lt('stock', 5)
            productosLowStock = count || 0
        }

        setStats({
            totalVentas,
            pedidosPendientes,
            pedidosAsignados,
            totalClientes,
            productosLowStock
        })
        setLoading(false)
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {userRole === 'admin' ? 'Dashboard General' : 'Mi Panel'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {userRole === 'admin'
                        ? 'Resumen general de tu tienda'
                        : 'Resumen de tus pedidos asignados'}
                </p>
            </div>

            {/* Stats Grid - Different for Admin vs Worker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userRole === 'admin' ? (
                    <>
                        <StatsCard
                            title="Ventas Totales"
                            value={formatCurrency(stats.totalVentas)}
                            change="Ingresos Estimados"
                            icon={<DollarSign className="h-6 w-6 text-green-600" />}
                            wrapperClass="bg-green-50 border-green-100"
                            loading={loading}
                        />
                        <StatsCard
                            title="Pedidos Pendientes"
                            value={stats.pedidosPendientes.toString()}
                            change="Por atender"
                            icon={<ShoppingBag className="h-6 w-6 text-orange-600" />}
                            wrapperClass="bg-orange-50 border-orange-100"
                            loading={loading}
                        />
                        <StatsCard
                            title="Clientes Totales"
                            value={stats.totalClientes.toString()}
                            change="Base de datos"
                            icon={<Users className="h-6 w-6 text-blue-600" />}
                            wrapperClass="bg-blue-50 border-blue-100"
                            loading={loading}
                        />
                        <StatsCard
                            title="Stock Bajo"
                            value={stats.productosLowStock.toString()}
                            change="Productos < 5 un."
                            icon={<Package className="h-6 w-6 text-red-600" />}
                            wrapperClass="bg-red-50 border-red-100"
                            loading={loading}
                        />
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="Pedidos Asignados"
                            value={stats.pedidosAsignados.toString()}
                            change="Pendientes de gestionar"
                            icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
                            wrapperClass="bg-blue-50 border-blue-100"
                            loading={loading}
                        />
                    </>
                )}
            </div>

            {/* Quick Links - Different for Admin vs Worker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                        <CardTitle>Accesos Rápidos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/admin/pedidos" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border flex flex-col items-center justify-center text-center gap-2">
                            <ShoppingBag className="h-8 w-8 text-gray-600" />
                            <span className="font-medium">
                                {userRole === 'admin' ? 'Gestionar Pedidos' : 'Mis Pedidos'}
                            </span>
                        </Link>

                        {/* Inventario - Solo para Admin */}
                        {userRole === 'admin' && (
                            <Link href="/admin/productos" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border flex flex-col items-center justify-center text-center gap-2">
                                <Package className="h-8 w-8 text-gray-600" />
                                <span className="font-medium">Inventario</span>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, icon, wrapperClass, loading }: any) {
    return (
        <Card className={`border shadow-sm transition-all hover:shadow-md ${wrapperClass}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        {icon}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{change}</p>
                </div>
            </CardContent>
        </Card>
    )
}
