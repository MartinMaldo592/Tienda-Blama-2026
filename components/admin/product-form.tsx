
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, UploadCloud } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface ProductFormProps {
    productToEdit?: any
    onSuccess: () => void
    onCancel: () => void
}

export function ProductForm({ productToEdit, onSuccess, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    // Form State
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [categoryId, setCategoryId] = useState<string>("default")

    // Create Category State
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.nombre || "")
            setPrice(productToEdit.precio?.toString() || "")
            setStock(productToEdit.stock?.toString() || "")
            setImageUrl(productToEdit.imagen_url || "")
            setCategoryId(productToEdit.categoria_id?.toString() || "default")
        } else {
            // Reset form when not editing (or switching to new)
            setName("")
            setPrice("")
            setStock("")
            setImageUrl("")
            setCategoryId("default")
        }
    }, [productToEdit])

    async function fetchCategories() {
        const { data } = await supabase.from('categorias').select('*')
        if (data) setCategories(data)
    }

    // ... (handleCreateCategory and handleImageUpload remain same)
    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return

        const slug = newCategoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

        try {
            setLoading(true)
            const { data, error } = await supabase.from('categorias').insert({
                nombre: newCategoryName,
                slug: slug // Simple slug generation
            }).select().single()

            if (error) throw error

            // Add to local list and select it
            setCategories([...categories, data])
            setCategoryId(data.id.toString())
            setIsCreatingCategory(false)
            setNewCategoryName("")

        } catch (error: any) {
            alert("Error creando categoría: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true)
            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('productos')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('productos').getPublicUrl(filePath)
            setImageUrl(data.publicUrl)

        } catch (error: any) {
            alert("Error subiendo imagen: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const productData = {
                nombre: name,
                precio: parseFloat(price),
                stock: parseInt(stock),
                imagen_url: imageUrl,
                categoria_id: categoryId === 'default' ? null : parseInt(categoryId)
            }

            let error;

            if (productToEdit) {
                const { error: updateError } = await supabase
                    .from('productos')
                    .update(productData)
                    .eq('id', productToEdit.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('productos')
                    .insert(productData)
                error = insertError
            }

            if (error) throw error

            onSuccess()
        } catch (error: any) {
            alert("Error al guardar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Precio ($)</Label>
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
            </div>


            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Categoría</Label>
                    {!isCreatingCategory ? (
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs text-accent"
                                onClick={() => setIsCreatingCategory(true)}
                            >
                                + Nueva Categoría
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs text-destructive"
                                onClick={() => setIsCreatingCategory(false)}
                            >
                                Cancelar
                            </Button>
                        )}
                </div>

                {isCreatingCategory ? (
                    <div className="flex gap-2">
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
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Sin Categoría</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="space-y-2">
                <Label>Imagen</Label>
                <div className="flex gap-2 items-center">
                    <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Pega una URL externa o sube una imagen (si tienes bucket).</p>

                {/* Simple File Input for optional upload */}
                <div className="mt-2">
                    <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm text-accent hover:text-accent-foreground bg-accent/10 px-3 py-2 rounded-md transition-colors">
                        <UploadCloud className="h-4 w-4" />
                        {uploading ? "Subiendo..." : "Subir desde PC"}
                    </Label>
                    <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </div>

                {/* Preview */}
                {imageUrl && (
                    <div className="mt-2 h-32 w-32 rounded-lg border overflow-hidden relative bg-popover">
                        <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                )}
            </div>

            <div className="pt-4 flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading || uploading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Guardar Producto
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
