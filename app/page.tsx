import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { PromoCarousel } from "@/components/promo-carousel"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import { getHomePageData } from "@/features/products/services/products.server"
import { StoreLocation } from "@/components/store-location"

const HOME_PRODUCTS_LIMIT = 12

const FEATURED_QUERY = "%PELUCHE CORDEITO%"

export const metadata: Metadata = {
  title: "Tienda Online Premium",
  description:
    "Blama.shop es una tienda online en Perú con productos seleccionados, compras simples y atención rápida por WhatsApp. Descubre novedades, ofertas y envíos a domicilio.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Blama.shop | Tienda Online Premium",
    description:
      "Compra en Blama.shop: productos seleccionados, ofertas y atención rápida por WhatsApp. Envíos a domicilio y experiencia de compra simple.",
    url: "/",
    type: "website",
    locale: "es_ES",
    siteName: "Blama.shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blama.shop | Tienda Online Premium",
    description:
      "Tienda online en Perú con atención rápida por WhatsApp. Novedades, ofertas y envíos a domicilio.",
  },
}

export const revalidate = 300 // Disable cache for real-time feel (optional, better for dev)

export default async function Home({
  searchParams,
}: {
  searchParams?:
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams:
    | Record<string, string | string[] | undefined>
    | undefined =
    searchParams && typeof (searchParams as any).then === 'function'
      ? await (searchParams as Promise<Record<string, string | string[] | undefined>>)
      : (searchParams as Record<string, string | string[] | undefined> | undefined)

  const rawCat = resolvedSearchParams?.cat
  const selectedCategorySlug = (Array.isArray(rawCat) ? rawCat[0] : rawCat || '').trim()

  const { categories, featuredProduct, products, bestSellers, offers, productsError } = await getHomePageData({
    selectedCategorySlug,
    featuredQuery: FEATURED_QUERY,
    productsLimit: HOME_PRODUCTS_LIMIT,
  })

  if (productsError) {
    console.error("Error fetching products:", productsError)
    return <div className="p-4 text-red-500">Error cargando productos. Revisa tu conexión a Supabase.</div>
  }

  return (
    <main className="pb-20 font-sans">

      <section className="p-4">
        <PromoCarousel />
      </section>

      {featuredProduct?.id ? (
        <section className="p-4 px-2">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 grid gap-5 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                  Destacado
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                  {String(featuredProduct.nombre)}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                  Un detalle premium listo para sorprender: peluche + tulipán infinito + caja de regalo.
                </p>
                <div className="mt-4 grid gap-2 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Presentación lista para regalar
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Ideal para aniversarios y cumpleaños
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Atención inmediata por WhatsApp
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Button asChild className="rounded-xl">
                    <Link href={`/productos/${slugify(String(featuredProduct.nombre))}-${featuredProduct.id}`}>
                      Ver producto
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/productos">Ver más regalos</Link>
                  </Button>
                </div>
              </div>

              <div className="max-w-sm md:max-w-none">
                <ProductCard product={featuredProduct as any} imagePriority />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {bestSellers.length > 0 && (
        <section className="p-4 px-2" data-nosnippet>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-bold text-foreground">Lo más vendido</h3>
            <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {bestSellers.slice(0, 6).map((product, idx) => (
              <ProductCard key={`bestseller-${product.id}`} product={product} imagePriority={idx < 2} />
            ))}
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section className="p-4 px-2" data-nosnippet>
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-foreground">Ofertas</h3>
              <span className="text-xs text-muted-foreground">Aprovecha descuento por tiempo limitado</span>
            </div>
            <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {offers.slice(0, 6).map((product, idx) => (
              <ProductCard key={`offer-${product.id}`} product={product} imagePriority={idx < 1} />
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="p-4 px-2" data-nosnippet>
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-foreground">Novedades</h3>
            <span className="text-xs text-muted-foreground">Últimos productos agregados</span>
          </div>
          <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-primary">
            <Link href="/productos">Ver todo</Link>
          </Button>
        </div>

        {categories && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-2 pb-3">
            <Button
              asChild
              variant={!selectedCategorySlug ? 'secondary' : 'outline'}
              size="sm"
              className="shrink-0"
            >
              <Link href="/">Todos</Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                asChild
                variant={cat.slug === selectedCategorySlug ? 'secondary' : 'outline'}
                size="sm"
                className="shrink-0"
              >
                <Link href={`/?cat=${encodeURIComponent(cat.slug)}`}>{cat.nombre}</Link>
              </Button>
            ))}
          </div>
        )}

        {!products || products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No hay productos disponibles.</p>
            <p className="text-xs mt-2 text-gray-400">Ejecuta el script de seed.sql en Supabase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.slice(0, 12).map((product, idx) => (
              <ProductCard key={product.id} product={product} imagePriority={idx < 2} />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button asChild className="rounded-xl">
            <Link href="/productos">Ver todos los productos</Link>
          </Button>
        </div>
      </section>

      <StoreLocation />
    </main>
  )
}
