import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProductBasicsProps {
    name: string
    setName: (value: string) => void
    descripcion: string
    setDescripcion: (value: string) => void
}

export function ProductBasics({ name, setName, descripcion, setDescripcion }: ProductBasicsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                    id="name"
                    placeholder="Ej: Zapatillas Nike Air"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (general)</Label>
                <Textarea
                    id="descripcion"
                    placeholder="Descripción completa del producto..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>
        </div>
    )
}
