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
