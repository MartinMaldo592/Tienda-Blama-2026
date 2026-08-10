
export default function PoliticaEnviosPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-bold mb-3 border border-[#FFD4E2]">
                    <span>Información al Cliente</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-[#2D2D2D]">Política de Envíos</h1>
                <p className="text-sm text-[#7C6A72]">BLAMA Fitness • Pilates • Gym • Lifestyle — Última actualización: Febrero 2026</p>
            </div>

            <div className="bg-white border border-[#FFD4E2] p-8 md:p-12 rounded-3xl shadow-xs space-y-8 text-[#2D2D2D]">
                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">1. COBERTURA</h2>
                    <p className="text-[#7C6A72]">
                        Realizamos envíos a nivel nacional en todo el territorio peruano (Lima Metropolitana y Provincias).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">2. TIEMPOS DE ENTREGA</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-[#7C6A72]">
                        <li><strong>Lima Metropolitana:</strong> De 24 a 48 horas hábiles después de confirmado el pedido.</li>
                        <li><strong>Provincias:</strong> De 2 a 5 días hábiles a través de agencias autorizadas (Olva Courier / Shalom).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">3. COSTOS DE ENVÍO Y PAGO CONTRAENTREGA</h2>
                    <p className="text-[#7C6A72]">
                        Ofrecemos servicio de <strong>pago contraentrega</strong> en Lima Metropolitana. En provincias, enviamos previa coordinación a agencia.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">4. SEGUIMIENTO Y ATENCIÓN</h2>
                    <p className="text-[#7C6A72]">
                        Recibirás tu código de seguimiento e información de entrega en tiempo real a través de WhatsApp de nuestras asesoras BLAMA.
                    </p>
                </section>
            </div>
        </div>
    )
}
