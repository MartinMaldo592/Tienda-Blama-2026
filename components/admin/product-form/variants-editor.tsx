import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

interface Variant {
    id?: number
    etiqueta: string
    precio: string
    precio_antes: string
    stock: string
    activo: boolean
}

interface VariantsEditorProps {
    variants: Variant[]
    setVariants: React.Dispatch<React.SetStateAction<Variant[]>>
}

export function VariantsEditor({ variants, setVariants }: VariantsEditorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Variantes (talla / color / modelo)</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVariants((prev) => ([...prev, { etiqueta: '', precio: '', precio_antes: '', stock: '0', activo: true }]))}
                >
                    Agregar
                </Button>
            </div>

            {variants.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin variantes</div>
            ) : (
                <div className="space-y-2">
                    {variants.map((v, idx) => (
                        <div key={v.id ?? `vnew-${idx}`} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3">
                            <div className="sm:col-span-4">
                                <Label className="text-xs">Etiqueta</Label>
                                <Input
                                    value={v.etiqueta}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        setVariants((prev) => prev.map((p) => (p === v ? { ...p, etiqueta: val } : p)))
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label className="text-xs">Precio (opcional)</Label>
                                <Input
                                    inputMode="decimal"
                                    value={v.precio}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        setVariants((prev) => prev.map((p) => (p === v ? { ...p, precio: val } : p)))
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label className="text-xs">Precio antes (opcional)</Label>
                                <Input
                                    inputMode="decimal"
                                    value={v.precio_antes}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        setVariants((prev) => prev.map((p) => (p === v ? { ...p, precio_antes: val } : p)))
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label className="text-xs">Stock</Label>
                                <Input
                                    inputMode="numeric"
                                    value={v.stock}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        setVariants((prev) => prev.map((p) => (p === v ? { ...p, stock: val } : p)))
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2 flex items-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setVariants((prev) => prev.map((p) => (p === v ? { ...p, activo: !p.activo } : p)))}
                                >
                                    {v.activo ? 'Activa' : 'Inactiva'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setVariants((prev) => prev.filter((p) => p !== v))}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
