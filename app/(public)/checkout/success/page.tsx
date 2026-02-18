"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag, MessageCircle } from "lucide-react"

export default function SuccessPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const orderId = searchParams.order_id
    const transactionId = searchParams.transaction_id || "culqi-verified"

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
            <div className="rounded-full bg-green-100 p-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>

            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed">
                    Gracias por tu compra. Hemos recibido tu pedido correctamente.
                </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-6 w-full max-w-sm space-y-4 shadow-sm">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">N° de Pedido:</span>
                    <span className="font-mono font-medium text-lg">#{String(orderId || "PEND").padStart(5, '0')}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-4">
                    <span className="text-gray-500">Transacción ID:</span>
                    <span className="font-mono text-xs text-gray-400 break-all">{String(transactionId).slice(0, 16)}...</span>
                </div>
                <div className="pt-2 text-xs text-center text-gray-400">
                    Te hemos enviado los detalles a tu correo electrónico.
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Link href="/productos" className="w-full">
                    <Button variant="outline" className="w-full gap-2">
                        <ShoppingBag className="h-4 w-4" /> Seguir Comprando
                    </Button>
                </Link>
                <Link
                    href={`https://api.whatsapp.com/send?phone=51958279604&text=Hola,%20acabo%20de%20pagar%20mi%20pedido%20%23${orderId}%20con%20tarjeta.%20%C2%BFMe%20confirman?`}
                    target="_blank"
                    className="w-full"
                >
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                        <MessageCircle className="h-4 w-4" /> Avisar por WhatsApp
                    </Button>
                </Link>
            </div>
        </div>
    )
}
