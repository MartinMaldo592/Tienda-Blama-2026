"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase.server"

// Cliente administrador para saltarse RLS y actualizar tabla usuarios
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function loginWithLockout(email: string, password: string) {
    try {
        const supabaseAdmin = getAdminClient()

        // 1. Verificamos si la cuenta está bloqueada ANTES de intentar login
        const { data: usuarios, error: userError } = await supabaseAdmin
            .from('usuarios')
            .select('intentos_fallidos, bloqueado_hasta')
            .eq('email', email)
            .limit(1)

        const usuario = usuarios && usuarios.length > 0 ? usuarios[0] : null

        if (userError) {
            console.error("Error consultando usuario:", userError)
        }

        if (usuario) {
            if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
                const minutosRestantes = Math.ceil((new Date(usuario.bloqueado_hasta).getTime() - new Date().getTime()) / 60000)
                return { 
                    error: `Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta nuevamente en ${minutosRestantes} minutos.`,
                    isLocked: true
                }
            }
        }

        // 2. Intentamos iniciar sesión con el cliente SSR (para setear las cookies en el navegador)
        const supabase = await createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            console.log("Error de Supabase Auth:", error.message, "Usuario encontrado:", !!usuario)
            
            // Si el error es de credenciales, registramos el fallo
            if (error.message.includes("Invalid login credentials") && usuario) {
                const nuevosIntentos = (usuario.intentos_fallidos || 0) + 1
                let nuevoBloqueo = null
                
                // Si llega a 5 intentos, bloqueamos por 15 minutos
                if (nuevosIntentos >= 5) {
                    nuevoBloqueo = new Date(Date.now() + 15 * 60000).toISOString()
                }

                await supabaseAdmin
                    .from('usuarios')
                    .update({ 
                        intentos_fallidos: nuevosIntentos,
                        bloqueado_hasta: nuevoBloqueo
                    })
                    .eq('email', email)

                if (nuevoBloqueo) {
                    return { 
                        error: "Cuenta bloqueada temporalmente por múltiples intentos fallidos (5). Intenta nuevamente en 15 minutos.",
                        isLocked: true 
                    }
                }
                
                return { error: `Credenciales incorrectas. Te quedan ${5 - nuevosIntentos} intentos.` }
            }
            
            return { error: "Credenciales incorrectas. Inténtalo de nuevo." }
        }

        // 3. Login exitoso -> Limpiamos el historial de fallos
        if (usuario && usuario.intentos_fallidos > 0) {
            await supabaseAdmin
                .from('usuarios')
                .update({ 
                    intentos_fallidos: 0,
                    bloqueado_hasta: null
                })
                .eq('email', email)
        }

        return { success: true }
    } catch (err: any) {
        console.error("Error en loginWithLockout:", err)
        return { error: "Error interno procesando el inicio de sesión." }
    }
}

export async function clearLockout() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user && user.email) {
            const supabaseAdmin = getAdminClient()
            await supabaseAdmin
                .from('usuarios')
                .update({ 
                    intentos_fallidos: 0,
                    bloqueado_hasta: null
                })
                .eq('email', user.email)
        }
    } catch (e) {
        console.error("Error limpiando historial de fallos:", e)
    }
}
