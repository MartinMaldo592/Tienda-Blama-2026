import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UseFormRegister } from "react-hook-form"
import { ProductFormValues } from "@/features/admin/schemas/product.schema"

interface ProductAttributesProps {
    register: UseFormRegister<ProductFormValues>
}

export function ProductAttributes({ register }: ProductAttributesProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="materiales">Materiales</Label>
                <Textarea id="materiales" {...register("materiales")} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tamano">Tamaño / Medidas</Label>
                <Textarea id="tamano" {...register("tamano")} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Textarea id="color" {...register("color")} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cuidados">Cuidados</Label>
                <Textarea id="cuidados" {...register("cuidados")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="uso">Uso recomendado</Label>
                <Textarea id="uso" {...register("uso")} />
            </div>
        </div>
    )
}
