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

export function useProductDetail(
    initialProduct?: any,
    initialVariants: any[] = [],
    initialSpecs: any[] = []
) {
    const params = useParams()
    const router = useRouter()
    const rawId = params.id as string

    const identifier = useMemo(() => parseProductIdentifier(rawId), [rawId])

    const [producto, setProducto] = useState<any>(initialProduct || null)
    const [variantes, setVariantes] = useState<any[]>(initialVariants)
    const [especificaciones, setEspecificaciones] = useState<any[]>(initialSpecs)
    const [loading, setLoading] = useState(!initialProduct)
    const [selectedVarianteId, setSelectedVarianteId] = useState<number | null>(() => {
        const vData = initialVariants || []
        return vData.length > 0 ? Number(vData[0].id) : null
    })
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
    const [showStickyBar] = useState(true)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const visibilityAnchorRef = useRef<HTMLDivElement>(null)
    const thumbContainerRef = useRef<HTMLDivElement>(null)

    const { addItem, items, updateQuantity } = useCartStore()
    const { setCustomMessage } = useWhatsAppStore()
    const triggerBump = useCartAnimationStore((s) => s.triggerBump)

    // Dispatch event on Sticky Bar visibility change
    useEffect(() => {
        if (typeof window !== "undefined") {
            const event = new CustomEvent("sticky-bar-change", { detail: showStickyBar })
            window.dispatchEvent(event)
        }
    }, [showStickyBar])

    // WhatsApp Custom Message
    useEffect(() => {
        if (producto) {
            const text = `Hola, estoy interesado en el producto *${producto.nombre}*. ¿Me podrían brindar más información?`
            setCustomMessage(encodeURIComponent(text))
        }
        return () => setCustomMessage(null)
    }, [producto, setCustomMessage])

    // Added Toast Timeout
    useEffect(() => {
        if (!addedToastOpen) return
        const id = window.setTimeout(() => {
            setAddedToastOpen(false)
        }, 1500)
        return () => window.clearTimeout(id)
    }, [addedToastOpen])

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

    // Fetch Product Data
    useEffect(() => {
        if (!rawId) return

        // If we already have the initialProduct and its identifier matches the requested rawId,
        // we don't need to re-fetch. But we DO need to send the GTM view_item event!
        const matchesInitial = initialProduct && (
            String(initialProduct.id) === String(identifier) ||
            String(initialProduct.slug) === String(identifier)
        )

        if (matchesInitial) {
            setLoading(false)
            // Trigger GTM event for the initial product
            if (initialProduct) {
                sendGTMEvent({
                    event: 'view_item',
                    ecommerce: {
                        currency: 'PEN',
                        value: Number(initialProduct.precio) || 0,
                        items: [{
                            item_id: String(initialProduct.id),
                            item_name: initialProduct.nombre,
                            price: Number(initialProduct.precio) || 0,
                            quantity: 1
                        }]
                    }
                })
            }
            return
        }

        fetchProducto()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawId, identifier, initialProduct])

    // Fetch Recommendations
    useEffect(() => {
        if (!producto?.id) return
        fetchRecomendados(Number(producto.id))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [producto?.id])

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

    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
    const [prevProductId, setPrevProductId] = useState<number | null>(null)

    const currentProductId = producto?.id ? Number(producto.id) : null
    if (currentProductId !== prevProductId) {
        setPrevProductId(currentProductId)
        setActiveImageIndex(0)
        setSelectedVideo(null)
    }

    const activeVideo = selectedVideo && videos.includes(selectedVideo) ? selectedVideo : (videos[0] || null)

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
        sendGTMEvent({
            event: 'click_whatsapp',
            whatsapp_type: 'compartir_producto',
            product_id: producto?.id ? String(producto.id) : undefined,
            product_name: producto?.nombre || undefined
        })
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

        if (producto) {
            sendGTMEvent({
                event: 'add_to_cart',
                ecommerce: {
                    currency: 'PEN',
                    value: Number(selectedVariante?.precio ?? producto.precio) || 0,
                    items: [{
                        item_id: String(producto.id),
                        item_name: producto.nombre,
                        price: Number(selectedVariante?.precio ?? producto.precio) || 0,
                        quantity: 1,
                        item_variant: selectedVariante?.etiqueta || undefined
                    }]
                }
            })
        }

        triggerBump()
        setAddedToastKey(Date.now())
        setAddedToastOpen(true)
    }

    const handleBeginCheckout = () => {
        const qtyToSend = quantity > 0 ? quantity : 1
        if (producto) {
            sendGTMEvent({
                event: 'begin_checkout',
                ecommerce: {
                    currency: 'PEN',
                    value: (Number(selectedVariante?.precio ?? producto.precio) || 0) * qtyToSend,
                    items: [{
                        item_id: String(producto.id),
                        item_name: producto.nombre,
                        price: Number(selectedVariante?.precio ?? producto.precio) || 0,
                        quantity: qtyToSend,
                        item_variant: selectedVariante?.etiqueta || undefined
                    }]
                }
            })
        }
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
        setActiveVideo: setSelectedVideo,
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
