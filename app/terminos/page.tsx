
export default function TerminosPage() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Términos y Condiciones</h1>
            <div className="prose prose-lg dark:prose-invert bg-card text-card-foreground border border-border p-8 rounded-2xl shadow-sm space-y-4">
                <p className="text-sm text-muted-foreground">Última actualización: Enero 2026</p>

                <h3 className="text-xl font-bold text-foreground">1. Introducción</h3>
                <p>
                    Bienvenido a <strong>Blama Shop</strong>. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones. Estos términos rigen tu acceso y uso de todos los servicios ofrecidos por nuestra tienda.
                </p>

                <h3 className="text-xl font-bold text-foreground">2. Proceso de Compra</h3>
                <p>
                    Nuestra plataforma facilita la visualización de productos. Para concretar una compra, el proceso finaliza mediante coordinación directa por WhatsApp, lo que nos permite ofrecer una atención personalizada y confirmar detalles de stock y entrega en tiempo real.
                </p>

                <h3 className="text-xl font-bold text-foreground">3. Pagos</h3>
                <p>
                    Los pagos se coordinan directamente con nuestros asesores de venta. Aceptamos diversos métodos de pago según disponibilidad (Yape, Plin, Transferencia BCP/Interbank, o Pago Contraentrega en zonas seleccionadas). <strong>No realizamos cobros automáticos a través de la web</strong>.
                </p>

                <h3 className="text-xl font-bold text-foreground">4. Cambios y Devoluciones</h3>
                <p>
                    Aceptamos cambios únicamente por defectos de fábrica reportados dentro de las primeras 48 horas de recibido el producto. El producto debe estar sin uso y en su empaque original.
                </p>
            </div>
        </div>
    )
}
