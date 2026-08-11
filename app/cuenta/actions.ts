"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase.server"
import { revalidatePath } from "next/cache"

function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export interface CustomerProfile {
    id: string
    email: string
    nombre: string
    telefono?: string
    dni?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    referencia?: string
    puntos: number
    role: string
    created_at?: string
}

/**
 * Registro de un nuevo cliente en la tienda
 */
export async function registerCustomerAction(args: {
    email: string
    password: string
    nombre: string
    telefono?: string
}) {
    try {
        const email = args.email.trim().toLowerCase()
        const password = args.password
        const nombre = args.nombre.trim()
        const telefono = args.telefono?.trim() || ""

        if (!email || !password || !nombre) {
            return { error: "Por favor completa los campos obligatorios." }
        }

        if (password.length < 6) {
            return { error: "La contraseña debe tener al menos 6 caracteres." }
        }

        const supabase = await createClient()

        // 1. Registro en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre,
                    telefono,
                }
            }
        })

        if (authError) {
            console.error("Error en signUp:", authError)
            return { error: authError.message || "Error al registrar la cuenta." }
        }

        if (!authData.user) {
            return { error: "No se pudo crear el usuario." }
        }

        const userId = authData.user.id
        const supabaseAdmin = getAdminClient()

        // 2. Crear o actualizar entrada en tabla public.usuarios con rol 'user'
        const { error: userTableErr } = await supabaseAdmin.from("usuarios").upsert({
            id: userId,
            email,
            nombre,
            telefono,
            role: "user",
            activo: true,
            puntos: 0,
        })

        if (userTableErr) {
            console.error("Error guardando en usuarios:", userTableErr)
        }

        // 3. Vincular pedidos de invitados previos asociados al mismo email
        try {
            await supabaseAdmin.rpc("vincular_pedidos_usuario", {
                p_usuario_id: userId,
                p_email: email,
            })
        } catch (e) {
            console.error("Error vinculando pedidos previos:", e)
        }

        // 4. Iniciar sesión automáticamente si no requiere confirmación de email inmediata
        if (authData.session) {
            return { success: true, autoLogin: true }
        }

        return { 
            success: true, 
            message: "Cuenta creada exitosamente. Inicia sesión con tus credenciales." 
        }

    } catch (err: any) {
        console.error("Error en registerCustomerAction:", err)
        return { error: err.message || "Error interno procesando el registro." }
    }
}

/**
 * Iniciar sesión de cliente
 */
export async function loginCustomerAction(email: string, password: string) {
    try {
        const cleanEmail = email.trim().toLowerCase()
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
        })

        if (error) {
            return { error: "Correo o contraseña incorrectos." }
        }

        if (data.user) {
            const supabaseAdmin = getAdminClient()
            // Vincular pedidos pendientes por si realizó alguna compra previa como invitado
            try {
                await supabaseAdmin.rpc("vincular_pedidos_usuario", {
                    p_usuario_id: data.user.id,
                    p_email: cleanEmail,
                })
            } catch (e) {
                // Silencioso
            }
        }

        return { success: true }
    } catch (err: any) {
        console.error("Error en loginCustomerAction:", err)
        return { error: "Error de servidor al iniciar sesión." }
    }
}

/**
 * Obtener el perfil completo del cliente actual
 */
export async function getCustomerProfileAction(): Promise<{ profile: CustomerProfile | null; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { profile: null }
        }

        const supabaseAdmin = getAdminClient()
        const { data, error } = await supabaseAdmin
            .from("usuarios")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()

        if (error) {
            console.error("Error buscando perfil de usuario:", error)
            return { profile: null, error: error.message }
        }

        if (!data) {
            // Si por alguna razón no existía en public.usuarios, creamos un registro por defecto
            const newProfile = {
                id: user.id,
                email: user.email || "",
                nombre: user.user_metadata?.nombre || user.email?.split("@")[0] || "Cliente",
                telefono: user.user_metadata?.telefono || "",
                role: "user",
                puntos: 0,
            }
            await supabaseAdmin.from("usuarios").insert(newProfile)
            return { profile: newProfile }
        }

        return {
            profile: {
                id: data.id,
                email: data.email || "",
                nombre: data.nombre || "",
                telefono: data.telefono || "",
                dni: data.dni || "",
                departamento: data.departamento || "",
                provincia: data.provincia || "",
                distrito: data.distrito || "",
                direccion: data.direccion || "",
                referencia: data.referencia || "",
                puntos: data.puntos || 0,
                role: data.role || "user",
                created_at: data.created_at || "",
            }
        }
    } catch (err: any) {
        console.error("Error en getCustomerProfileAction:", err)
        return { profile: null, error: err.message }
    }
}

/**
 * Actualizar datos personales y dirección por defecto del cliente
 */
export async function updateCustomerProfileAction(profileData: {
    nombre: string
    telefono?: string
    dni?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    referencia?: string
}) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: "No estás autenticado." }
        }

        const supabaseAdmin = getAdminClient()

        const { error } = await supabaseAdmin
            .from("usuarios")
            .update({
                nombre: profileData.nombre.trim(),
                telefono: profileData.telefono?.trim() || null,
                dni: profileData.dni?.trim() || null,
                departamento: profileData.departamento?.trim() || null,
                provincia: profileData.provincia?.trim() || null,
                distrito: profileData.distrito?.trim() || null,
                direccion: profileData.direccion?.trim() || null,
                referencia: profileData.referencia?.trim() || null,
            })
            .eq("id", user.id)

        if (error) {
            console.error("Error actualizando perfil:", error)
            return { error: "Error al actualizar la información del perfil." }
        }

        revalidatePath("/mi-cuenta")
        return { success: true }
    } catch (err: any) {
        console.error("Error en updateCustomerProfileAction:", err)
        return { error: err.message || "Error al actualizar la cuenta." }
    }
}

/**
 * Obtener todos los pedidos asociados al cliente (por usuario_id o por email)
 */
export async function getCustomerOrdersAction() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { orders: [] }
        }

        const supabaseAdmin = getAdminClient()

        // Buscar pedidos por usuario_id o por email_contacto
        const { data: orders, error } = await supabaseAdmin
            .from("pedidos")
            .select(`
                *,
                pedido_items (
                    id,
                    producto_id,
                    producto_nombre,
                    variante_nombre,
                    cantidad,
                    precio_unitario,
                    productos (
                        imagen_url
                    )
                )
            `)
            .or(`usuario_id.eq.${user.id},email_contacto.ilike.${user.email}`)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error obteniendo pedidos del cliente:", error)
            return { orders: [], error: error.message }
        }

        return { orders: orders || [] }
    } catch (err: any) {
        console.error("Error en getCustomerOrdersAction:", err)
        return { orders: [], error: err.message }
    }
}

/**
 * Cerrar sesión de usuario cliente
 */
export async function logoutCustomerAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/")
    return { success: true }
}
