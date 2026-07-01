/**
 * Cloudinary Fetch Optimization Helper
 * 
 * Transforms existing image URLs (from R2/Supabase) into Cloudinary Fetch URLs
 * that deliver auto-optimized images (AVIF/WebP, compressed, resized) via CDN.
 * 
 * This does NOT require uploading images to Cloudinary — it uses the "fetch"
 * delivery type which pulls the original from your existing storage on-the-fly.
 */

const CLOUD_NAME = "z3gt6ekz"
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch`

/**
 * Returns a Cloudinary Fetch URL that auto-optimizes the given image URL.
 * 
 * @param originalUrl - The original image URL (e.g. from R2 or Supabase)
 * @param options - Optional configuration for width, quality, etc.
 * @returns The Cloudinary-optimized URL, or the original URL if it can't be transformed
 * 
 * @example
 * getOptimizedImageUrl("https://assets.blama.shop/foto.jpg")
 * // => "https://res.cloudinary.com/z3gt6ekz/image/fetch/f_auto,q_auto/https://assets.blama.shop/foto.jpg"
 * 
 * getOptimizedImageUrl("https://assets.blama.shop/foto.jpg", { width: 400 })
 * // => "https://res.cloudinary.com/z3gt6ekz/image/fetch/f_auto,q_auto,w_400/https://assets.blama.shop/foto.jpg"
 */
export function getOptimizedImageUrl(
  originalUrl: string | null | undefined,
  options?: {
    width?: number
    quality?: "auto" | "auto:low" | "auto:eco" | "auto:good" | "auto:best" | number
    format?: "auto" | "webp" | "avif" | "jpg" | "png"
    crop?: "fill" | "fit" | "limit" | "thumb" | "scale"
    gravity?: "auto" | "face" | "center"
    dpr?: "auto" | number
  }
): string {
  // Guard: return empty/falsy URLs as-is
  if (!originalUrl || typeof originalUrl !== "string") return originalUrl || ""

  const url = originalUrl.trim()

  // Don't transform data URIs, empty strings, or already-Cloudinary URLs
  if (!url || url.startsWith("data:") || url.includes("res.cloudinary.com")) {
    return url
  }

  // Only transform URLs that are actual HTTP(S) URLs (skip relative paths, blobs, etc.)
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return url
  }

  // Don't transform video URLs
  const lowerUrl = url.toLowerCase()
  if (
    lowerUrl.endsWith(".mp4") ||
    lowerUrl.endsWith(".webm") ||
    lowerUrl.endsWith(".mov") ||
    lowerUrl.endsWith(".m4v")
  ) {
    return url
  }

  // Build transformations
  const transformations: string[] = []

  // Format: auto by default (Cloudinary picks AVIF/WebP/JPEG based on browser support)
  const fmt = options?.format ?? "auto"
  transformations.push(`f_${fmt}`)

  // Quality: auto by default (smart compression without visible loss)
  const q = options?.quality ?? "auto"
  transformations.push(`q_${q}`)

  // Width: optional responsive sizing
  if (options?.width) {
    transformations.push(`w_${Math.round(options.width)}`)
  }

  // Crop mode: optional
  if (options?.crop) {
    transformations.push(`c_${options.crop}`)
  }

  // Gravity: optional (useful for face detection in thumbnails)
  if (options?.gravity) {
    transformations.push(`g_${options.gravity}`)
  }

  // DPR (Device Pixel Ratio): optional
  if (options?.dpr) {
    transformations.push(`dpr_${options.dpr}`)
  }

  const transformString = transformations.join(",")

  return `${CLOUDINARY_BASE}/${transformString}/${encodeURI(url)}`
}

/**
 * Helper to get a Cloudinary loader for Next.js Image component.
 * Use this as the `loader` prop on <Image> to bypass Next.js built-in
 * image optimization and use Cloudinary's CDN instead.
 * 
 * @example
 * <Image
 *   src="https://assets.blama.shop/foto.jpg"
 *   loader={cloudinaryLoader}
 *   width={400}
 *   height={400}
 *   alt="Producto"
 * />
 */
export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  return getOptimizedImageUrl(src, {
    width,
    quality: quality ? quality : "auto",
  })
}
