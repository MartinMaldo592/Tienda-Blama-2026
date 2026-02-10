import type { Metadata } from "next"
import ProductoDetalleClient from "./producto-detalle-client"
import { fetchProductForMeta } from "@/features/products/services/products.server"
import { slugify } from "@/lib/utils"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blama.shop"

/**
 * Extrae el ID numérico del parámetro de ruta.
 * Soporta rutas con slug: "collar-plata-123" → 123
 * y rutas legacy solo con ID: "123" → 123
 */
function parseProductId(raw: string) {
    const direct = Number(raw)
    if (Number.isFinite(direct) && direct > 0) return direct
    const match = String(raw).match(/(\d+)(?:\D*)$/)
    if (match && match[1]) return Number(match[1])
    return 0
}

/**
 * Genera la URL canónica con slug SEO-friendly
 */
function buildProductUrl(nombre: string, id: number) {
    const slug = slugify(nombre)
    return `${BASE_URL}/productos/${slug}-${id}`
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
            title: "Producto no encontrado",
            description: "El producto que buscas no existe.",
            robots: { index: false }
        }
    }

    const product = await fetchProductForMeta(id) as any
    if (!product) {
        return {
            title: "Producto no encontrado",
            description: "El producto que buscas no existe o ha sido retirado.",
            robots: { index: false }
        }
    }

    const price = Number(product.precio) || 0
    const formattedPrice = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)

    const title = `${String(product.nombre || "Producto")} - ${formattedPrice}`
    const descText = buildDescription(product)
    const description = `${descText} | ${formattedPrice} | Envío gratis Lima | Pago contraentrega`

    const imgs = Array.isArray(product.imagenes) ? (product.imagenes as string[]).filter(Boolean) : []
    const primaryImage = imgs[0] || String(product.imagen_url || "")
    const url = buildProductUrl(String(product.nombre), Number(product.id))

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: String(product.nombre || "Producto"),
            description,
            url,
            siteName: 'Blama.shop',
            locale: 'es_PE',
            type: 'article',
            images: primaryImage
                ? [{
                    url: primaryImage,
                    width: 800,
                    height: 800,
                    alt: String(product.nombre || "Producto de Blama.shop"),
                    type: 'image/webp',
                }]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: String(product.nombre || "Producto"),
            description,
            images: primaryImage ? [primaryImage] : [],
            site: "@blamashop",
        },
        other: {
            "product:price:amount": String(price),
            "product:price:currency": "PEN",
            "product:availability": product.stock > 0 ? "in stock" : "out of stock",
        }
    }
}

export default async function ProductoDetallePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const id = parseProductId(resolvedParams.id)
    const product = await fetchProductForMeta(id) as any

    if (!product) {
        return <ProductoDetalleClient />
    }

    const price = Number(product.precio) || 0
    const images = Array.isArray(product.imagenes)
        ? (product.imagenes as string[]).filter(Boolean)
        : [product.imagen_url || ""].filter(Boolean)
    const url = buildProductUrl(String(product.nombre), Number(product.id))

    // Obtener el nombre de la categoría si está disponible
    const categoryName = (product as any).categorias?.nombre || null

    // JSON-LD Schema.org — Product structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.nombre,
        description: buildDescription(product),
        image: images,
        sku: String(product.id),
        brand: {
            "@type": "Brand",
            name: "Blama.shop"
        },
        ...(categoryName ? { category: categoryName } : {}),
        url,
        offers: {
            "@type": "Offer",
            priceCurrency: "PEN",
            price: price.toFixed(2),
            availability: product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url,
            seller: {
                "@type": "Organization",
                name: "Blama.shop"
            },
            shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                    "@type": "MonetaryAmount",
                    value: "0",
                    currency: "PEN"
                },
                shippingDestination: {
                    "@type": "DefinedRegion",
                    addressCountry: "PE"
                },
                deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: {
                        "@type": "QuantitativeValue",
                        minValue: 0,
                        maxValue: 1,
                        unitCode: "DAY"
                    },
                    transitTime: {
                        "@type": "QuantitativeValue",
                        minValue: 1,
                        maxValue: 3,
                        unitCode: "DAY"
                    }
                }
            }
        }
    }

    // BreadcrumbList JSON-LD for Google rich results
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: BASE_URL
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Productos",
                item: `${BASE_URL}/productos`
            },
            ...(categoryName ? [{
                "@type": "ListItem",
                position: 3,
                name: categoryName,
                item: `${BASE_URL}/productos`
            }] : []),
            {
                "@type": "ListItem",
                position: categoryName ? 4 : 3,
                name: product.nombre,
                item: url
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ProductoDetalleClient />
        </>
    )
}
