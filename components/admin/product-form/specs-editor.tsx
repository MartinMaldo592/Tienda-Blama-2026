import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"

interface Spec {
    id?: number
    clave: string
    valor: string
    orden: number
}

interface SpecsEditorProps {
    specs: Spec[]
    setSpecs: React.Dispatch<React.SetStateAction<Spec[]>>
}

export function SpecsEditor({ specs, setSpecs }: SpecsEditorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Ficha técnica (especificaciones)</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSpecs((prev) => ([...prev, { clave: '', valor: '', orden: prev.length }]))}
                >
                    Agregar
                </Button>
            </div>

            {specs.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin especificaciones</div>
            ) : (
                <div className="space-y-2">
                    {specs
                        .slice()
                        .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
                        .map((s, idx) => (
                            <div key={s.id ?? `new-${idx}`} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3">
                                <div className="sm:col-span-4">
                                    <Label className="text-xs">Clave</Label>
                                    <Input
                                        value={s.clave}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setSpecs((prev) => prev.map((p) => (p === s ? { ...p, clave: val } : p)))
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-6">
                                    <Label className="text-xs">Valor</Label>
                                    <Input
                                        value={s.valor}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setSpecs((prev) => prev.map((p) => (p === s ? { ...p, valor: val } : p)))
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-2 flex items-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setSpecs((prev) => prev.map((p) => (p === s ? { ...p, orden: Math.max(0, Number(p.orden || 0) - 1) } : p)))}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setSpecs((prev) => prev.map((p) => (p === s ? { ...p, orden: Number(p.orden || 0) + 1 } : p)))}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setSpecs((prev) => prev.filter((p) => p !== s))}
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
