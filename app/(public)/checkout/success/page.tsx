"use client"

import Link from "next/link"
import Image from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"
import { Button } from "@/components/ui/button"
import { ShoppingBag, MessageCircle, Package, Truck, CheckCircle2, Clock, MapPin, User } from "lucide-react"
import React, { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase.client"
import { formatCurrency } from "@/lib/utils"
import { buildWhatsAppFinalMessage, buildWhatsAppUrl, isMobileDevice } from "@/features/checkout"

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
    const isWhatsApp = transactionId === "whatsapp" || (!transactionId && !order?.culqi_charge_id)
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(!!orderId)

    const [accessDenied, setAccessDenied] = useState(false)
    const [redirected, setRedirected] = useState(false)

    // Email: only send once per page load
    const emailSentRef = useRef(false)

    useEffect(() => {
        if (!orderId) return
        async function loadOrder() {
            try {
                const supabase = createClient()

                const [secRes, orderRes, itemsRes] = await Promise.all([
                    supabase.from("pedidos").select("culqi_charge_id").eq("id", Number(orderId)).maybeSingle(),
                    supabase.from("pedidos").select(`
                        id, 
                        nombre_contacto, 
                        dni_contacto, 
                        telefono_contacto, 
                        metodo_envio, 
                        departamento, 
                        provincia, 
                        distrito, 
                        direccion_calle, 
                        referencia_direccion, 
                        link_ubicacion, 
                        email_contacto, 
                        subtotal, 
                        descuento, 
                        total, 
                        status
                    `).eq("id", Number(orderId)).maybeSingle(),
                    supabase.from("pedido_items").select("producto_nombre, variante_nombre, cantidad, precio_unitario, producto_id").eq("pedido_id", Number(orderId))
                ])

                const secCheck = secRes.data
                const orderData = orderRes.data
                const itemsData = itemsRes.data

                if (!orderData) {
                    setAccessDenied(true)
                    setLoading(false)
                    return
                }

                // If the transaction_id in the URL doesn't match what we stored → block access
                const storedToken = secCheck?.culqi_charge_id || ""
                if (storedToken && transactionId && transactionId !== "whatsapp" && storedToken !== transactionId) {
                    setAccessDenied(true)
                    setLoading(false)
                    return
                }

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
                console.error("❌ [WhatsApp Redirect Debug] Error in loadOrder:", e)
            } finally {
                setLoading(false)
            }
        }
        loadOrder()
    }, [orderId, transactionId])

    const getWhatsAppUrl = () => {
        if (!order) return "#"
        const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "51958279604").replace(/\D/g, "")
        if (isWhatsApp) {
            const msg = buildWhatsAppFinalMessage({
                orderIdFormatted: String(order.id).padStart(6, '0'),
                name: order.nombre_contacto || "Cliente",
                dni: order.dni_contacto || "",
                phone: order.telefono_contacto || "",
                address: order.direccion_calle || "",
                department: order.departamento || "",
                province: order.provincia || "",
                district: order.distrito || "",
                reference: order.referencia_direccion || "",
                locationLink: order.link_ubicacion || "",
                items: items.map((item: any) => ({
                    id: item.producto_id || 0,
                    quantity: item.cantidad || 1,
                    precio: item.precio_unitario || 0,
                    nombre: item.producto_nombre || "",
                    variante_nombre: item.variante_nombre || null
                })),
                subtotal: order.subtotal || 0,
                discount: order.descuento || 0,
                total: order.total || 0,
                couponCode: order.cupon_codigo || null,
                shippingMethod: order.metodo_envio || "",
                email: order.email_contacto || ""
            })
            return buildWhatsAppUrl(whatsappNumber, msg)
        } else {
            return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(`¡Hola! Acabo de pagar mi pedido #${String(orderId).padStart(6, '0')} con tarjeta. ¿Me confirman? 🛍️`)}`
        }
    }

    useEffect(() => {
        console.log("🔍 [WhatsApp Redirect Debug] useEffect fired:", {
            hasOrder: !!order,
            orderId: order?.id,
            itemsLength: items.length,
            isWhatsApp,
            loading,
            redirected,
            transactionId
        })

        if (!order || items.length === 0 || !isWhatsApp || loading || redirected) {
            console.log("🚫 [WhatsApp Redirect Debug] Redirect skipped. Conditions not met.")
            return
        }

        console.log("⏱️ [WhatsApp Redirect Debug] Conditions met. Setting timer for 2s...")
        const timer = setTimeout(() => {
            const url = getWhatsAppUrl()
            console.log("🔗 [WhatsApp Redirect Debug] Generated WhatsApp URL:", url)
            if (url && url !== "#") {
                setRedirected(true)
                if (isMobileDevice()) {
                    console.log("🚀 [WhatsApp Redirect Debug] Mobile detected. Navigating window.location.href to:", url)
                    window.location.href = url
                } else {
                    console.log("🚀 [WhatsApp Redirect Debug] Desktop detected. Opening in new tab via window.open to:", url)
                    window.open(url, "_blank")
                }
            } else {
                console.log("⚠️ [WhatsApp Redirect Debug] URL was '#' or empty, redirect skipped.")
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [order, items, isWhatsApp, loading, redirected])

    // Confirmation email is now handled server-side in the checkout API
    // for maximum reliability and to prevent duplicate emails.

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
                    {isWhatsApp ? "¡Pedido Recibido!" : "¡Pago Exitoso!"}
                </h1>
                <p className="text-gray-500">
                    {isWhatsApp
                        ? "Hemos recibido tu solicitud. Un asesor te contactará pronto para confirmar el envío."
                        : "Gracias por tu compra. Hemos recibido tu pedido correctamente."}
                </p>
            </div>

            {/* ── Delivery Steps ── */}
            <DeliverySteps />

            {/* ── Redirection Banner (Premium Custom Design) ── */}
            {isWhatsApp && order && (
                <div className="w-full max-w-sm bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/80 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Redirigiéndote a WhatsApp para confirmar...
                    </div>
                    <p className="text-[11px] text-emerald-600/90 leading-tight">
                        Por favor no cierres esta ventana. Si no se abre en unos segundos, presiona el botón verde de abajo.
                    </p>
                </div>
            )}

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
                                            loader={cloudinaryLoader}
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
                                <span>{isWhatsApp ? "Total a Pagar" : "Total Pagado"}</span>
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
                    href={getWhatsAppUrl()}
                    target="_blank"
                    className="w-full"
                >
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2 h-12 rounded-xl shadow-md transition-all active:scale-95">
                        <MessageCircle className="h-4 w-4" /> {isWhatsApp ? "Confirmar por WhatsApp" : "Avisar por WhatsApp"}
                    </Button>
                </Link>
            </div>
        </div>
    )
}
