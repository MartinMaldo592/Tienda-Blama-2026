export function isInAppBrowser() {
    const ua = String(navigator?.userAgent || "")
    const uaLower = ua.toLowerCase()

    if (uaLower.includes("fban") || uaLower.includes("fbav")) return true
    if (uaLower.includes("instagram")) return true
    if (uaLower.includes("tiktok")) return true
    if (uaLower.includes("snapchat")) return true
    if (uaLower.includes("pinterest")) return true
    if (uaLower.includes("linkedinapp")) return true
    if (uaLower.includes("wv") || uaLower.includes("; wv")) return true
    if (uaLower.includes("webview")) return true
    return false
}

export function isMobileDevice() {
    const ua = String(navigator?.userAgent || "").toLowerCase()
    if (ua.includes("android")) return true
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return true
    try {
        if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return true
    } catch (err) {
    }
    return false
}
