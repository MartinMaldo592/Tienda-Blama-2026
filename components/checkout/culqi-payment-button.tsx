"use client"

import { useEffect, useState, useRef } from "react"
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

    // Refs para mantener siempre las últimas versiones de las funciones sin reiniciar el efecto
    const onTokenRef = useRef(onToken)
    const onErrorRef = useRef(onError)

    // Actualizar refs cuando cambian las props
    useEffect(() => {
        onTokenRef.current = onToken
        onErrorRef.current = onError
    }, [onToken, onError])

    const handleScriptLoad = () => {
        setIsScriptLoaded(true)
        if (window.Culqi) {
            console.log("✅ Culqi Script cargado correctamente")
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY
            window.Culqi.options({
                style: {
                    logo: "https://static.culqi.com/v2/v2/static/img/logo.png",
                    maincolor: "#16a34a",
                }
            })
        }
    }

    // Verificar si el script ya estaba cargado de antes (Navegación o re-render)
    useEffect(() => {
        if (window.Culqi) {
            handleScriptLoad()
        }
    }, [])

    // Definir la función global window.culqi UNA SOLA VEZ al montar
    useEffect(() => {
        console.log("🔧 Instalando handler global de Culqi")

        window.culqi = async () => {
            console.log("📣 Callback de Culqi disparado")

            if (window.Culqi.token) {
                try {
                    const token = window.Culqi.token.id
                    const tokenEmail = window.Culqi.token.email
                    console.log('💳 Token generado:', token)

                    // Usar la ref para llamar a la función más reciente
                    if (onTokenRef.current) {
                        await onTokenRef.current(token, tokenEmail)
                    }
                } catch (err) {
                    console.error('Error procesando token:', err)
                    if (onErrorRef.current) onErrorRef.current(err)
                } finally {
                    window.Culqi.close()
                    setIsProcessing(false)
                }
            } else if (window.Culqi.error) {
                console.error('❌ Error Culqi:', window.Culqi.error)
                const userMsg = window.Culqi.error.user_message || "Error en el pago"
                if (onErrorRef.current) onErrorRef.current(new Error(userMsg))
                setIsProcessing(false)
            } else {
                console.log("ℹ️ Cierre modal sin acción")
                if (onErrorRef.current) onErrorRef.current(new Error("Proceso de pago cancelado por el usuario."))
                setIsProcessing(false)
            }
        }

        // Cleanup opcional: En teoría no queremos borrarla para no romper nada si el componente se desmonta mientras el modal está abierto,
        // pero es buena práctica limpiar si el usuario navega fuera totalmente.
        return () => {
            // window.culqi = () => {} 
        }
    }, []) // Dependencias vacías = Se ejecuta 1 sola vez

    const handlePay = async (e: React.MouseEvent) => {
        if (e) e.preventDefault()

        if (!isScriptLoaded || !window.Culqi) {
            console.error("Culqi no está listo (Script no cargado)")
            return
        }

        // Re-asegurar configuración pública antes de abrir
        window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY

        // Validación previa
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

            window.Culqi.open()

            // INICIO VIGILANTE: Detectar si el usuario cierra el modal con la X
            // Culqi a veces no dispara el callback al cerrar, así que vigilamos si el iframe desaparece.
            const checkInterval = setInterval(() => {
                const iframe = document.getElementById('culqi_checkout_frame')
                // Solo si ya pasaron unos segundos y el iframe ya no está...
                if (!iframe && window.Culqi?.close) {
                    // Asumimos que se cerró manual
                    clearInterval(checkInterval)
                    // Pequeño delay para dar chance al callback oficial si existiera
                    setTimeout(() => {
                        setIsProcessing((prev) => {
                            if (prev) {
                                console.log("⚠️ Detectado cierre manual de Culqi por DOM")
                                if (onErrorRef.current) onErrorRef.current(new Error("Proceso de pago cancelado por el usuario."))
                                return false
                            }
                            return prev
                        })
                    }, 1000)
                }
            }, 1000)

            // Limpieza del intervalo si el componente se desmonta
            // (Guardamos el ID en una ref si fuera necesario, pero aquí el closure funciona para esta ejecución)

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

            <style jsx global>{`
                /* Culqi Mobile Fix v2026-ForceUpdate */
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
                
                /* Ensure scrolling works on small screens if content overflows */
                .culqi_checkout_container {
                     overflow-y: auto !important;
                     -webkit-overflow-scrolling: touch !important;
                }
            `}</style>
        </>
    )
}
