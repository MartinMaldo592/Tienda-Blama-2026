"use client"

import { useState, useEffect } from "react"
import { CheckoutForm } from "@/components/checkout-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCartStore } from "@/features/cart"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function CheckoutSkeleton() {
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6 animate-in fade-in duration-300">
            {/* Back button skeleton */}
            <Skeleton className="h-10 w-44 rounded-lg" />

            {/* Form skeleton */}
            <Card className="shadow-sm border">
                <CardContent className="p-6 space-y-6">
                    {/* Title */}
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />

                    {/* Product rows */}
                    <div className="space-y-4 pt-4 border-t">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-28" />
                    </div>

                    {/* Form fields */}
                    <div className="space-y-4 pt-4 border-t">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-12 rounded-lg" />
                            <Skeleton className="h-12 rounded-lg" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>

                    {/* Submit button */}
                    <Skeleton className="h-14 w-full rounded-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function CheckoutPage() {
    const router = useRouter()
    const [hydrated, setHydrated] = useState(false)

    const items = useCartStore((s) => s.items)
    const total = useCartStore((s) => s.total)
    const clearCart = useCartStore((s) => s.clearCart)

    // Esperar a que Zustand hidrate desde localStorage
    useEffect(() => {
        setHydrated(true)
    }, [])

    // Mientras Zustand no hidrate, mostrar skeleton
    if (!hydrated) {
        return <CheckoutSkeleton />
    }

    if (!items || items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-4 space-y-4 animate-in fade-in duration-300">
                <Button variant="ghost" className="gap-2" asChild>
                    <Link href="/productos">
                        <ArrowLeft className="h-4 w-4" /> Volver a productos
                    </Link>
                </Button>

                <Card className="shadow-sm border">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="text-lg font-bold text-foreground">Tu carrito está vacío</div>
                        <div className="text-sm text-muted-foreground">
                            Agrega productos al carrito para continuar con la compra.
                        </div>
                        <Button asChild className="mt-2">
                            <Link href="/productos">Ver productos</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-4 animate-in fade-in duration-300">
            <CheckoutForm
                items={items}
                total={total}
                onBack={() => router.back()}
                onComplete={() => {
                    clearCart()
                    router.push("/")
                }}
            />
        </div>
    )
}
