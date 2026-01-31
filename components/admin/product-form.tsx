/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
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
    const [changeCategoryMode, setChangeCategoryMode] = useState(false)

    const [descripcion, setDescripcion] = useState("")
    const [materiales, setMateriales] = useState("")
    const [tamano, setTamano] = useState("")
    const [color, setColor] = useState("")
    const [cuidados, setCuidados] = useState("")
    const [uso, setUso] = useState("")

    const [especificaciones, setEspecificaciones] = useState<Array<{ id?: number; clave: string; valor: string; orden: number }>>([])
    const [variantes, setVariantes] = useState<Array<{ id?: number; etiqueta: string; precio: string; precio_antes: string; stock: string; activo: boolean }>>([])

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

            const rawCatId = productToEdit.categoria_id
            if (!rawCatId) {
                setSelectedParentId("default")
                setSelectedSubcategoryId("default")
            }

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
            // Reset form
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
            let finalCategoryIdToSave: string | number | null = null
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
                if (productToEdit?.categoria_id) {
                    finalCategoryIdToSave = productToEdit.categoria_id
                } else {
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
        <form onSubmit={handleSubmit} className="space-y-8 py-4 px-1">
            <ProductBasics
                name={name} setName={setName}
                descripcion={descripcion} setDescripcion={setDescripcion}
            />

            <ProductAttributes
                materiales={materiales} setMateriales={setMateriales}
                tamano={tamano} setTamano={setTamano}
                color={color} setColor={setColor}
                cuidados={cuidados} setCuidados={setCuidados}
                uso={uso} setUso={setUso}
            />

            <SpecsEditor
                specs={especificaciones} setSpecs={setEspecificaciones}
            />

            <VariantsEditor
                variants={variantes} setVariants={setVariantes}
            />

            <ProductPricing
                price={price} setPrice={setPrice}
                priceBefore={priceBefore} setPriceBefore={setPriceBefore}
                stock={stock} setStock={setStock}
                calificacion={calificacion} setCalificacion={setCalificacion}
            />

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
