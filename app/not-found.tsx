import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getHomePageData } from "@/features/products/services/products.server"
import { ProductCard } from "@/components/product-card"
import { Home, MoveRight } from "lucide-react"

export default async function NotFound() {
    // Fetch data for recommendations (Best Sellers)
    const { bestSellers } = await getHomePageData({ productsLimit: 4 })
    const recommendations = bestSellers.slice(0, 4)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* 404 Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-9xl font-extrabold text-primary/20 select-none">404</h1>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                        Ups, página no encontrada
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                        Lo sentimos, no pudimos encontrar lo que buscabas. Pudo haber sido eliminada o nunca existió.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Volver al Inicio
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                        <Link href="/productos">
                            Ver Catálogo
                            <MoveRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="container mx-auto px-4 pb-20">
                    <div className="border-t border-border pt-12">
                        <h3 className="text-2xl font-bold text-center mb-8">
                            Quizás te interese
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {recommendations.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
