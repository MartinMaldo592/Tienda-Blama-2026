
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowDown, ArrowUp, Loader2, Save, Star, Trash2, UploadCloud } from "lucide-react"
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
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [newGalleryUrl, setNewGalleryUrl] = useState("")
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
            const fromDb = Array.isArray(productToEdit.imagenes) ? (productToEdit.imagenes as string[]) : []
            const normalized = [
                ...(productToEdit.imagen_url ? [productToEdit.imagen_url] : []),
                ...fromDb,
            ]
                .map((x) => String(x || "").trim())
                .filter(Boolean)
            const unique = Array.from(new Set(normalized)).slice(0, 10)
            setGalleryImages(unique)
            setNewGalleryUrl("")
            setCategoryId(productToEdit.categoria_id?.toString() || "default")
        } else {
            // Reset form when not editing (or switching to new)
            setName("")
            setPrice("")
            setStock("")
            setImageUrl("")
            setGalleryImages([])
            setNewGalleryUrl("")
            setCategoryId("default")
        }
    }, [productToEdit])

    function normalizeImages(input: string[]) {
        const unique: string[] = []
        for (const raw of input) {
            const v = String(raw || "").trim()
            if (!v) continue
            if (!unique.includes(v)) unique.push(v)
            if (unique.length >= 10) break
        }
        return unique
    }

    function addGalleryUrl(url: string) {
        const next = normalizeImages([...galleryImages, url])
        setGalleryImages(next)
        if (!imageUrl && next.length > 0) {
            setImageUrl(next[0])
        }
    }

    function removeGalleryUrl(url: string) {
        const next = galleryImages.filter((x) => x !== url)
        setGalleryImages(next)

        if (imageUrl === url) {
            setImageUrl(next[0] || "")
        }
    }

    function makeGalleryMain(url: string) {
        const next = normalizeImages([url, ...galleryImages.filter((x) => x !== url)])
        setGalleryImages(next)
        setImageUrl(next[0] || "")
    }

    function moveGalleryIndex(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return
        if (fromIndex < 0 || toIndex < 0) return
        if (fromIndex >= galleryImages.length || toIndex >= galleryImages.length) return

        const next = [...galleryImages]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        setGalleryImages(next)
        if (next.length > 0) setImageUrl(next[0])
    }

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
            const files = Array.from(e.target.files)
            const remaining = Math.max(0, 10 - galleryImages.length)
            const toUpload = files.slice(0, remaining)

            const uploadedUrls: string[] = []

            for (const file of toUpload) {
                const fileExt = file.name.split('.').pop() || 'jpg'
                const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('productos')
                    .upload(filePath, file)

                if (uploadError) {
                    throw uploadError
                }

                const { data } = supabase.storage.from('productos').getPublicUrl(filePath)
                if (data?.publicUrl) uploadedUrls.push(data.publicUrl)
            }

            const next = normalizeImages([...galleryImages, ...uploadedUrls])
            setGalleryImages(next)

            if (!imageUrl && next.length > 0) {
                setImageUrl(next[0])
            }

        } catch (error: any) {
            alert("Error subiendo imagen: " + error.message)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const mergedImages = galleryImages.length > 0
                ? normalizeImages(galleryImages)
                : normalizeImages([...(imageUrl ? [imageUrl] : [])])
            const mainImage = mergedImages[0] || (imageUrl ? imageUrl : null)

            const productData = {
                nombre: name,
                precio: parseFloat(price),
                stock: parseInt(stock),
                imagen_url: mainImage,
                imagenes: mergedImages,
                categoria_id: categoryId === 'default' ? null : parseInt(categoryId)
            }

            let error;

            async function save(withGallery: boolean) {
                const payload: any = { ...productData }
                if (!withGallery) delete payload.imagenes

                if (productToEdit) {
                    return supabase.from('productos').update(payload).eq('id', productToEdit.id)
                }
                return supabase.from('productos').insert(payload)
            }

            const first = await save(true)
            error = first.error
            if (error && typeof (error as any).message === 'string' && (error as any).message.toLowerCase().includes('imagenes')) {
                const second = await save(false)
                error = second.error
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
                    <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-2 rounded-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm">
                        <UploadCloud className="h-4 w-4" />
                        {uploading ? "Subiendo..." : "Subir desde PC (puedes seleccionar varias)"}
                    </Label>
                    <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
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

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Galería (hasta 10)</Label>
                    <span className="text-xs text-muted-foreground">{galleryImages.length}/10</span>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Pega otra URL de imagen..."
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => {
                            if (!newGalleryUrl.trim()) return
                            if (galleryImages.length >= 10) return
                            addGalleryUrl(newGalleryUrl)
                            setNewGalleryUrl("")
                        }}
                        disabled={!newGalleryUrl.trim() || galleryImages.length >= 10}
                    >
                        Agregar
                    </Button>
                </div>

                {galleryImages.length > 0 && (
                    <div className="space-y-2">
                        {galleryImages.map((url, idx) => (
                            <div key={`${url}-${idx}`} className="flex items-center gap-3 rounded-lg border bg-popover p-2">
                                <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                </div>

                                <div className="h-12 w-12 rounded-md overflow-hidden border bg-background flex-shrink-0">
                                    <img src={url} alt="Imagen" className="h-full w-full object-cover" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground truncate">{url}</p>
                                    {idx === 0 && (
                                        <p className="text-xs font-medium">Principal</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => makeGalleryMain(url)}
                                        disabled={idx === 0}
                                    >
                                        <Star className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => moveGalleryIndex(idx, idx - 1)}
                                        disabled={idx === 0}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => moveGalleryIndex(idx, idx + 1)}
                                        disabled={idx === galleryImages.length - 1}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => removeGalleryUrl(url)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
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
