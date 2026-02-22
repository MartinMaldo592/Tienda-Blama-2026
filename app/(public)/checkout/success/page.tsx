"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, MessageCircle } from "lucide-react"
import React from "react"

// Pure CSS/SVG animated checkmark — works on ALL devices, no external libs needed
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
                .success-circle-wrap {
                    animation: scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
                }
                .success-ring {
                    stroke-dasharray: 283;
                    stroke-dashoffset: 283;
                    animation: drawCircle 0.6s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .success-check {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: drawCheck 0.5s 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>
            <div className="success-circle-wrap">
                <svg
                    width="140"
                    height="140"
                    viewBox="0 0 140 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background circle (light green fill) */}
                    <circle cx="70" cy="70" r="70" fill="#dcfce7" />

                    {/* Animated border ring */}
                    <circle
                        className="success-ring"
                        cx="70"
                        cy="70"
                        r="45"
                        stroke="#22c55e"
                        strokeWidth="5"
                        strokeLinecap="round"
                        fill="none"
                        transform="rotate(-90 70 70)"
                    />

                    {/* Animated checkmark path */}
                    <polyline
                        className="success-check"
                        points="45,72 62,90 95,52"
                        stroke="#16a34a"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
    )
}

export default function SuccessPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = React.use(searchParamsPromise)
    const orderId = searchParams.order_id
    const transactionId = searchParams.transaction_id || "culqi-verified"

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
            <SuccessCheckmark />

            <div className="space-y-1 max-w-md">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed">
                    Gracias por tu compra. Hemos recibido tu pedido correctamente.
                </p>
            </div>

            <div className="bg-gray-50 border rounded-xl p-6 w-full max-w-sm space-y-4 shadow-sm">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">N° de Pedido:</span>
                    <span className="font-mono font-bold text-lg text-primary">#{String(orderId || "PEND").padStart(5, '0')}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-4">
                    <span className="text-gray-500 font-medium">Transacción ID:</span>
                    <span className="font-mono text-[10px] text-gray-400 break-all">{String(transactionId).slice(0, 24)}...</span>
                </div>
                <div className="pt-2 text-xs text-center text-muted-foreground italic">
                    Te hemos enviado los detalles a tu correo electrónico.
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-4">
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
