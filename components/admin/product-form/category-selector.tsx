import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Save } from "lucide-react"
import { createAdminCategoria } from "@/features/admin"

interface CategorySelectorProps {
    productToEdit?: any
    categories: any[]
    changeCategoryMode: boolean
    setChangeCategoryMode: (value: boolean) => void
    selectedParentId: string
    setSelectedParentId: (value: string) => void
    selectedSubcategoryId: string
    setSelectedSubcategoryId: (value: string) => void
}

export function CategorySelector({
    productToEdit,
    categories,
    changeCategoryMode,
    setChangeCategoryMode,
    selectedParentId,
    setSelectedParentId,
    selectedSubcategoryId,
    setSelectedSubcategoryId
}: CategorySelectorProps) {

    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return

        try {
            setLoading(true)
            const data = await createAdminCategoria({ nombre: newCategoryName })

            // Auto-select the new category
            setSelectedParentId(data.id.toString())
            setIsCreatingCategory(false)
            setNewCategoryName("")

        } catch (error: any) {
            alert("Error creando categoría: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const hasExistingCategory = !!productToEdit?.categoria_id

    // Logic to display existing category name
    let existingParentName = ""
    let existingChildName = ""

    if (hasExistingCategory && categories.length > 0) {
        const rawId = String(productToEdit.categoria_id)
        const current = categories.find((c: any) => String(c.id) === rawId)
        if (current) {
            if (current.parent_id) {
                const p = categories.find((c: any) => String(c.id) === String(current.parent_id))
                existingParentName = p?.nombre || "..."
                existingChildName = current.nombre
            } else {
                existingParentName = current.nombre
            }
        }
    }

    return (
        <div className="space-y-4">
            {hasExistingCategory && (
                <div className="p-4 border rounded-md bg-muted/40">
                    <Label className="text-sm font-semibold mb-2 block">Categoría Asignada (Actual)</Label>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                            {existingParentName || "Desconocida"}
                        </span>
                        {existingChildName && (
                            <>
                                <span className="text-muted-foreground">/</span>
                                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
                                    {existingChildName}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="changeCat"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={changeCategoryMode}
                                onChange={(e) => setChangeCategoryMode(e.target.checked)}
                            />
                            <Label htmlFor="changeCat" className="font-normal cursor-pointer select-none">
                                Quiero cambiar la categoría actual
                            </Label>
                        </div>
                    </div>
                </div>
            )}

            {(!hasExistingCategory || changeCategoryMode) && (
                <div className={`space-y-4 ${hasExistingCategory ? "p-4 border border-dashed rounded-md bg-background animate-in fade-in zoom-in-95 duration-200" : ""}`}>
                    {hasExistingCategory && <Label className="text-sm font-semibold text-primary">Seleccionar Nueva Categoría</Label>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Categoría Principal {hasExistingCategory ? "(Nueva)" : ""}</Label>
                            <Select
                                value={selectedParentId}
                                onValueChange={(val) => {
                                    setSelectedParentId(val)
                                    setSelectedSubcategoryId("default")
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar Principal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Seleccionar...</SelectItem>
                                    {categories
                                        .filter((c: any) => !c.parent_id)
                                        .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
                                        .map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.nombre}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Subcategoría (Opcional)</Label>
                            <Select
                                value={selectedSubcategoryId}
                                onValueChange={setSelectedSubcategoryId}
                                disabled={selectedParentId === "default" || !categories.some((c: any) => String(c.parent_id) === selectedParentId)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar Subcategoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Ninguna</SelectItem>
                                    {categories
                                        .filter((c: any) => String(c.parent_id) === selectedParentId)
                                        .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
                                        .map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.nombre}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Create new category shortcut */}
                    {!isCreatingCategory ? (
                        <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-xs text-accent mt-2"
                            onClick={() => setIsCreatingCategory(true)}
                        >
                            + Crear Nueva Categoría Global
                        </Button>
                    ) : (
                        <div className="flex gap-2 mt-2">
                            <Input
                                placeholder="Nombre nueva categoría..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleCreateCategory}
                                disabled={!newCategoryName.trim() || loading}
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCreatingCategory(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}
