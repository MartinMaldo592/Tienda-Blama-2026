"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCartStore } from "@/features/cart"
import { useCartAnimationStore } from "@/features/cart/cart-animation"
import { useWhatsAppStore } from "@/features/checkout"
import { getProductDetail, getRecommendedProducts } from "@/features/products/services/products.client"
import { sendGTMEvent } from "@/lib/gtm"

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

export function useProductDetail() {
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
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const visibilityAnchorRef = useRef<HTMLDivElement>(null)
    const thumbContainerRef = useRef<HTMLDivElement>(null)

    const { addItem, items, updateQuantity } = useCartStore()
    const { setCustomMessage } = useWhatsAppStore()
    const triggerBump = useCartAnimationStore((s) => s.triggerBump)

    // Sticky Bar Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isAbove = entry.boundingClientRect.top < 650
                setShowStickyBar(!entry.isIntersecting && isAbove)
            },
            {
                threshold: 0,
                rootMargin: '-650px 0px 0px 0px'
            }
        )

        if (visibilityAnchorRef.current) {
            observer.observe(visibilityAnchorRef.current)
        }

        return () => observer.disconnect()
    }, [producto, loading])

    // WhatsApp Custom Message
    useEffect(() => {
        if (producto) {
            const text = `Hola, estoy interesado en el producto *${producto.nombre}*. ¿Me podrían brindar más información?`
            setCustomMessage(encodeURIComponent(text))
        }
        return () => setCustomMessage(null)
    }, [producto?.id, producto?.nombre, setCustomMessage])

    // Added Toast Timeout
    useEffect(() => {
        if (!addedToastOpen) return
        const id = window.setTimeout(() => {
            setAddedToastOpen(false)
        }, 1500)
        return () => window.clearTimeout(id)
    }, [addedToastOpen])

    // Fetch Product Data
    useEffect(() => {
        if (!rawId) return
        fetchProducto()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawId])

    // Fetch Recommendations
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

    useEffect(() => {
        setActiveImageIndex(0)
    }, [images.join('|')])

    useEffect(() => {
        const container = thumbContainerRef.current
        if (!container) return
        const activeThumb = container.children[activeImageIndex] as HTMLElement | undefined
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    }, [activeImageIndex])

    const selectedVariante = useMemo(() => {
        if (!selectedVarianteId) return null
        return variantes.find((v: any) => Number(v.id) === Number(selectedVarianteId)) || null
    }, [selectedVarianteId, variantes])

    const effectiveStock = useMemo(() => {
        return selectedVariante ? Number((selectedVariante as any).stock ?? 0) : Number(producto?.stock || 0)
    }, [selectedVariante, producto])

    const inStock = effectiveStock > 0
    const isLowStock = inStock && effectiveStock <= 5

    const currentPrice = useMemo(() => {
        return Number(selectedVariante?.precio ?? producto?.precio ?? 0)
    }, [selectedVariante, producto])

    const beforePrice = useMemo(() => {
        return Number(selectedVariante?.precio_antes ?? producto?.precio_antes ?? 0)
    }, [selectedVariante, producto])

    const hasSale = useMemo(() => {
        return (
            Number.isFinite(beforePrice) &&
            beforePrice > 0 &&
            Number.isFinite(currentPrice) &&
            currentPrice > 0 &&
            beforePrice > currentPrice
        )
    }, [beforePrice, currentPrice])

    const discountPercent = hasSale ? Math.round((1 - currentPrice / beforePrice) * 100) : 0

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

    const scrollRecoBy = (delta: number) => {
        const el = recoRef.current
        if (!el) return
        el.scrollBy({ left: delta, behavior: "smooth" })
    }

    const quantity = useMemo(() => {
        if (!producto?.id) return 0
        const pid = Number(producto.id)
        const vid = selectedVarianteId ?? null
        const found = items.find((it: any) => it.id === pid && ((it as any).producto_variante_id ?? null) === vid)
        return found?.quantity || 0
    }, [items, producto?.id, selectedVarianteId])

    const handleAddToCart = () => {
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
    }

    const handleBeginCheckout = () => {
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
    }

    return {
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
        selectedVarianteIdVal: selectedVarianteId ?? null,
        
        images,
        videos,
        activeVideo,
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
    }
}
