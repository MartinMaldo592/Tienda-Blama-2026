import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { ProductFormValues } from "@/features/admin/schemas/product.schema"

interface ProductBasicsProps {
    register: UseFormRegister<ProductFormValues>
    errors: FieldErrors<ProductFormValues>
}

export function ProductBasics({ register, errors }: ProductBasicsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input
                    id="nombre"
                    placeholder="Ej: Zapatillas Nike Air"
                    {...register("nombre")}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (general)</Label>
                <Textarea
                    id="descripcion"
                    placeholder="Descripción completa del producto..."
                    {...register("descripcion")}
                />
                {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
            </div>
        </div>
    )
}
