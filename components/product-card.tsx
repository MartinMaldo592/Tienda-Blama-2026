"use client"

import Link from "next/link"
import { Flame } from "lucide-react"
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

    const slug = (product as any).slug
    const productHref = slug
        ? `/productos/${slug}`
        : `/productos/${slugify(product.nombre)}-${product.id}`

    // Countdown logic
    const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 })

    useEffect(() => {
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
        <div className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
            
            {/* --- BADGE --- */}
            <div className="absolute top-4 left-4 z-20">
                <div className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Flame size={12} className="text-white" fill="currentColor" />
                    ¡LO MÁS VENDIDO!
                </div>
            </div>

            {/* --- IMAGE SECTION --- */}
            <Link href={productHref} className="relative block w-full aspect-[4/5] bg-slate-100 overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                    {fallbackImages.length > 0 ? (
                        <ProductImageCarousel
                            images={fallbackImages}
                            alt={product.nombre}
                            className="w-full h-full object-cover"
                            autoPlay
                            intervalMs={4000}
                            showControls={false}
                            priority={imagePriority}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={90}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            Sin imagen
                        </div>
                    )}
                </div>
            </Link>

            {/* --- CONTENT --- */}
            <div className="p-5 flex flex-col flex-grow">
                <Link href={productHref} className="mb-2 block">
                    <h3 className="text-[17px] font-black text-slate-900 leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.nombre}
                    </h3>
                </Link>

                <div className="mt-auto space-y-4">
                    {/* Price Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-3xl font-black text-[#1e3a8a] tracking-tight">
                            {formatCurrency(currentPrice)}
                        </span>
                        
                        {hasSale && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400 line-through font-medium">
                                    {formatCurrency(beforePrice)}
                                </span>
                                <div className="h-6 w-6 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center text-[10px] font-bold">
                                    -{discountPercent}%
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timer Box */}
                    {hasSale && (
                        <div className="flex items-center justify-between bg-[#f4f8fe] border border-[#e2e8f0] rounded-2xl p-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Oferta</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Expira en :</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#1e3a8a] font-black text-xl tracking-wider">
                                <span>{timeLeft.m < 10 ? `0${timeLeft.m}` : timeLeft.m}</span>
                                <span className="animate-pulse">:</span>
                                <span>{timeLeft.s < 10 ? `0${timeLeft.s}` : timeLeft.s}</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
