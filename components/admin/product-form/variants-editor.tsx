import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { Control, UseFormRegister, useFieldArray } from "react-hook-form"
import { ProductFormValues } from "@/features/admin/schemas/product.schema"

interface VariantsEditorProps {
    control: Control<ProductFormValues>
    register: UseFormRegister<ProductFormValues>
}

export function VariantsEditor({ control, register }: VariantsEditorProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variantes"
    })

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Variantes (talla / color / modelo)</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                        etiqueta: '',
                        precio: '',
                        precio_antes: '',
                        stock: '0',
                        activo: true
                    })}
                >
                    Agregar
                </Button>
            </div>

            {fields.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin variantes</div>
            ) : (
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3 items-end">
                            <div className="sm:col-span-3 space-y-1">
                                <Label className="text-xs">Etiqueta</Label>
                                <Input
                                    {...register(`variantes.${index}.etiqueta`)}
                                    placeholder="Ej: Talla M"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                                <Label className="text-xs">Precio (opc)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register(`variantes.${index}.precio`)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                                <Label className="text-xs">Antes (opc)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register(`variantes.${index}.precio_antes`)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                                <Label className="text-xs">Stock</Label>
                                <Input
                                    type="number"
                                    {...register(`variantes.${index}.stock`)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="sm:col-span-3 flex items-center justify-end gap-2 h-[42px] pb-[2px]">
                                <label className="flex items-center gap-2 h-9 border rounded px-3 text-sm cursor-pointer hover:bg-muted select-none bg-background">
                                    <input
                                        type="checkbox"
                                        {...register(`variantes.${index}.activo`)}
                                        className="accent-primary h-4 w-4"
                                    />
                                    <span>Activa</span>
                                </label>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => remove(index)}
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
