"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye, ArrowUpRight } from "lucide-react"
import { formatCurrency, slugify } from "@/lib/utils"
import { Database } from "@/types/database.types"
import { useState } from "react"
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
    const hoverImage = fallbackImages.length > 1 ? fallbackImages[1] : null

    const slug = (product as any).slug
    const productHref = slug
        ? `/productos/${slug}`
        : `/productos/${slugify(product.nombre)}-${product.id}`

    const [imageLoading, setImageLoading] = useState(true)

    const isKit = product.categoria_id === 4 || product.nombre.toLowerCase().includes("kit")

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100/80 shadow-xs hover:shadow-lg transition-all duration-500">
            {/* --- IMAGE SECTION --- */}
            <Link href={productHref} prefetch={false} className="relative block w-full aspect-[4/5] bg-[#F9F7F8] overflow-hidden">
                {/* Secondary image hover effect */}
                <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105">
                    {fallbackImages.length > 0 ? (
                        <>
                            {imageLoading && (
                                <div className="absolute inset-0 bg-slate-100 animate-pulse z-20" />
                            )}
                            <Image
                                src={fallbackImages[0]}
                                alt={product.nombre}
                                fill
                                loader={cloudinaryLoader}
                                className={`object-cover transition-all duration-500 ${hoverImage ? 'group-hover:opacity-0' : ''} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                priority={imagePriority}
                                sizes="(max-width: 640px) 45vw, (max-width: 1200px) 30vw, 20vw"
                                quality={80}
                                onLoad={() => setImageLoading(false)}
                            />
                            {hoverImage && (
                                <Image
                                    src={hoverImage}
                                    alt={`${product.nombre} vista 2`}
                                    fill
                                    loader={cloudinaryLoader}
                                    className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    sizes="(max-width: 640px) 45vw, (max-width: 1200px) 30vw, 20vw"
                                    quality={80}
                                />
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs uppercase tracking-widest font-medium">
                            BLAMA SHOP
                        </div>
                    )}
                </div>

                {/* --- FLOATING BADGES (TOP) --- */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    {isKit ? (
                        <span className="bg-white/90 backdrop-blur-md text-[#1C1819] text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs border border-white/60">
                            ✦ KIT AHORRO
                        </span>
                    ) : hasSale ? (
                        <span className="bg-[#1C1819] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                            -{discountPercent}% OFF
                        </span>
                    ) : (
                        <span className="bg-white/80 backdrop-blur-md text-slate-700 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                            BLAMA
                        </span>
                    )}

                    {isKit && hasSale && (
                        <span className="bg-[#FF4081] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-xs">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* --- HOVER QUICK VIEW BUTTON (BOTTOM OF IMAGE) --- */}
                <div className="absolute bottom-3 left-3 right-3 z-10 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="w-full py-2.5 bg-white/95 backdrop-blur-md text-[#1C1819] hover:bg-[#1C1819] hover:text-white transition-colors rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md">
                        <span>Ver Detalle</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </Link>

            {/* --- CONTENT SECTION --- */}
            <div className="p-4 flex flex-col flex-grow justify-between bg-white">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        {isKit ? "Colección Pilates & Gym" : "Bienestar & Estilo"}
                    </div>
                    <Link href={productHref} prefetch={false} className="block group/title">
                        <h3 className="text-sm md:text-base font-bold text-[#1C1819] leading-snug line-clamp-2 hover:text-[#FF4081] transition-colors">
                            {product.nombre}
                        </h3>
                    </Link>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline gap-2">
                    <span className="text-base md:text-lg font-extrabold text-[#1C1819] tracking-tight">
                        {formatCurrency(currentPrice)}
                    </span>
                    {hasSale && (
                        <span className="text-xs text-slate-400 line-through font-normal">
                            {formatCurrency(beforePrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
