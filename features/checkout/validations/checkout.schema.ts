import { z } from "zod"

/**
 * ──────────────────────────────────────────────────────────────────
 * REGLAS UNIVERSALES DE VALIDACIÓN PARA CLIENTES (Frontend y Backend)
 * ──────────────────────────────────────────────────────────────────
 * Centralizar estas reglas asegura que si mañana el gobierno cambia
 * la longitud de los documentos de identidad, o decides aceptar nuevos
 * formatos, solo tengas que editar este único archivo y protegerás 
 * tanto la interfaz visual como las APIs con la misma consistencia.
 *
 * Canonical location: features/checkout/validations/checkout.schema.ts
 */

export const identitySchema = {
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 letras")
        .max(100, "Nombre demasiado largo"),

    // Soporta DNI peruano (8), Carnet de Extranjería y Pasaporte (9-15 caracteres)
    document: z.string()
        .min(8, "Mínimo 8 caracteres")
        .max(15, "Máximo 15 caracteres")
        .regex(/^[a-zA-Z0-9]+$/, "Solo números y letras, sin guiones ni espacios"),

    // Soporta teléfonos fijos y celulares peruanos, e internacionales con símbolo +
    phone: z.string()
        .min(9, "Mínimo 9 dígitos")
        .max(15, "Teléfono demasiado largo")
        .regex(/^\+?[0-9\s]+$/, "Debe contener solo números o formato internacional"),

    // Email opcional
    email: z.string()
        .email("Formato de correo electrónico inválido")
        .optional()
        .or(z.literal(""))
}

export const addressSchema = {
    address: z.string()
        .min(5, "La dirección detallada es obligatoria")
        .max(250, "La dirección es demasiado larga"),

    locationField: z.string()
        .min(2, "Este campo es requerido")
        .max(100, "El texto es muy largo"),

    reference: z.string().nullable().optional()
}

/** 
 * Este es el esquema base usado para extender en los distintos flujos
 * Ejemplo: En la API de Culqi se le suma { token: z.string() }
 */
export const checkoutBaseFields = {
    name: identitySchema.name,
    phone: identitySchema.phone,
    dni: identitySchema.document,
    email: identitySchema.email,
    department: addressSchema.locationField,
    province: addressSchema.locationField,
    district: addressSchema.locationField,
    address: addressSchema.address,
    reference: addressSchema.reference,
    shippingMethod: z.string().min(1, "Método de envío requerido"),
    couponCode: z.string().nullable().optional(),
}
