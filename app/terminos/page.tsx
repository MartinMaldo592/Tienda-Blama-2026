
export default function TerminosPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Términos y Condiciones</h1>
            <p className="text-muted-foreground mb-8">Última actualización: Febrero 2026</p>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-2">1. INFORMACIÓN GENERAL</h2>
                    <p>
                        Este sitio web es operado por <strong>MALDONADO QUINTANA KENNETH MARTIN</strong> con RUC 10724108453, con domicilio fiscal en Av. Larco 123, Miraflores, Lima, Perú. En todo el sitio, los términos "nosotros", "nos" y "nuestro" se refieren a BLAMA SHOP.
                        Al visitar nuestro sitio y/o comprar algo de nosotros, usted acepta los siguientes términos y condiciones.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">2. PRODUCTOS Y PRECIOS</h2>
                    <p>
                        Los precios de nuestros productos están expresados en Soles (S/.). Al estar acogidos al Nuevo Régimen Único Simplificado (RUS), nuestras ventas no están afectas al desglose de IGV en comprobantes de pago tipo boleta de venta.
                        Nos reservamos el derecho de modificar los precios sin previo aviso.
                        Hemos hecho el esfuerzo de mostrar los colores y las imágenes de nuestros productos con la mayor precisión posible. No podemos garantizar que el monitor de su computadora muestre los colores de manera exacta.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">3. MÉTODOS DE PAGO</h2>
                    <p className="mb-4">
                        Ofrecemos diversas opciones de pago para su comodidad y seguridad:
                    </p>

                    <h3 className="font-semibold mt-4 mb-2">A. Pagos en Línea (Vía Culqi)</h3>
                    <p>
                        Aceptamos pagos seguros con tarjetas de crédito y débito (Visa, Mastercard, Amex, Diners), así como pagos mediante Yape, Plin y PagoEfectivo. Todas estas transacciones son procesadas de manera encriptada y segura.
                    </p>

                    <h3 className="font-semibold mt-4 mb-2">B. Pago Contraentrega</h3>
                    <p>
                        Ofrecemos la opción de <strong>Pago Contraentrega</strong> para mayor confianza:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Lima Metropolitana:</strong> Disponible en la mayoría de distritos. El pago se realiza al recibir el producto, en efectivo o Yape/Plin.</li>
                        <li><strong>Provincias:</strong> Disponible en destinos seleccionados (sujeto a cobertura de currier partner).</li>
                        <li>Es indispensable que el cliente se encuentre presente o deje encargado el monto exacto para facilitar la entrega.</li>
                        <li>Esta modalidad requiere una confirmación previa del pedido vía WhatsApp para coordinar la fecha y hora de entrega.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">4. ENVÍOS Y ENTREGAS</h2>
                    <p>
                        Realizamos envíos a todo el Perú.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Lima Metropolitana:</strong> Entrega en 24 a 48 horas hábiles.</li>
                        <li><strong>Provincias:</strong> Entrega de 2 a 5 días hábiles dependiendo del destino (vía Olva Courier o Shalom).</li>
                    </ul>
                    <p className="mt-2">
                        Es responsabilidad del cliente ingresar la dirección correcta. Si el paquete es devuelto por dirección incorrecta, el cliente deberá abonar nuevamente el costo de envío.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">5. PROPIEDAD INTELECTUAL</h2>
                    <p>
                        Todo el contenido del sitio (textos, gráficos, logos, iconos, imágenes) es propiedad exclusiva de BLAMA SHOP o de sus proveedores de contenido y está protegido por las leyes de derechos de autor internacionales y peruanas.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">6. CAMBIOS Y MODIFICACIONES</h2>
                    <p>
                        Nos reservamos el derecho de actualizar o cambiar cualquier parte de estos Términos de Servicio mediante la publicación de actualizaciones y/o cambios en nuestro sitio web. Es su responsabilidad revisar esta página periódicamente.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">7. CONTACTO</h2>
                    <p>
                        Para cualquier duda o consulta sobre nuestros términos, puede contactarnos en:
                    </p>
                    <ul className="list-none mt-2 space-y-1">
                        <li><strong>Email:</strong> soporte@blamashop.com</li>
                        <li><strong>WhatsApp:</strong> +51 958 279 604</li>
                    </ul>
                </section>
            </div>
        </div>
    )
}
