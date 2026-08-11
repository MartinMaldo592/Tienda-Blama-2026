"use client"

import { useEffect, useState, useRef } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"

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
                    billetera: true, // <-- Billeteras Móviles y QR Code dentro del modal Culqi
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
            console.log("🔔 Callback window.culqi ejecutado. Objeto Culqi:", window.Culqi)

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
            } else if (window.Culqi.order) {
                // Pago generado mediante orden/QR dentro del modal Culqi
                console.log("✅ Orden/QR generado dentro de Culqi:", window.Culqi.order)
                if (window.Culqi.close) window.Culqi.close()
                setIsProcessing(false)
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

    const handlePay = async (e: React.MouseEvent) => {
        if (e) e.preventDefault()

        if (!isScriptLoaded || !window.Culqi) {
            console.error("Culqi no está listo (Script no cargado)")
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

            // Configurar Culqi Settings con RSA Keys (sin pre-crear orden backend)
            // Esto permite que Culqi v4 genere la orden internamente en estado 'created'
            // y despliegue el Código QR dentro de su propio modal sin error CNP0183.
            const culqiSettings: any = {
                title: title,
                currency: 'PEN',
                amount: amountInCents,
                email: email || 'cliente@blama.shop',
            }

            // Llaves RSA obligatorias para que el modal Culqi genere el QR internamente
            if (process.env.NEXT_PUBLIC_CULQI_RSA_ID) {
                culqiSettings.xculqirsaid = process.env.NEXT_PUBLIC_CULQI_RSA_ID
            }

            if (process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY) {
                // Asegurar formato correcto de saltos de línea en la llave pública RSA
                let rawRsa = process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY
                rawRsa = rawRsa.replace(/\\n/g, "\n")
                if (!rawRsa.includes("-----BEGIN PUBLIC KEY-----")) {
                    rawRsa = `-----BEGIN PUBLIC KEY-----\n${rawRsa}\n-----END PUBLIC KEY-----`
                }
                culqiSettings.rsapublickey = rawRsa
            }

            console.log("⚙️ Culqi.settings configurado para modal integrado:", {
                amount: culqiSettings.amount,
                hasRsaId: Boolean(culqiSettings.xculqirsaid),
                hasRsaPublic: Boolean(culqiSettings.rsapublickey)
            })

            window.Culqi.settings(culqiSettings)

            // Configurar opciones de pago habilitando Billeteras Móviles / QR Code
            window.Culqi.options({
                lang: "es",
                installments: false,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    billetera: true, // <-- Habilita la pestaña Billeteras Digitales (Código QR) dentro del modal
                    bancaMovil: false,
                    agente: false,
                    cuotealo: false
                },
                style: {
                    logo: "https://static.culqi.com/v2/v2/static/img/logo.png",
                    maincolor: "#FF6FA7",
                }
            })

            // Abrir modal Culqi
            window.Culqi.open()

            // Vigilante de cierre manual del modal
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

    return (
        <>
            <Script
                src="https://checkout.culqi.com/js/v4"
                onLoad={handleScriptLoad}
                strategy="lazyOnload"
            />

            <Button
                onClick={handlePay}
                disabled={!isScriptLoaded || disabled || isProcessing || amount <= 0}
                className={`w-full bg-[#FF6FA7] hover:bg-[#e0558d] text-white h-14 text-base font-black rounded-2xl shadow-lg shadow-[#FF6FA7]/20 transition-all ${className}`}
                type="button"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Abriendo pasarela de pago...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pagar S/ {amount.toFixed(2)} con Tarjeta / Yape / QR
                    </>
                )}
            </Button>

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
