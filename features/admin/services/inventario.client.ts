import { createClient } from "@/lib/supabase.client"

export type InventoryItem = {
    producto_id: number
    variante_id: number | null
    nombre: string
    stock: number
    precio: number
}

export async function fetchAdminInventory(): Promise<InventoryItem[]> {
    const supabase = createClient()
    const { data: products, error } = await supabase
        .from("productos")
        .select(`
            id, nombre, stock, precio,
            producto_variantes (
                id, etiqueta, stock, precio
            )
        `)
        .order("nombre")

    if (error) throw new Error(error.message)
    if (!products) return []

    const flat: InventoryItem[] = []
    for (const p of products) {
        const variants = Array.isArray((p as any).producto_variantes) ? (p as any).producto_variantes : []
        if (variants.length > 0) {
            for (const v of variants) {
                flat.push({
                    producto_id: p.id,
                    variante_id: v.id,
                    nombre: `${p.nombre} - ${v.etiqueta}`,
                    stock: v.stock,
                    precio: v.precio || p.precio
                })
            }
        } else {
            flat.push({
                producto_id: p.id,
                variante_id: null,
                nombre: p.nombre,
                stock: p.stock,
                precio: p.precio
            })
        }
    }
    return flat
}
