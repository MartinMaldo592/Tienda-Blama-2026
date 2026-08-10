"use client"

import Link from "next/link"
import Image from "next/image"
import { Flame, Sparkles } from "lucide-react"
import { formatCurrency, slugify } from "@/lib/utils"
import { Database } from "@/types/database.types"
import { useEffect, useState } from "react"
import { cloudinaryLoader } from "@/lib/cloudinary"

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

    const [isHovered, setIsHovered] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md"
        >
            


            {/* --- IMAGE SECTION --- */}
            <Link href={productHref} prefetch={false} className="relative block w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                    {fallbackImages.length > 0 ? (
                        <>
                            {imageLoading && (
                                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse z-20 flex items-center justify-center">
                                    <div className="absolute inset-0 shimmer opacity-60" />
                                </div>
                            )}
                            <Image
                                src={fallbackImages[0]}
                                alt={product.nombre}
                                fill
                                loader={cloudinaryLoader}
                                className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                priority={imagePriority}
                                sizes="(max-width: 640px) 40vw, (max-width: 1200px) 33vw, 20vw"
                                quality={75}
                                onLoad={() => setImageLoading(false)}
                                ref={(img) => {
                                    if (img && img.complete && imageLoading) {
                                        setImageLoading(false);
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            Sin imagen
                        </div>
                    )}
                </div>
            </Link>

            {/* --- CONTENT --- */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Badge */}
                {product.categoria_id === 4 || product.nombre.toLowerCase().includes("kit") ? (
                    <div className="bg-gradient-to-r from-[#FF6FA7] to-[#FF85B3] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit mb-2.5 shadow-xs">
                        <Sparkles size={12} className="text-white" fill="currentColor" />
                        KIT AHORRO 💖
                    </div>
                ) : (
                    <div className="bg-[#FF6FA7] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit mb-2.5 shadow-xs">
                        <Flame size={12} className="text-white" fill="currentColor" />
                        COLECCIÓN BLAMA
                    </div>
                )}
                <Link href={productHref} prefetch={false} className="mb-2 block">
                    <h3 className="text-[17px] font-black text-[#2D2D2D] leading-tight line-clamp-2 h-[42px] overflow-hidden hover:text-[#FF6FA7] transition-colors">
                        {product.nombre}
                    </h3>
                </Link>

                <div className="mt-auto pt-2">
                    {/* Price Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-3xl font-black text-[#FF6FA7] tracking-tight">
                            {formatCurrency(currentPrice)}
                        </span>
                        
                        {hasSale && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400 line-through font-medium">
                                    {formatCurrency(beforePrice)}
                                </span>
                                <div className="h-6 px-2 rounded-full bg-[#FFE6EF] border border-[#FFD4E2] text-[#FF6FA7] flex items-center justify-center text-[10px] font-bold">
                                    -{discountPercent}%
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
