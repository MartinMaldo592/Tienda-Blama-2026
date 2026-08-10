
export default function DevolucionesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-bold mb-3 border border-[#FFD4E2]">
                    <span>Garantía y Confianza</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-[#2D2D2D]">Política de Cambios y Devoluciones</h1>
                <p className="text-sm text-[#7C6A72]">Garantía de Satisfacción BLAMA Fitness • Pilates • Gym</p>
            </div>

            <div className="bg-white border border-[#FFD4E2] p-8 md:p-12 rounded-3xl shadow-xs space-y-8 text-[#2D2D2D]">
                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">1. PLAZOS PARA LA DEVOLUCIÓN O CAMBIO</h2>
                    <p className="text-[#7C6A72]">
                        Aceptamos cambios y devoluciones dentro de los <strong>7 días calendario</strong> posteriores a la recepción de tu pedido, siempre que el artículo conserve su empaque y no haya sido utilizado.
                    </p>
                    <p className="mt-2 text-[#7C6A72]">
                        Para productos con defecto de fabricación en costuras, elastómeros o válvulas, el plazo de reclamo con reemplazo inmediato es de <strong>30 días calendario</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">2. CONDICIONES DEL PRODUCTO</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-[#7C6A72]">
                        <li>Estar en su estado original sin uso de entrenamiento.</li>
                        <li>Contar con sus etiquetas, bolsa de transporte y accesorios completos.</li>
                        <li>Presentar el número de pedido o comprobante de compra.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">3. CANAL DE ATENCIÓN DIRECTA</h2>
                    <p className="text-[#7C6A72]">
                        Para gestionar un cambio de producto o atención de garantía:
                    </p>
                    <ul className="list-none mt-2 space-y-1 text-[#7C6A72]">
                        <li><strong>WhatsApp Asesoras:</strong> +51 958 279 604</li>
                        <li><strong>Email Directo:</strong> hola@blama.shop</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2 text-[#FF6FA7]">4. COSTOS DE ENVÍO POR GARANTÍA</h2>
                    <p className="text-[#7C6A72]">
                        Si el cambio es por falla de fábrica o envío incorrecto, <strong>BLAMA asume el 100% de los costos de recojo y reenvío</strong> a todo el Perú.
                    </p>
                </section>
            </div>
        </div>
    )
}
