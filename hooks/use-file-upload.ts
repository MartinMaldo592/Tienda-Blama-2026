import { useState } from 'react'
import { createClient } from '@/lib/supabase.client'
import { toast } from 'sonner'

interface UseFileUploadProps {
    bucketName: string
    onUploadComplete?: (url: string) => Promise<void> | void
    onDeleteComplete?: () => Promise<void> | void
}

export function useFileUpload({ bucketName, onUploadComplete, onDeleteComplete }: UseFileUploadProps) {
    const supabase = createClient()
    const [isUploading, setIsUploading] = useState(false)

    /**
     * Uploads a file to Supabase Storage and triggers the callback
     */
    const upload = async (file: File, customFileName?: string) => {
        if (!file) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            // Use custom name or generate a random safe one
            const fileName = customFileName || `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName)

            // 3. Callback (usually DB update)
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
