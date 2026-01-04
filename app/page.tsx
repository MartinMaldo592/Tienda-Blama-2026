import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { ProductCard } from "@/components/product-card"
import { CartButton } from "@/components/cart-button"
import { Database } from "@/types/database.types"

// Types
type Product = Database['public']['Tables']['productos']['Row']

export const revalidate = 0 // Disable cache for real-time feel (optional, better for dev)

export default async function Home() {
  // 1. Fetch products directly from Supabase
  const { data: products, error } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })
  let bestSellers: Product[] = []
  try {
    const { data: soldItems, error: soldItemsError } = await supabase
      .from('pedido_items')
      .select(`
        cantidad,
        productos (*),
        pedidos (status)
      `)

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

  if (error) {
    console.error("Error fetching products:", error)
    return <div className="p-4 text-red-500">Error cargando productos. Revisa tu conexión a Supabase.</div>
  }

  return (
    <main className="pb-20 font-sans">

      {/* Hero Section */}
        <section className="p-4">
        <div className="bg-gradient-to-r from-sidebar to-sidebar-primary rounded-2xl p-6 text-sidebar-primary-foreground shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Nueva Colección 2026</h2>
            <p className="text-muted-foreground text-sm mb-4 max-w-[200px]">Envío gratis contraentrega en toda la ciudad.</p>
            <Button variant="secondary" size="sm" className="font-semibold shadow-lg hover:shadow-xl transition-shadow">
              Ver Ofertas
            </Button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-foreground/10 rounded-full blur-2xl"></div>
        </div>
      </section>

      {bestSellers.length > 0 && (
        <section className="p-4 px-2">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-bold text-foreground">Lo más vendido</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {bestSellers.map((product) => (
              <ProductCard key={`bestseller-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="p-4 px-2">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-bold text-foreground">Populares</h3>
          <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">Ver todo</Button>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No hay productos disponibles.</p>
            <p className="text-xs mt-2 text-gray-400">Ejecuta el script de seed.sql en Supabase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
