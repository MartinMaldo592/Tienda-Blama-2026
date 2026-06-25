import { useState } from 'react'
import { toast } from 'sonner'
import { uploadToR2 } from '@/features/admin/services/storage.client'

interface UseFileUploadProps {
    bucketName?: string
    onUploadComplete?: (url: string) => Promise<void> | void
    onDeleteComplete?: () => Promise<void> | void
}

export function useFileUpload({ onUploadComplete, onDeleteComplete }: UseFileUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    /**
     * Uploads a file to Cloudflare R2 and triggers the callback
     */
    const upload = async (file: File, customFileName?: string) => {
        if (!file) return

        setIsUploading(true)
        try {
            const fileToUpload = customFileName
                ? new File([file], customFileName, { type: file.type })
                : file

            // Subir el archivo a R2 (imágenes, PDFs o videos)
            const publicUrl = await uploadToR2(fileToUpload)

            if (!publicUrl) {
                throw new Error("No se pudo obtener la URL del archivo subido")
            }

            // Callback (actualización de base de datos)
            if (onUploadComplete) {
                await onUploadComplete(publicUrl)
            }

            toast.success("Archivo subido correctamente")
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Error al subir archivo")
        } finally {
            setIsUploading(false)
        }
    }

    /**
     * Wraps a deletion logic with loading state and toast
     * Note: Does not delete from storage by default, relies on callback to do DB updates
     */
    const remove = async (overrideDeleteAction?: () => Promise<void>) => {
        setIsUploading(true)
        try {
            if (overrideDeleteAction) {
                await overrideDeleteAction()
            } else if (onDeleteComplete) {
                await onDeleteComplete()
            }
            toast.success("Eliminado correctamente")
        } catch (error: any) {
            console.error("Delete error:", error)
            toast.error(error.message || "Error al eliminar")
        } finally {
            setIsUploading(false)
        }
    }

    return {
        isUploading,
        upload,
        remove
    }
}
