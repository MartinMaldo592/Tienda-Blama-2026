import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormValues } from "@/features/admin/schemas/product.schema"

interface ProductPricingProps {
    register: UseFormRegister<ProductFormValues>
    errors: FieldErrors<ProductFormValues>
}

export function ProductPricing({ register, errors }: ProductPricingProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="precio">Precio actual (S/)</Label>
                <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("precio")}
                />
                {errors.precio && <p className="text-sm text-red-500">{errors.precio.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="precio_antes">Precio antes (S/) (opcional)</Label>
                <Input
                    id="precio_antes"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("precio_antes")}
                />
                {errors.precio_antes && <p className="text-sm text-red-500">{errors.precio_antes.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="stock">Stock (Unidades)</Label>
                <Input
                    id="stock"
                    type="number"
                    placeholder="10"
                    {...register("stock")}
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="calificacion">Calificación (0-5)</Label>
                <Input
                    id="calificacion"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="5.0"
                    {...register("calificacion")}
                />
                {errors.calificacion && <p className="text-sm text-red-500">{errors.calificacion.message}</p>}
            </div>
        </div>
    )
}
