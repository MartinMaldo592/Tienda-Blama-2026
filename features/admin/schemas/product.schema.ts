import { z } from "zod"

// Helper for optional empty strings to be null or undefined
const emptyToNull = (val: unknown) => {
    if (val === "" || val === null || val === undefined) return null
    return val
}

export const productSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),

    // Attributes
    materiales: z.string().optional(),
    tamano: z.string().optional(),
    color: z.string().optional(),
    cuidados: z.string().optional(),
    uso: z.string().optional(),

    // Pricing & Stock
    precio: z.coerce.number().min(0.01, "Precio debe ser mayor a 0"),
    precio_antes: z.coerce.number().optional().nullable().transform(val => val === 0 ? null : val), // Handle 0 as valid or null explicitly? 
    // Actually, input could be empty string. coerce handles check logic.
    // But standard input type="number" returns "123" string or "".
    stock: z.coerce.number().min(0, "Stock debe ser mayor o igual a 0"),
    calificacion: z.coerce.number().min(0).max(5).default(5),

    // Media
    imagen_url: z.string().optional().nullable(),
    imagenes: z.array(z.string()).default([]),
    videos: z.array(z.string()).default([]),

    // Category - handled carefully
    categoria_id: z.coerce.number().optional().nullable(),

    // Sub-entities
    especificaciones: z.array(z.object({
        id: z.number().optional(),
        clave: z.string().min(1, "Clave requerida"),
        valor: z.string(),
        orden: z.coerce.number().default(0)
    })).default([]),

    variantes: z.array(z.object({
        id: z.number().optional(),
        etiqueta: z.string().min(1, "Etiqueta requerida"),
        // Keeping as strings to bind directly to inputs easily, will parse on submit
        precio: z.string().optional(),
        precio_antes: z.string().optional(),
        stock: z.string().optional().default("0"),
        activo: z.boolean().default(true)
    })).default([])
})

export type ProductFormValues = z.infer<typeof productSchema>

// Extended type for submit transformation if needed, or just usage
