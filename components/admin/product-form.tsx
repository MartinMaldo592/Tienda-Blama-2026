
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { upsertProductAction } from "@/features/admin/actions/products"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Info, Tag, Image as ImageIcon, Settings, ChevronRight } from "lucide-react"

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
import { motion, AnimatePresence } from "framer-motion"
import { fetchProductoSpecsAndVariants } from "@/features/admin"

interface ProductFormProps {
    productToEdit?: any
    categories?: any[]
    onSuccess: () => void
    onCancel: () => void
}

const DEFAULT_CATEGORIES: any[] = []

type TabType = 'general' | 'precio' | 'media' | 'atributos'

export function ProductForm({ productToEdit, categories = DEFAULT_CATEGORIES, onSuccess, onCancel }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('general')

    const [selectedParentId, setSelectedParentId] = useState<string>("default")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("default")
    const [changeCategoryMode, setChangeCategoryMode] = useState(false)

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

    useEffect(() => {
        const init = async () => {
            if (productToEdit) {
                const mainImg = productToEdit.imagen_url || ""
                const fromDbImgs = Array.isArray(productToEdit.imagenes) ? (productToEdit.imagenes as string[]) : []
                const normalizedImgs = Array.from(new Set([
                    ...(mainImg ? [mainImg] : []),
                    ...fromDbImgs
                ].map(x => String(x || "").trim()).filter(Boolean))).slice(0, 10)

                setImageUrl(mainImg)
                setGalleryImages(normalizedImgs.length > 0 ? normalizedImgs : (productToEdit.imagen_url ? [productToEdit.imagen_url] : []))

                const fromDbVideos = Array.isArray((productToEdit as any).videos) ? ((productToEdit as any).videos as string[]) : []
                setVideos(Array.from(new Set(fromDbVideos.map(x => String(x || '').trim()).filter(Boolean))).slice(0, 6))

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
                    imagenes: normalizedImgs,
                    videos: Array.isArray(productToEdit.videos) ? productToEdit.videos : [],
                    categoria_id: productToEdit.categoria_id,
                    especificaciones: specs,
                    variantes: variants
                })
            } else {
                reset({ nombre: "", precio: 0, stock: 0, calificacion: 5, especificaciones: [], variantes: [], imagenes: [], videos: [] })
                setImageUrl(""); setGalleryImages([]); setVideos([]); setSelectedParentId("default"); setSelectedSubcategoryId("default")
            }
        }
        init()
    }, [productToEdit, reset])

    useEffect(() => {
        setValue("imagen_url", imageUrl)
        setValue("imagenes", galleryImages)
        setValue("videos", videos)
    }, [imageUrl, galleryImages, videos, setValue])

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true)
        try {
            let finalCategoryIdToSave: number | null = data.categoria_id || null
            if ((!productToEdit?.categoria_id) || changeCategoryMode) {
                if (!selectedParentId || selectedParentId === "default") {
                    alert("Debes seleccionar una Categoría Principal.")
                    setLoading(false); return
                }
                let catId = Number(selectedParentId)
                const hasSubcats = categories.some((c: any) => String(c.parent_id) === selectedParentId)
                if (hasSubcats) {
                    if (!selectedSubcategoryId || selectedSubcategoryId === "default") {
                        alert("Debes seleccionar una Subcategoría.")
                        setLoading(false); return
                    }
                    catId = Number(selectedSubcategoryId)
                }
                finalCategoryIdToSave = catId
            }

            const result = await upsertProductAction({
                id: productToEdit ? Number(productToEdit.id) : undefined,
                product: { ...data, categoria_id: finalCategoryIdToSave } as any,
                specs: data.especificaciones.map((s, idx) => ({ ...s, orden: idx })),
                variants: data.variantes.map(v => ({
                    etiqueta: v.etiqueta,
                    precio: v.precio ? Number(v.precio) : null,
                    precio_antes: v.precio_antes ? Number(v.precio_antes) : null,
                    stock: Number(v.stock || 0),
                    activo: v.activo
                }))
            })
            if (result.error) throw new Error(result.error)
            onSuccess()
        } catch (error: any) {
            alert("Error al guardar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'general', label: 'Información', icon: Info },
        { id: 'precio', label: 'Precio & Stock', icon: Tag },
        { id: 'media', label: 'Multimedia', icon: ImageIcon },
        { id: 'atributos', label: 'Atributos', icon: Settings },
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
            {/* --- CUSTOM TABS --- */}
            <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] sticky top-0 z-30 shadow-sm border border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <tab.icon size={16} className="relative z-10" />
                        <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute inset-0 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                                        General
                                    </h2>
                                    <ProductBasics register={register} errors={errors} />
                                </div>
                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <h2 className="text-2xl font-black text-slate-900">Categorización</h2>
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
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="button" onClick={() => setActiveTab('precio')} className="gap-2 rounded-xl bg-slate-50 text-slate-900 hover:bg-slate-100 font-bold border-slate-200 border shadow-none transition-all haptic-scale">
                                        Siguiente Paso <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'precio' && (
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                                        Valores & Inventario
                                    </h2>
                                    <ProductPricing register={register} errors={errors} isEditing={!!productToEdit} />
                                </div>
                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <h2 className="text-2xl font-black text-slate-900">Variantes del Producto</h2>
                                    <VariantsEditor control={control} register={register} isEditing={!!productToEdit} />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="button" onClick={() => setActiveTab('media')} className="gap-2 rounded-xl bg-slate-50 text-slate-900 hover:bg-slate-100 font-bold border-slate-200 border shadow-none transition-all haptic-scale">
                                        Siguiente Paso <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                                        Contenido Visual
                                    </h2>
                                    <MediaManager
                                        imageUrl={imageUrl} setImageUrl={setImageUrl}
                                        galleryImages={galleryImages} setGalleryImages={setGalleryImages}
                                        videos={videos} setVideos={setVideos}
                                        newGalleryUrl={newGalleryUrl} setNewGalleryUrl={setNewGalleryUrl}
                                        uploading={uploading} setUploading={setUploading} setLoading={setLoading}
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="button" onClick={() => setActiveTab('atributos')} className="gap-2 rounded-xl bg-slate-50 text-slate-900 hover:bg-slate-100 font-bold border-slate-200 border shadow-none transition-all haptic-scale">
                                        Siguiente Paso <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'atributos' && (
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                                        Atributos & Características
                                    </h2>
                                    <ProductAttributes register={register} />
                                </div>
                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <h2 className="text-2xl font-black text-slate-900">Ficha Técnica</h2>
                                    <SpecsEditor control={control} register={register} />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* --- ACTIONS --- */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-lg">
                <p className="text-xs text-slate-400 font-medium max-w-sm text-center sm:text-left">
                    Recuerda revisar todos los campos antes de guardar. Las imágenes pesadas pueden tardar unos segundos en procesarse.
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 sm:flex-none h-12 px-8 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-all haptic-scale">
                        Descartar
                    </Button>
                    <Button type="submit" className="flex-1 sm:flex-none h-12 px-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold transition-all shadow-xl shadow-blue-200 haptic-scale" disabled={loading || uploading}>
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Finalizar & Guardar</>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
