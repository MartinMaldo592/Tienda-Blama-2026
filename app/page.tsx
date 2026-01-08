import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { ProductCard } from "@/components/product-card"
import { PromoCarousel } from "@/components/promo-carousel"
import { Database } from "@/types/database.types"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import { CreditCard, Gift, ShieldCheck, Truck, Zap } from "lucide-react"

// Types
type Product = Database['public']['Tables']['productos']['Row']
type Category = Database['public']['Tables']['categorias']['Row']

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

  const { data: categories } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre', { ascending: true })

  const { data: featuredProduct } = await supabase
    .from('productos')
    .select('*')
    .ilike('nombre', FEATURED_QUERY)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const selectedCategory = (categories as Category[] | null)?.find(
    (c) => c.slug === selectedCategorySlug
  )
  
  let productsQuery = supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  productsQuery = productsQuery.limit(HOME_PRODUCTS_LIMIT)

  if (selectedCategory?.id) {
    productsQuery = productsQuery.eq('categoria_id', selectedCategory.id)
  }

  const { data: products, error } = await productsQuery
  let bestSellers: Product[] = []
  let offers: Product[] = []
  try {
    const { data: soldItems, error: soldItemsError } = await supabase
      .from('pedido_items')
      .select(`
        cantidad,
        productos (*),
        pedidos (status)
      `)
      .limit(1000)

    if (!soldItemsError && soldItems && soldItems.length > 0) {
      const soldByProductId = new Map<number, { product: Product; sold: number }>()

      for (const row of soldItems as any[]) {
        const status: string | undefined = row.pedidos?.status
        if (status && ['Fallido', 'Devuelto'].includes(status)) continue

        const product: Product | null | undefined = row.productos
        if (!product) continue

        const productId = product.id
        const qty = Number(row.cantidad) || 0
        if (qty <= 0) continue

        const current = soldByProductId.get(productId)
        if (current) {
          current.sold += qty
        } else {
          soldByProductId.set(productId, { product, sold: qty })
        }
      }

      bestSellers = Array.from(soldByProductId.values())
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
        .map((x) => x.product)
    }
  } catch (err) {
    bestSellers = []
  }

  try {
    const { data: offersRaw, error: offersError } = await supabase
      .from('productos')
      .select('*')
      .not('precio_antes', 'is', null)
      .limit(60)

    if (!offersError && offersRaw && offersRaw.length > 0) {
      offers = (offersRaw as Product[])
        .filter((p) => {
          const before = Number((p as any)?.precio_antes ?? 0)
          const current = Number((p as any)?.precio ?? 0)
          return Number.isFinite(before) && Number.isFinite(current) && before > current && current > 0
        })
        .sort((a, b) => {
          const beforeA = Number((a as any)?.precio_antes ?? 0)
          const currentA = Number((a as any)?.precio ?? 0)
          const beforeB = Number((b as any)?.precio_antes ?? 0)
          const currentB = Number((b as any)?.precio ?? 0)
          const discA = beforeA > 0 ? (beforeA - currentA) / beforeA : 0
          const discB = beforeB > 0 ? (beforeB - currentB) / beforeB : 0
          return discB - discA
        })
        .slice(0, 6)
    }
  } catch (err) {
    offers = []
  }

  if (error) {
    console.error("Error fetching products:", error)
    return <div className="p-4 text-red-500">Error cargando productos. Revisa tu conexión a Supabase.</div>
  }

  return (
    <main className="pb-20 font-sans">

      <section className="px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-foreground to-primary text-primary-foreground shadow-xl">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 50% 90%, rgba(255,255,255,0.2), transparent 55%)" }} />
          <div className="relative p-6 sm:p-8 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur">
                <Zap className="h-4 w-4" />
                Atención rápida por WhatsApp
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight">
                Regalos que enamoran.
                <br />
                Entrega rápida y compra fácil.
              </h1>

              <p className="mt-3 text-sm sm:text-base text-primary-foreground/90 max-w-xl">
                Productos seleccionados, presentación premium y soporte inmediato. Haz tu pedido en minutos y confírmalo por WhatsApp.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Button asChild className="rounded-xl bg-white text-foreground hover:bg-white/90">
                  <Link href={featuredProduct?.id ? `/productos/${slugify(String(featuredProduct.nombre))}-${featuredProduct.id}` : '/productos'}>
                    Comprar el destacado
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10">
                  <Link href="/productos">Ver catálogo</Link>
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Envíos a domicilio
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pago contraentrega / transferencia
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Compra segura
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Presentación lista para regalar
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur">
              <div className="text-sm font-bold">Oferta recomendada</div>
              <div className="mt-1 text-2xl font-extrabold leading-tight">Peluches & flores eternas</div>
              <div className="mt-2 text-sm text-primary-foreground/90">
                Ideal para cumpleaños, aniversarios y sorpresas.
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-black/20 p-4">
                <div>
                  <div className="text-xs text-primary-foreground/80">Respuesta promedio</div>
                  <div className="text-lg font-extrabold">&lt; 5 min</div>
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/80">Garantía</div>
                  <div className="text-lg font-extrabold">Soporte</div>
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/80">Entrega</div>
                  <div className="text-lg font-extrabold">Rápida</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-primary-foreground/85">
                Consejo: agrega un mensaje personalizado en WhatsApp para que lo incluyamos en el regalo.
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {(categories as Category[]).map((cat) => (
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
    </main>
  )
}
