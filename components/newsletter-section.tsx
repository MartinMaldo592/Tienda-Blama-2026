"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewsletterSection() {
    return (
        <section className="py-16 px-4 my-10 bg-primary text-primary-foreground rounded-3xl mx-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 container mx-auto text-center max-w-2xl">
                <h3 className="text-3xl font-bold mb-4">Únete al Club Premium</h3>
                <p className="text-primary-foreground/80 mb-8">
                    Recibe ofertas exclusivas, acceso anticipado a liquidaciones y un cupón de 10% en tu primera compra.
                </p>

                <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        placeholder="tu@email.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-offset-0"
                    />
                    <Button variant="secondary" className="font-bold">
                        Suscribirme
                    </Button>
                </form>
                <p className="text-xs mt-4 text-primary-foreground/60">
                    No enviamos spam, solo ofertas reales.
                </p>
            </div>
        </section>
    )
}
