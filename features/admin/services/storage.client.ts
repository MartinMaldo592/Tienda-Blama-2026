
export async function uploadToR2(file: File): Promise<string | null> {
    try {
        // 1. Get Presigned URL
        const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, contentType: file.type }),
        })

        if (!res.ok) {
            const errText = await res.text()
            throw new Error(`Failed to get upload URL: ${res.status} ${errText}`)
        }

        const { uploadUrl, publicUrl } = await res.json()

        // 2. Upload File to R2
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        })

        if (!uploadRes.ok) throw new Error("Failed to upload to R2")

        return publicUrl
    } catch (error) {
        console.error("R2 Upload Error:", error)
        return null
    }
}
