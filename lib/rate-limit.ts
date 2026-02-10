/**
 * Rate Limiter en memoria para API Routes de Next.js
 * Usa un Map con TTL automático para trackear requests por IP
 *
 * Para producción a gran escala, considera migrar a Redis (Upstash)
 * pero para el volumen actual de Tienda Blama esto es suficiente
 */

type RateLimitEntry = {
    count: number
    resetTime: number
}

// Store global — sobrevive entre requests en el mismo worker
const rateLimitStore = new Map<string, RateLimitEntry>()

// Limpieza periódica de entries expiradas (cada 60s)
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 60_000

function cleanupExpired() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now

    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}

type RateLimitConfig = {
    /** Número máximo de requests permitidos en la ventana */
    maxRequests: number
    /** Duración de la ventana en segundos */
    windowSeconds: number
    /** Prefijo para la key (diferencia endpoints distintos) */
    prefix?: string
}

type RateLimitResult = {
    success: boolean
    remaining: number
    resetIn: number // segundos hasta el reset
    headers: Record<string, string>
}

/**
 * Verifica si un request está dentro de los límites de rate
 * @param identifier - Generalmente la IP del cliente
 * @param config - Configuración del rate limit
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    cleanupExpired()

    const { maxRequests, windowSeconds, prefix = "rl" } = config
    const key = `${prefix}:${identifier}`
    const now = Date.now()
    const windowMs = windowSeconds * 1000

    const existing = rateLimitStore.get(key)

    // Si no hay entrada o ya expiró, crear nueva
    if (!existing || now > existing.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        })
        return {
            success: true,
            remaining: maxRequests - 1,
            resetIn: windowSeconds,
            headers: buildHeaders(maxRequests, maxRequests - 1, windowSeconds),
        }
    }

    // Incrementar contador
    existing.count++

    const resetIn = Math.ceil((existing.resetTime - now) / 1000)
    const remaining = Math.max(0, maxRequests - existing.count)

    if (existing.count > maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetIn,
            headers: buildHeaders(maxRequests, 0, resetIn),
        }
    }

    return {
        success: true,
        remaining,
        resetIn,
        headers: buildHeaders(maxRequests, remaining, resetIn),
    }
}

function buildHeaders(
    limit: number,
    remaining: number,
    resetIn: number
): Record<string, string> {
    return {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(resetIn),
    }
}

/**
 * Extrae la IP del cliente de un Request de Next.js
 * Funciona en Vercel (x-forwarded-for) y desarrollo local
 */
export function getClientIP(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for")
    if (forwarded) {
        // x-forwarded-for puede contener múltiples IPs: "client, proxy1, proxy2"
        return forwarded.split(",")[0].trim()
    }
    const realIp = req.headers.get("x-real-ip")
    if (realIp) return realIp.trim()
    return "unknown"
}
