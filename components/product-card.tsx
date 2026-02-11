
"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Image as ImageIcon } from "lucide-react"
import { formatCurrency, slugify } from "@/lib/utils"
import { Database } from "@/types/database.types"
import { useRef } from "react"
import { ProductImageCarousel } from "@/components/product-image-carousel"

type Product = Database['public']['Tables']['productos']['Row']

interface ProductCardProps {
    product: Product
    imagePriority?: boolean
}

export function ProductCard({ product, imagePriority = false }: ProductCardProps) {
    const imageRef = useRef<HTMLDivElement>(null)

    const currentPrice = Number(product.precio ?? 0)
    const beforePrice = Number(product.precio_antes ?? 0)
    const hasSale = Number.isFinite(beforePrice) && beforePrice > 0 && Number.isFinite(currentPrice) && currentPrice > 0 && beforePrice > currentPrice
    const discountPercent = hasSale ? Math.round((1 - currentPrice / beforePrice) * 100) : 0

    const images = (
        (Array.isArray(product.imagenes) ? (product.imagenes as string[]) : [])
            .filter(Boolean)
            .filter((u) => {
                const s = String(u || '').toLowerCase()
                return !(s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v'))
            })
            .slice(0, 10)
    )
    const fallbackImages = images.length > 0 ? images : product.imagen_url ? [product.imagen_url] : []

    const productHref = `/productos/${slugify(product.nombre)}-${product.id}`

    return (
        <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card flex flex-col rounded-xl">
            <Link href={productHref} className="block">
                <div className="aspect-square bg-popover relative overflow-hidden" ref={imageRef}>
                    {fallbackImages.length > 0 ? (
                        <ProductImageCarousel
                            images={fallbackImages}
                            alt={product.nombre}
                            className="group-hover:scale-105 transition-transform duration-300"
                            autoPlay
                            intervalMs={2500}
                            showControls={false}
                            priority={imagePriority}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            quality={70}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="h-10 w-10 opacity-50" />
                        </div>
                    )}
                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {hasSale && (
                        <div className="absolute left-2 top-2 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-md ring-1 ring-white/30 backdrop-blur">
                                -{discountPercent}%
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <Link href={productHref} className="hover:underline">
                        <h4 className="font-medium text-sm line-clamp-2 leading-tight mb-1 text-foreground">{product.nombre}</h4>
                    </Link>
                </div>
                <div className="mt-1" data-nosnippet>
                    <div className="flex items-baseline gap-2">
                        <p className="text-lg font-extrabold text-primary tracking-tight">{formatCurrency(currentPrice)}</p>
                        {hasSale && (
                            <div className="flex items-baseline gap-2">
                                <p className="text-sm text-muted-foreground line-through">{formatCurrency(beforePrice)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
