import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProductPricingProps {
    price: string
    setPrice: (v: string) => void
    priceBefore: string
    setPriceBefore: (v: string) => void
    stock: string
    setStock: (v: string) => void
    calificacion: string
    setCalificacion: (v: string) => void
}

export function ProductPricing({
    price, setPrice,
    priceBefore, setPriceBefore,
    stock, setStock,
    calificacion, setCalificacion
}: ProductPricingProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="price">Precio actual (S/)</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="priceBefore">Precio antes (S/) (opcional)</Label>
                <Input
                    id="priceBefore"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={priceBefore}
                    onChange={(e) => setPriceBefore(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="stock">Stock (Unidades)</Label>
                <Input
                    id="stock"
                    type="number"
                    required
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="calificacion">Calificación (0-5)</Label>
                <Input
                    id="calificacion"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    placeholder="5.0"
                    value={calificacion}
                    onChange={(e) => setCalificacion(e.target.value)}
                />
            </div>
        </div>
    )
}
