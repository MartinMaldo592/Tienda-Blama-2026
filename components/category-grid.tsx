import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

interface Category {
    id: number
    slug: string
    nombre: string
    imagen_url?: string | null
    parent_id?: number | null
    [key: string]: any
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
    if (!categories || categories.length === 0) return null

    const mainCategories = categories.filter(c => !c.parent_id)

    return (
        <section className="py-10 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
                <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF4081] mb-1 block">
                        COLECCIONES 2026
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1819] tracking-tight font-serif">
                        Explora por Categoría
                    </h2>
                </div>
                <Link 
                    href="/productos" 
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#1C1819] flex items-center gap-1 transition-colors"
                >
                    <span>Ver Todo el Catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Ultra-Clean Minimalist Chips Container */}
            <div className="flex flex-wrap gap-3 py-2">
                {mainCategories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/productos?categoria=${cat.slug}`}
                        prefetch={false}
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200/90 text-[#1C1819] hover:bg-[#1C1819] hover:text-white hover:border-[#1C1819] transition-all duration-300 shadow-2xs text-xs font-bold uppercase tracking-wider"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#FF4081] group-hover:text-white transition-colors" />
                        <span>{cat.nombre}</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}
