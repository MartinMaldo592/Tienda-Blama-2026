import Link from "next/link"
import { ArrowRight, LayoutGrid, Tag } from "lucide-react"

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

    // Ensure robust filtering on the client side as well
    const mainCategories = categories.filter(c => !c.parent_id)

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">Explora por Categoría</h3>
                </div>
            </div>

            {/* Modern "Chips" / "Pills" Layout - Horizontal Scroll */}
            <div className="flex overflow-x-auto gap-4 py-4 -mx-4 px-4 snap-x">
                {mainCategories.map((cat, i) => (
                    <Link
                        key={cat.id}
                        href={`/productos?cat=${cat.id}`}
                        className="group shrink-0 relative flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 snap-start"
                    >
                        <Tag className="w-4 h-4 text-gray-400 group-hover:text-white/90 transition-colors" />
                        <span className="text-sm font-bold tracking-wide whitespace-nowrap">{cat.nombre}</span>

                        {/* Optional: New badge for first items if desired */}
                        {i < 2 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    )
}
