
export default function DevolucionesPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Política de Cambios y Devoluciones</h1>
            <p className="text-muted-foreground mb-8">Esta política describe los términos bajo los cuales BLAMA SHOP ofrece cambios y devoluciones.</p>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-2">1. PLAZOS PARA LA DEVOLUCIÓN</h2>
                    <p>
                        Aceptamos cambios y devoluciones dentro de los <strong>7 días calendario</strong> posteriores a la recepción de su pedido, siempre que el producto no haya sido abierto, usado o dañado.
                    </p>
                    <p className="mt-2">
                        Para productos con defecto de fábrica, el plazo de reclamo es de <strong>30 días calendario</strong> desde la fecha de recepción.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">2. CONDICIONES DEL PRODUCTO</h2>
                    <p>
                        Para ser elegible para una devolución o cambio, su artículo debe cumplir con las siguientes condiciones:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Debe estar sin uso y en la misma condición en que lo recibió.</li>
                        <li>Debe estar en su empaque original sellado.</li>
                        <li>Debe contar con todas sus etiquetas y accesorios.</li>
                        <li>Debe presentar el comprobante de pago (boleta o factura).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">3. PRODUCTOS NO ELEGIBLES</h2>
                    <p>
                        No aceptamos devoluciones de los siguientes artículos por razones de higiene y seguridad:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Ropa interior y trajes de baño.</li>
                        <li>Aretes y piercings.</li>
                        <li>Productos de cuidado personal abiertos.</li>
                        <li>Productos en liquidación o oferta final (&quot;Sale&quot;).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">4. PROCESO DE DEVOLUCIÓN</h2>
                    <p>
                        Para iniciar una devolución, puede contactarnos a través de:
                    </p>
                    <ul className="list-none mt-2 space-y-1">
                        <li><strong>WhatsApp:</strong> +51 958 279 604</li>
                        <li><strong>Email:</strong> <span dangerouslySetInnerHTML={{ __html: "<!--email_off-->soporte@blamashop.com<!--/email_off-->" }} /></li>
                    </ul>
                    <p className="mt-4">
                        Por favor indique su número de pedido y el motivo de la devolución. Si el producto presenta fallas, adjunte fotos claras del defecto.
                    </p>
                    <p className="mt-2">
                        Una vez aprobada la solicitud, le indicaremos la dirección de envío para el retorno del producto.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">5. COSTOS DE ENVÍO</h2>
                    <p>
                        <strong>Cambio por opinión (no me gustó/talla incorrecta):</strong> El cliente asume el costo de envío de retorno y el nuevo envío.
                    </p>
                    <p className="mt-2">
                        <strong>Producto defectuoso o error de envío:</strong> BLAMA SHOP asume todos los costos de envío (recojo y nuevo envío).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">6. REEMBOLSOS</h2>
                    <p>
                        Una vez recibido y inspeccionado su devolución, le notificaremos la aprobación o rechazo de su reembolso.
                        Si es aprobado, el reembolso será procesado a su método de pago original dentro de los 5 a 10 días hábiles siguientes, dependiendo de su banco.
                    </p>
                </section>
            </div>
        </div>
    )
}
