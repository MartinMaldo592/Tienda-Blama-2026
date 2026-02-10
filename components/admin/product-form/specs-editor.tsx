import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"
import { Control, UseFormRegister, useFieldArray } from "react-hook-form"
import { ProductFormValues } from "@/features/admin/schemas/product.schema"

interface SpecsEditorProps {
    control: Control<ProductFormValues>
    register: UseFormRegister<ProductFormValues>
}

export function SpecsEditor({ control, register }: SpecsEditorProps) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "especificaciones"
    })

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Ficha técnica (especificaciones)</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ clave: '', valor: '', orden: fields.length })}
                >
                    Agregar
                </Button>
            </div>

            {fields.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin especificaciones</div>
            ) : (
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3 items-end">
                            <div className="sm:col-span-4 space-y-1">
                                <Label className="text-xs">Clave</Label>
                                <Input
                                    {...register(`especificaciones.${index}.clave`)}
                                    placeholder="Ej: Material"
                                />
                            </div>
                            <div className="sm:col-span-6 space-y-1">
                                <Label className="text-xs">Valor</Label>
                                <Input
                                    {...register(`especificaciones.${index}.valor`)}
                                    placeholder="Ej: Cuero sintético"
                                />
                            </div>
                            <div className="sm:col-span-2 flex items-center justify-end gap-1 h-[42px] pb-[2px]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === 0}
                                    onClick={() => move(index, index - 1)}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === fields.length - 1}
                                    onClick={() => move(index, index + 1)}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
