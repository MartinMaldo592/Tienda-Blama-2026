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
            <section className="py-16 px-4 my-10 bg-primary text-primary-foreground rounded-3xl mx-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 container mx-auto text-center max-w-2xl">
                    <h3 className="text-3xl font-bold mb-4">¡Ya formas parte de la comunidad!</h3>
                    <p className="text-primary-foreground/80 mb-4">
                        Revisa tu correo para ver tu código de descuento del 10% y empezar a comprar.
                    </p>
                    <p className="text-xs text-primary-foreground/60">
                        Gracias por suscribirte a nuestro boletín.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-4 my-10 bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7] text-white rounded-3xl mx-4 overflow-hidden relative shadow-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 container mx-auto text-center max-w-2xl">
                <h3 className="text-3xl font-extrabold mb-3 tracking-tight font-serif lowercase">Únete a la Comunidad BLAMA</h3>
                <p className="text-white/90 mb-8 text-sm sm:text-base font-medium">
                    Recibe lanzamientos de colecciones pilates & gym, consejos de bienestar y un cupón de 10% de descuento en tu primera compra. ♡
                </p>

                <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico"
                        disabled={isLoading}
                        className="bg-white/20 border-white/40 text-white placeholder:text-white/80 focus-visible:ring-offset-0 rounded-full h-11"
                    />
                    <Button variant="secondary" className="font-extrabold rounded-full h-11 px-8 bg-white text-[#2D2D2D] hover:bg-[#FFE6EF]" disabled={isLoading}>
                        {isLoading ? "Suscribiendo..." : "Unirme Ahora"}
                    </Button>
                </form>
                <p className="text-xs mt-4 text-white/75 font-semibold">
                    Únete a más de 5,000 mujeres activas en Perú.
                </p>
            </div>
        </section>
    )
}

