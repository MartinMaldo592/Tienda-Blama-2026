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
          <section className="py-10 px-6 max-w-7xl mx-auto" data-nosnippet>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF4081] mb-1 block">
                  MÁS POPULARES
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1819] tracking-tight font-serif">
                  Lo Más Pedido Hoy
                </h2>
              </div>
              <Link 
                href="/productos" 
                className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#1C1819] transition-colors"
              >
                Ver Todo el Catálogo →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {bestSellers.slice(0, 5).map((product, idx) => (
                <ProductCard key={`bestseller-${product.id}`} product={product} imagePriority={idx < 4} />
              ))}
            </div>
          </section>
        </HomeScrollReveal>
      )}

      {/* Ofertas */}
      {offers.length > 0 && (
        <HomeScrollReveal direction="up" delay={100}>
          <section className="py-10 px-6 max-w-7xl mx-auto" data-nosnippet>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF4081] mb-1 block">
                  EDICIÓN LIMITADA
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1819] tracking-tight font-serif">
                  Ofertas Exclusivas
                </h2>
              </div>
              <Link 
                href="/productos" 
                className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#1C1819] transition-colors"
              >
                Ver Todas las Ofertas →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {offers.slice(0, 5).map((product, idx) => (
                <ProductCard key={`offer-${product.id}`} product={product} imagePriority={false} />
              ))}
            </div>
          </section>
        </HomeScrollReveal>
      )}



      {/* Benefits Bar */}
      <HomeScrollReveal direction="up" delay={120}>
        <BenefitsBar />
      </HomeScrollReveal>

      {/* Contact Section */}
      <HomeScrollReveal direction="up" delay={130}>
        <ContactSection />
      </HomeScrollReveal>
    </main>
  )
}
