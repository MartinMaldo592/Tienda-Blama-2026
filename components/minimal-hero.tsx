import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MinimalHero() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-background mx-4 my-2 border border-border/50 shadow-md">
            {/* Background with animated gradient mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />

            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl dark:bg-purple-900/20 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl dark:bg-blue-900/20" />

            <div className="relative z-10 container mx-auto px-4 py-10 md:py-32 flex flex-col items-center text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold mb-4 border border-primary/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Nueva Colección 2026 Disponible
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1]">
                    Eleva tu estilo <br />
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                        con lo mejor.
                    </span>
                </h1>

                <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl leading-relaxed px-2">
                    Descubre productos seleccionados con calidad premium. Envío gratis en pedidos seleccionados.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
                    <Button asChild size="default" className="w-full sm:w-auto rounded-full px-8 h-10 sm:h-12 text-sm sm:text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                        <Link href="/productos">
                            <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Comprar Ahora
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="default" className="w-full sm:w-auto rounded-full px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold bg-white/50 backdrop-blur-sm border-2 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 dark:text-white transition-all">
                        <Link href="/ofertas">
                            Ver Ofertas <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Decorative Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
        </section>
    )
}
