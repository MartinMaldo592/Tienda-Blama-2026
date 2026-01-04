"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ProductosPage() {
    const [productos, setProductos] = useState<any[]>([])
    const [categorias, setCategorias] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const { addItem, items, updateQuantity } = useCartStore()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)

        // Fetch products
        const { data: productosData } = await supabase
            .from('productos')
            .select('*')
            .order('nombre', { ascending: true })

        // Fetch categories
        const { data: categoriasData } = await supabase
            .from('categorias')
            .select('*')
            .order('nombre', { ascending: true })

        if (productosData) setProductos(productosData)
        if (categoriasData) setCategorias(categoriasData)

        setLoading(false)
    }

    // Filter products
    const filteredProducts = productos.filter(producto => {
        const matchesCategory = selectedCategory === "all" || producto.categoria_id?.toString() === selectedCategory
        const matchesSearch = producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const getItemQuantity = (productId: number) => {
        const item = items.find(i => i.id === productId)
        return item?.quantity || 0
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-sidebar to-sidebar-primary text-sidebar-primary-foreground py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Catálogo</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explora nuestra selección de productos. Agrega al carrito y realiza tu pedido por WhatsApp.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar productos..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={selectedCategory === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory("all")}
                            >
                                Todos
                            </Button>
                            {categorias.map(cat => (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.id.toString() ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(cat.id.toString())}
                                >
                                    {cat.nombre}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Cargando productos...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No se encontraron productos.</p>
                        {searchQuery && (
                            <Button variant="link" onClick={() => setSearchQuery("")}>
                                Limpiar búsqueda
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((producto) => {
                            const quantity = getItemQuantity(producto.id)

                            return (
                                <div key={producto.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden group hover:shadow-lg transition-all">
                                    {/* Image */}
                                    <div className="aspect-square bg-popover relative overflow-hidden">
                                        {producto.imagen_url ? (
                                            <img
                                                src={producto.imagen_url}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                Sin imagen
                                            </div>
                                        )}
                                        {producto.stock <= 0 && (
                                            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                                                <span className="text-sidebar-primary-foreground font-bold">Agotado</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{producto.nombre}</h3>
                                        <p className="text-xl font-bold text-primary mb-3">${producto.precio.toFixed(2)}</p>

                                        {producto.stock > 0 ? (
                                            quantity === 0 ? (
                                                <Button
                                                    className="w-full gap-2"
                                                    onClick={() => addItem(producto)}
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    Agregar
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-between bg-popover rounded-lg p-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(producto.id, quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="font-bold">{quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(producto.id, quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        ) : (
                                            <Button disabled className="w-full">
                                                Sin Stock
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
