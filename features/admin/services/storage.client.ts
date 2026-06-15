export function uploadToR2(
    file: File,
    onProgress?: (percent: number, step: string) => void
): Promise<string | null> {
    return new Promise(async (resolve) => {
        try {
            const isVideo = file.type.startsWith("video/")
            const isLargeFile = file.size > 4 * 1024 * 1024 // Mayor a 4MB

            // Si es video o es un archivo pesado, subirlo directamente a R2 usando una presigned URL
            if (isVideo || isLargeFile) {
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
                formData.append("file", file)

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
                    if (onProgress) onProgress(85, "Comprimiendo y optimizando imagen con Sharp en el servidor...")
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
