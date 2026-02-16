
export default function PoliticaEnviosPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Política de Envíos</h1>
            <p className="text-muted-foreground mb-8">Última actualización: Febrero 2026</p>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-2">1. COBERTURA</h2>
                    <p>
                        Realizamos envíos a nivel nacional en todo el territorio peruano.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">2. TIEMPOS DE ENTREGA</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Lima Metropolitana:</strong> De 24 a 48 horas hábiles después de confirmado el pedido.</li>
                        <li><strong>Provincias:</strong> De 2 a 5 días hábiles, dependiendo del destino y la accesibilidad de la zona.</li>
                    </ul>
                    <p className="mt-2">
                        Los tiempos de entrega pueden variar en fechas de alta demanda (Cyber Days, Navidad, etc.).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">3. COSTOS DE ENVÍO</h2>
                    <p>
                        El costo de envío se calculará al momento de finalizar la compra, dependiendo del destino y el peso/volumen del paquete.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Lima:</strong> Tarifa plana o variable según distrito.</li>
                        <li><strong>Provincia:</strong> Pago en destino o tarifa calculada por agencia (Olva Courier / Shalom).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">4. PROCESO DE ENTREGA</h2>
                    <p>
                        Las entregas se realizan de lunes a sábado en horario de oficina. Es responsabilidad del cliente asegurarse de que haya una persona mayor de edad disponible para recibir el pedido en la dirección indicada.
                    </p>
                    <p className="mt-2">
                        Si no se encuentra a nadie en el domicilio, la empresa de mensajería realizará un segundo intento o dejará un aviso para coordinar el recojo en agencia.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">5. SEGUIMIENTO DE PEDIDO</h2>
                    <p>
                        Una vez despachado su pedido, recibirá un número de seguimiento (tracking) vía correo electrónico o WhatsApp para que pueda monitorear el estado de su envío.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">6. DAÑOS EN EL TRANSPORTE</h2>
                    <p>
                        Si recibe el paquete con signos visibles de daño o manipulación, por favor no lo reciba y contáctenos inmediatamente. Si el producto sufrió daños durante el transporte, gestionaremos el cambio sin costo adicional.
                    </p>
                </section>
            </div>
        </div>
    )
}
