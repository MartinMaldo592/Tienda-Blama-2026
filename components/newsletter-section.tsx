"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function NewsletterSection() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const sub = localStorage.getItem("hasSubscribedNewsletter")
            if (sub === "true") {
                setIsSubscribed(true)
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedEmail = email.trim()
        if (!trimmedEmail) {
            toast.error("Por favor ingresa tu correo electrónico.")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: trimmedEmail }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Ocurrió un error al procesar tu suscripción.")
            }

            toast.success(data.message || "¡Suscripción exitosa!")
            localStorage.setItem("hasSubscribedNewsletter", "true")
            setIsSubscribed(true)
        } catch (err: any) {
            console.error("Newsletter subscription error:", err)
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubscribed) {
        return (
            <section className="w-full relative bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7] text-white py-16 px-6 overflow-hidden m-0 border-none">
                <div className="relative z-10 container mx-auto text-center max-w-2xl">
                    <h3 className="text-3xl font-bold mb-3 font-serif">¡Ya formas parte de la comunidad!</h3>
                    <p className="text-white/90 mb-2 font-medium">
                        Revisa tu correo para ver tu código de descuento del 10% y empezar a comprar. ♡
                    </p>
                    <p className="text-xs text-white/70">
                        Gracias por suscribirte a nuestro boletín.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full relative bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7] text-white pt-16 pb-20 px-6 overflow-hidden shadow-none m-0 border-none">
            {/* Glowing background circle */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 container mx-auto text-center max-w-2xl">
                <h3 className="text-3xl md:text-4xl font-black mb-3 tracking-tight font-serif lowercase">
                    Únete a la Comunidad BLAMA
                </h3>
                <p className="text-white/95 mb-8 text-base md:text-lg font-medium leading-relaxed">
                    Recibe lanzamientos de colecciones pilates & gym, consejos de bienestar y un cupón de 10% de descuento en tu primera compra. ♡
                </p>

                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico..."
                        disabled={isLoading}
                        className="bg-white/20 border-white/40 text-white placeholder:text-white/80 focus-visible:ring-offset-0 rounded-full h-12 px-6 text-sm font-medium"
                    />
                    <Button 
                        variant="secondary" 
                        className="font-black rounded-full h-12 px-8 bg-white text-[#2D2D2D] hover:bg-[#FFE6EF] transition-all shadow-md shrink-0 uppercase tracking-wider text-xs" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Suscribiendo..." : "Unirme Ahora"}
                    </Button>
                </form>

                <p className="text-xs mt-4 text-white/80 font-semibold tracking-wide">
                    Únete a más de 5,000 mujeres activas en Perú.
                </p>
            </div>
        </section>
    )
}
