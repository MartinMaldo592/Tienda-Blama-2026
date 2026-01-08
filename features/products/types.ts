import type { Database } from "@/types/database.types"

export type Product = Database["public"]["Tables"]["productos"]["Row"]
export type Category = Database["public"]["Tables"]["categorias"]["Row"]
export type ProductVariant = Database["public"]["Tables"]["producto_variantes"]["Row"]
export type ProductSpecification = Database["public"]["Tables"]["producto_especificaciones"]["Row"]

export type ProductCategorySummary = {
    id: number
    nombre: string
    slug: string
}

export type ProductWithCategory = Product & {
    categorias?: ProductCategorySummary | null
}

export type SortValue = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest"
