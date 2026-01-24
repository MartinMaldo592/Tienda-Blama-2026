"use client"

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

function parseProductId(raw: string) {
    const direct = Number(raw)
    if (Number.isFinite(direct) && direct > 0) return direct
    const match = String(raw).match(/(\d+)(?:\D*)$/)
    if (match && match[1]) return Number(match[1])
    return 0
}

export default function ProductoDetalleClient() {
    const params = useParams()
    const router = useRouter()
    const rawId = params.id as string

    const numericId = useMemo(() => parseProductId(rawId), [rawId])
    const startAnimation = useCartAnimationStore((s) => s.startAnimation)

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
    const [activeTab, setActiveTab] = useState<'description' | 'details' | 'specs' | 'reviews' | 'questions'>('description')
    const [showVideo, setShowVideo] = useState(false)

    const { addItem, items, updateQuantity } = useCartStore()

    useEffect(() => {
        if (!addedToastOpen) return
        const id = window.setTimeout(() => {
            setAddedToastOpen(false)
        }, 1600)
        return () => window.clearTimeout(id)
    }, [addedToastOpen])

    const quantity = useMemo(() => {
        const vid = selectedVarianteId ?? null
        const found = items.find((it: any) => it.id === numericId && ((it as any).producto_variante_id ?? null) === vid)
        return found?.quantity || 0
    }, [items, numericId, selectedVarianteId])

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

        if (!numericId) {
            setProducto(null)
            setLoading(false)
            return
        }

        const { producto, variantes, especificaciones } = await getProductDetail(numericId)
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
        return <div className="p-10 text-center text-muted-foreground">Cargando producto...</div>
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
        <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-0">
            <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" className="gap-2" asChild>
                    <Link href="/productos">
                        <ArrowLeft className="h-4 w-4" /> Volver a productos
                    </Link>
                </Button>

                <div className="relative">
                    <Button type="button" variant="outline" className="gap-2" onClick={handleShareNative}>
                        <Share2 className="h-4 w-4" /> Compartir
                    </Button>

                    {shareOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-card shadow-lg p-2 z-20">
                            <button
                                type="button"
                                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-popover text-foreground"
                                onClick={() => {
                                    setShareOpen(false)
                                    handleShareWhatsApp()
                                }}
                            >
                                <Send className="h-4 w-4" /> WhatsApp
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-popover text-foreground"
                                onClick={() => {
                                    handleCopyLink()
                                }}
                            >
                                <Copy className="h-4 w-4" /> {copied ? "Link copiado" : "Copiar link"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-sm text-muted-foreground">
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
                        <div className="aspect-square bg-popover relative group" ref={imageContainerRef}>
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
                                        <ProductImageCarousel images={images} alt={producto.nombre} />
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

                <div className="space-y-4">
                    <Card className="shadow-sm border">
                        <CardContent className="p-6 space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex items-center">
                                        {(() => {
                                            const rating = Number(producto.calificacion ?? 5)
                                            const fullStars = Math.floor(rating)
                                            const hasHalfStar = rating % 1 >= 0.4
                                            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

                                            return (
                                                <>
                                                    {Array.from({ length: fullStars }).map((_, i) => (
                                                        <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    ))}
                                                    {hasHalfStar && <StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" />}
                                                    {Array.from({ length: emptyStars }).map((_, i) => (
                                                        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />
                                                    ))}
                                                    <span className="text-sm font-semibold text-muted-foreground ml-2">{rating.toFixed(1)}</span>
                                                </>
                                            )
                                        })()}
                                    </div>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{producto.nombre}</h1>
                                <div className="text-sm text-muted-foreground">
                                    {producto.categorias?.nombre ? (
                                        <span>Categoría: {producto.categorias.nombre}</span>
                                    ) : (
                                        <span>Categoría: —</span>
                                    )}
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

                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Precio</div>
                                    <div className="flex items-end gap-3 flex-wrap">
                                        <div className="text-3xl font-extrabold text-primary tracking-tight">
                                            {formatCurrency(currentPrice)}
                                        </div>
                                        {hasSale && (
                                            <div className="flex items-center gap-2">
                                                <div className="text-base text-muted-foreground line-through">
                                                    {formatCurrency(beforePrice)}
                                                </div>
                                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-md ring-1 ring-white/30">
                                                    -{discountPercent}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Stock</div>
                                    <div className={`text-sm font-semibold ${inStock ? "text-green-700" : "text-red-700"}`}>
                                        {inStock ? `${effectiveStock} disponibles` : "Sin stock"}
                                    </div>
                                </div>
                            </div>

                            {isLowStock && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                                    <span className="font-semibold">Quedan {effectiveStock} unidades</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Truck className="h-4 w-4 text-foreground" />
                                    <span>Entrega gratuita en 24h solo Lima Metropolitana</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CreditCard className="h-4 w-4 text-foreground" />
                                    <span>Pago contraentrega / Pagas al recibir tu pedido</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <RefreshCw className="h-4 w-4 text-foreground" />
                                    <span>Cambios y devoluciones</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-foreground" />
                                    <span>Compra segura</span>
                                </div>
                            </div>

                            {inStock ? (
                                quantity === 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Button
                                            className="w-full gap-2 h-11"
                                            variant="secondary"
                                            onClick={() => {
                                                addItem(producto, selectedVariante)
                                                router.push("/checkout")
                                            }}
                                        >
                                            Comprar ahora
                                        </Button>
                                        <Button className="w-full gap-2 h-11" onClick={() => {
                                            addItem(producto, selectedVariante)
                                            if (imageContainerRef.current && images.length > 0) {
                                                const rect = imageContainerRef.current.getBoundingClientRect()
                                                startAnimation(images[0], rect)
                                            }
                                            setAddedToastKey(Date.now())
                                            setAddedToastOpen(true)
                                        }}>
                                            <ShoppingCart className="h-4 w-4" /> Agregar al carrito
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
                                <Button className="w-full h-11" variant="secondary" onClick={() => router.push("/checkout")}>
                                    Comprar ahora
                                </Button>
                            )}

                            <div className="pt-2 text-xs text-muted-foreground">
                                ID: #{String(producto.id).padStart(6, "0")} • {new Date(producto.created_at).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>

                    {/* TABS SECTION */}
                    <div className="mt-12">
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 select-none p-1 bg-muted/30 rounded-full w-fit mx-auto border">
                            {producto?.descripcion && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('description')}
                                    className={`
                                        relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                        ${activeTab === 'description'
                                            ? 'bg-white text-foreground shadow-sm ring-1 ring-border'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }
                                    `}
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>Descripción</span>
                                </button>
                            )}
                            {(producto?.materiales || producto?.tamano || producto?.color || producto?.cuidados || producto?.uso) && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('details')}
                                    className={`
                                        relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                        ${activeTab === 'details'
                                            ? 'bg-white text-foreground shadow-sm ring-1 ring-border'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }
                                    `}
                                >
                                    <Sparkles className="h-4 w-4" />
                                    <span>Detalles</span>
                                </button>
                            )}

                            {especificaciones.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('specs')}
                                    className={`
                                        relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                        ${activeTab === 'specs'
                                            ? 'bg-white text-foreground shadow-sm ring-1 ring-border'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }
                                    `}
                                >
                                    <Ruler className="h-4 w-4" />
                                    <span>Especificaciones</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setActiveTab('reviews')}
                                className={`
                                    relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                    ${activeTab === 'reviews'
                                        ? 'bg-white text-foreground shadow-sm ring-1 ring-border'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                `}
                            >
                                <Star className="h-4 w-4" />
                                <span>Valoraciones</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('questions')}
                                className={`
                                    relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                    ${activeTab === 'questions'
                                        ? 'bg-white text-foreground shadow-sm ring-1 ring-border'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                `}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>Preguntas</span>
                            </button>
                        </div>

                        <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === 'description' && producto?.descripcion && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="bg-card border rounded-2xl p-8 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Sparkles className="w-32 h-32 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                            <span className="p-2 bg-primary/10 rounded-lg">
                                                <FileText className="h-5 w-5" />
                                            </span>
                                            Descripción del Producto
                                        </h3>
                                        <div className="prose prose-sm md:prose-base text-muted-foreground whitespace-pre-line leading-relaxed max-w-none">
                                            {producto.descripcion}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {producto?.materiales && (
                                            <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow duration-300 flex gap-4 items-start group">
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Shield className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">Materiales</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{producto.materiales}</p>
                                                </div>
                                            </div>
                                        )}

                                        {producto?.tamano && (
                                            <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow duration-300 flex gap-4 items-start group">
                                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Ruler className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">Medidas</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{producto.tamano}</p>
                                                </div>
                                            </div>
                                        )}

                                        {producto?.color && (
                                            <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow duration-300 flex gap-4 items-start group">
                                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Palette className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">Color</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{producto.color}</p>
                                                </div>
                                            </div>
                                        )}

                                        {producto?.cuidados && (
                                            <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow duration-300 flex gap-4 items-start group">
                                                <div className="p-3 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Droplets className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">Cuidados</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{producto.cuidados}</p>
                                                </div>
                                            </div>
                                        )}

                                        {producto?.uso && (
                                            <div className="md:col-span-2 bg-card border rounded-xl p-5 hover:shadow-md transition-shadow duration-300 flex gap-4 items-start group">
                                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Lightbulb className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">Uso Recomendado</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{producto.uso}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specs' && especificaciones.length > 0 && (
                                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                                        <div className="bg-muted/50 p-4 border-b">
                                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                Especificaciones Técnicas
                                            </h3>
                                        </div>
                                        <div className="divide-y">
                                            {especificaciones.map((s: any, idx: number) => (
                                                <div key={s.id} className="p-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
                                                    <div className="text-sm font-semibold text-foreground w-1/3">{String(s.clave || "")}</div>
                                                    <div className="text-sm text-muted-foreground text-right w-2/3 whitespace-pre-line">{String(s.valor || "")}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm p-6 md:p-8">
                                        <ProductSocialProof productId={Number(producto.id)} section="reviews" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'questions' && (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm p-6 md:p-8">
                                        <ProductSocialProof productId={Number(producto.id)} section="questions" />
                                    </div>
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

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                        <div className="text-xs text-muted-foreground">Precio del producto</div>
                        <div className="text-lg font-extrabold text-primary leading-none">{formatCurrency(currentPrice)}</div>
                    </div>
                    <Button
                        className="h-11 flex-1 gap-2"
                        disabled={!inStock}
                        onClick={() => {
                            addItem(producto, selectedVariante)
                            if (imageContainerRef.current && images.length > 0) {
                                const rect = imageContainerRef.current.getBoundingClientRect()
                                startAnimation(images[0], rect)
                            }
                            setAddedToastKey(Date.now())
                            setAddedToastOpen(true)
                        }}
                    >
                        <ShoppingCart className="h-4 w-4" /> Agregar
                    </Button>
                </div>
            </div>

            {addedToastOpen && (
                <div className="md:hidden fixed inset-x-0 bottom-20 z-50 flex justify-center px-4">
                    <div key={addedToastKey} className="w-full max-w-sm rounded-xl border border-border bg-card shadow-lg p-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-foreground leading-snug">Producto añadido al carrito</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
