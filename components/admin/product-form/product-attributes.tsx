import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProductAttributesProps {
    materiales: string
    setMateriales: (v: string) => void
    tamano: string
    setTamano: (v: string) => void
    color: string
    setColor: (v: string) => void
    cuidados: string
    setCuidados: (v: string) => void
    uso: string
    setUso: (v: string) => void
}

export function ProductAttributes({
    materiales, setMateriales,
    tamano, setTamano,
    color, setColor,
    cuidados, setCuidados,
    uso, setUso
}: ProductAttributesProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="materiales">Materiales</Label>
                <Textarea id="materiales" value={materiales} onChange={(e) => setMateriales(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tamano">Tamaño / Medidas</Label>
                <Textarea id="tamano" value={tamano} onChange={(e) => setTamano(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Textarea id="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cuidados">Cuidados</Label>
                <Textarea id="cuidados" value={cuidados} onChange={(e) => setCuidados(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="uso">Uso recomendado</Label>
                <Textarea id="uso" value={uso} onChange={(e) => setUso(e.target.value)} />
            </div>
        </div>
    )
}
