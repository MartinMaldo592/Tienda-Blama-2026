"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface CulqiButtonProps {
    amount: number
    email?: string // Opcional porque a veces lo sacamos del form
    title?: string
    onToken: (token: string, email: string) => Promise<void>
    onError: (error: any) => void
    onBeforeOpen?: () => boolean | Promise<boolean> // Nuevo: Validación previa
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
    title = 'Tienda Blama',
    onToken,
    onError,
    onBeforeOpen,
    disabled,
    className
}: CulqiButtonProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleScriptLoad = () => {
        setIsScriptLoaded(true)
        if (window.Culqi) {
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY
            window.Culqi.options({
                style: {
                    logo: "https://static.culqi.com/v2/v2/static/img/logo-culqi-new.png",
                    maincolor: "#16a34a",
                }
            })
        }
    }

    const handlePay = async (e: React.MouseEvent) => {
        if (e) e.preventDefault() // Prevenir submit del form si está dentro

        if (!isScriptLoaded || !window.Culqi) {
            console.error("Culqi no está listo")
            return
        }

        // Validación previa (ej: campos del form)
        if (onBeforeOpen) {
            const isValid = await onBeforeOpen()
            if (!isValid) return
        }

        setIsProcessing(true)

        try {
            const amountInCents = Math.round(amount * 100)

            // Configurar settings justo antes de abrir
            window.Culqi.settings({
                title: title,
                currency: 'PEN',
                amount: amountInCents,
                email: email || 'cliente@blama.shop',
            })

            window.Culqi.open()
        } catch (err) {
            console.error("Error abriendo Culqi:", err)
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        // Intervalo para definir el callback global window.culqi
        const interval = setInterval(() => {
            if (window.Culqi) {
                window.culqi = async () => {
                    if (window.Culqi.token) {
                        try {
                            const token = window.Culqi.token.id
                            const tokenEmail = window.Culqi.token.email
                            console.log('Token Culqi recibido:', token)
                            await onToken(token, tokenEmail)
                        } catch (err) {
                            console.error('Error procesando token:', err)
                            onError(err)
                        } finally {
                            window.Culqi.close()
                            setIsProcessing(false) // Terminado
                        }
                    } else if (window.Culqi.error) {
                        console.error('Error Culqi callback:', window.Culqi.error)
                        onError(window.Culqi.error)
                        setIsProcessing(false)
                    } else {
                        // Caso cierre manual
                        setIsProcessing(false)
                    }
                }
            }
        }, 800)

        return () => clearInterval(interval)
    }, [onToken, onError])

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
                className={`w-full bg-green-700 hover:bg-green-800 h-14 text-base font-bold shadow-md transition-all ${className}`}
                type="button" // Importante: No type="submit"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pagar {formatCurrency(amount)} ahora
                    </>
                )}
            </Button>

            <p className="text-[10px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                <span className="bg-gray-100 rounded px-1 py-0.5">🔒 Pago Seguro con Culqi</span>
                <span>Tarjetas y Yape</span>
            </p>
        </>
    )
}
