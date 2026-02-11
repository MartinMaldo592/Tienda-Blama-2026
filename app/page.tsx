import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { PromoCarousel } from "@/components/promo-carousel"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import { getHomePageData } from "@/features/products/services/products.server"
import { StoreLocation } from "@/components/store-location"
import { HomeScrollReveal } from "@/components/home-scroll-reveal"

const HOME_PRODUCTS_LIMIT = 12

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

export const revalidate = 300

interface HomePageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: HomePageProps) {
  const searchParams = await props.searchParams
  const rawCat = searchParams?.cat
  const selectedCategorySlug = (Array.isArray(rawCat) ? rawCat[0] : rawCat || '').trim()

  const { categories, products, bestSellers, offers, productsError } = await getHomePageData({
    selectedCategorySlug,
    productsLimit: HOME_PRODUCTS_LIMIT,
  })

  if (productsError) {
    console.error("Error fetching products:", productsError)
    return <div className="p-4 text-red-500">Error cargando productos. Revisa tu conexión a Supabase.</div>
  }

  return (
    <main className="pb-20 font-sans">

      {/* Hero Banner */}
      <HomeScrollReveal direction="none" delay={0}>
        <section className="p-4">
          <PromoCarousel />
        </section>
      </HomeScrollReveal>

      {/* Lo más vendido */}
      {bestSellers.length > 0 && (
        <HomeScrollReveal direction="up" delay={100}>
          <section className="p-4 px-2" data-nosnippet>
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="text-lg font-bold text-foreground">Lo más vendido</h3>
              </div>
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
        </HomeScrollReveal>
      )}

      {/* Ofertas */}
      {offers.length > 0 && (
        <HomeScrollReveal direction="up" delay={100}>
          <section className="p-4 px-2" data-nosnippet>
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full" />
                  <h3 className="text-lg font-bold text-foreground">Ofertas</h3>
                </div>
                <span className="text-xs text-muted-foreground ml-3">Aprovecha descuento por tiempo limitado</span>
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
        </HomeScrollReveal>
      )}

      {/* Product Grid */}
      <HomeScrollReveal direction="up" delay={100}>
        <section className="p-4 px-2" data-nosnippet>
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full" />
                <h3 className="text-lg font-bold text-foreground">Novedades</h3>
              </div>
              <span className="text-xs text-muted-foreground ml-3">Últimos productos agregados</span>
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
            <div className="text-center py-20 bg-muted/20 rounded-xl mx-4 border border-dashed">
              <h3 className="text-xl font-semibold text-gray-700">Próximamente tendremos novedades para ti</h3>
              <p className="text-gray-500 mt-2">Estamos actualizando nuestro catálogo.</p>
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
      </HomeScrollReveal>

      {/* Store Location */}
      <HomeScrollReveal direction="up" delay={150}>
        <StoreLocation />
      </HomeScrollReveal>
    </main>
  )
}
