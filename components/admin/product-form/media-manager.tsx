import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, Star, Trash2, UploadCloud } from "lucide-react"
import { deleteFromR2, uploadProductImages, uploadProductVideos } from "@/features/admin"

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

                {imageUrl && (
                    <div className="mt-2 h-32 w-32 rounded-lg border overflow-hidden relative bg-popover">
                        <Image src={imageUrl} alt="Preview" fill className="object-cover" />
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

                                <div className="h-12 w-12 rounded-md overflow-hidden border bg-background flex-shrink-0 relative">
                                    <Image src={url} alt="Imagen" fill className="object-cover" />
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
        </div>
    )
}
