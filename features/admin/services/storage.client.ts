export async function uploadToR2(file: File): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("file", file)

        // Use a new dedicated proxy route
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
