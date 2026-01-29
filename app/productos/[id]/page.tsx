import type { Metadata } from "next"
import ProductoDetalleClient from "./producto-detalle-client"
import { fetchProductForMeta } from "@/features/products/services/products.server"

function parseProductId(raw: string) {
    const direct = Number(raw)
    if (Number.isFinite(direct) && direct > 0) return direct
    const match = String(raw).match(/(\d+)(?:\D*)$/)
    if (match && match[1]) return Number(match[1])
    return 0
}

function buildDescription(p: any) {
    const raw = String(p?.descripcion || "").trim()
    const safe = raw.replace(/\s+/g, " ").slice(0, 160)
    if (safe) return safe
    return "Compra online con entrega rápida y compra segura."
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const resolvedParams = await params
    const id = parseProductId(resolvedParams.id)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blama.shop"

    if (!id) {
        return {
            title: "Producto",
            description: "Detalle de producto",
            robots: { index: false }
        }
    }

    const product = await fetchProductForMeta(id)
    if (!product) {
        return {
            title: "Producto",
            description: "Detalle de producto",
            robots: { index: false }
        }
    }

    const price = Number((product as any).precio) || 0
    const formattedPrice = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)

    const title = `${String((product as any).nombre || "Producto")} - ${formattedPrice}`
    const descText = buildDescription(product)
    const description = `Precio: ${formattedPrice}. ${descText}`

    const imgs = Array.isArray((product as any).imagenes) ? ((product as any).imagenes as string[]).filter(Boolean) : []
    const primaryImage = imgs[0] || String((product as any).imagen_url || "")
    const url = `${baseUrl}/productos/${id}`

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'Blama.shop',
            locale: 'es_PE',
            type: 'website',
            images: primaryImage ? [{ url: primaryImage, width: 800, height: 800, alt: title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: primaryImage ? [primaryImage] : [],
        },
    }
}

export default function ProductoDetallePage() {
    return <ProductoDetalleClient />
}
