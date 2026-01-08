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
    if (!id) {
        return {
            title: "Producto",
            description: "Detalle de producto",
        }
    }

    const product = await fetchProductForMeta(id)
    if (!product) {
        return {
            title: "Producto",
            description: "Detalle de producto",
        }
    }

    const title = String((product as any).nombre || "Producto")
    const description = buildDescription(product)
    const imgs = Array.isArray((product as any).imagenes) ? ((product as any).imagenes as string[]).filter(Boolean) : []
    const primaryImage = imgs[0] || String((product as any).imagen_url || "")

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: primaryImage ? [{ url: primaryImage }] : [],
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
