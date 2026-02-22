"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, MessageCircle, Package, Truck, CheckCircle2, Clock, MapPin, User } from "lucide-react"
import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase.client"
import { formatCurrency } from "@/lib/utils"

// ─── Animated Checkmark (CSS/SVG – no external libs) ────────────────────────
function SuccessCheckmark() {
    return (
        <div className="flex items-center justify-center">
            <style>{`
                @keyframes scaleIn {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.15); opacity: 1; }
                    80%  { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }
                @keyframes drawCircle {
                    0%   { stroke-dashoffset: 283; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes drawCheck {
                    0%   { stroke-dashoffset: 100; }
                    100% { stroke-dashoffset: 0; }
                }
                .success-circle-wrap { animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .success-ring {
                    stroke-dasharray: 283;
                    stroke-dashoffset: 283;
                    animation: drawCircle 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) forwards;
                }
                .success-check {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: drawCheck 0.5s 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
                }
            `}</style>
            <div className="success-circle-wrap">
                <svg width="130" height="130" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="70" cy="70" r="70" fill="#dcfce7" />
                    <circle
                        className="success-ring"
                        cx="70" cy="70" r="45"
                        stroke="#22c55e" strokeWidth="5"
                        strokeLinecap="round" fill="none"
                        transform="rotate(-90 70 70)"
                    />
                    <polyline
                        className="success-check"
                        points="45,72 62,90 95,52"
                        stroke="#16a34a" strokeWidth="7"
                        strokeLinecap="round" strokeLinejoin="round"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
    )
}

// ─── Delivery Steps ──────────────────────────────────────────────────────────
function DeliverySteps() {
    const steps = [
        { icon: CheckCircle2, label: "Pedido\nConfirmado", done: true },
        { icon: Package, label: "En\nPreparación", done: false },
        { icon: Truck, label: "En\nCamino", done: false },
    ]
    return (
        <div className="w-full max-w-sm">
            <div className="flex items-center justify-between relative">
                {/* connector line */}
                <div className="absolute top-5 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-gray-200 z-0">
                    <div className="h-full w-1/2 bg-green-500 transition-all" />
                </div>

                {steps.map((step, i) => {
                    const Icon = step.icon
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 z-10 flex-1">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all
                                ${step.done
                                    ? "bg-green-500 border-green-500 text-white"
                                    : i === 1
                                        ? "bg-amber-50 border-amber-400 text-amber-500"
                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className={`text-[10px] font-semibold text-center leading-tight whitespace-pre-line
                                ${step.done ? "text-green-600" : i === 1 ? "text-amber-500" : "text-gray-400"}`}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Delivery Time estimate ──────────────────────────────────────────────────
function DeliveryEstimate({ shippingMethod }: { shippingMethod: string }) {
    const isLima = shippingMethod?.toLowerCase().includes("lima") || !shippingMethod
    return (
        <div className="w-full max-w-sm bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
                <p className="text-sm font-bold text-blue-800">Tiempo Estimado de Entrega</p>
                {isLima ? (
                    <p className="text-xs text-blue-600 mt-0.5">
                        📦 <strong>24 horas</strong> en Lima Metropolitana y Callao
                    </p>
                ) : (
                    <p className="text-xs text-blue-600 mt-0.5">
                        📦 <strong>1 a 3 días hábiles</strong> en provincia (envío por agencia)
                    </p>
                )}
                <p className="text-[10px] text-blue-400 mt-1">Lunes a sábado, sujeto a disponibilidad del courier.</p>
            </div>
        </div>
    )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SuccessPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = React.use(searchParamsPromise)
    const orderId = searchParams.order_id as string | undefined
    const transactionId = (searchParams.transaction_id as string | undefined) || "culqi-verified"

    const [order, setOrder] = useState<any>(null)
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(!!orderId)

    const [accessDenied, setAccessDenied] = useState(false)

    useEffect(() => {
        if (!orderId) return
        async function loadOrder() {
            try {
                const supabase = createClient()

                // ── SECURITY: first fetch ONLY the transaction token – no personal data ──
                const { data: secCheck } = await supabase
                    .from("pedidos")
                    .select("codigo_seguimiento")
                    .eq("id", Number(orderId))
                    .single()

                // If the transaction_id in the URL doesn't match what we stored → block access
                const storedToken = secCheck?.codigo_seguimiento || ""
                if (storedToken && transactionId && storedToken !== transactionId) {
                    setAccessDenied(true)
                    setLoading(false)
                    return
                }
                // ─────────────────────────────────────────────────────────────────────────

                // All good — fetch the full order
                const { data: orderData } = await supabase
                    .from("pedidos")
                    .select("id, nombre_contacto, metodo_envio, subtotal, descuento, total, status")
                    .eq("id", Number(orderId))
                    .single()

                const { data: itemsData } = await supabase
                    .from("pedido_items")
                    .select("producto_nombre, variante_nombre, cantidad, precio_unitario, producto_id")
                    .eq("pedido_id", Number(orderId))

                let enrichedItems = itemsData || []
                if (enrichedItems.length > 0) {
                    const productIds = [...new Set(enrichedItems.map((i: any) => i.producto_id).filter(Boolean))]
                    if (productIds.length > 0) {
                        const { data: productos } = await supabase
                            .from("productos")
                            .select("id, imagen_url")
                            .in("id", productIds)

                        const imgMap: Record<number, string> = {}
                        productos?.forEach((p: any) => { imgMap[p.id] = p.imagen_url })

                        enrichedItems = enrichedItems.map((item: any) => ({
                            ...item,
                            imagen_url: imgMap[item.producto_id] || null
                        }))
                    }
                }

                setOrder(orderData)
                setItems(enrichedItems)
            } catch (e) {
                // silently fail — fallback to basic view
            } finally {
                setLoading(false)
            }
        }
        loadOrder()
    }, [orderId, transactionId])

    const shippingMethod = order?.metodo_envio || ""
    const clientName = order?.nombre_contacto || ""

    // ── Access denied: someone tampered with the URL ──────────────────────────
    if (accessDenied) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center gap-4">
                <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Acceso No Autorizado</h1>
                <p className="text-gray-500 max-w-xs text-sm">
                    El enlace que usaste no es válido o no te pertenece. Solo el comprador puede ver el detalle de su pedido.
                </p>
                <Link href="/productos">
                    <Button variant="outline" className="mt-2 gap-2 rounded-xl">
                        <ShoppingBag className="h-4 w-4" /> Ir a la Tienda
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center space-y-5 pb-12">

            {/* ── Animated Check ── */}
            <SuccessCheckmark />

            {/* ── Title ── */}
            <div className="space-y-1 max-w-md">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-gray-500">
                    Gracias por tu compra. Hemos recibido tu pedido correctamente.
                </p>
            </div>

            {/* ── Delivery Steps ── */}
            <DeliverySteps />

            {/* ── Order Info Card ── */}
            <div className="bg-gray-50 border rounded-xl p-4 w-full max-w-sm shadow-sm text-left space-y-3">

                {/* Header row */}
                <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-xs text-gray-500 font-medium">N° de Pedido</span>
                    <span className="font-mono font-bold text-base text-primary">
                        #{String(orderId || "PEND").padStart(5, '0')}
                    </span>
                </div>

                {/* Client & Shipping */}
                {(clientName || shippingMethod) && (
                    <div className="space-y-1.5 pb-2 border-b">
                        {clientName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                <span>{clientName}</span>
                            </div>
                        )}
                        {shippingMethod && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                <span>Envío: <strong>{shippingMethod}</strong></span>
                            </div>
                        )}
                    </div>
                )}

                {/* Products list */}
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="h-14 w-14 bg-gray-200 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3 items-center">
                                {/* Product image */}
                                <div className="h-14 w-14 bg-white rounded-lg border flex-shrink-0 relative overflow-hidden">
                                    {item.imagen_url ? (
                                        <Image
                                            src={item.imagen_url}
                                            alt={item.producto_nombre}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                                            <Package className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                {/* Product info */}
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                                        {item.producto_nombre}
                                    </p>
                                    {item.variante_nombre && (
                                        <p className="text-xs text-gray-400">{item.variante_nombre}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        ×{item.cantidad} — {formatCurrency(item.precio_unitario)}
                                    </p>
                                </div>
                                {/* Subtotal */}
                                <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                                    {formatCurrency(item.cantidad * item.precio_unitario)}
                                </p>
                            </div>
                        ))}

                        {/* Totals */}
                        <div className="border-t pt-3 space-y-1">
                            {order?.descuento > 0 && (
                                <>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-green-600 font-medium">
                                        <span>Descuento</span>
                                        <span>-{formatCurrency(order.descuento)}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between text-sm font-bold text-gray-900">
                                <span>Total Pagado</span>
                                <span>{formatCurrency(order?.total ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Transaction ID */}
                <div className="flex justify-between items-center text-xs border-t pt-3">
                    <span className="text-gray-400 font-medium">Transacción ID</span>
                    <span className="font-mono text-[10px] text-gray-400 break-all">
                        {String(transactionId).slice(0, 24)}...
                    </span>
                </div>
            </div>

            {/* ── Delivery Estimate ── */}
            <DeliveryEstimate shippingMethod={shippingMethod} />

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-2">
                <Link href="/productos" className="w-full">
                    <Button variant="outline" className="w-full gap-2 h-12 rounded-xl transition-all hover:bg-muted">
                        <ShoppingBag className="h-4 w-4" /> Seguir Comprando
                    </Button>
                </Link>
                <Link
                    href={`https://api.whatsapp.com/send?phone=51958279604&text=Hola,%20acabo%20de%20pagar%20mi%20pedido%20%23${orderId}%20con%20tarjeta.%20%C2%BFMe%20confirman?`}
                    target="_blank"
                    className="w-full"
                >
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12 rounded-xl shadow-md transition-all active:scale-95">
                        <MessageCircle className="h-4 w-4" /> Avisar por WhatsApp
                    </Button>
                </Link>
            </div>
        </div>
    )
}
