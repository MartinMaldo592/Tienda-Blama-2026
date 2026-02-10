/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase.client"
import {
    fetchProductoSpecsAndVariants,
    saveAdminProductoViaApi,
} from "@/features/admin"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

import { ProductBasics } from "./product-form/product-basics"
import { ProductAttributes } from "./product-form/product-attributes"
import { ProductPricing } from "./product-form/product-pricing"
import { SpecsEditor } from "./product-form/specs-editor"
import { VariantsEditor } from "./product-form/variants-editor"
import { CategorySelector } from "./product-form/category-selector"
import { MediaManager } from "./product-form/media-manager"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, ProductFormValues } from "@/features/admin/schemas/product.schema"

interface ProductFormProps {
    productToEdit?: any
    categories?: any[]
    onSuccess: () => void
    onCancel: () => void
}

const DEFAULT_CATEGORIES: any[] = []

export function ProductForm({ productToEdit, categories = DEFAULT_CATEGORIES, onSuccess, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Separate states for complex UI logic (Categories & Media)
    const [selectedParentId, setSelectedParentId] = useState<string>("default")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("default")
    const [changeCategoryMode, setChangeCategoryMode] = useState(false)

    // Media states needed for the MediaManager UI
    const [imageUrl, setImageUrl] = useState("")
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [newGalleryUrl, setNewGalleryUrl] = useState("")
    const [videos, setVideos] = useState<string[]>([])

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            nombre: "",
            descripcion: "",
            materiales: "",
            tamano: "",
            color: "",
            cuidados: "",
            uso: "",
            precio: 0,
            precio_antes: null,
            stock: 0,
            calificacion: 5,
            imagen_url: "",
            imagenes: [],
            videos: [],
            especificaciones: [],
            variantes: [],
            categoria_id: null
        } as any
    })

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = form

    // Initialize form with productToEdit
    useEffect(() => {
        const init = async () => {
            if (productToEdit) {
                // Initialize Media State
                const mainImg = productToEdit.imagen_url || ""
                const fromDbImgs = Array.isArray(productToEdit.imagenes) ? (productToEdit.imagenes as string[]) : []
                const normalizedImgs = Array.from(new Set([
                    ...(mainImg ? [mainImg] : []),
                    ...fromDbImgs
                ].map(x => String(x || "").trim()).filter(Boolean))).slice(0, 10)

                setImageUrl(mainImg)
                const finalGallery = normalizedImgs.length > 0 ? normalizedImgs : (productToEdit.imagen_url ? [productToEdit.imagen_url] : [])
                setGalleryImages(finalGallery)

                const fromDbVideos = Array.isArray((productToEdit as any).videos) ? ((productToEdit as any).videos as string[]) : []
                const normalizedVideos = Array.from(new Set(fromDbVideos.map(x => String(x || '').trim()).filter(Boolean))).slice(0, 6)
                setVideos(normalizedVideos)

                // Initialize Category State
                const rawCatId = productToEdit.categoria_id
                if (!rawCatId) {
                    setSelectedParentId("default")
                    setSelectedSubcategoryId("default")
                }

                // Fetch Specs & Variants
                let specs: any[] = []
                let variants: any[] = []
                try {
                    const pid = Number(productToEdit.id)
                    if (pid) {
                        const res = await fetchProductoSpecsAndVariants(pid)
                        specs = Array.isArray(res.specs) ? res.specs.map((s: any) => ({
                            id: Number(s.id),
                            clave: String(s.clave || ''),
                            valor: String(s.valor || ''),
                            orden: Number(s.orden || 0),
                        })) : []

                        variants = Array.isArray(res.variants) ? res.variants.map((v: any) => ({
                            id: Number(v.id),
                            etiqueta: String(v.etiqueta || ''),
                            precio: v.precio != null ? String(v.precio) : '',
                            precio_antes: v.precio_antes != null ? String(v.precio_antes) : '',
                            stock: String(v.stock ?? 0),
                            activo: Boolean(v.activo ?? true),
                        })) : []
                    }
                } catch (e) { console.error(e) }

                // Reset Form
                reset({
                    nombre: productToEdit.nombre || "",
                    descripcion: productToEdit.descripcion || "",
                    materiales: productToEdit.materiales || "",
                    tamano: productToEdit.tamano || "",
                    color: productToEdit.color || "",
                    cuidados: productToEdit.cuidados || "",
                    uso: productToEdit.uso || "",
                    precio: Number(productToEdit.precio || 0),
                    precio_antes: productToEdit.precio_antes ? Number(productToEdit.precio_antes) : null,
                    stock: Number(productToEdit.stock || 0),
                    calificacion: Number(productToEdit.calificacion || 5),
                    imagen_url: mainImg,
                    imagenes: finalGallery,
                    videos: normalizedVideos,
                    categoria_id: productToEdit.categoria_id,
                    especificaciones: specs,
                    variantes: variants
                })

            } else {
                reset({
                    nombre: "",
                    precio: 0,
                    stock: 0,
                    calificacion: 5,
                    especificaciones: [],
                    variantes: [],
                    imagenes: [],
                    videos: []
                })
                setImageUrl("")
                setGalleryImages([])
                setVideos([])
                setSelectedParentId("default")
                setSelectedSubcategoryId("default")
            }
        }
        init()
    }, [productToEdit, reset])

    // Sync Media State to Form
    useEffect(() => {
        setValue("imagen_url", imageUrl)
        setValue("imagenes", galleryImages)
    }, [imageUrl, galleryImages, setValue])

    useEffect(() => {
        setValue("videos", videos)
    }, [videos, setValue])


    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true)
        try {
            const supabase = createClient()
            const sessionRes = await supabase.auth.getSession()
            const accessToken = sessionRes?.data?.session?.access_token
            if (!accessToken) {
                alert('Tu sesión expiró. Vuelve a iniciar sesión.')
                return
            }

            // Determine final category ID
            let finalCategoryIdToSave: number | null = data.categoria_id || null
            const isChangeMode = (!productToEdit?.categoria_id) || changeCategoryMode

            if (isChangeMode) {
                if (!selectedParentId || selectedParentId === "default") {
                    alert("Debes seleccionar una Categoría Principal.")
                    setLoading(false)
                    return
                }

                let catId = Number(selectedParentId)
                const hasSubcats = categories.some((c: any) => String(c.parent_id) === selectedParentId)

                if (hasSubcats) {
                    if (!selectedSubcategoryId || selectedSubcategoryId === "default") {
                        alert("Debes seleccionar una Subcategoría para la nueva categoría seleccionada.")
                        setLoading(false)
                        return
                    }
                    catId = Number(selectedSubcategoryId)
                }
                finalCategoryIdToSave = catId
            }

            const method = productToEdit ? 'PUT' : 'POST'

            const { especificaciones, variantes, ...productFields } = data

            const apiBody: any = {
                product: {
                    ...productFields,
                    categoria_id: finalCategoryIdToSave,
                    precio_antes: productFields.precio_antes || null
                },
                specs: especificaciones.map((s, idx) => ({ ...s, orden: idx })),
                variants: variantes.map(v => ({
                    etiqueta: v.etiqueta,
                    precio: v.precio ? Number(v.precio) : null,
                    precio_antes: v.precio_antes ? Number(v.precio_antes) : null,
                    stock: Number(v.stock || 0),
                    activo: v.activo
                }))
            }

            if (productToEdit) apiBody.id = Number(productToEdit.id)

            await saveAdminProductoViaApi({
                accessToken,
                method: method as "POST" | "PUT",
                body: apiBody,
            })

            onSuccess()
        } catch (error: any) {
            console.error(error)
            alert("Error al guardar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4 px-1">
            <ProductBasics register={register} errors={errors} />

            <ProductAttributes register={register} />

            <SpecsEditor control={control} register={register} />

            <VariantsEditor control={control} register={register} />

            <ProductPricing register={register} errors={errors} />

            <CategorySelector
                productToEdit={productToEdit}
                categories={categories}
                changeCategoryMode={changeCategoryMode}
                setChangeCategoryMode={setChangeCategoryMode}
                selectedParentId={selectedParentId}
                setSelectedParentId={setSelectedParentId}
                selectedSubcategoryId={selectedSubcategoryId}
                setSelectedSubcategoryId={setSelectedSubcategoryId}
            />

            <MediaManager
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                galleryImages={galleryImages}
                setGalleryImages={setGalleryImages}
                videos={videos}
                setVideos={setVideos}
                newGalleryUrl={newGalleryUrl}
                setNewGalleryUrl={setNewGalleryUrl}
                uploading={uploading}
                setUploading={setUploading}
                setLoading={setLoading}
            />

            <div className="pt-4 flex gap-3 justify-end border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading || uploading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando datos...
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
