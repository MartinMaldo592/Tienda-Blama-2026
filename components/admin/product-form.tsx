
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
    createAdminCategoria,
    fetchAdminCategorias,
    fetchProductoSpecsAndVariants,
    saveAdminProductoViaApi,
    uploadProductImages,
    uploadProductVideos,
} from "@/features/admin"
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
    categories?: any[]
    onSuccess: () => void
    onCancel: () => void
}

export function ProductForm({ productToEdit, categories = [], onSuccess, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    // Categories are now passed as props

    // Form State
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [priceBefore, setPriceBefore] = useState("")
    const [stock, setStock] = useState("")
    const [calificacion, setCalificacion] = useState("5")
    const [imageUrl, setImageUrl] = useState("")
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [newGalleryUrl, setNewGalleryUrl] = useState("")
    const [videos, setVideos] = useState<string[]>([])
    const [selectedParentId, setSelectedParentId] = useState<string>("default")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("default")

    const [descripcion, setDescripcion] = useState("")
    const [materiales, setMateriales] = useState("")
    const [tamano, setTamano] = useState("")
    const [color, setColor] = useState("")
    const [cuidados, setCuidados] = useState("")
    const [uso, setUso] = useState("")

    const [especificaciones, setEspecificaciones] = useState<Array<{ id?: number; clave: string; valor: string; orden: number }>>([])
    const [variantes, setVariantes] = useState<Array<{ id?: number; etiqueta: string; precio: string; precio_antes: string; stock: string; activo: boolean }>>([])

    // NEW: Toggle for manual category change
    const [changeCategoryMode, setChangeCategoryMode] = useState(false)

    // Computed Category State removed (we use direct productToEdit or local state)



    // Create Category State
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")


    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.nombre || "")
            setPrice(productToEdit.precio?.toString() || "")
            setPriceBefore(productToEdit.precio_antes != null ? String(productToEdit.precio_antes) : "")
            setStock(productToEdit.stock?.toString() || "")
            setCalificacion(productToEdit.calificacion != null ? String(productToEdit.calificacion) : "5")
            setImageUrl(productToEdit.imagen_url || "")
            setDescripcion(productToEdit.descripcion || "")
            setMateriales(productToEdit.materiales || "")
            setTamano(productToEdit.tamano || "")
            setColor(productToEdit.color || "")
            setCuidados(productToEdit.cuidados || "")
            setUso(productToEdit.uso || "")
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

            const vFromDb = Array.isArray((productToEdit as any).videos) ? ((productToEdit as any).videos as string[]) : []
            const vClean = vFromDb.map((x) => String(x || '').trim()).filter(Boolean)
            setVideos(Array.from(new Set(vClean)).slice(0, 6))

            // Category syncing logic:
            // If editing, we DO NOT fill the selectedParentId/Sub to avoid confusing the "New Category" fields.
            // We want "New Category" fields to start empty (default) so the user explicitly chooses if they want to change.
            // UNLESS it's a new product or no category assigned.

            const rawCatId = productToEdit.categoria_id
            if (!rawCatId) {
                setSelectedParentId("default")
                setSelectedSubcategoryId("default")
            }
            // If rawCatId exists, we leave selected*Id as default. The UI will show the "Current Category" block.

            ; (async () => {
                try {
                    const productId = Number(productToEdit.id)
                    if (!productId) {
                        setEspecificaciones([])
                        setVariantes([])
                        return
                    }

                    const { specs, variants } = await fetchProductoSpecsAndVariants(productId)

                    const nextSpecs = Array.isArray(specs)
                        ? specs.map((s: any) => ({
                            id: Number(s.id),
                            clave: String(s.clave || ''),
                            valor: String(s.valor || ''),
                            orden: Number(s.orden || 0),
                        }))
                        : []
                    setEspecificaciones(nextSpecs)

                    const nextVars = Array.isArray(variants)
                        ? variants.map((v: any) => ({
                            id: Number(v.id),
                            etiqueta: String(v.etiqueta || ''),
                            precio: v.precio != null ? String(v.precio) : '',
                            precio_antes: v.precio_antes != null ? String(v.precio_antes) : '',
                            stock: String(v.stock ?? 0),
                            activo: Boolean(v.activo ?? true),
                        }))
                        : []
                    setVariantes(nextVars)
                } catch (err) {
                    setEspecificaciones([])
                    setVariantes([])
                }
            })()
        } else {
            // Reset form when not editing (or switching to new)
            setName("")
            setPrice("")
            setPriceBefore("")
            setStock("")
            setCalificacion("5")
            setImageUrl("")
            setDescripcion("")
            setMateriales("")
            setTamano("")
            setColor("")
            setCuidados("")
            setUso("")
            setGalleryImages([])
            setNewGalleryUrl("")
            setVideos([])
            setSelectedParentId("default")
            setSelectedSubcategoryId("default")
            setEspecificaciones([])
            setVariantes([])
        }
    }, [productToEdit, categories])



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

    function normalizeVideos(input: string[]) {
        const unique: string[] = []
        for (const raw of input) {
            const v = String(raw || "").trim()
            if (!v) continue
            if (!unique.includes(v)) unique.push(v)
            if (unique.length >= 6) break
        }
        return unique
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        try {
            setUploading(true)
            const files = Array.from(e.target.files)
            const remaining = Math.max(0, 6 - videos.length)
            const toUpload = files.slice(0, remaining)

            const uploadedUrls = await uploadProductVideos({ files: toUpload })

            const next = normalizeVideos([...videos, ...uploadedUrls])
            setVideos(next)
        } catch (error: any) {
            alert("Error subiendo video: " + error.message)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
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

    function moveVideoIndex(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return
        if (fromIndex < 0 || toIndex < 0) return
        if (fromIndex >= videos.length || toIndex >= videos.length) return

        const next = [...videos]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        setVideos(next)
    }


    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return

        try {
            setLoading(true)
            const data = await createAdminCategoria({ nombre: newCategoryName })

            // Add to local list and select it
            // setCategories([...categories, data]) // Cannot update props locally
            // window.location.reload() // Force reload to fetch new category?
            // BETTER: Just set it locally if we could, but for now fixed the build error:
            setSelectedParentId(data.id.toString())
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
            const files = Array.from(e.target.files).filter((f) => {
                const t = String(f?.type || '').toLowerCase()
                const n = String(f?.name || '').toLowerCase()
                if (t) return t.startsWith('image/')
                return n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.webp') || n.endsWith('.gif')
            })
            const remaining = Math.max(0, 10 - galleryImages.length)
            const toUpload = files.slice(0, remaining)

            const uploadedUrls = await uploadProductImages({ files: toUpload })

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
            const sessionRes = await supabase.auth.getSession()
            const accessToken = sessionRes?.data?.session?.access_token
            if (!accessToken) {
                alert('Tu sesión expiró. Vuelve a iniciar sesión.')
                setLoading(false)
                return
            }

            // Determine final category ID
            // Determine final category ID
            let finalCategoryIdToSave: string | number | null = null

            // LOGIC: 
            // 1. If Change Mode is active (explicit toggle OR no existing category), use selectedParentId.
            // 2. Else, keep existing productToEdit.categoria_id.

            const isChangeMode = (!productToEdit?.categoria_id) || changeCategoryMode

            if (isChangeMode) {
                if (!selectedParentId || selectedParentId === "default") {
                    alert("Debes seleccionar una Categoría Principal.")
                    setLoading(false)
                    return
                }

                finalCategoryIdToSave = selectedParentId

                // Validate subcategory if needed
                const hasSubcats = categories.some((c: any) => String(c.parent_id) === selectedParentId)
                if (hasSubcats && (!selectedSubcategoryId || selectedSubcategoryId === "default")) {
                    alert("Debes seleccionar una Subcategoría para la nueva categoría seleccionada.")
                    setLoading(false)
                    return
                }
                if (selectedSubcategoryId && selectedSubcategoryId !== "default") {
                    finalCategoryIdToSave = selectedSubcategoryId
                }
            } else {
                // Not in change mode, preserve existing
                if (productToEdit?.categoria_id) {
                    finalCategoryIdToSave = productToEdit.categoria_id
                } else {
                    // Should not happen if logic is correct, but fallback
                    alert("Error de lógica: No hay categoría asignada y no se seleccionó ninguna.")
                    setLoading(false)
                    return
                }
            }

            const priceNum = Number(price)
            if (!Number.isFinite(priceNum) || priceNum <= 0) {
                alert('Ingresa un precio actual válido')
                setLoading(false)
                return
            }

            const priceBeforeRaw = String(priceBefore || '').trim()
            const priceBeforeNum = priceBeforeRaw ? Number(priceBeforeRaw) : null
            if (priceBeforeNum != null && (!Number.isFinite(priceBeforeNum) || priceBeforeNum <= 0)) {
                alert('Ingresa un precio antes válido o déjalo vacío')
                setLoading(false)
                return
            }

            if (priceBeforeNum != null && priceBeforeNum <= priceNum) {
                alert('El precio antes debe ser mayor que el precio actual para mostrar oferta')
                setLoading(false)
                return
            }

            const stockNum = Number(stock)
            if (!Number.isFinite(stockNum) || stockNum < 0) {
                alert('Ingresa un stock válido')
                setLoading(false)
                return
            }

            const calificacionNum = Number(calificacion)
            if (!Number.isFinite(calificacionNum) || calificacionNum < 0 || calificacionNum > 5) {
                alert('Ingresa una calificación válida (0-5)')
                setLoading(false)
                return
            }

            const mergedImages = galleryImages.length > 0
                ? normalizeImages(galleryImages)
                : normalizeImages([...(imageUrl ? [imageUrl] : [])])

            const imageOnly = mergedImages.filter((u) => {
                const s = String(u || '').toLowerCase()
                return !(s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v'))
            })

            const videoFromImages = mergedImages.filter((u) => {
                const s = String(u || '').toLowerCase()
                return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v')
            })

            const videosFinal = normalizeVideos([...videos, ...videoFromImages])

            const mainImage = imageOnly[0] || (imageUrl ? imageUrl : null)

            const productData = {
                nombre: name,
                precio: priceNum,
                precio_antes: priceBeforeNum,
                stock: stockNum,
                calificacion: calificacionNum,
                imagen_url: mainImage,
                imagenes: imageOnly,
                videos: videosFinal,
                descripcion: descripcion.trim() || null,
                materiales: materiales.trim() || null,
                tamano: tamano.trim() || null,
                color: color.trim() || null,
                cuidados: cuidados.trim() || null,
                uso: uso.trim() || null,
                categoria_id: finalCategoryIdToSave ? parseInt(String(finalCategoryIdToSave)) : null
            }

            const cleanSpecs = especificaciones
                .map((s) => ({
                    clave: String(s.clave || '').trim(),
                    valor: String(s.valor || '').trim(),
                    orden: Number(s.orden || 0),
                }))
                .filter((s) => s.clave.length > 0)

            const cleanVariants = variantes
                .map((v) => ({
                    etiqueta: String(v.etiqueta || '').trim(),
                    precio: String(v.precio || '').trim(),
                    precio_antes: String(v.precio_antes || '').trim(),
                    stock: String(v.stock || '').trim(),
                    activo: Boolean(v.activo),
                }))
                .filter((v) => v.etiqueta.length > 0)

            const method = productToEdit ? 'PUT' : 'POST'
            const apiBody: any = {
                product: productData,
                specs: cleanSpecs,
                variants: cleanVariants.map((v) => ({
                    etiqueta: v.etiqueta,
                    precio: v.precio ? Number(v.precio) : null,
                    precio_antes: v.precio_antes ? Number(v.precio_antes) : null,
                    stock: Number(v.stock || 0),
                    activo: v.activo,
                })),
            }
            if (productToEdit) apiBody.id = Number(productToEdit.id)

            await saveAdminProductoViaApi({
                accessToken,
                method: method as "POST" | "PUT",
                body: apiBody,
            })

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

            <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (general)</Label>
                <Textarea
                    id="descripcion"
                    placeholder="Descripción completa del producto..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

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

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Ficha técnica (especificaciones)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEspecificaciones((prev) => ([...prev, { clave: '', valor: '', orden: prev.length }]))}
                    >
                        Agregar
                    </Button>
                </div>

                {especificaciones.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Sin especificaciones</div>
                ) : (
                    <div className="space-y-2">
                        {especificaciones
                            .slice()
                            .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
                            .map((s, idx) => (
                                <div key={s.id ?? `new-${idx}`} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3">
                                    <div className="sm:col-span-4">
                                        <Label className="text-xs">Clave</Label>
                                        <Input
                                            value={s.clave}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                setEspecificaciones((prev) => prev.map((p) => (p === s ? { ...p, clave: val } : p)))
                                            }}
                                        />
                                    </div>
                                    <div className="sm:col-span-6">
                                        <Label className="text-xs">Valor</Label>
                                        <Input
                                            value={s.valor}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                setEspecificaciones((prev) => prev.map((p) => (p === s ? { ...p, valor: val } : p)))
                                            }}
                                        />
                                    </div>
                                    <div className="sm:col-span-2 flex items-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => setEspecificaciones((prev) => prev.map((p) => (p === s ? { ...p, orden: Math.max(0, Number(p.orden || 0) - 1) } : p)))}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => setEspecificaciones((prev) => prev.map((p) => (p === s ? { ...p, orden: Number(p.orden || 0) + 1 } : p)))}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => setEspecificaciones((prev) => prev.filter((p) => p !== s))}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Videos (hasta 6)</Label>
                    <span className="text-xs text-muted-foreground">{videos.length}/6</span>
                </div>

                <div className="flex items-center gap-3">
                    <Input
                        type="file"
                        accept="video/mp4,video/webm"
                        multiple
                        onChange={handleVideoUpload}
                        disabled={uploading || videos.length >= 6}
                    />
                </div>

                {videos.length > 0 && (
                    <div className="space-y-2">
                        {videos.map((url, idx) => (
                            <div key={`${url}-${idx}`} className="flex items-center gap-3 rounded-lg border bg-popover p-2">
                                <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground truncate">{url}</p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => moveVideoIndex(idx, idx - 1)}
                                        disabled={idx === 0}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => moveVideoIndex(idx, idx + 1)}
                                        disabled={idx === videos.length - 1}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setVideos((prev) => prev.filter((x) => x !== url))}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Variantes (talla / color / modelo)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setVariantes((prev) => ([...prev, { etiqueta: '', precio: '', precio_antes: '', stock: '0', activo: true }]))}
                    >
                        Agregar
                    </Button>
                </div>

                {variantes.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Sin variantes</div>
                ) : (
                    <div className="space-y-2">
                        {variantes.map((v, idx) => (
                            <div key={v.id ?? `vnew-${idx}`} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3">
                                <div className="sm:col-span-4">
                                    <Label className="text-xs">Etiqueta</Label>
                                    <Input
                                        value={v.etiqueta}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setVariantes((prev) => prev.map((p) => (p === v ? { ...p, etiqueta: val } : p)))
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label className="text-xs">Precio (opcional)</Label>
                                    <Input
                                        inputMode="decimal"
                                        value={v.precio}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setVariantes((prev) => prev.map((p) => (p === v ? { ...p, precio: val } : p)))
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label className="text-xs">Precio antes (opcional)</Label>
                                    <Input
                                        inputMode="decimal"
                                        value={v.precio_antes}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setVariantes((prev) => prev.map((p) => (p === v ? { ...p, precio_antes: val } : p)))
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label className="text-xs">Stock</Label>
                                    <Input
                                        inputMode="numeric"
                                        value={v.stock}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setVariantes((prev) => prev.map((p) => (p === v ? { ...p, stock: val } : p)))
                                        }}
                                    />
                                </div>
                                <div className="sm:col-span-2 flex items-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setVariantes((prev) => prev.map((p) => (p === v ? { ...p, activo: !p.activo } : p)))}
                                    >
                                        {v.activo ? 'Activa' : 'Inactiva'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setVariantes((prev) => prev.filter((p) => p !== v))}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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


            <div className="space-y-2">
                {/* Dynamic Category Section */}
                {(() => {
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

                                    {/* Create new category shortcut (optional, kept for convenience) */}
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
                })()}
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
        </form >
    )
}
