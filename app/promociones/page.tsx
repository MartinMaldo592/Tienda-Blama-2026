import { listProducts } from "@/features/products/services/products.server"
import { ProductCard } from "@/components/product-card"
import { Sparkles, Flame, Tag, Percent, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: 'Promociones & Kits Ahorro | Blama Shop',
    description: 'Aprovecha ofertas exclusivas en equipamiento de pilates, resistencia, suplementación femenina y combos ahorro con envío express en Perú.',
}

export const revalidate = 300

export default async function PromocionesPage() {
    let products: any[] = []

    try {
        const data = await listProducts({
            cat: 'all',
            subcat: 'all',
            q: '',
            min: '',
            max: '',
            stock: false,
            page: 1,
            pageSize: 50,
            sort: 'price-asc'
        })
        
        // Filter products that either have a discount or belong to Kits (categoria_id = 4)
        products = (data.productos || []).filter((p: any) => {
            const hasDiscount = Number(p.precio_antes) > Number(p.precio)
            const isKit = p.categoria_id === 4 || (p.nombre && p.nombre.toLowerCase().includes('kit'))
            return hasDiscount || isKit
        })
    } catch (err) {
        console.error("Error loading promo products:", err)
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* --- HERO BANNER --- */}
            <div className="relative pt-16 pb-12 overflow-hidden bg-gradient-to-b from-[#FFF7F9] via-[#FFE6EF]/40 to-[#fafafa]">
                <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-black mb-4 border border-[#FFD4E2] uppercase tracking-wider">
                            <Percent className="w-3.5 h-3.5" />
                            <span>Descuentos & Combos Exclusivos</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] leading-[0.98] tracking-tighter mb-4 font-serif">
                            Ofertas Especiales & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7]">
                                Kits Ahorro BLAMA 💖
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-[#7C6A72] font-medium leading-relaxed max-w-2xl">
                            Ahorra hasta S/ 50 en tus pedidos combinando equipamiento de pilates, resistencia y suplementos femeninos. Envíos express a todo el Perú.
                        </p>
                    </div>
                </div>

                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FFE6EF]/60 to-transparent pointer-events-none" />
            </div>

            {/* --- PRODUCTS GRID SECTION --- */}
            <div className="container mx-auto px-6 pb-20 max-w-7xl">
                {products.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#FFD4E2]/60">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-[#FF6FA7]" />
                                <h2 className="text-xl font-black text-[#2D2D2D] tracking-tight">
                                    {products.length} {products.length === 1 ? 'Oferta Disponible' : 'Ofertas & Kits Disponibles'}
                                </h2>
                            </div>
                            <Link 
                                href="/productos" 
                                className="text-xs font-black text-[#FF6FA7] hover:underline flex items-center gap-1 uppercase tracking-wider"
                            >
                                Ver Todo el Catálogo <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#FFD4E2] p-8">
                        <Tag className="w-12 h-12 text-[#FF6FA7] mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-black text-[#2D2D2D] mb-2 font-serif">¡Próximamente nuevas ofertas!</h3>
                        <p className="text-sm text-[#7C6A72] mb-6">Estamos preparando nuevos Kits y descuentos para tu rutina diaria.</p>
                        <Link 
                            href="/productos" 
                            className="bg-[#FF6FA7] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-wider hover:bg-[#FF85B3] transition-all inline-block shadow-md"
                        >
                            Explorar Catálogo Completo
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
