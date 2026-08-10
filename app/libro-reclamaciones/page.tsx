"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import Link from "next/link"

// Department/Prov/Dist data... For now simple text inputs or simplified select if needed.
// Given time constraints, text inputs are acceptable or basic select.

const formSchema = z.object({
    tipo_documento: z.enum(["DNI", "CE", "RUC"]),
    dni: z.string().min(8, "Mínimo 8 caracteres"),
    nombres: z.string().min(2, "Requerido"),
    apellidos: z.string().min(2, "Requerido"),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(9, "Mínimo 9 dígitos"),
    direccion: z.string().min(5, "Dirección requerida"),
    departamento: z.string().min(2, "Requerido"),
    provincia: z.string().min(2, "Requerido"),
    distrito: z.string().min(2, "Requerido"),
    menor_edad: z.boolean().default(false),
    apoderado_nombres: z.string().optional(),
    apoderado_dni: z.string().optional(),

    tipo_bien: z.enum(["PRODUCTO", "SERVICIO"]),
    monto_reclamado: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto inválido"),
    descripcion_bien: z.string().min(5, "Descripción del bien requerida"),

    tipo_reclamo: z.enum(["QUEJA", "RECLAMO"]),
    detalle_reclamo: z.string().min(20, "Detalle debe ser más específico"),
    pedido_relacionado: z.string().optional(),

    acepto_terminos: z.boolean().refine(val => val === true, {
        message: "Debes aceptar los términos y condiciones"
    }),
}).refine((data) => {
    if (data.menor_edad && (!data.apoderado_nombres || !data.apoderado_dni)) {
        return false;
    }
    return true;
}, {
    message: "Datos de apoderado son requeridos si es menor de edad",
    path: ["apoderado_dni"],
});

type FormValues = z.infer<typeof formSchema>

export default function LibroReclamacionesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successData, setSuccessData] = useState<{ codigo: string, fecha: string } | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            tipo_documento: "DNI",
            tipo_bien: "PRODUCTO",
            tipo_reclamo: "RECLAMO",
            menor_edad: false,
        }
    })

    // Watch menor_edad to show apoderado fields
    const menorEdad = form.watch("menor_edad")

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/libro-reclamaciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al enviar reclamo")
            }

            setSuccessData(result)
            toast.success("Reclamo registrado correctamente")

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (successData) {
        return (
            <div className="container max-w-2xl py-20 px-4 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
                <h1 className="text-3xl font-bold mb-2">Reclamo Registrado</h1>
                <p className="text-muted-foreground mb-8">
                    Tu reclamo ha sido registrado con éxito en nuestro Libro de Reclamaciones Virtual.
                </p>

                <Card className="w-full mb-8 bg-muted/30">
                    <CardHeader>
                        <CardTitle>Detalles del Registro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-left">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Código de Reclamación:</span>
                            <span className="text-primary font-mono font-bold text-lg">{successData.codigo}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Fecha de Registro:</span>
                            <span>{successData.fecha}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Se ha enviado una copia de este registro a tu correo electrónico.
                            Nos pondremos en contacto contigo en un plazo máximo de 15 días hábiles conforme a ley.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button asChild variant="outline">
                        <Link href="/">Volver al Inicio</Link>
                    </Button>
                    <Button onClick={() => window.print()}>Imprimir Constancia</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <div className="mb-8 text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-black mb-2 border border-[#FFD4E2] uppercase tracking-wider">
                    <span>Atención al Consumidor</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[#2D2D2D] uppercase tracking-tight font-serif">Libro de Reclamaciones Virtual</h1>
                <p className="text-sm text-[#7C6A72]">Conforme a lo establecido en el Código de Protección y Defensa del Consumidor del Perú</p>
            </div>

            <Card className="border-[#FFD4E2] rounded-3xl shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#FFF7F9] to-white border-b border-[#FFD4E2] p-6 md:p-8">
                    <CardTitle className="text-xl font-black text-[#FF6FA7]">Hoja de Reclamación Virtual</CardTitle>
                    <CardDescription className="text-xs text-[#7C6A72] mt-1 space-y-0.5">
                        <span className="font-bold text-[#2D2D2D]">RAZÓN SOCIAL:</span> MALDONADO QUINTANA KENNETH MARTIN<br />
                        <span className="font-bold text-[#2D2D2D]">RUC:</span> 10724108453 • <span className="font-bold text-[#2D2D2D]">MARCA REGISTRADA:</span> BLAMA SHOP
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* 1. Identificación del Consumidor */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">1. Identificación del Consumidor Reclamante</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Documento</Label>
                                    <Select onValueChange={(val) => form.setValue("tipo_documento", val as any)} defaultValue="DNI">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DNI">DNI</SelectItem>
                                            <SelectItem value="CE">Carne de Extranjería</SelectItem>
                                            <SelectItem value="RUC">RUC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Número de Documento *</Label>
                                    <Input {...form.register("dni")} placeholder="Ingresa tu número" />
                                    {form.formState.errors.dni && <p className="text-xs text-red-500">{form.formState.errors.dni.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Nombres *</Label>
                                    <Input {...form.register("nombres")} placeholder="Tus nombres" />
                                    {form.formState.errors.nombres && <p className="text-xs text-red-500">{form.formState.errors.nombres.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Apellidos *</Label>
                                    <Input {...form.register("apellidos")} placeholder="Tus apellidos" />
                                    {form.formState.errors.apellidos && <p className="text-xs text-red-500">{form.formState.errors.apellidos.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input {...form.register("email")} type="email" placeholder="correo@ejemplo.com" />
                                    {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Teléfono / Celular *</Label>
                                    <Input {...form.register("telefono")} placeholder="999 999 999" />
                                    {form.formState.errors.telefono && <p className="text-xs text-red-500">{form.formState.errors.telefono.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Dirección *</Label>
                                <Input {...form.register("direccion")} placeholder="Av. Principal 123, Dpto 401" />
                                {form.formState.errors.direccion && <p className="text-xs text-red-500">{form.formState.errors.direccion.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Departamento *</Label>
                                    <Input {...form.register("departamento")} placeholder="Ej. Lima" />
                                    {form.formState.errors.departamento && <p className="text-xs text-red-500">{form.formState.errors.departamento.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Provincia *</Label>
                                    <Input {...form.register("provincia")} placeholder="Ej. Lima" />
                                    {form.formState.errors.provincia && <p className="text-xs text-red-500">{form.formState.errors.provincia.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Distrito *</Label>
                                    <Input {...form.register("distrito")} placeholder="Ej. Miraflores" />
                                    {form.formState.errors.distrito && <p className="text-xs text-red-500">{form.formState.errors.distrito.message}</p>}
                                </div>
                            </div>

                            {/* Menor de edad checkbox */}
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="menor_edad"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    {...form.register("menor_edad")}
                                />
                                <label htmlFor="menor_edad" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Soy menor de edad (requiere datos de apoderado)
                                </label>
                            </div>

                            {menorEdad && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/10 mt-2">
                                    <div className="space-y-2">
                                        <Label>Nombres del Padre/Madre *</Label>
                                        <Input {...form.register("apoderado_nombres")} placeholder="Nombre completo" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>DNI del Padre/Madre *</Label>
                                        <Input {...form.register("apoderado_dni")} placeholder="DNI apoderado" />
                                        {form.formState.errors.apoderado_dni && <p className="text-xs text-red-500">{form.formState.errors.apoderado_dni.message}</p>}
                                    </div>
                                    <p className="text-xs text-muted-foreground col-span-2">
                                        * Datos obligatorios para menores de edad.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 2. Identificación del Bien Contratado */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">2. Identificación del Bien Contratado</h3>

                            <div className="space-y-3">
                                <Label>Tipo de Bien *</Label>
                                <RadioGroup
                                    onValueChange={(val) => form.setValue("tipo_bien", val as any)}
                                    defaultValue="PRODUCTO"
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="PRODUCTO" id="bien-producto" />
                                        <Label htmlFor="bien-producto" className="font-normal">Producto</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="SERVICIO" id="bien-servicio" />
                                        <Label htmlFor="bien-servicio" className="font-normal">Servicio</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Monto Reclamado (S/.) *</Label>
                                    <Input {...form.register("monto_reclamado")} type="number" step="0.01" placeholder="0.00" />
                                    {form.formState.errors.monto_reclamado && <p className="text-xs text-red-500">{form.formState.errors.monto_reclamado.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Número de Pedido (Opcional)</Label>
                                    <Input {...form.register("pedido_relacionado")} placeholder="Ej. #12345" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Descripción del Bien Contratado *</Label>
                                <Textarea {...form.register("descripcion_bien")} placeholder="Ej. Zapatillas Nike Air Max Talla 42" />
                                {form.formState.errors.descripcion_bien && <p className="text-xs text-red-500">{form.formState.errors.descripcion_bien.message}</p>}
                            </div>
                        </div>

                        {/* 3. Detalle de Reclamación */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">3. Detalle de la Reclamación</h3>

                            <div className="space-y-3">
                                <Label>Tipo de Reclamación *</Label>
                                <RadioGroup
                                    onValueChange={(val) => form.setValue("tipo_reclamo", val as any)}
                                    defaultValue="RECLAMO"
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-start space-x-2">
                                        <RadioGroupItem value="RECLAMO" id="tipo-reclamo" className="mt-1" />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="tipo-reclamo" className="font-bold">Reclamo</Label>
                                            <p className="text-sm text-muted-foreground">Disconformidad relacionada a los productos o servicios.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2 mt-2">
                                        <RadioGroupItem value="QUEJA" id="tipo-queja" className="mt-1" />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="tipo-queja" className="font-bold">Queja</Label>
                                            <p className="text-sm text-muted-foreground">Disconformidad no relacionada directamente con el producto o servicio (ej. mala atención).</p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>Detalle *</Label>
                                <Textarea
                                    {...form.register("detalle_reclamo")}
                                    placeholder="Describa detalladamente los hechos que motivan su reclamo..."
                                    className="min-h-[150px]"
                                />
                                {form.formState.errors.detalle_reclamo && <p className="text-xs text-red-500">{form.formState.errors.detalle_reclamo.message}</p>}
                            </div>
                        </div>

                        {/* 4. Aceptación */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="acepto_terminos"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    {...form.register("acepto_terminos")}
                                />
                                <label htmlFor="acepto_terminos" className="text-sm text-muted-foreground leading-snug">
                                    Declaro que la información consignada es veraz y acepto recibir la copia de mi hoja de reclamación al correo electrónico ingresado. Acepto la <Link href="/privacidad" className="text-primary underline">Política de Privacidad</Link>.
                                </label>
                            </div>
                            {form.formState.errors.acepto_terminos && <p className="text-xs text-red-500">{form.formState.errors.acepto_terminos.message}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar Reclamo"
                                )}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
                <p>
                    * La empresa deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles improrrogables.
                </p>
            </div>
        </div>
    )
}
