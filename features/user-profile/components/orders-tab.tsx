"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Calendar, MapPin, Truck, ExternalLink, ShoppingBag, ChevronDown, ChevronUp, FileText } from "lucide-react"

interface OrdersTabProps {
    orders: any[]
}

export function OrdersTab({ orders }: OrdersTabProps) {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(orders.length > 0 ? orders[0].id : null)

    const toggleExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "entregado":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 font-bold">Entregado</Badge>
            case "enviado":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 font-bold">En Camino</Badge>
            case "en_proceso":
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 font-bold">En Preparación</Badge>
            case "cancelado":
                return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200 font-bold">Cancelado</Badge>
            default:
                return <Badge className="bg-slate-500/10 text-slate-600 border-slate-200 font-bold">Pendiente</Badge>
        }
    }

    const getPagoBadge = (pagoStatus: string) => {
        switch (pagoStatus) {
            case "pagado":
                return <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 font-bold">Pago Confirmado</Badge>
            case "rechazado":
                return <Badge variant="outline" className="text-rose-700 bg-rose-50 border-rose-200 font-bold">Pago Rechazado</Badge>
            default:
                return <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 font-bold">Pago Pendiente</Badge>
        }
    }

    if (orders.length === 0) {
        return (
            <Card className="rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900">No tienes pedidos registrados</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                    Tus compras realizadas aparecerán aquí con su estado y seguimiento en tiempo real.
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Mis Compras</h2>
                    <p className="text-xs text-slate-500 font-medium">Historial completo de tus pedidos</p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                    {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
                </span>
            </div>

            <div className="space-y-4">
                {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id
                    return (
                        <Card
                            key={order.id}
                            className={`rounded-3xl border transition-all duration-200 ${
                                isExpanded ? "border-blue-500/50 shadow-md bg-white" : "border-slate-200/80 shadow-sm hover:border-slate-300 bg-slate-50/50"
                            }`}
                        >
                            <CardHeader
                                className="p-5 cursor-pointer select-none flex flex-row items-center justify-between"
                                onClick={() => toggleExpand(order.id)}
                            >
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-slate-900 text-base">
                                                Pedido #{order.id}
                                            </span>
                                            {getStatusBadge(order.status)}
                                            {getPagoBadge(order.pago_status)}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {new Date(order.created_at).toLocaleDateString("es-PE", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span>•</span>
                                            <span>{order.metodo_envio || "Envío Estándar"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500 font-medium block">Total</span>
                                        <span className="text-lg font-black text-slate-900">
                                            S/ {Number(order.total).toFixed(2)}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400">
                                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </CardHeader>

                            {isExpanded && (
                                <CardContent className="p-6 pt-0 border-t space-y-6 mt-2">
                                    {/* Tracking Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <div className="p-4 rounded-2xl bg-slate-100/70 space-y-2 text-xs">
                                            <span className="font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-slate-500" /> Dirección de Entrega
                                            </span>
                                            <p className="font-semibold text-slate-800">
                                                {order.nombre_contacto || "Sin nombre"} ({order.telefono_contacto || "Sin tel."})
                                            </p>
                                            <p className="text-slate-600">
                                                {order.direccion_calle}, {order.distrito}, {order.provincia}, {order.departamento}
                                            </p>
                                            {order.referencia_direccion && (
                                                <p className="text-slate-500 italic">Ref: {order.referencia_direccion}</p>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs">
                                            <span className="font-bold text-blue-700 uppercase tracking-wider block flex items-center gap-1.5">
                                                <Truck className="h-4 w-4 text-blue-600" /> Datos de Envío & Seguimiento
                                            </span>
                                            <p className="font-semibold text-slate-800">
                                                Método: <span className="font-bold text-blue-900">{order.metodo_envio || "Agencia"}</span>
                                            </p>
                                            {order.codigo_seguimiento && (
                                                <p className="text-slate-700">
                                                    Código Tracking: <span className="font-bold text-blue-900">{order.codigo_seguimiento}</span>
                                                </p>
                                            )}
                                            {order.shalom_orden && (
                                                <div className="text-slate-700 space-y-0.5 pt-1">
                                                    <p>Orden Shalom: <strong>{order.shalom_orden}</strong></p>
                                                    {order.shalom_clave && <p>Clave: <strong>{order.shalom_clave}</strong></p>}
                                                </div>
                                            )}
                                            {order.guia_archivo_url && (
                                                <a
                                                    href={order.guia_archivo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold pt-1"
                                                >
                                                    <FileText className="h-3.5 w-3.5" /> Ver Guía Adjunta <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Products List */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Detalle de Productos
                                        </h4>
                                        <div className="divide-y divide-slate-100">
                                            {order.pedido_items?.map((item: any) => (
                                                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border">
                                                            {item.productos?.imagen_url ? (
                                                                <img src={item.productos.imagen_url} alt={item.producto_nombre} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <ShoppingBag className="h-5 w-5 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{item.producto_nombre}</p>
                                                            <p className="text-xs text-slate-500 font-medium">
                                                                Cantidad: {item.cantidad} {item.variante_nombre ? `(${item.variante_nombre})` : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            S/ {Number((item.precio_unitario || 0) * item.cantidad).toFixed(2)}
                                                        </span>
                                                        <span className="text-xs text-slate-500 block">
                                                            S/ {Number(item.precio_unitario || 0).toFixed(2)} c/u
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary breakdown */}
                                    <div className="pt-3 border-t flex flex-col items-end gap-1 text-xs text-slate-600">
                                        <div className="flex justify-between w-full max-w-xs">
                                            <span>Subtotal:</span>
                                            <span className="font-semibold text-slate-800">S/ {Number(order.subtotal || order.total).toFixed(2)}</span>
                                        </div>
                                        {Number(order.descuento || 0) > 0 && (
                                            <div className="flex justify-between w-full max-w-xs text-emerald-600">
                                                <span>Descuento:</span>
                                                <span className="font-semibold">- S/ {Number(order.descuento).toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between w-full max-w-xs text-sm font-black text-slate-900 pt-1 border-t">
                                            <span>Total Pagado:</span>
                                            <span>S/ {Number(order.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
