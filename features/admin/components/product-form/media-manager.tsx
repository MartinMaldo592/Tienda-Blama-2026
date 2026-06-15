import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, Star, Trash2, UploadCloud, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { deleteFromR2, uploadToR2 } from "@/features/admin"
import { toast } from "sonner" // Asumimos que existe sonner o usaremos alert si no

interface MediaManagerProps {
    imageUrl: string
    setImageUrl: (url: string) => void
    galleryImages: string[]
    setGalleryImages: (images: string[]) => void
    videos: string[]
    setVideos: React.Dispatch<React.SetStateAction<string[]>>
    newGalleryUrl: string
    setNewGalleryUrl: (url: string) => void
    uploading: boolean
    setUploading: (uploading: boolean) => void
    setLoading: (loading: boolean) => void
}

interface UploadProgressInfo {
    id: string
    fileName: string
    progress: number
    status: "uploading" | "success" | "error"
    stepText: string
    isImage: boolean
}

export function MediaManager({
    imageUrl,
    setImageUrl,
    galleryImages,
    setGalleryImages,
    videos,
    setVideos,
    newGalleryUrl,
    setNewGalleryUrl,
    uploading,
    setUploading,
    setLoading
}: MediaManagerProps) {
    const [activeUploads, setActiveUploads] = useState<UploadProgressInfo[]>([])

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

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files).filter((f) => {
            const t = String(f?.type || '').toLowerCase()
            const n = String(f?.name || '').toLowerCase()
            if (t) return t.startsWith('image/')
            return n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.webp') || n.endsWith('.gif')
        })

        const remainingSlots = Math.max(0, 10 - galleryImages.length)
        const toUpload = files.slice(0, remainingSlots)

        if (toUpload.length === 0) {
            toast.error("No se pueden seleccionar más imágenes (límite de 10 alcanzado o formato incorrecto).")
            e.target.value = ''
            return
        }

        setUploading(true)

        // Inicializar el estado de progreso para cada archivo
        const newUploads = toUpload.map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            progress: 0,
            status: "uploading" as const,
            stepText: "Preparando subida...",
            isImage: true
        }))
        setActiveUploads(prev => [...newUploads, ...prev])

        try {
            const uploadPromises = toUpload.map(async (file, idx) => {
                const uploadId = newUploads[idx].id
                try {
                    const url = await uploadToR2(file, (percent, step) => {
                        setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, progress: percent, stepText: step } : up))
                    })

                    if (url) {
                        setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, progress: 100, status: "success", stepText: "¡Imagen subida con éxito!" } : up))
                        return url
                    } else {
                        setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, status: "error", stepText: "Fallo al procesar o guardar la imagen." } : up))
                        return null
                    }
                } catch (err: any) {
                    console.error(`Falló subida de ${file.name}`, err)
                    setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, status: "error", stepText: err.message || "Error al subir la imagen." } : up))
                    return null
                }
            })

            const results = await Promise.all(uploadPromises)
            const successfulUrls = results.filter((url) => url !== null) as string[]

            if (successfulUrls.length > 0) {
                const next = normalizeImages([...galleryImages, ...successfulUrls])
                setGalleryImages(next)

                if (!imageUrl && next.length > 0) {
                    setImageUrl(next[0])
                }
                toast.success(`Se subieron correctamente ${successfulUrls.length} imagen(es).`)
            }

            const failedCount = toUpload.length - successfulUrls.length
            if (failedCount > 0) {
                toast.error(`No se pudieron subir ${failedCount} de ${toUpload.length} imágenes.`)
            }

        } catch (error: any) {
            console.error("Error exception al subir imágenes:", error)
            toast.error(`Error crítico al subir imágenes: ${error.message}`)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        const remainingSlots = Math.max(0, 6 - videos.length)
        const toUpload = files.slice(0, remainingSlots)

        if (toUpload.length === 0) {
            toast.error("No se pueden subir más videos (límite de 6 alcanzado).")
            e.target.value = ''
            return
        }

        setUploading(true)

        // Inicializar el estado de progreso para cada archivo
        const newUploads = toUpload.map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            progress: 0,
            status: "uploading" as const,
            stepText: "En cola para subir...",
            isImage: false
        }))
        setActiveUploads(prev => [...newUploads, ...prev])

        let successCount = 0
        let currentVideos = [...videos]

        for (let i = 0; i < toUpload.length; i++) {
            const file = toUpload[i]
            const uploadId = newUploads[i].id

            try {
                const url = await uploadToR2(file, (percent, step) => {
                    setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, progress: percent, stepText: step } : up))
                })

                if (url) {
                    currentVideos = normalizeVideos([...currentVideos, url])
                    setVideos(currentVideos)
                    successCount++
                    setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, progress: 100, status: "success", stepText: "¡Video subido con éxito!" } : up))
                } else {
                    setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, status: "error", stepText: "Error al guardar video en la nube." } : up))
                }
            } catch (error: any) {
                console.error(`Error exception video ${file.name}:`, error)
                setActiveUploads(prev => prev.map(up => up.id === uploadId ? { ...up, status: "error", stepText: error.message || "Error al subir video." } : up))
            }
        }

        if (successCount === toUpload.length) {
            toast.success("¡Todos los videos se subieron correctamente!")
        } else {
            toast.warning(`Se subieron ${successCount} de ${toUpload.length} videos correctamente.`)
        }

        setUploading(false)
        e.target.value = ''
    }

    function addGalleryUrl(url: string) {
        const next = normalizeImages([...galleryImages, url])
        setGalleryImages(next)
        if (!imageUrl && next.length > 0) {
            setImageUrl(next[0])
        }
    }

    async function removeGalleryUrl(url: string) {
        if (!confirm("¿Estás seguro de que deseas eliminar esta imagen permanentemente? Esta acción no se puede deshacer.")) {
            return
        }

        setLoading(true)
        try {
            await deleteFromR2(url)

            const next = galleryImages.filter((x) => x !== url)
            setGalleryImages(next)

            if (imageUrl === url) {
                setImageUrl(next[0] || "")
            }
        } catch (e) {
            alert("Error al intentar eliminar la imagen.")
        } finally {
            setLoading(false)
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

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Imagen Principal y Galería</Label>
                <div className="flex gap-2 items-center">
                    <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Pega una URL externa o sube imágenes desde tu dispositivo.</p>

                <div className="mt-2">
                    <Label htmlFor="file-upload" className={`cursor-pointer inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all shadow-sm ${uploading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                        {uploading ? "Procesando archivos..." : "Subir imágenes (múltiple)"}
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

                {/* Panel de Subidas Activas y Recientes (Premium) */}
                {activeUploads.length > 0 && (
                    <div className="mt-4 border rounded-xl bg-card text-card-foreground shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
                            <div className="flex items-center gap-2">
                                <UploadCloud className="h-4 w-4 text-primary" />
                                <h4 className="font-bold text-xs">Progreso de Carga de Archivos</h4>
                            </div>
                            {activeUploads.every(up => up.status !== "uploading") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                                    onClick={() => setActiveUploads([])}
                                >
                                    Limpiar historial
                                </Button>
                            )}
                        </div>
                        <div className="divide-y max-h-60 overflow-y-auto">
                            {activeUploads.map((up) => {
                                const isUploading = up.status === "uploading"
                                const isSuccess = up.status === "success"
                                const isError = up.status === "error"

                                return (
                                    <div key={up.id} className="p-3 space-y-2 hover:bg-muted/10 transition-colors">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded ${up.isImage ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                                                        {up.isImage ? "Imagen" : "Video"}
                                                    </span>
                                                    <p className="text-xs font-bold truncate text-foreground leading-tight" title={up.fileName}>
                                                        {up.fileName}
                                                    </p>
                                                </div>
                                                <p className={`text-[10px] mt-1 ${isError ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                                                    {up.stepText}
                                                </p>
                                            </div>

                                            <div className="flex-shrink-0 text-right">
                                                {isUploading && (
                                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                                                        {up.progress}%
                                                    </span>
                                                )}
                                                {isSuccess && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full border border-green-200/40">
                                                        <CheckCircle2 className="h-2.5 w-2.5" /> Éxito
                                                    </span>
                                                )}
                                                {isError && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full border border-red-200/40">
                                                        <AlertCircle className="h-2.5 w-2.5" /> Error
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Barra de Progreso */}
                                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative">
                                            <div
                                                className={`h-full transition-all duration-300 rounded-full ${
                                                    isSuccess
                                                        ? "bg-green-500"
                                                        : isError
                                                        ? "bg-red-500"
                                                        : "bg-primary"
                                                }`}
                                                style={{ width: `${up.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {imageUrl && (
                    <div className="mt-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                        <Label className="mb-2 block">Vista Previa Principal</Label>
                        <div className="h-48 w-full md:w-64 rounded-lg border overflow-hidden relative bg-muted/20">
                            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <Label className="text-base">Galería de Imágenes (hasta 10)</Label>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">{galleryImages.length}/10</span>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Agregar URL de imagen manualmente..."
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
                        Agregar URL
                    </Button>
                </div>

                {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {galleryImages.map((url, idx) => (
                            <div key={`${url}-${idx}`} className="group relative rounded-lg border bg-popover overflow-hidden hover:shadow-md transition-shadow">
                                <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                                    #{idx + 1}
                                </div>

                                <div className="aspect-square relative bg-muted/30">
                                    <Image src={url} alt={`Imagen ${idx + 1}`} fill className="object-cover" />
                                </div>

                                <div className="p-2 space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="icon"
                                                className="h-7 w-7"
                                                title="Mover atrás"
                                                onClick={() => moveGalleryIndex(idx, idx - 1)}
                                                disabled={idx === 0}
                                            >
                                                <ArrowUp className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="icon"
                                                className="h-7 w-7"
                                                title="Mover adelante"
                                                onClick={() => moveGalleryIndex(idx, idx + 1)}
                                                disabled={idx === galleryImages.length - 1}
                                            >
                                                <ArrowDown className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-7 w-7"
                                            title="Eliminar"
                                            onClick={() => removeGalleryUrl(url)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={idx === 0 ? "default" : "outline"}
                                        size="sm"
                                        className="w-full h-7 text-xs"
                                        onClick={() => makeGalleryMain(url)}
                                        disabled={idx === 0}
                                    >
                                        {idx === 0 ? <><Star className="h-3 w-3 mr-1 fill-current" /> Principal</> : "Hacer Principal"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/10">
                        <p>No hay imágenes en la galería</p>
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-base">Videos del Producto (hasta 6)</Label>
                        <p className="text-xs text-muted-foreground mt-1">Sube videos cortos para mostrar mejor tu producto.</p>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">{videos.length}/6</span>
                </div>

                <div className="mt-2">
                    <Label htmlFor="video-upload" className={`cursor-pointer inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all shadow-sm ${uploading || videos.length >= 6 ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                        {uploading ? "Subiendo videos..." : "Subir Videos (MP4/WebM)"}
                    </Label>
                    <Input
                        id="video-upload"
                        type="file"
                        accept="video/mp4,video/webm"
                        multiple
                        className="hidden"
                        onChange={handleVideoUpload}
                        disabled={uploading || videos.length >= 6}
                    />
                </div>

                {videos.length > 0 ? (
                    <div className="space-y-2">
                        {videos.map((url, idx) => (
                            <div key={`${url}-${idx}`} className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
                                <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold ring-1 ring-slate-200">
                                    {idx + 1}
                                </div>

                                <div className="min-w-0 flex-1 overflow-hidden">
                                    <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate block text-blue-600">
                                        {url.split('/').pop()}
                                    </a>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Subir posición"
                                        onClick={() => moveVideoIndex(idx, idx - 1)}
                                        disabled={idx === 0}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Bajar posición"
                                        onClick={() => moveVideoIndex(idx, idx + 1)}
                                        disabled={idx === videos.length - 1}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        title="Eliminar video"
                                        onClick={() => setVideos((prev) => prev.filter((x) => x !== url))}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/10">
                        <p>No hay videos cargados</p>
                    </div>
                )}
            </div>
        </div>
    )
}
