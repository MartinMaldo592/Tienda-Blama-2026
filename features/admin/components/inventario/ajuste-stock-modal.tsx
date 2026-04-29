"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { registrarMovimientoAction } from "@/features/admin/actions/inventario"

type ItemData = {
    producto_id: number
    variante_id: number | null
    nombre: string
}

export function AjusteStockModal({ items }: { items: ItemData[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [selectedItem, setSelectedItem] = useState<string>("")
    const [tipo, setTipo] = useState<"ENTRADA_COMPRA" | "AJUSTE" | "DEVOLUCION" | "TRASLADO">("AJUSTE")
    const [cantidad, setCantidad] = useState<string>("1")
    const [costoUnitario, setCostoUnitario] = useState<string>("0.00")
    const [notas, setNotas] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedItem) {
            toast.error("Selecciona un producto o variante")
            return
        }
        
        const cantNum = parseInt(cantidad, 10)
        if (isNaN(cantNum) || cantNum === 0) {
            toast.error("La cantidad debe ser un número diferente de cero")
            return
        }

        const costoNum = parseFloat(costoUnitario)
        if (isNaN(costoNum) || costoNum < 0) {
            toast.error("El costo unitario debe ser un número válido")
            return
        }

        const [prodIdStr, varIdStr] = selectedItem.split("_")
        const producto_id = parseInt(prodIdStr, 10)
        const variante_id = varIdStr !== "null" ? parseInt(varIdStr, 10) : null

        setLoading(true)
        try {
            const res = await registrarMovimientoAction({
                producto_id,
                variante_id,
                tipo_movimiento: tipo,
                cantidad: cantNum,
                costo_unitario: costoNum,
                notas: notas.trim() || "Ajuste manual de admin",
                referencia: "AJUSTE_MANUAL"
            })

            if (res.ok) {
                toast.success("Movimiento registrado correctamente")
                setOpen(false)
                // Reset form
                setSelectedItem("")
                setCantidad("1")
                setCostoUnitario("0.00")
                setNotas("")
            } else {
                toast.error(res.error || "Error al registrar movimiento")
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Movimiento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                        <DialogDescription>
                            Añade o resta stock manualmente. Esto quedará registrado en el Kardex.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="item">Producto / Variante</Label>
                            <Select value={selectedItem} onValueChange={setSelectedItem} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar ítem..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {items.map((it, i) => (
                                        <SelectItem key={i} value={`${it.producto_id}_${it.variante_id || 'null'}`}>
                                            {it.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tipo">Tipo de Movimiento</Label>
                            <Select value={tipo} onValueChange={(val: any) => setTipo(val)} required>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENTRADA_COMPRA">Entrada por Compra (Proveedor)</SelectItem>
                                    <SelectItem value="DEVOLUCION">Devolución (Entrada)</SelectItem>
                                    <SelectItem value="AJUSTE">Ajuste Manual / Merma (+ o -)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="cantidad">Cantidad (+ / -)</Label>
                                <Input
                                    id="cantidad"
                                    type="number"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="costo">Costo Unitario (S/)</Label>
                                <Input
                                    id="costo"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={costoUnitario}
                                    onChange={(e) => setCostoUnitario(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-2">Usa cantidades negativas para mermas o salidas manuales.</p>
                        <div className="grid gap-2">
                            <Label htmlFor="notas">Notas (Opcional)</Label>
                            <Input
                                id="notas"
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                placeholder="Motivo del ajuste..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Movimiento"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
