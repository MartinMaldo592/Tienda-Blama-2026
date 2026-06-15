export async function uploadToR2(file: File): Promise<string | null> {
    try {
        const isVideo = file.type.startsWith("video/")
        const isLargeFile = file.size > 4 * 1024 * 1024 // Mayor a 4MB

        // Si es video o es un archivo pesado, subirlo directamente a R2 usando una presigned URL
        if (isVideo || isLargeFile) {
            // 1. Obtener la URL firmada del backend
            const presignedRes = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            })

            if (!presignedRes.ok) {
                const errText = await presignedRes.text()
                throw new Error(`Error al generar URL pre-firmada: ${presignedRes.status} ${errText}`)
            }

            const { uploadUrl, publicUrl } = await presignedRes.json()

            // 2. Subir directamente el archivo a Cloudflare R2 vía PUT
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            })

            if (!uploadRes.ok) {
                throw new Error(`Error en la subida directa a R2: ${uploadRes.status}`)
            }

            return publicUrl
        }

        const formData = new FormData()
        formData.append("file", file)

        // Use a new dedicated proxy route para imágenes pequeñas (y aplicar sharp en el servidor)
        const res = await fetch("/api/upload-proxy", {
            method: "POST",
            body: formData,
        })

        if (!res.ok) {
            const errText = await res.text()
            throw new Error(`Upload failed: ${res.status} ${errText}`)
        }

        const { publicUrl } = await res.json()
        return publicUrl
    } catch (error) {
        console.error("R2 Upload Error:", error)
        return null
    }
}

export async function deleteFromR2(fileUrl: string): Promise<boolean> {
    try {
        const res = await fetch("/api/delete-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl }),
        })

        if (!res.ok) {
            console.error("Delete failed server-side", await res.text())
            // Don't return false immediately if it might be a Supabase URL that naturally fails R2 deletion 
            // but effectively we consider it "done" for the UI if we want to remove it.
            // However, strictly speaking, returns false.
            return false
        }
        return true
    } catch (e) {
        console.error("Delete failed network", e)
        return false
    }
}
