"use client"

import { useEffect, useState, useRef } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, QrCode, CheckCircle2, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

interface CulqiButtonProps {
    amount: number
    email?: string
    name?: string
    phone?: string
    title?: string
    onToken: (token: string, email: string) => Promise<void>
    onError: (error: any) => void
    onBeforeOpen?: () => boolean | Promise<boolean>
    disabled?: boolean
    className?: string
}

declare global {
    interface Window {
        Culqi: any
        culqi: () => void
    }
}

export function CulqiPaymentButton({
    amount,
    email,
    name = 'Cliente BLAMA',
    phone = '900000000',
    title = 'BLAMA Fitness',
    onToken,
    onError,
    onBeforeOpen,
    disabled,
    className
}: CulqiButtonProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    // Modal para Código QR Yape / Plin
    const [qrModalOpen, setQrModalOpen] = useState(false)
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null)
    const [qrOrderId, setQrOrderId] = useState<string | null>(null)
    const [generatingQr, setGeneratingQr] = useState(false)

    const onTokenRef = useRef(onToken)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onTokenRef.current = onToken
        onErrorRef.current = onError
    }, [onToken, onError])

    const handleScriptLoad = () => {
        setIsScriptLoaded(true)
        if (window.Culqi) {
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY
            window.Culqi.options({
                lang: "es",
                installments: false,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    billetera: false,
                    bancaMovil: false,
                    agente: false,
                    cuotealo: false
                },
                style: {
                    logo: "https://static.culqi.com/v2/v2/static/img/logo.png",
                    maincolor: "#FF6FA7",
                }
            })
        }
    }

    useEffect(() => {
        if (window.Culqi) {
            handleScriptLoad()
        }
    }, [])

    useEffect(() => {
        window.culqi = async () => {
            console.log("🔔 Callback window.culqi ejecutado:", window.Culqi)

            if (window.Culqi.token) {
                try {
                    const token = window.Culqi.token.id
                    const tokenEmail = window.Culqi.token.email || email

                    if (onTokenRef.current) {
                        await onTokenRef.current(token, tokenEmail)
                    }
                } catch (err) {
                    console.error('Error procesando token Culqi:', err)
                    if (onErrorRef.current) onErrorRef.current(err)
                } finally {
                    if (window.Culqi.close) window.Culqi.close()
                    setIsProcessing(false)
                }
            } else if (window.Culqi.error) {
                console.error('❌ Error Culqi:', window.Culqi.error)
                const userMsg = window.Culqi.error.user_message || window.Culqi.error.merchant_message || "Error en el pago"
                if (onErrorRef.current) onErrorRef.current(new Error(userMsg))
                setIsProcessing(false)
            } else {
                if (onErrorRef.current) onErrorRef.current(new Error("Proceso de pago cancelado por el usuario."))
                setIsProcessing(false)
            }
        }
    }, [email])

    // Abrir Modal de Pagos con Tarjeta / Yape síncrono
    const handlePayCard = async (e: React.MouseEvent) => {
        if (e) e.preventDefault()

        if (!isScriptLoaded || !window.Culqi) {
            console.error("Culqi no está listo")
            return
        }

        window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY

        if (onBeforeOpen) {
            const isValid = await onBeforeOpen()
            if (!isValid) return
        }

        setIsProcessing(true)

        try {
            const amountInCents = Math.round(amount * 100)

            window.Culqi.settings({
                title: title,
                currency: 'PEN',
                amount: amountInCents,
                email: email || 'cliente@blama.shop',
            })

            window.Culqi.options({
                lang: "es",
                installments: false,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    billetera: false,
                    bancaMovil: false,
                    agente: false,
                    cuotealo: false
                },
                style: {
                    logo: "https://static.culqi.com/v2/v2/static/img/logo.png",
                    maincolor: "#FF6FA7",
                }
            })

            window.Culqi.open()

            const checkInterval = setInterval(() => {
                const iframe = document.getElementById('culqi_checkout_frame')
                if (!iframe && window.Culqi?.close) {
                    clearInterval(checkInterval)
                    setTimeout(() => {
                        setIsProcessing((prev) => {
                            if (prev) {
                                if (onErrorRef.current) onErrorRef.current(new Error("Proceso de pago cancelado por el usuario."))
                                return false
                            }
                            return prev
                        })
                    }, 1000)
                }
            }, 1000)

        } catch (err) {
            console.error("Error abriendo Culqi:", err)
            setIsProcessing(false)
        }
    }

    // Generar y desplegar Código QR Oficial Culqi (Yape / Plin)
    const handleGenerateQr = async () => {
        if (onBeforeOpen) {
            const isValid = await onBeforeOpen()
            if (!isValid) return
        }

        setGeneratingQr(true)
        try {
            const nameParts = (name || "Cliente BLAMA").trim().split(" ")
            const firstName = nameParts[0] || "Cliente"
            const lastName = nameParts.slice(1).join(" ") || "BLAMA"
            const cleanPhone = (phone || "").replace(/\D/g, "") || "900000000"

            const res = await fetch("/api/checkout/culqi/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amount,
                    description: title,
                    client_details: {
                        first_name: firstName,
                        last_name: lastName,
                        email: email || "hola@blama.shop",
                        phone_number: cleanPhone.length === 9 ? cleanPhone : "900000000",
                    }
                })
            })

            const data = await res.json()

            if (res.ok && data.qr) {
                setQrImageUrl(data.qr)
                setQrOrderId(data.orderId)
                setQrModalOpen(true)
                toast.success("Código QR de Culqi generado exitosamente")
            } else {
                toast.error("No se pudo generar el código QR. Intenta con tarjeta o Yape directo.")
            }
        } catch (err) {
            console.error("Error generando QR Culqi:", err)
            toast.error("Error conectando con la pasarela de pago QR.")
        } finally {
            setGeneratingQr(false)
        }
    }

    return (
        <>
            <Script
                src="https://checkout.culqi.com/js/v4"
                onLoad={handleScriptLoad}
                strategy="lazyOnload"
            />

            <div className="space-y-3">
                {/* Botón Principal: Pago con Tarjeta o Yape (Modal Culqi Checkout v4) */}
                <Button
                    onClick={handlePayCard}
                    disabled={!isScriptLoaded || disabled || isProcessing || amount <= 0}
                    className={`w-full bg-[#FF6FA7] hover:bg-[#e0558d] text-white h-14 text-base font-black rounded-2xl shadow-lg shadow-[#FF6FA7]/20 transition-all ${className}`}
                    type="button"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Procesando pasarela...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pagar S/ {amount.toFixed(2)} con Tarjeta / Yape
                        </>
                    )}
                </Button>

                {/* Botón Secundario: Pagar Escaneando Código QR (Yape / Plin) */}
                <Button
                    onClick={handleGenerateQr}
                    disabled={disabled || generatingQr || amount <= 0}
                    variant="outline"
                    className="w-full border-2 border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/50 text-slate-800 h-12 text-sm font-bold rounded-2xl transition-all"
                    type="button"
                >
                    {generatingQr ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" />
                            Generando Código QR...
                        </>
                    ) : (
                        <>
                            <QrCode className="mr-2 h-4 w-4 text-purple-600" />
                            Pagar escaneando Código QR (Yape / Plin)
                        </>
                    )}
                </Button>
            </div>

            {/* Sello Oficial Culqi */}
            <div className="mt-4 pb-2 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-[10px] text-slate-400 font-medium mb-1">Pasarela Segura por</span>
                <div className="flex items-center gap-1 mb-1.5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C14.3644 22 16.5372 21.1818 18.2562 19.8055L20.8953 22.8643C21.4654 23.5252 22.4633 23.5985 23.1242 23.0284C23.7851 22.4583 23.8584 21.4604 23.2883 20.7995L20.6492 17.7408C21.4746 16.124 22 14.167 22 12C22 6.47715 17.5228 2 12 2ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12Z" fill="#eb5e00" />
                    </svg>
                    <span className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-none">
                        Culqi
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase font-medium">
                    <span>Con el respaldo de</span>
                    <span className="font-extrabold text-[#002A8D] tracking-[0.2em]">Credicorp</span>
                </div>
            </div>

            {/* MODAL OFICIAL CÓDIGO QR CULQI */}
            <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border-none shadow-2xl">
                    <DialogHeader className="text-center space-y-1">
                        <DialogTitle className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
                            <QrCode className="h-6 w-6 text-purple-600" /> Código QR Culqi
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium">
                            Escanea desde tu app de Yape, Plin o tu banca móvil para pagar <strong>S/ {amount.toFixed(2)}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    {qrImageUrl ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <div className="p-4 bg-white border-2 border-purple-200 rounded-3xl shadow-md">
                                <img
                                    src={qrImageUrl}
                                    alt="Código QR Culqi Yape Plin"
                                    className="w-56 h-56 object-contain"
                                />
                            </div>

                            <div className="text-center space-y-1">
                                <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Orden Culqi: <span className="font-mono text-purple-700">{qrOrderId}</span>
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Al completar tu pago en tu app, tu pedido se confirmará automáticamente.
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={() => setQrModalOpen(false)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl text-xs mt-2"
                            >
                                Entendido, ya escaneé el QR
                            </Button>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                #culqi_checkout_frame {
                    max-width: 100vw !important;
                    width: 100% !important;
                    height: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    position: fixed !important;
                    z-index: 99999 !important;
                }
            `}</style>
        </>
    )
}
