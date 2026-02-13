import Link from "next/link"
import { ArrowRight } from "lucide-react"

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

    // Limit to 4 for the grid layout on desktop, but show all main categories on mobile
    const desktopCats = mainCategories.slice(0, 4)

    return (
        <section className="py-6 md:py-10 px-4">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Explora por Categoría</h3>

            {/* Mobile View: Horizontal Scroll */}
            <div className="flex md:hidden overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x scrollbar-none">
                {mainCategories.map((cat, i) => (
                    <Link
                        key={cat.id}
                        href={`/productos?cat=${cat.id}`}
                        className="shrink-0 w-32 h-32 relative rounded-xl overflow-hidden snap-start shadow-sm border border-border/50"
                    >
                        {/* Background */}
                        {cat.imagen_url ? (
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${cat.imagen_url})` }}
                            />
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? 'from-slate-700 to-black' : 'from-indigo-900 to-slate-900'}`} />
                        )}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                            <span className="text-white text-sm font-bold leading-tight drop-shadow-md">{cat.nombre}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 h-80">
                {desktopCats.map((cat, i) => (
                    <Link
                        key={cat.id}
                        href={`/productos?cat=${cat.id}`}
                        className={`relative rounded-xl overflow-hidden group cursor-pointer border border-border/50 shadow-md ${i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-1' : ''}`}
                    >
                        {/* Background: Image if available, otherwise gradient */}
                        {cat.imagen_url ? (
                            <div
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: `url(${cat.imagen_url})` }}
                            />
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? 'from-slate-800 to-black' : 'from-blue-900 to-slate-900'} group-hover:scale-105 transition-transform duration-500`} />
                        )}

                        <div className={`absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors ${cat.imagen_url ? 'bg-black/40' : ''}`} />

                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h4 className="text-white font-bold text-lg leading-tight drop-shadow-lg">{cat.nombre}</h4>
                            <span className="text-white/90 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 mt-2 font-medium">
                                Ver productos <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
