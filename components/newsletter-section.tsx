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
        <section className="py-16 px-4 my-10 bg-primary text-primary-foreground rounded-3xl mx-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 container mx-auto text-center max-w-2xl">
                <h3 className="text-3xl font-bold mb-4">Únete a nuestro newsletter</h3>
                <p className="text-primary-foreground/80 mb-8">
                    Recibe ofertas exclusivas, acceso anticipado a liquidaciones y un cupón de 10% en tu primera compra.
                </p>

                <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico"
                        disabled={isLoading}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-offset-0"
                    />
                    <Button variant="secondary" className="font-bold" disabled={isLoading}>
                        {isLoading ? "Suscribiendo..." : "Suscribirme"}
                    </Button>
                </form>
                <p className="text-xs mt-4 text-primary-foreground/60">
                    No enviamos spam, solo ofertas reales.
                </p>
            </div>
        </section>
    )
}

