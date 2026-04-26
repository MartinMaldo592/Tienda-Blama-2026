import { createClient } from "@/lib/supabase.server"
import { getSupabaseEnv } from "@/features/admin/services/admin.server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

async function fetchMovimientos() {
    const supabase = await createClient()
    const { url, service } = getSupabaseEnv()
    if (!url || !service) return []
    const supabaseAdmin = createAdminClient(url, service)

    const { data: movimientos, error } = await supabaseAdmin
        .from("kardex_valorizado_view")
        .select(`*`)
        .order("created_at", { ascending: false })
        .limit(200)

    if (error) {
        console.error("Error fetching movimientos:", error)
        return []
    }

    return movimientos || []
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}

function getBadgeVariant(tipo: string) {
    if (tipo === 'ENTRADA_COMPRA' || tipo === 'DEVOLUCION') return 'default'
    if (tipo === 'SALIDA_VENTA') return 'secondary'
    if (tipo === 'AJUSTE') return 'outline'
    if (tipo === 'AJUSTE_INICIAL') return 'outline'
    return 'outline'
}

function formatTipo(tipo: string) {
    return tipo.replace('_', ' ')
}

export default async function MovimientosPage() {
    const movimientos = await fetchMovimientos()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/inventario">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kardex Valorizado</h1>
                    <p className="text-muted-foreground">Control detallado de entradas, salidas, saldos y costos.</p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Últimos Movimientos</CardTitle>
                    <CardDescription>Muestra los últimos 200 movimientos con su saldo acumulado y valor.</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Fecha</TableHead>
                                <TableHead className="min-w-[200px]">Producto</TableHead>
                                <TableHead>Concepto</TableHead>
                                <TableHead className="text-right">Costo Unit.</TableHead>
                                <TableHead className="text-center">Entradas</TableHead>
                                <TableHead className="text-center">Salidas</TableHead>
                                <TableHead className="text-center font-bold bg-muted/50">Saldo</TableHead>
                                <TableHead className="text-right font-bold bg-muted/50">Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movimientos.map((mov: any) => {
                                const prodName = mov.producto_nombre || 'Desconocido'
                                const varName = mov.variante_nombre ? ` - ${mov.variante_nombre}` : ''
                                const isPos = mov.cantidad > 0

                                return (
                                    <TableRow key={mov.id}>
                                        <TableCell className="whitespace-nowrap text-xs">
                                            {new Date(mov.created_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                                        </TableCell>
                                        <TableCell className="font-medium text-sm">
                                            {prodName}{varName}
                                            {mov.referencia && <div className="text-xs text-muted-foreground mt-0.5">Ref: {mov.referencia}</div>}
                                            {mov.notas && <div className="text-xs text-muted-foreground mt-0.5">{mov.notas}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(mov.tipo_movimiento) as any} className="whitespace-nowrap text-xs">
                                                {formatTipo(mov.tipo_movimiento)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            {formatCurrency(mov.costo_unitario)}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-emerald-600">
                                            {mov.entradas > 0 ? mov.entradas : '-'}
                                        </TableCell>
                                        <TableCell className="text-center font-medium text-rose-600">
                                            {mov.salidas > 0 ? mov.salidas : '-'}
                                        </TableCell>
                                        <TableCell className="text-center font-bold bg-muted/50">
                                            {mov.saldo_cantidad}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold bg-muted/50 ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {formatCurrency(Math.abs(mov.valor_total))}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {movimientos.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No hay movimientos registrados en el Kardex.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
