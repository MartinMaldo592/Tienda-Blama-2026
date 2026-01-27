
import { Truck, MapPin, Clock } from "lucide-react"

export default function EnviosPage() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Política de Envíos</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center text-center shadow-sm">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Envíos a Todo el Perú</h3>
                    <p className="text-muted-foreground text-sm">Llegamos a donde estés, con cobertura nacional.</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center text-center shadow-sm">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Lima y Provincias</h3>
                    <p className="text-muted-foreground text-sm">Tarifas preferenciales y tiempos de entrega optimizados.</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center text-center shadow-sm">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
                    <p className="text-muted-foreground text-sm">Procesamos tu pedido el mismo día de la confirmación.</p>
                </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none bg-card text-card-foreground border border-border p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-foreground mt-0">Tiempos de Entrega</h3>
                <ul className="list-disc pl-5 mb-6">
                    <li><strong>Lima Metropolitana:</strong> 24 a 48 horas hábiles.</li>
                    <li><strong>Provincias:</strong> 2 a 5 días hábiles, dependiendo del destino.</li>
                </ul>

                <h3 className="text-xl font-bold text-foreground">Costo de Envío</h3>
                <p>
                    El costo de envío se calcula al momento de coordinar tu pedido y depende de la ubicación exacta de entrega y el volumen del paquete. ¡Consulta por nuestras promociones de <strong>Envío Gratis</strong>!
                </p>

                <h3 className="text-xl font-bold text-foreground mt-6">Seguimiento de Pedido</h3>
                <p className="mb-0">
                    Una vez despachado tu pedido, te enviaremos el número de seguimiento o la confirmación de envío directamente a tu WhatsApp para que sepas exactamente cuándo llegará.
                </p>
            </div>
        </div>
    )
}
