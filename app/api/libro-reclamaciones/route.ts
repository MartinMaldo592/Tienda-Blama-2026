import { createClient } from "@/lib/supabase.server";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function POST(req: Request) {
    try {
        const supabase = await createClient(); // Use server client
        const body = await req.json();

        // Basic Validation
        if (!body.nombres || !body.apellidos || !body.dni || !body.email || !body.detalle_reclamo) {
            return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
        }

        // Insert into DB
        const { data, error } = await supabase
            .from("libro_reclamaciones")
            .insert([
                {
                    nombres: body.nombres,
                    apellidos: body.apellidos,
                    tipo_documento: body.tipo_documento || 'DNI',
                    numero_documento: body.dni,
                    email: body.email,
                    telefono: body.telefono,
                    direccion: body.direccion,
                    departamento: body.departamento,
                    provincia: body.provincia,
                    distrito: body.distrito,
                    menor_edad: body.menor_edad || false,
                    apoderado_nombres: body.apoderado_nombres,
                    apoderado_dni: body.apoderado_dni,
                    tipo_bien: body.tipo_bien, // PRODUCTO/SERVICIO
                    monto_reclamado: body.monto_reclamado,
                    descripcion_bien: body.descripcion_bien,
                    tipo_reclamo: body.tipo_reclamo, // QUEJA/RECLAMO
                    detalle_reclamo: body.detalle_reclamo,
                    pedido_relacionado: body.pedido_relacionado,
                    estado: 'PENDIENTE'
                }
            ])
            .select('codigo, created_at')
            .single();

        if (error) {
            console.error("Error inserting complaint:", error);
            return NextResponse.json({ error: "No se pudo registrar, intente nuevamente." }, { status: 500 });
        }

        // Here we would send an email with the copy. Since we don't have email setup confirmed, 
        // we will rely on returning the code.
        // Ideally use Resend/Nodemailer here.

        return NextResponse.json({
            success: true,
            codigo: data.codigo,
            fecha: format(new Date(data.created_at), "dd/MM/yyyy HH:mm")
        });

    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
