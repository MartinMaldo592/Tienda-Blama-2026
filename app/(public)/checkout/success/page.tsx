"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, MessageCircle } from "lucide-react"
import React from "react"
import dynamic from "next/dynamic"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// Lottie JSON definition (Simplified Success Check)
const successAnimation = {
    "v": "5.5.7", "fr": 60, "ip": 0, "op": 60, "w": 200, "h": 200, "nm": "Success", "ddd": 0,
    "assets": [],
    "layers": [
        {
            "ddd": 0, "ind": 1, "ty": 4, "nm": "Check", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [100, 100, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0,
            "shapes": [
                {
                    "ty": "gr", "it": [
                        { "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [{ "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]], "v": [[-40, 0], [-40, 0], [-40, 0]], "c": false }] }, { "t": 30, "s": [{ "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]], "v": [[-40, 0], [-10, 30], [-10, 30]], "c": false }] }, { "t": 60, "s": [{ "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]], "v": [[-40, 0], [-10, 30], [40, -30]], "c": false }] }], "ix": 2 }, "nm": "Path 1", "hd": false },
                        { "ty": "st", "c": { "a": 0, "k": [0.13, 0.77, 0.36, 1], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 15, "ix": 5 }, "lc": 2, "lj": 2, "ml": 4, "bm": 0, "nm": "Stroke 1", "hd": false },
                        { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }
                    ], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "hd": false
                }
            ], "ip": 0, "op": 60, "st": 0, "bm": 0
        },
        {
            "ddd": 0, "ind": 2, "ty": 4, "nm": "Circle", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [100, 100, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0, 0], "ix": 1 }, "s": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0, 0, 100] }, { "t": 30, "s": [100, 100, 100] }], "ix": 6 } }, "ao": 0,
            "shapes": [
                {
                    "ty": "gr", "it": [
                        { "d": 1, "ty": "el", "s": { "a": 0, "k": [180, 180], "ix": 2 }, "p": { "a": 0, "k": [0, 0], "ix": 3 }, "nm": "Ellipse Path 1", "hd": false },
                        { "ty": "st", "c": { "a": 0, "k": [0.13, 0.77, 0.36, 1], "ix": 3 }, "o": { "a": 0, "k": 20, "ix": 4 }, "w": { "a": 0, "k": 2, "ix": 5 }, "lc": 1, "lj": 1, "ml": 4, "bm": 0, "nm": "Stroke 1", "hd": false },
                        { "ty": "fl", "c": { "a": 0, "k": [0.13, 0.77, 0.36, 1], "ix": 4 }, "o": { "a": 0, "k": 10, "ix": 5 }, "r": 1, "bm": 0, "nm": "Fill 1", "hd": false },
                        { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }
                    ], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "hd": false
                }
            ], "ip": 0, "op": 60, "st": 0, "bm": 0
        }
    ]
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
            <div className="h-40 w-40 flex items-center justify-center pointer-events-none drop-shadow-sm">
                <Lottie
                    animationData={successAnimation}
                    loop={false}
                    className="h-48 w-48"
                />
            </div>

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
