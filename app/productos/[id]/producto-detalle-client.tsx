"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { useCartStore } from "@/features/cart"
import { useCartAnimationStore } from "@/features/cart/cart-animation"

import { getProductDetail, getRecommendedProducts } from "@/features/products/services/products.client"
import { sendGTMEvent } from "@/lib/gtm"
import {
    ArrowLeft,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    Minus,
    Plus,
    RefreshCw,
    Send,
    ShieldCheck,
    Share2,
    ShoppingCart,
    Truck,
    Star,
    MessageCircle,
    FileText,
    Ruler,
    Palette,
    Droplets,
    Lightbulb,
    Shield,
    Sparkles,
    Image as ImageIcon,
    PlayCircle,
    StarHalf,
} from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { ProductSocialProof } from "@/components/product-social-proof"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import dynamic from "next/dynamic"
const QuickCheckoutModal = dynamic(() => import("@/components/quick-checkout-modal").then(mod => mod.QuickCheckoutModal), {
    ssr: false
})


function parseProductIdentifier(raw: string): string | number {
    const direct = Number(raw)
    if (Number.isFinite(direct) && direct > 0) return direct

    // Legacy Support: URLs que terminan en -ID ("zapato-123")
    const match = String(raw).match(/-(\d+)$/)
    if (match && match[1]) {
        return Number(match[1])
    }

    // New Support: URLs limpias (Slug puro)
    return raw
}

import { useWhatsAppStore } from "@/lib/whatsapp-store"

// ... existing imports

export default function ProductoDetalleClient() {
    const params = useParams()
    const router = useRouter()
    const rawId = params.id as string

    const identifier = useMemo(() => parseProductIdentifier(rawId), [rawId])


    const [loading, setLoading] = useState(true)
    const [producto, setProducto] = useState<any>(null)
    const [variantes, setVariantes] = useState<any[]>([])
    const [especificaciones, setEspecificaciones] = useState<any[]>([])
    const [selectedVarianteId, setSelectedVarianteId] = useState<number | null>(null)
    const [recoLoading, setRecoLoading] = useState(false)
    const [recomendados, setRecomendados] = useState<any[]>([])
    const recoRef = useRef<HTMLDivElement | null>(null)
    const imageContainerRef = useRef<HTMLDivElement | null>(null)

    const [shareOpen, setShareOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [addedToastOpen, setAddedToastOpen] = useState(false)
    const [addedToastKey, setAddedToastKey] = useState(0)
    const [showVideo, setShowVideo] = useState(false)
    const [quickBuyOpen, setQuickBuyOpen] = useState(false)
    const [showStickyBar, setShowStickyBar] = useState(false)
    const visibilityAnchorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Solo activamos la barra cuando el botón principal de compra NO es visible
                setShowStickyBar(!entry.isIntersecting)
            },
            {
                threshold: 0,
                rootMargin: '-80px 0px 0px 0px' // Margen para que aparezca un poco antes de perder de vista el botón
            }
        )

        if (visibilityAnchorRef.current) {
            observer.observe(visibilityAnchorRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const { addItem, items, updateQuantity } = useCartStore()
    const { setCustomMessage } = useWhatsAppStore()
    const triggerBump = useCartAnimationStore((s) => s.triggerBump)

    useEffect(() => {
        if (producto) {
            const text = `Hola, estoy interesado en el producto *${producto.nombre}*. ¿Me podrían brindar más información?`
            setCustomMessage(encodeURIComponent(text))
        }
        return () => setCustomMessage(null)
    }, [producto?.id, producto?.nombre, setCustomMessage])




    useEffect(() => {
        if (!addedToastOpen) return
        const id = window.setTimeout(() => {
            setAddedToastOpen(false)
        }, 1500) // Shorter, snappier duration
        return () => window.clearTimeout(id)
    }, [addedToastOpen])

    const quantity = useMemo(() => {
        if (!producto?.id) return 0
        const pid = Number(producto.id)
        const vid = selectedVarianteId ?? null
        const found = items.find((it: any) => it.id === pid && ((it as any).producto_variante_id ?? null) === vid)
        return found?.quantity || 0
    }, [items, producto?.id, selectedVarianteId])

    useEffect(() => {
        if (!rawId) return
        fetchProducto()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawId])

    useEffect(() => {
        if (!producto?.id) return
        fetchRecomendados(Number(producto.id))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [producto?.id])

    async function fetchProducto() {
        setLoading(true)

        if (!identifier) {
            setProducto(null)
            setLoading(false)
            return
        }

        const { producto, variantes, especificaciones } = await getProductDetail(identifier)
        setProducto(producto)

        const vData = Array.isArray(variantes) ? variantes : []
        setVariantes(vData)
        if (vData.length > 0) {
            setSelectedVarianteId((prev) => {
                if (prev != null && vData.some((v: any) => Number(v.id) === Number(prev))) return prev
                return Number(vData[0].id)
            })
        } else {
            setSelectedVarianteId(null)
        }

        const sData = Array.isArray(especificaciones) ? especificaciones : []
        setEspecificaciones(sData)

        setLoading(false)

        // GTM: View Content
        if (producto) {
            sendGTMEvent({
                event: 'view_item',
                ecommerce: {
                    currency: 'PEN',
                    value: Number(producto.precio) || 0,
                    items: [{
                        item_id: String(producto.id),
                        item_name: producto.nombre,
                        price: Number(producto.precio) || 0,
                        quantity: 1
                    }]
                }
            })
        }
    }

    async function fetchRecomendados(excludeId: number) {
        setRecoLoading(true)
        try {
            const recos = await getRecommendedProducts(excludeId)
            setRecomendados(Array.isArray(recos) ? recos : [])
        } finally {
            setRecoLoading(false)
        }
    }

    const images = useMemo(() => {
        const arr = Array.isArray(producto?.imagenes) ? (producto.imagenes as string[]) : []
        const clean = (arr || [])
            .filter(Boolean)
            .filter((u) => {
                const s = String(u || '').toLowerCase()
                return !(s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v'))
            })
            .slice(0, 10)
        if (clean.length > 0) return clean
        const single = producto?.imagen_url ? String(producto.imagen_url) : ''
        const s = single.toLowerCase()
        if (single && !(s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v'))) return [single]
        return []
    }, [producto])

    const videos = useMemo(() => {
        const arr = Array.isArray(producto?.videos) ? (producto.videos as string[]) : []
        const base = (arr || []).map((x) => String(x || '').trim()).filter(Boolean)

        const fromImages = Array.isArray(producto?.imagenes)
            ? (producto.imagenes as string[])
                .map((x) => String(x || '').trim())
                .filter((u) => {
                    const s = u.toLowerCase()
                    return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v')
                })
            : []

        const fromMain = producto?.imagen_url
            ? (() => {
                const u = String(producto.imagen_url || '').trim()
                const s = u.toLowerCase()
                return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v') ? [u] : []
            })()
            : []

        const merged = [...base, ...fromImages, ...fromMain]
        const unique: string[] = []
        for (const u of merged) {
            if (!u) continue
            if (!unique.includes(u)) unique.push(u)
            if (unique.length >= 6) break
        }
        return unique
    }, [producto])

    const [activeVideo, setActiveVideo] = useState<string | null>(null)

    useEffect(() => {
        setActiveVideo((prev) => {
            if (prev && videos.includes(prev)) return prev
            return videos[0] || null
        })
    }, [videos.join('|')])

    if (loading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto pb-12 md:pb-0 font-sans p-6 animate-in fade-in zoom-in-95 duration-500">
                {/* Back Button Skeleton */}
                <Skeleton className="h-4 w-24 mb-4" />

                {/* Breadcrumbs Skeleton */}
                <div className="flex gap-2 text-sm text-muted-foreground mb-6">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="aspect-square w-full rounded-2xl" />
                        <div className="grid grid-cols-4 gap-2">
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="aspect-square rounded-lg" />
                        </div>
                    </div>

                    {/* Product Details Skeleton */}
                    <div className="space-y-6 md:pl-6">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>

                        <div className="space-y-2 py-4 border-y border-dashed">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="flex items-end gap-3">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border">
                            <div className="flex gap-3 items-center">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!producto) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" className="gap-2" onClick={() => router.push("/productos")}
                >
                    <ArrowLeft className="h-4 w-4" /> Volver
                </Button>
                <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                    <p className="text-lg font-semibold">Producto no encontrado</p>
                    <p className="text-sm text-muted-foreground mt-1">Puede que haya sido eliminado o no exista.</p>
                </div>
            </div>
        )
    }

    const selectedVariante = selectedVarianteId
        ? variantes.find((v: any) => Number(v.id) === Number(selectedVarianteId)) || null
        : null

    const effectiveStock = selectedVariante ? Number((selectedVariante as any).stock ?? 0) : Number(producto.stock || 0)
    const inStock = effectiveStock > 0
    const isLowStock = inStock && effectiveStock <= 5

    const currentPrice = Number(selectedVariante?.precio ?? producto?.precio ?? 0)
    const beforePrice = Number(selectedVariante?.precio_antes ?? producto?.precio_antes ?? 0)
    const hasSale =
        Number.isFinite(beforePrice) &&
        beforePrice > 0 &&
        Number.isFinite(currentPrice) &&
        currentPrice > 0 &&
        beforePrice > currentPrice
    const discountPercent = hasSale ? Math.round((1 - currentPrice / beforePrice) * 100) : 0

    const scrollRecoBy = (delta: number) => {
        const el = recoRef.current
        if (!el) return
        el.scrollBy({ left: delta, behavior: "smooth" })
    }

    const categoryLabel = producto?.categorias?.nombre ? String(producto.categorias.nombre) : "—"
    const categoryId = producto?.categoria_id ? String(producto.categoria_id) : null

    const shareUrl = typeof window !== "undefined" ? window.location.href : ""

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        } catch (err) {
        }
    }

    const handleShareWhatsApp = () => {
        const text = `${String(producto?.nombre || "Producto")}: ${shareUrl}`
        const wa = `https://api.whatsapp.com/send/?text=${encodeURIComponent(text)}`
        window.open(wa, "_blank")
    }

    const handleShareNative = async () => {
        try {
            const nav: any = navigator
            if (nav?.share) {
                await nav.share({
                    title: String(producto?.nombre || "Producto"),
                    text: String(producto?.nombre || "Producto"),
                    url: shareUrl,
                })
                return
            }
        } catch (err) {
        }
        setShareOpen((v) => !v)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 md:pb-0">
            <QuickCheckoutModal
                isOpen={quickBuyOpen}
                onClose={() => setQuickBuyOpen(false)}
                product={producto}
                variant={selectedVariante}
            />
            <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" className="gap-2" asChild>
                    <Link href="/productos">
                        <ArrowLeft className="h-4 w-4" /> Volver a productos
                    </Link>
                </Button>


            </div>

            <div className="hidden sm:block text-sm text-muted-foreground">
                <Link href="/" className="hover:underline">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/productos" className="hover:underline">Productos</Link>
                <span className="mx-2">/</span>
                {categoryId ? (
                    <Link href={`/productos?cat=${encodeURIComponent(categoryId)}`} className="hover:underline">
                        {categoryLabel}
                    </Link>
                ) : (
                    <span>{categoryLabel}</span>
                )}
                <span className="mx-2">/</span>
                <span className="text-foreground font-semibold">{String(producto.nombre)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card className="overflow-hidden shadow-sm border">
                        <div className="aspect-[3/4] bg-popover relative group" ref={imageContainerRef}>
                            {showVideo && activeVideo ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black">
                                    <video
                                        key={activeVideo}
                                        src={activeVideo}
                                        controls
                                        playsInline
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <>
                                    {images.length > 0 ? (
                                        <ProductImageCarousel
                                            images={images}
                                            alt={producto.nombre}
                                            quality={90}
                                            priority={true}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Sin imagen</div>
                                    )}
                                    {!inStock && (
                                        <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                                            <span className="text-sidebar-primary-foreground font-bold">Agotado</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>

                    {showVideo && videos.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {videos.map((v, i) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setActiveVideo(v)}
                                    className={
                                        "rounded-lg border px-3 py-2 text-xs font-semibold transition-colors " +
                                        (activeVideo === v ? "border-primary bg-primary/10" : "border-border hover:bg-popover")
                                    }
                                >
                                    Video {i + 1}
                                </button>
                            ))}
                        </div>
                    )}

                    {videos.length > 0 && (
                        <Button
                            className={`w-full gap-2 h-12 text-base font-bold shadow-md transition-all duration-300 ${showVideo
                                ? "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:scale-[1.01] border-0"
                                }`}
                            onClick={() => setShowVideo(!showVideo)}
                        >
                            {showVideo ? (
                                <>
                                    <ImageIcon className="h-5 w-5" />
                                    Ver Galería de Fotos
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="h-5 w-5 animate-pulse" />
                                    Ver Videos del Producto
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <div className="space-y-4" ref={visibilityAnchorRef}>
                    <Card className="shadow-sm border">
                        <CardContent className="p-6 space-y-3">
                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{producto.nombre}</h1>
                                <div className="flex items-center gap-2 mt-1 mb-4">
                                    <div className="flex items-center">
                                        {(() => {
                                            const rating = Number(producto.calificacion ?? 4.9)
                                            const fullStars = Math.floor(rating)
                                            const hasHalfStar = rating % 1 >= 0.4
                                            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
                                            const reviewCount = Math.floor((Number(producto.id || 1) * 7) % 250) + 18 // Fake robust count

                                            return (
                                                <>
                                                    {Array.from({ length: fullStars }).map((_, i) => (
                                                        <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    ))}
                                                    {hasHalfStar && <StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" />}
                                                    {Array.from({ length: emptyStars }).map((_, i) => (
                                                        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />
                                                    ))}
                                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 ml-2">{rating.toFixed(1)}</span>
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-1 cursor-pointer hover:underline" onClick={() => {
                                                    }}>
                                                        ({reviewCount} Valoraciones)
                                                    </span>
                                                </>
                                            )
                                        })()}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground hidden">
                                    {producto.categorias?.nombre && <span>Categoría: {producto.categorias.nombre}</span>}
                                </div>
                            </div>

                            {variantes.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-semibold text-foreground">Variantes</div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {variantes.map((v: any) => {
                                            const vId = Number(v.id)
                                            const isActive = (selectedVarianteId ?? null) === vId
                                            const vStock = Number(v.stock ?? 0)
                                            return (
                                                <button
                                                    key={vId}
                                                    type="button"
                                                    onClick={() => setSelectedVarianteId(vId)}
                                                    className={
                                                        "rounded-lg border px-3 py-2 text-left transition-colors " +
                                                        (isActive ? "border-primary bg-primary/10" : "border-border hover:bg-popover")
                                                    }
                                                >
                                                    <div className="text-sm font-semibold text-foreground line-clamp-1">
                                                        {String(v.etiqueta || "Variante")}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {vStock > 0 ? `${vStock} disponibles` : "Sin stock"}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-3 bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border shadow-sm">
                                <div className="flex flex-col">
                                    {hasSale && (
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <div className="text-sm font-semibold text-muted-foreground line-through">
                                                {formatCurrency(beforePrice)}
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 ring-1 ring-emerald-300 shadow-sm animate-pulse-hybrid">
                                                🔥 ¡Ahorras {formatCurrency(beforePrice - currentPrice)}!
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">
                                        {formatCurrency(currentPrice)}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium mt-1">Precio final incluido IGV.</div>
                                </div>
                                <div className="text-right pt-1 flex flex-col items-end">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Estado</div>
                                    <div className={`text-xs font-bold px-2.5 py-1 rounded-md border ${inStock ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"}`}>
                                        {inStock ? `${effectiveStock} disp.` : "Sin stock"}
                                    </div>
                                </div>
                            </div>

                            {isLowStock && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                                    <span className="font-semibold">Quedan {effectiveStock} unidades</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-blue-50/70 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30 transition-all hover:scale-[1.02]">
                                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md dark:bg-blue-800/40 dark:text-blue-400">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-300 leading-tight">Envío en 24h a Lima</span>
                                </div>
                                <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30 transition-all hover:scale-[1.02]">
                                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md dark:bg-emerald-800/40 dark:text-emerald-400">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 leading-tight">Pago Contraentrega</span>
                                </div>
                                <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-amber-50/70 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/30 transition-all hover:scale-[1.02]">
                                    <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md dark:bg-amber-800/40 dark:text-amber-400">
                                        <RefreshCw className="h-4 w-4" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 leading-tight">Cambios / Devoluciones</span>
                                </div>
                                <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-purple-50/70 border border-purple-100 dark:bg-purple-900/10 dark:border-purple-800/30 transition-all hover:scale-[1.02]">
                                    <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md dark:bg-purple-800/40 dark:text-purple-400">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-purple-900 dark:text-purple-300 leading-tight">100% Compra Segura</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {inStock ? (
                                    quantity === 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <Button
                                                className="w-full gap-2 h-11 border-2 border-transparent bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-extrabold text-base tracking-wide animate-pulse-hybrid animate-wiggle"
                                                onClick={() => {
                                                    sendGTMEvent({
                                                        event: 'begin_checkout',
                                                        ecommerce: {
                                                            currency: 'PEN',
                                                            value: Number(producto.precio) || 0,
                                                            items: [{
                                                                item_id: String(producto.id),
                                                                item_name: producto.nombre,
                                                                price: Number(producto.precio) || 0,
                                                                quantity: 1
                                                            }]
                                                        }
                                                    })
                                                    setQuickBuyOpen(true)
                                                }}
                                            >
                                                <span className="drop-shadow-sm">REALIZAR PEDIDO</span>
                                                <ChevronRight className="h-5 w-5 animate-pulse" />
                                            </Button>
                                            <Button className="w-full gap-2 h-11" onClick={() => {
                                                addItem(producto, selectedVariante)

                                                // GTM: Add to Cart
                                                sendGTMEvent({
                                                    event: 'add_to_cart',
                                                    ecommerce: {
                                                        currency: 'PEN',
                                                        value: Number(producto.precio) || 0,
                                                        items: [{
                                                            item_id: String(producto.id),
                                                            item_name: producto.nombre,
                                                            price: Number(producto.precio) || 0,
                                                            quantity: 1
                                                        }]
                                                    }
                                                })

                                                triggerBump()
                                                setAddedToastKey(Date.now())
                                                setAddedToastOpen(true)
                                            }}>
                                                <ShoppingCart className={`h-4 w-4 ${addedToastOpen ? 'animate-bounce text-green-500' : ''}`} /> Agregar al carrito
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-full flex items-center justify-between bg-popover rounded-lg p-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10"
                                                onClick={() => updateQuantity(Number(producto.id), quantity - 1, selectedVarianteId ?? null)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <div className="text-center">
                                                <div className="text-xs text-muted-foreground">Cantidad</div>
                                                <div className="text-lg font-bold">{quantity}</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10"
                                                onClick={() => updateQuantity(Number(producto.id), quantity + 1, selectedVarianteId ?? null)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <Button disabled className="w-full h-11">
                                        Sin stock
                                    </Button>
                                )}

                                {inStock && quantity > 0 && (
                                    <Button
                                        className="w-full h-11 border-2 border-transparent bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-extrabold text-base tracking-wide animate-pulse-hybrid animate-wiggle"
                                        onClick={() => {
                                            sendGTMEvent({
                                                event: 'begin_checkout',
                                                ecommerce: {
                                                    currency: 'PEN',
                                                    value: Number(producto.precio) || 0,
                                                    items: [{
                                                        item_id: String(producto.id),
                                                        item_name: producto.nombre,
                                                        price: Number(producto.precio) || 0,
                                                        quantity: 1
                                                    }]
                                                }
                                            })
                                            setQuickBuyOpen(true)
                                        }}
                                    >
                                        <span className="drop-shadow-sm">REALIZAR PEDIDO</span>
                                        <ChevronRight className="h-5 w-5 animate-pulse" />
                                    </Button>
                                )}
                            </div>

                            <div className="relative pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 h-11 border-2 border-muted hover:border-primary hover:text-primary transition-colors"
                                    onClick={handleShareNative}
                                >
                                    <Share2 className="h-4 w-4" />
                                    Compartir este producto
                                </Button>
                                {shareOpen && (
                                    <div className="absolute bottom-full mb-2 left-0 w-full rounded-md border bg-popover p-4 shadow-md animate-in fade-in zoom-in-95 slide-in-from-bottom-2 z-50">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" className="gap-2 w-full" onClick={handleCopyLink}>
                                                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                Copiar
                                            </Button>
                                            <Button variant="outline" className="gap-2 w-full" onClick={handleShareWhatsApp}>
                                                <Send className="h-4 w-4" />
                                                WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* TABS SECTION REPLACED WITH ACCORDION */}
                    <div className="mt-12 mb-10 text-left">
                        <Accordion type="single" collapsible defaultValue="description" className="w-full space-y-4">
                            {/* DESCRIPTION */}
                            {producto?.descripcion && (
                                <AccordionItem value="description" className="bg-card border rounded-2xl px-6 shadow-sm overflow-hidden">
                                    <AccordionTrigger className="text-lg font-bold hover:no-underline py-5 text-primary">
                                        <div className="flex items-center gap-3">
                                            <span className="p-2 bg-primary/10 rounded-lg shrink-0">
                                                <FileText className="h-5 w-5" />
                                            </span>
                                            Descripción del Producto
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="prose prose-sm md:prose-base text-muted-foreground whitespace-pre-line leading-relaxed max-w-none">
                                            {producto.descripcion}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* DETAILS */}
                            {(producto?.materiales || producto?.tamano || producto?.color || producto?.cuidados || producto?.uso) && (
                                <AccordionItem value="details" className="bg-card border rounded-2xl px-6 shadow-sm overflow-hidden">
                                    <AccordionTrigger className="text-lg font-bold hover:no-underline py-5">
                                        <div className="flex items-center gap-3">
                                            <span className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                                                <Sparkles className="h-5 w-5" />
                                            </span>
                                            Detalles
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 items-start">
                                            {producto?.materiales && (
                                                <div className="border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-4 items-start group">
                                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                                        <Shield className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1 text-sm">Materiales</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{producto.materiales}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {producto?.tamano && (
                                                <div className="border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 flex gap-4 items-start group">
                                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                                        <Ruler className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1 text-sm">Medidas</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{producto.tamano}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {producto?.color && (
                                                <div className="border border-purple-100 dark:border-purple-900/30 rounded-xl p-4 flex gap-4 items-start group">
                                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                                        <Palette className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1 text-sm">Color</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{producto.color}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {producto?.cuidados && (
                                                <div className="border border-sky-100 dark:border-sky-900/30 rounded-xl p-4 flex gap-4 items-start group">
                                                    <div className="p-3 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-xl">
                                                        <Droplets className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1 text-sm">Cuidados</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{producto.cuidados}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {producto?.uso && (
                                                <div className="md:col-span-2 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 flex gap-4 items-start group">
                                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                                                        <Lightbulb className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1 text-sm">Uso Recomendado</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{producto.uso}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* SPECS */}
                            {especificaciones.length > 0 && (
                                <AccordionItem value="specs" className="bg-card border rounded-2xl px-6 shadow-sm overflow-hidden">
                                    <AccordionTrigger className="text-lg font-bold hover:no-underline py-5">
                                        <div className="flex items-center gap-3">
                                            <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg shrink-0">
                                                <Ruler className="h-5 w-5" />
                                            </span>
                                            Especificaciones Técnicas
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="rounded-xl border bg-card overflow-hidden mt-2">
                                            <div className="divide-y">
                                                {especificaciones.map((s: any, idx: number) => (
                                                    <div key={s.id} className="p-3 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
                                                        <div className="text-sm font-semibold text-foreground w-1/3">{String(s.clave || "")}</div>
                                                        <div className="text-sm text-muted-foreground text-right w-2/3 whitespace-pre-line">{String(s.valor || "")}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* REVIEWS */}
                            <AccordionItem value="reviews" className="bg-card border rounded-2xl px-6 shadow-sm overflow-hidden">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 rounded-lg shrink-0">
                                            <Star className="h-5 w-5" />
                                        </span>
                                        Valoraciones
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 pt-2">
                                    <ProductSocialProof productId={Number(producto.id)} section="reviews" />
                                </AccordionContent>
                            </AccordionItem>

                            {/* QUESTIONS */}
                            <AccordionItem value="questions" className="bg-card border rounded-2xl px-6 shadow-sm overflow-hidden">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 rounded-lg shrink-0">
                                            <MessageCircle className="h-5 w-5" />
                                        </span>
                                        Preguntas
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 pt-2">
                                    <ProductSocialProof productId={Number(producto.id)} section="questions" />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">Más comprados</h2>
                        <p className="text-sm text-muted-foreground">Productos populares para completar tu compra</p>
                    </div>
                    <Link href="/productos" className="text-sm font-semibold text-primary hover:underline">
                        Ver más
                    </Link>
                </div>

                {recoLoading ? (
                    <div className="relative mt-4">
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="min-w-[220px] max-w-[220px] h-[280px] rounded-xl border bg-card animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : recomendados.length === 0 ? (
                    <div className="mt-4 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                        No hay recomendaciones disponibles en este momento.
                    </div>
                ) : (
                    <div className="relative mt-4">
                        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

                        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 rounded-full shadow-sm"
                                onClick={() => scrollRecoBy(-520)}
                                aria-label="Ver anteriores"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 rounded-full shadow-sm"
                                onClick={() => scrollRecoBy(520)}
                                aria-label="Ver siguientes"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div ref={recoRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
                            {recomendados.map((p) => (
                                <div key={p.id} className="snap-start min-w-[220px] max-w-[220px]">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODERN FLOATING MOBILE BOTTOM BAR - ANIMATED VERSION */}
            <div className={`md:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-500 ease-out ${showStickyBar ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"}`}>
                <div className="bg-white/95 backdrop-blur-md border border-neutral-200 shadow-[0_-8px_40px_rgb(0,0,0,0.12)] rounded-3xl p-2 flex items-center justify-between gap-3">
                    <div className="pl-3 py-1 flex-shrink-0">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1 hidden sm:block">Total Pagar</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1 sm:hidden">Total</div>
                        <div className="text-[19px] font-black text-foreground leading-none tracking-tight">{formatCurrency(currentPrice)}</div>
                    </div>
                    <div className="flex gap-2 flex-1 justify-end">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                            disabled={!inStock}
                            onClick={() => {
                                addItem(producto, selectedVariante)
                                triggerBump()
                                setAddedToastKey(Date.now())
                                setAddedToastOpen(true)
                            }}
                        >
                            <ShoppingCart className="h-[22px] w-[22px]" />
                        </Button>
                        <Button
                            className="h-12 px-6 rounded-2xl border-2 border-transparent bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] font-black text-[15px] tracking-wide transform active:scale-95 transition-all overflow-hidden relative group"
                            disabled={!inStock}
                            onClick={() => {
                                sendGTMEvent({
                                    event: 'begin_checkout',
                                    ecommerce: {
                                        currency: 'PEN',
                                        value: Number(producto.precio) || 0,
                                        items: [{
                                            item_id: String(producto.id),
                                            item_name: producto.nombre,
                                            price: Number(producto.precio) || 0,
                                            quantity: 1
                                        }]
                                    }
                                })
                                setQuickBuyOpen(true)
                            }}
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:animate-shimmer opacity-0 group-hover:opacity-100" style={{ transform: 'skewX(-20deg)' }}></span>
                            PEDIR AHORA
                        </Button>
                    </div>
                </div>
            </div>

            {
                addedToastOpen && (
                    <div className="md:hidden fixed inset-x-0 top-4 z-[70] flex justify-center px-4 pointer-events-none">
                        <div
                            key={addedToastKey}
                            className="w-full max-w-[320px] rounded-2xl border border-green-500/20 bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-3 animate-in fade-in slide-in-from-top-6 zoom-in-95 duration-300 ease-out flex items-center gap-3"
                            style={{ transform: 'translateZ(0)' }}
                        >
                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-foreground text-sm leading-tight">¡Añadido con éxito!</div>
                                <div className="text-[11px] text-muted-foreground">Ya puedes ver tu carrito</div>
                            </div>
                        </div>
                    </div>
                )
            }


        </div>
    )
}
