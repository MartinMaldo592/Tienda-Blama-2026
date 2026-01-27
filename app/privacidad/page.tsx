
export default function PrivacidadPage() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Política de Privacidad</h1>
            <div className="prose prose-lg dark:prose-invert bg-card text-card-foreground border border-border p-8 rounded-2xl shadow-sm space-y-4">
                <p className="text-sm text-muted-foreground">Última actualización: Enero 2026</p>

                <h3 className="text-xl font-bold text-foreground">1. Recopilación de Información</h3>
                <p>
                    En <strong>Blama Shop</strong>, respetamos tu privacidad. Solo recopilamos la información necesaria para procesar tus pedidos y brindarte una mejor experiencia de compra (nombre, dirección de envío, número de teléfono).
                </p>

                <h3 className="text-xl font-bold text-foreground">2. Uso de la Información</h3>
                <p>
                    Utilizamos tus datos exclusivamente para:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Coordinar y entregar tus pedidos.</li>
                    <li>Comunicarnos contigo vía WhatsApp sobre el estado de tu compra.</li>
                    <li>Mejorar nuestros servicios y catálogo de productos.</li>
                </ul>

                <h3 className="text-xl font-bold text-foreground">3. Protección de Datos</h3>
                <p>
                    No compartimos tu información personal con terceros ajenos a la logística de entrega. Tus datos están seguros con nosotros.
                </p>
            </div>
        </div>
    )
}
