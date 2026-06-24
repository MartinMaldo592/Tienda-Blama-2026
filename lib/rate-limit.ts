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
export async function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

    if (redisUrl && redisToken) {
        try {
            const { maxRequests, windowSeconds, prefix = "rl" } = config
            const key = `${prefix}:${identifier}`

            const res = await fetch(`${redisUrl}/pipeline`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${redisToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([
                    ["INCR", key],
                    ["TTL", key]
                ])
            })

            const pipelineRes = await res.json()
            if (Array.isArray(pipelineRes)) {
                const count = Number(pipelineRes[0]?.result ?? 0)
                let ttl = Number(pipelineRes[1]?.result ?? -1)

                if (count === 1 || ttl === -1) {
                    await fetch(`${redisUrl}/EXPIRE/${key}/${windowSeconds}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${redisToken}` }
                    }).catch(() => {})
                    ttl = windowSeconds
                }

                const remaining = Math.max(0, maxRequests - count)
                const resetIn = ttl > 0 ? ttl : windowSeconds

                if (count > maxRequests) {
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
        } catch (error) {
            console.error("Upstash Redis Rate Limit Error (falling back to memory):", error)
        }
    }

    // ── FALLBACK: In-Memory Rate Limiting ──
    if (process.env.NODE_ENV === "production") {
        console.warn("⚠️ WARNING: Rate limiting falling back to in-memory store in production! This is not robust in Serverless. Ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.")
    }
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
