import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"

import Link from "next/link"
import { slugify } from "@/lib/utils"
import { getHomePageData } from "@/features/products/services/products.server"
import dynamic from "next/dynamic"

const ContactSection = dynamic(() => import("@/components/contact-section").then(mod => mod.ContactSection), {
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-[2.5rem]" />
})
const NewsletterSection = dynamic(() => import("@/components/newsletter-section").then(mod => mod.NewsletterSection), {
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-3xl" />
})
import { HomeScrollReveal } from "@/components/home-scroll-reveal"
import { CategoryGrid } from "@/components/category-grid"
import { MinimalHero } from "@/components/minimal-hero"
import { BenefitsBar } from "@/components/benefits-bar"

const HOME_PRODUCTS_LIMIT = 12

export const metadata: Metadata = {
  title: "BLAMA | Fitness • Pilates • Gym • Lifestyle",
  description:
    "Tu mejor versión, todos los días. ♡ Descubre equipamiento premium de pilates, mats, bandas de glúteos, pesas y accesorios deportivos en Perú.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BLAMA | Fitness • Pilates • Lifestyle",
    description:
      "Equipamiento de pilates, gym y bienestar diseñado para mujeres en Perú. Tu mejor versión, todos los días. ♡",
    url: "/",
    type: "website",
    locale: "es_ES",
    siteName: "BLAMA",
  },
  twitter: {
    card: "summary_large_image",
    title: "BLAMA | Fitness • Pilates • Lifestyle",
    description:
      "Equipamiento premium de pilates y gym para mujeres en Perú. Envíos express a todo el país.",
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

      {/* Hero Banner Gymshark style */}
      <HomeScrollReveal direction="none" delay={0}>
        <section className="p-0 -mt-9">
          <MinimalHero />
        </section>
      </HomeScrollReveal>





      {/* Category Grid */}
      {categories.length > 0 && (
        <HomeScrollReveal direction="up" delay={80}>
          <CategoryGrid categories={categories} />
        </HomeScrollReveal>
      )}

      {/* Lo más vendido */}
      {bestSellers.length > 0 && (
        <HomeScrollReveal direction="up" delay={100}>
          <section className="p-4 px-2" data-nosnippet>
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="text-lg font-bold text-foreground">Lo más pedido hoy</h3>
              </div>
              <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-primary">
                <Link href="/productos">Ver todo</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {bestSellers.slice(0, 6).map((product, idx) => (
                <ProductCard key={`bestseller-${product.id}`} product={product} imagePriority={idx < 4} />
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
                  <h3 className="text-lg font-bold text-foreground">Ofertas Exclusivas</h3>
                </div>
                <span className="text-xs text-muted-foreground ml-3">Descuentos por tiempo limitado en productos seleccionados</span>
              </div>
              <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-primary">
                <Link href="/productos">Ver todo</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {offers.slice(0, 6).map((product, idx) => (
                <ProductCard key={`offer-${product.id}`} product={product} imagePriority={false} />
              ))}
            </div>
          </section>
        </HomeScrollReveal>
      )}



      {/* Newsletter */}
      <HomeScrollReveal direction="up" delay={120}>
        <NewsletterSection />
      </HomeScrollReveal>

      {/* Benefits Bar */}
      <HomeScrollReveal direction="up" delay={130}>
        <BenefitsBar />
      </HomeScrollReveal>

      {/* Contact Section */}
      <HomeScrollReveal direction="up" delay={150}>
        <ContactSection />
      </HomeScrollReveal>
    </main>
  )
}
