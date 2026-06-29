function compressImageInBrowser(file: File): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement("canvas")
                let width = img.width
                let height = img.height
                const MAX_WIDTH = 1200
                const MAX_HEIGHT = 1200

                // Redimensionar manteniendo aspect ratio
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width)
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height)
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext("2d")
                if (!ctx) {
                    resolve(file)
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file)
                            return
                        }
                        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
                        const compressedFile = new File([blob], `${nameWithoutExt}.webp`, {
                            type: "image/webp",
                            lastModified: Date.now(),
                        })
                        resolve(compressedFile)
                    },
                    "image/webp",
                    0.82 // Calidad 82% WebP
                )
            }
            img.onerror = () => resolve(file)
        }
        reader.onerror = () => resolve(file)
    })
}

export function uploadToR2(
    file: File,
    onProgress?: (percent: number, step: string) => void
): Promise<string | null> {
    return new Promise(async (resolve) => {
        try {
            const isImage = file.type.startsWith("image/")
            const isVideo = file.type.startsWith("video/")

            let fileToProcess = file
            if (isImage) {
                if (onProgress) onProgress(0, "Optimizando imagen en el navegador...")
                fileToProcess = await compressImageInBrowser(file)
            }

            // Subir directamente si es video o si es un archivo no-imagen pesado.
            // Las imágenes siempre van a través del optimizador sharp.
            const shouldUploadDirectly = isVideo || (!isImage && file.size > 4 * 1024 * 1024)

            if (shouldUploadDirectly) {
                if (onProgress) onProgress(0, "Preparando archivo y generando clave de subida...")
                
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
                    console.error("Error presigned URL:", errText)
                    if (onProgress) onProgress(0, `Error de preparación: ${presignedRes.status}`)
                    resolve(null)
                    return
                }

                const { uploadUrl, publicUrl } = await presignedRes.json()

                if (onProgress) onProgress(5, "Iniciando transferencia directa a R2...")

                // 2. Subir directamente el archivo a Cloudflare R2 vía PUT con XMLHttpRequest para registrar progreso
                const xhr = new XMLHttpRequest()
                xhr.open("PUT", uploadUrl, true)
                xhr.setRequestHeader("Content-Type", file.type)

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.min(98, Math.round((event.loaded / event.total) * 93) + 5)
                        if (onProgress) onProgress(percentComplete, "Subiendo archivo a la nube...")
                    }
                }

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        if (onProgress) onProgress(100, "¡Subida exitosa!")
                        resolve(publicUrl)
                    } else {
                        console.error("PUT upload status error:", xhr.status)
                        if (onProgress) onProgress(0, `Error en la transferencia: ${xhr.status}`)
                        resolve(null)
                    }
                }

                xhr.onerror = (err) => {
                    console.error("XHR PUT upload network error:", err)
                    if (onProgress) onProgress(0, "Error de red durante la transferencia.")
                    resolve(null)
                }

                xhr.send(file)
            } else {
                // Imagen pequeña - Usar proxy con optimización sharp
                if (onProgress) onProgress(0, "Preparando imagen y optimización...")
                
                const formData = new FormData()
                formData.append("file", fileToProcess)

                const xhr = new XMLHttpRequest()
                xhr.open("POST", "/api/upload-proxy", true)

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        // Escalamos la subida hasta el 80% porque luego el servidor hace la compresión sharp
                        const percentComplete = Math.round((event.loaded / event.total) * 80)
                        if (onProgress) onProgress(percentComplete, "Transfiriendo imagen al servidor...")
                    }
                }

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText)
                            if (onProgress) onProgress(100, "¡Procesamiento y subida exitosa!")
                            resolve(response.publicUrl)
                        } catch (e) {
                            console.error("Parse upload response error:", e)
                            if (onProgress) onProgress(0, "Error al procesar la respuesta del servidor.")
                            resolve(null)
                        }
                    } else {
                        console.error("Proxy upload status error:", xhr.status)
                        if (onProgress) onProgress(0, `Error en el servidor: ${xhr.status}`)
                        resolve(null)
                    }
                }

                xhr.onerror = (err) => {
                    console.error("XHR Proxy upload network error:", err)
                    if (onProgress) onProgress(0, "Error de conexión con el servidor.")
                    resolve(null)
                }

                // Callback cuando el navegador termina de enviar la petición (inicia procesamiento en backend)
                xhr.upload.onload = () => {
                    if (onProgress) onProgress(85, "Procesando subida en el servidor...")
                }

                xhr.send(formData)
            }
        } catch (error) {
            console.error("R2 Upload Error:", error)
            if (onProgress) onProgress(0, "Error inesperado al subir el archivo.")
            resolve(null)
        }
    })
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
            return false
        }
        return true
    } catch (e) {
        console.error("Delete failed network", e)
        return false
    }
}
