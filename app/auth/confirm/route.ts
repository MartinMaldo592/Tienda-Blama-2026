import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase.server"

/**
 * Token Exchange Endpoint (PKCE Flow)
 * 
 * Intercepta los enlaces de autenticación enviados por correo (recovery, signup, etc.)
 * y realiza el intercambio de token de forma segura en el servidor.
 * 
 * El token se consume UNA SOLA VEZ — un segundo intento con el mismo token fallará.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type") as EmailOtpType | null
    const next = searchParams.get("next") ?? "/"

    const redirectTo = request.nextUrl.clone()

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            redirectTo.pathname = next
            redirectTo.searchParams.delete("token_hash")
            redirectTo.searchParams.delete("type")
            redirectTo.searchParams.delete("next")
            return NextResponse.redirect(redirectTo)
        }
    }

    // Token inválido o ya consumido — redirigir a página de error
    redirectTo.pathname = "/auth/login"
    redirectTo.searchParams.set("error", "invalid_token")
    redirectTo.searchParams.delete("token_hash")
    redirectTo.searchParams.delete("type")
    redirectTo.searchParams.delete("next")
    return NextResponse.redirect(redirectTo)
}
