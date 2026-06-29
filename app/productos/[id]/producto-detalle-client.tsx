"use client"

import { useState, useMemo, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { useProductDetail } from "@/features/products/hooks/useProductDetail"
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
    Share,
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

const QuickCheckoutModal = dynamic(() => import("@/features/checkout/components/quick-checkout-modal").then(mod => mod.QuickCheckoutModal), {
    ssr: false
})

interface ProductoDetalleClientProps {
    initialProduct?: any
    initialVariants?: any[]
    initialSpecs?: any[]
}

export default function ProductoDetalleClient({
    initialProduct,
    initialVariants = [],
    initialSpecs = [],
}: ProductoDetalleClientProps) {
    const {
        router,
        loading,
        producto,
        variantes,
        especificaciones,
        selectedVarianteId,
        setSelectedVarianteId,
        recoLoading,
        recomendados,
        recoRef,
        imageContainerRef,
        shareOpen,
        setShareOpen,
        copied,
        addedToastOpen,
        addedToastKey,
        showVideo,
        setShowVideo,
        quickBuyOpen,
        setQuickBuyOpen,
        showStickyBar,
        activeImageIndex,
        setActiveImageIndex,
        visibilityAnchorRef,
        thumbContainerRef,
        quantity,
        updateQuantity,
        
        images,
        videos,
        videoGroups,
        activeVideo,
        activeVideoGroup,
        setActiveVideo,
        selectedVariante,
        effectiveStock,
        inStock,
        isLowStock,
        currentPrice,
        beforePrice,
        hasSale,
        discountPercent,
        categoryLabel,
        categoryId,
        shareUrl,
        handleCopyLink,
        handleShareWhatsApp,
        handleShareNative,
        scrollRecoBy,
        handleAddToCart,
        handleBeginCheckout
    } = useProductDetail(initialProduct, initialVariants, initialSpecs)

    const [activeTab, setActiveTab] = useState<string>("")

    useEffect(() => {
        // Preload checkout modal chunk in the background 1.5s after mount to make checkout instant
        const timer = setTimeout(() => {
            import("@/features/checkout/components/quick-checkout-modal")
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    const tabList = useMemo(() => {
        return [
            { id: "description", label: "Descripción", icon: FileText, show: !!producto?.descripcion },
            { id: "details", label: "Detalles", icon: Sparkles, show: !!(producto?.materiales || producto?.tamano || producto?.color || producto?.cuidados || producto?.uso) },
            { id: "specs", label: "Especificaciones", icon: Ruler, show: especificaciones.length > 0 },
            { id: "reviews", label: "Valoraciones", icon: Star, show: true },
            { id: "questions", label: "Preguntas", icon: MessageCircle, show: true },
        ].filter(t => t.show)
    }, [producto, especificaciones])

    const currentActiveTab = activeTab || tabList[0]?.id || ""

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
                        <Skeleton className="aspect-[3/4] w-full -mx-4 sm:mx-0 rounded-none sm:rounded-2xl" />
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

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 md:pb-0 px-4 sm:px-6">
            <QuickCheckoutModal
                isOpen={quickBuyOpen}
                onClose={() => setQuickBuyOpen(false)}
                product={producto}
                variant={selectedVariante}
                initialQuantity={quantity > 0 ? quantity : 1}
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
                    <Card className="overflow-hidden shadow-sm border -mx-4 sm:mx-0 rounded-none sm:rounded-xl border-x-0 sm:border">
                        <div className="aspect-[3/4] bg-popover relative group" ref={imageContainerRef}>
                            {showVideo && activeVideoGroup ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black">
                                    <video
                                        key={activeVideoGroup.id}
                                        controls
                                        autoPlay
                                        loop
                                        playsInline
                                        className="w-full h-full object-contain"
                                    >
                                        {activeVideoGroup.sources.map((s) => (
                                            <source key={s.src} src={s.src} type={s.type} />
                                        ))}
                                        Tu navegador no soporta la reproducción de video.
                                    </video>
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
                                            selectedIndex={activeImageIndex}
                                            onIndexChange={setActiveImageIndex}
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

                    {videos.length > 0 && (
                        <Button
                            className={`w-full gap-2 h-10 text-sm font-bold shadow-md transition-all duration-300 ${showVideo
                                ? "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:scale-[1.01] border-0"
                                }`}
                            onClick={() => {
                                setShowVideo(!showVideo)
                                setTimeout(() => {
                                    imageContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                                }, 50)
                            }}
                        >
                            {showVideo ? (
                                <>
                                    <span className="animate-bounce">👉</span>
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Ver imágenes del Producto</span>
                                    <span className="animate-bounce">👈</span>
                                </>
                            ) : (
                                <>
                                    <span className="animate-bounce">👉</span>
                                    <PlayCircle className="h-4 w-4 animate-pulse" />
                                    <span>Ver Videos del Producto</span>
                                    <span className="animate-bounce">👈</span>
                                </>
                            )}
                        </Button>
                    )}

                    {/* Thumbnail Preview Strip — Razor Bill style */}
                    {!showVideo && images.length > 1 && (
                        <div
                            ref={thumbContainerRef}
                            className="flex gap-2.5 overflow-x-auto md:overflow-x-visible md:flex-wrap scrollbar-hide py-2 px-0.5 snap-x snap-mandatory"
                        >
                            {images.map((src, i) => (
                                <button
                                    key={src}
                                    type="button"
                                    aria-label={`Ver imagen ${i + 1}`}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`relative shrink-0 w-[22.5%] aspect-square md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start active:scale-95 ${
                                        activeImageIndex === i
                                            ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.03]'
                                            : 'border-transparent opacity-60 hover:opacity-90 hover:border-border'
                                    }`}
                                >
                                    <Image
                                        src={src}
                                        alt={`Miniatura ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 25vw, 96px"
                                        quality={60}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {showVideo && videoGroups.length > 1 && (
                        <div
                            className="flex gap-2.5 overflow-x-auto md:overflow-x-visible md:flex-wrap scrollbar-hide py-2 px-0.5 snap-x snap-mandatory"
                        >
                            {videoGroups.map((vg, i) => (
                                <button
                                    key={vg.id}
                                    type="button"
                                    aria-label={`Ver video ${i + 1}`}
                                    onClick={() => setActiveVideo(vg.id)}
                                    className={`relative shrink-0 w-[22.5%] aspect-square md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start active:scale-95 ${
                                        activeVideoGroup?.id === vg.id
                                            ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.03]'
                                            : 'border-transparent opacity-60 hover:opacity-90 hover:border-border'
                                    }`}
                                >
                                    <video
                                        className="w-full h-full object-cover bg-black"
                                        preload="metadata"
                                        muted
                                        playsInline
                                    >
                                        {vg.sources.map((s) => (
                                            <source key={s.src} src={s.src} type={s.type} />
                                        ))}
                                    </video>
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <PlayCircle className="h-7 w-7 text-white drop-shadow-md" />
                                    </div>
                                    <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                        Video {i + 1}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div ref={visibilityAnchorRef} className="h-px w-full pointer-events-none opacity-0" aria-hidden="true" />
                    <div className="space-y-6">
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

                            <div className="py-5 border-y border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {formatCurrency(currentPrice)}
                                        </span>
                                        {hasSale && (
                                            <>
                                                <span className="text-lg font-semibold text-muted-foreground line-through">
                                                    {formatCurrency(beforePrice)}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                    -{discountPercent}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">Precio final incluido IGV.</div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estado:</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${inStock ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                                        <span className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                                        {inStock ? `${effectiveStock} disponibles` : "Agotado"}
                                    </span>
                                </div>
                            </div>

                            {isLowStock && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                                    <span className="font-semibold">Quedan {effectiveStock} unidades</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 py-4 border-b border-dashed border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold leading-tight">Recibe el mismo día en Lima</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold leading-tight">Contraentrega en todo el Perú</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                        <RefreshCw className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold leading-tight">Envíos a todo el país</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold leading-tight">100% Compra Segura</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {inStock ? (
                                    quantity === 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <Button
                                                className="w-full gap-2 h-11 border-2 border-transparent bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-extrabold text-base tracking-wide animate-pulse-hybrid animate-wiggle"
                                                onClick={handleBeginCheckout}
                                            >
                                                <span className="drop-shadow-sm">REALIZAR PEDIDO</span>
                                                <ChevronRight className="h-5 w-5 animate-pulse" />
                                            </Button>
                                            <Button className="w-full gap-2 h-11" onClick={handleAddToCart}>
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
                                            {quantity < 5 ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10"
                                                    onClick={() => updateQuantity(Number(producto.id), quantity + 1, selectedVarianteId ?? null)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <div className="w-10 h-10" />
                                            )}
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
                                        onClick={handleBeginCheckout}
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
                                    <Share className="h-4 w-4" />
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

                    </div>

                    {/* TABS SECTION */}
                    <div className="mt-12 mb-10 text-left">
                        {/* Tab Headers - Premium Segmented Control Capsule */}
                        <div className="bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-1.5 flex gap-1 overflow-x-auto md:overflow-x-visible md:flex-wrap scrollbar-hide backdrop-blur-md">
                            {tabList.map((tab) => {
                                const Icon = tab.icon
                                const isActive = tab.id === currentActiveTab
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 ${
                                            isActive
                                                ? "bg-white dark:bg-slate-800 text-primary shadow-sm scale-[1.02]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/20"
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? "scale-110 text-primary" : "text-muted-foreground"}`} />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Tab Content Box - Premium Card */}
                        <div className="mt-6 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.015)] min-h-[150px]">
                            {currentActiveTab === "description" && producto?.descripcion && (
                                <div className="prose prose-neutral dark:prose-invert leading-relaxed max-w-none text-[15px] sm:text-base animate-in fade-in slide-in-from-bottom-2 duration-300 whitespace-pre-line text-muted-foreground">
                                    {producto.descripcion}
                                </div>
                            )}

                            {currentActiveTab === "details" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {producto?.materiales && (
                                        <div className="bg-white/40 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-400/20 transition-all duration-300 rounded-2xl p-5 flex gap-4 items-start group">
                                            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs tracking-wider uppercase">Materiales</h4>
                                                <p className="text-[14px] text-muted-foreground leading-relaxed">{producto.materiales}</p>
                                            </div>
                                        </div>
                                    )}

                                    {producto?.tamano && (
                                        <div className="bg-white/40 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:border-emerald-500/20 dark:hover:border-emerald-400/20 transition-all duration-300 rounded-2xl p-5 flex gap-4 items-start group">
                                            <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                <Ruler className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs tracking-wider uppercase">Medidas</h4>
                                                <p className="text-[14px] text-muted-foreground leading-relaxed">{producto.tamano}</p>
                                            </div>
                                        </div>
                                    )}

                                    {producto?.color && (
                                        <div className="bg-white/40 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:border-purple-500/20 dark:hover:border-purple-400/20 transition-all duration-300 rounded-2xl p-5 flex gap-4 items-start group">
                                            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                <Palette className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs tracking-wider uppercase">Color</h4>
                                                <p className="text-[14px] text-muted-foreground leading-relaxed">{producto.color}</p>
                                            </div>
                                        </div>
                                    )}

                                    {producto?.cuidados && (
                                        <div className="bg-white/40 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:border-cyan-500/20 dark:hover:border-cyan-400/20 transition-all duration-300 rounded-2xl p-5 flex gap-4 items-start group">
                                            <div className="p-3 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-400 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                <Droplets className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs tracking-wider uppercase">Cuidados</h4>
                                                <p className="text-[14px] text-muted-foreground leading-relaxed">{producto.cuidados}</p>
                                            </div>
                                        </div>
                                    )}

                                    {producto?.uso && (
                                        <div className="md:col-span-2 bg-white/40 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:border-amber-500/20 dark:hover:border-amber-400/20 transition-all duration-300 rounded-2xl p-5 flex gap-4 items-start group">
                                            <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                <Lightbulb className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs tracking-wider uppercase">Uso Recomendado</h4>
                                                <p className="text-[14px] text-muted-foreground leading-relaxed">{producto.uso}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentActiveTab === "specs" && especificaciones.length > 0 && (
                                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/20 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                        {especificaciones.map((s: any) => (
                                            <div key={s.id} className="p-4 flex items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-200">
                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 w-1/3 tracking-wide">{String(s.clave || "")}</div>
                                                <div className="text-sm text-muted-foreground text-right w-2/3 font-medium">{String(s.valor || "")}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentActiveTab === "reviews" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <ProductSocialProof productId={Number(producto.id)} section="reviews" />
                                </div>
                            )}

                            {currentActiveTab === "questions" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <ProductSocialProof productId={Number(producto.id)} section="questions" />
                                </div>
                            )}
                        </div>
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
            <div className={`md:hidden fixed bottom-4 left-4 right-[84px] z-40 transition-all duration-500 ease-out ${showStickyBar ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"}`}>
                <div className="bg-white/95 backdrop-blur-md border border-neutral-200 shadow-[0_-8px_40px_rgb(0,0,0,0.12)] rounded-3xl p-2 flex items-center justify-between gap-2">
                    <div className="pl-2 py-1 flex-shrink-0">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1 hidden sm:block">Total Pagar</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1 sm:hidden">Total</div>
                        <div className="text-[19px] font-black text-foreground leading-none tracking-tight">{formatCurrency(currentPrice)}</div>
                    </div>
                    <div className="flex gap-1.5 flex-1 justify-end">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                            disabled={!inStock || quantity >= 5}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-[22px] w-[22px]" />
                        </Button>
                        <Button
                            className="h-12 px-4 sm:px-6 rounded-2xl border-2 border-transparent bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] font-black text-[15px] tracking-wide transform active:scale-95 transition-all overflow-hidden relative group"
                            disabled={!inStock}
                            onClick={handleBeginCheckout}
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
