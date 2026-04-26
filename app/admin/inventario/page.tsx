import { createClient } from "@/lib/supabase.server"
import { getSupabaseEnv } from "@/features/admin/services/admin.server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftRight, PackageOpen, History } from "lucide-react"
import { AjusteStockModal } from "@/components/admin/inventario/ajuste-stock-modal"

export const dynamic = "force-dynamic"

async function fetchInventory() {
    const supabase = await createClient()
    const { url, service } = getSupabaseEnv()
    if (!url || !service) return []
    const supabaseAdmin = createAdminClient(url, service)

    // Fetch products and their variants
    const { data: products, error } = await supabaseAdmin
        .from("productos")
        .select(`
            id, nombre, stock, precio,
            producto_variantes (
                id, etiqueta, stock, precio
            )
        `)
        .order("nombre")

    if (error) {
        console.error("Error fetching inventory:", error)
        return []
    }

    return products || []
}

export default async function InventarioPage() {
    const products = await fetchInventory()

    let totalProducts = 0
    let lowStockCount = 0
    let outOfStockCount = 0

    const flattenedInventory: any[] = []

    for (const p of products) {
        const variants = Array.isArray(p.producto_variantes) ? p.producto_variantes : []
        if (variants.length > 0) {
            for (const v of variants) {
                totalProducts++
                if (v.stock <= 0) outOfStockCount++
                else if (v.stock <= 5) lowStockCount++

                flattenedInventory.push({
                    producto_id: p.id,
                    variante_id: v.id,
                    nombre: `${p.nombre} - ${v.etiqueta}`,
                    stock: v.stock,
                    precio: v.precio || p.precio
                })
            }
        } else {
            totalProducts++
            if (p.stock <= 0) outOfStockCount++
            else if (p.stock <= 5) lowStockCount++

            flattenedInventory.push({
                producto_id: p.id,
                variante_id: null,
                nombre: p.nombre,
                stock: p.stock,
                precio: p.precio
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
                    <p className="text-muted-foreground">Gestiona el stock actual de tus productos y variantes.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/admin/inventario/movimientos">
                            <History className="w-4 h-4 mr-2" />
                            Ver Kardex
                        </Link>
                    </Button>
                    <AjusteStockModal items={flattenedInventory} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total de Ítems</CardTitle>
                        <PackageOpen className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-amber-600">Stock Bajo (≤ 5)</CardTitle>
                        <ArrowLeftRight className="w-4 h-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-red-600">Sin Stock o Negativo</CardTitle>
                        <PackageOpen className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Niveles de Stock Actual</CardTitle>
                    <CardDescription>El stock mostrado aquí es un cálculo exacto basado en el Kardex.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto / Variante</TableHead>
                                <TableHead className="text-right">Stock Actual</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flattenedInventory.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.nombre}</TableCell>
                                    <TableCell className="text-right font-bold text-lg">{item.stock}</TableCell>
                                    <TableCell>
                                        {item.stock > 5 ? (
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600">Adecuado</Badge>
                                        ) : item.stock > 0 ? (
                                            <Badge variant="outline" className="text-amber-500 border-amber-500">Stock Bajo</Badge>
                                        ) : (
                                            <Badge variant="destructive">Agotado / Negativo</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
