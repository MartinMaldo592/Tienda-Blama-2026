
"use client"

import Link from "next/link"
import { Flame, Zap, Eye } from "lucide-react"
import { formatCurrency, slugify } from "@/lib/utils"
import { Database } from "@/types/database.types"
import { useEffect, useState } from "react"
import { ProductImageCarousel } from "@/components/product-image-carousel"

type Product = Database['public']['Tables']['productos']['Row']

interface ProductCardProps {
    product: Product
    imagePriority?: boolean
}

export function ProductCard({ product, imagePriority = false }: ProductCardProps) {
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

    // Countdown logic
    const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 })

    useEffect(() => {
        // Randomize start time slightly to avoid all cards looking identical on refresh
        const randomMinutes = Math.floor(Math.random() * 15) + 5
        setTimeLeft({ m: randomMinutes, s: 59 })

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 }
                if (prev.m > 0) return { m: prev.m - 1, s: 59 }
                return { m: 0, s: 0 }
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block h-full">
            {/* --- HEADER: LO MÁS VENDIDO --- */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 animate-bounce shadow-lg">
                    <Flame size={12} fill="white" /> ¡LO MÁS VENDIDO!
                </div>
            </div>

            {/* --- IMAGE CAROUSEL --- */}
            <Link href={productHref} className="block w-full">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                    {fallbackImages.length > 0 ? (
                        <ProductImageCarousel
                            images={fallbackImages}
                            alt={product.nombre}
                            className="w-full h-full"
                            autoPlay
                            intervalMs={3000}
                            showControls={false}
                            priority={imagePriority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={90}
                            imageFit="contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No imagen
                        </div>
                    )}
                </div>
            </Link>

            {/* --- CONTENT --- */}
            <div className="p-4 flex flex-col gap-3">
                {/* Título del producto (Ocupa todo el ancho) */}
                <Link href={productHref} className="block w-full">
                    <h3 className="text-base font-black text-gray-900 leading-tight hover:text-red-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                        {product.nombre}
                    </h3>
                </Link>

                {/* Precios (Debajo del título para evitar colisiones) */}
                <div className="flex items-end gap-2">
                    <p className="text-2xl font-black text-red-600 leading-none">
                        {formatCurrency(currentPrice)}
                    </p>
                    {hasSale && (
                        <p className="text-xs text-gray-400 line-through font-medium mb-1">
                            {formatCurrency(beforePrice)}
                        </p>
                    )}
                    {hasSale && (
                        <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* --- COUNTDOWN --- */}
                <div className="bg-red-50 p-2 rounded-xl border border-red-100 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Oferta expira en:</p>
                        <div className="flex gap-1 font-mono text-lg font-black text-red-600 leading-none">
                            <span>{timeLeft.m < 10 ? `0${timeLeft.m}` : timeLeft.m}</span>
                            <span>:</span>
                            <span>{timeLeft.s < 10 ? `0${timeLeft.s}` : timeLeft.s}</span>
                        </div>
                    </div>
                </div>

                {/* --- BUTTON --- */}
                <Link href={productHref} className="w-full">
                    <button className="w-full bg-red-600 text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-200 active:scale-95 transition-all hover:bg-red-700 uppercase tracking-wide">
                        <Eye size={16} fill="white" />
                        VER PRODUCTO
                    </button>
                </Link>
            </div>
        </div>
    )
}

