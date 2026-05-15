import {
    Html, Head, Body, Container, Section, Row, Column,
    Text, Hr, Img, Link, Preview, Heading, Font
} from "@react-email/components"

interface OrderItem {
    producto_nombre: string
    variante_nombre?: string | null
    cantidad: number
    precio_unitario: number
}

interface OrderConfirmationProps {
    clienteNombre: string
    pedidoId: number
    items: OrderItem[]
    subtotal: number
    descuento: number
    total: number
    metodoPago: string
    transactionId?: string
    direccion?: string
    metodoEnvio?: string
    whatsappTienda?: string
}

function formatCurrency(amount: number) {
    return `S/ ${amount.toFixed(2)}`
}

export function OrderConfirmationEmail({
    clienteNombre = "Cliente",
    pedidoId = 0,
    items = [],
    subtotal = 0,
    descuento = 0,
    total = 0,
    metodoPago = "Tarjeta",
    transactionId,
    direccion,
    metodoEnvio,
    whatsappTienda = "+51958279604",
}: OrderConfirmationProps) {
    const pedidoFormateado = `#${pedidoId.toString().padStart(6, "0")}`

    return (
        <Html lang="es">
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>
                {metodoPago === "Contraentrega"
                    ? `¡Pedido recibido! Tu orden ${pedidoFormateado} está en camino - Tienda Blama`
                    : `¡Pago confirmado! Tu pedido ${pedidoFormateado} está siendo procesado - Tienda Blama`}
            </Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>

                    {/* Header */}
                    <Section style={headerStyle}>
                        <Text style={logoStyle}>BLAMA</Text>
                        <Text style={logoSubtitleStyle}>SHOP</Text>
                    </Section>

                    {/* Success Badge */}
                    <Section style={successBadgeSection}>
                        <div style={checkCircleStyle}>✓</div>
                        <Heading as="h1" style={mainTitleStyle}>
                            {metodoPago === "Contraentrega" ? "¡Pedido Recibido!" : "¡Pago Confirmado!"}
                        </Heading>
                        <Text style={subtitleStyle}>
                            Hola <strong>{clienteNombre}</strong>, {metodoPago === "Contraentrega"
                                ? "hemos registrado tu pedido correctamente. Pagas al recibir tu producto."
                                : "hemos recibido tu pago exitosamente."}
                            {" "}Tu pedido ya está siendo preparado por nuestro equipo.
                        </Text>
                    </Section>

                    <Hr style={dividerStyle} />

                    {/* Order Info */}
                    <Section style={orderInfoSection}>
                        <Row>
                            <Column style={{ width: "50%" }}>
                                <Text style={labelStyle}>Número de Pedido</Text>
                                <Text style={valueStyle}>{pedidoFormateado}</Text>
                            </Column>
                            <Column style={{ width: "50%" }}>
                                <Text style={labelStyle}>Método de Pago</Text>
                                <Text style={valueStyle}>{metodoPago}</Text>
                            </Column>
                        </Row>
                        {transactionId && (
                            <Row style={{ marginTop: "12px" }}>
                                <Column>
                                    <Text style={labelStyle}>ID de Transacción</Text>
                                    <Text style={{ ...valueStyle, fontSize: "12px", color: "#6b7280" }}>{transactionId}</Text>
                                </Column>
                            </Row>
                        )}
                    </Section>

                    <Hr style={dividerStyle} />

                    {/* Items Table */}
                    <Section>
                        <Heading as="h2" style={sectionTitleStyle}>
                            Detalle de tu Compra
                        </Heading>

                        {/* Header Row */}
                        <Row style={tableHeaderStyle}>
                            <Column style={{ width: "55%" }}>
                                <Text style={tableHeaderText}>Producto</Text>
                            </Column>
                            <Column style={{ width: "15%", textAlign: "center" as const }}>
                                <Text style={tableHeaderText}>Cant.</Text>
                            </Column>
                            <Column style={{ width: "30%", textAlign: "right" as const }}>
                                <Text style={tableHeaderText}>Precio</Text>
                            </Column>
                        </Row>

                        {/* Item Rows */}
                        {items.map((item, idx) => (
                            <Row key={idx} style={idx % 2 === 0 ? tableRowStyle : tableRowAltStyle}>
                                <Column style={{ width: "55%" }}>
                                    <Text style={itemNameStyle}>
                                        {item.producto_nombre}
                                        {item.variante_nombre && (
                                            <span style={variantStyle}> — {item.variante_nombre}</span>
                                        )}
                                    </Text>
                                </Column>
                                <Column style={{ width: "15%", textAlign: "center" as const }}>
                                    <Text style={itemQtyStyle}>{item.cantidad}</Text>
                                </Column>
                                <Column style={{ width: "30%", textAlign: "right" as const }}>
                                    <Text style={itemPriceStyle}>
                                        {formatCurrency(item.precio_unitario * item.cantidad)}
                                    </Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={dividerStyle} />

                    {/* Totals */}
                    <Section style={totalsSection}>
                        <Row>
                            <Column style={{ width: "60%" }}>
                                <Text style={totalLabelStyle}>Subtotal</Text>
                            </Column>
                            <Column style={{ width: "40%", textAlign: "right" as const }}>
                                <Text style={totalValueStyle}>{formatCurrency(subtotal)}</Text>
                            </Column>
                        </Row>
                        {descuento > 0 && (
                            <Row>
                                <Column style={{ width: "60%" }}>
                                    <Text style={{ ...totalLabelStyle, color: "#059669" }}>Descuento</Text>
                                </Column>
                                <Column style={{ width: "40%", textAlign: "right" as const }}>
                                    <Text style={{ ...totalValueStyle, color: "#059669" }}>
                                        -{formatCurrency(descuento)}
                                    </Text>
                                </Column>
                            </Row>
                        )}
                        <Hr style={{ borderColor: "#e5e7eb", margin: "8px 0" }} />
                        <Row>
                            <Column style={{ width: "60%" }}>
                                <Text style={grandTotalLabelStyle}>{metodoPago === "Contraentrega" ? "Total a Pagar" : "Total Pagado"}</Text>
                            </Column>
                            <Column style={{ width: "40%", textAlign: "right" as const }}>
                                <Text style={grandTotalValueStyle}>{formatCurrency(total)}</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Shipping Info */}
                    {(direccion || metodoEnvio) && (
                        <>
                            <Hr style={dividerStyle} />
                            <Section style={orderInfoSection}>
                                <Heading as="h2" style={sectionTitleStyle}>Datos de Envío</Heading>
                                {metodoEnvio && (
                                    <>
                                        <Text style={labelStyle}>Método de Envío</Text>
                                        <Text style={valueStyle}>{metodoEnvio}</Text>
                                    </>
                                )}
                                {direccion && (
                                    <>
                                        <Text style={{ ...labelStyle, marginTop: "8px" }}>Dirección</Text>
                                        <Text style={valueStyle}>{direccion}</Text>
                                    </>
                                )}
                            </Section>
                        </>
                    )}

                    <Hr style={dividerStyle} />

                    {/* CTA / WhatsApp */}
                    <Section style={ctaSection}>
                        <Text style={ctaText}>
                            ¿Tienes alguna pregunta sobre tu pedido?
                        </Text>
                        <Link
                            href={`https://wa.me/${whatsappTienda.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola, consulta sobre mi pedido ${pedidoFormateado}`)}`}
                            style={ctaButton}
                        >
                            💬 Escríbenos por WhatsApp
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={footerStyle}>
                        <Text style={footerText}>
                            Este correo fue generado automáticamente por Tienda Blama.
                        </Text>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} Blama Shop. Todos los derechos reservados.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}



// ── Styles ──

const bodyStyle = {
    backgroundColor: "#f4f4f5",
    fontFamily: "'Inter', Arial, sans-serif",
    margin: "0",
    padding: "40px 0",
}

const containerStyle = {
    backgroundColor: "#ffffff",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden" as const,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
}

const headerStyle = {
    backgroundColor: "#0a0a0a",
    padding: "28px 40px",
    textAlign: "center" as const,
}

const logoStyle = {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800" as const,
    letterSpacing: "6px",
    margin: "0",
    lineHeight: "1",
}

const logoSubtitleStyle = {
    color: "#a1a1aa",
    fontSize: "11px",
    fontWeight: "500" as const,
    letterSpacing: "4px",
    margin: "4px 0 0 0",
}

const successBadgeSection = {
    padding: "32px 40px 24px",
    textAlign: "center" as const,
}

const checkCircleStyle = {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    fontSize: "28px",
    fontWeight: "700" as const,
    lineHeight: "56px",
    margin: "0 auto 16px",
    textAlign: "center" as const,
}

const mainTitleStyle = {
    fontSize: "24px",
    fontWeight: "700" as const,
    color: "#111827",
    margin: "0 0 8px",
}

const subtitleStyle = {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    margin: "0",
}

const dividerStyle = {
    borderColor: "#e5e7eb",
    margin: "0 40px",
}

const orderInfoSection = {
    padding: "20px 40px",
}

const labelStyle = {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 4px",
}

const valueStyle = {
    fontSize: "15px",
    fontWeight: "600" as const,
    color: "#111827",
    margin: "0",
}

const sectionTitleStyle = {
    fontSize: "16px",
    fontWeight: "700" as const,
    color: "#111827",
    margin: "0 0 16px",
    padding: "0 40px",
}

const tableHeaderStyle = {
    backgroundColor: "#f9fafb",
    padding: "10px 40px",
    borderBottom: "1px solid #e5e7eb",
}

const tableHeaderText = {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0",
}

const tableRowStyle = {
    padding: "12px 40px",
}

const tableRowAltStyle = {
    padding: "12px 40px",
    backgroundColor: "#fafafa",
}

const itemNameStyle = {
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#111827",
    margin: "0",
    lineHeight: "1.4",
}

const variantStyle = {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "400" as const,
}

const itemQtyStyle = {
    fontSize: "14px",
    color: "#374151",
    margin: "0",
}

const itemPriceStyle = {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#111827",
    margin: "0",
}

const totalsSection = {
    padding: "16px 40px 20px",
}

const totalLabelStyle = {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0",
}

const totalValueStyle = {
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#374151",
    margin: "4px 0",
}

const grandTotalLabelStyle = {
    fontSize: "16px",
    fontWeight: "700" as const,
    color: "#111827",
    margin: "4px 0",
}

const grandTotalValueStyle = {
    fontSize: "18px",
    fontWeight: "800" as const,
    color: "#111827",
    margin: "4px 0",
}

const ctaSection = {
    padding: "24px 40px",
    textAlign: "center" as const,
}

const ctaText = {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 16px",
}

const ctaButton = {
    display: "inline-block",
    backgroundColor: "#25d366",
    color: "#ffffff",
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600" as const,
    textDecoration: "none",
}

const footerStyle = {
    backgroundColor: "#fafafa",
    padding: "24px 40px",
    textAlign: "center" as const,
    borderTop: "1px solid #e5e7eb",
}

const footerText = {
    fontSize: "12px",
    color: "#9ca3af",
    margin: "2px 0",
    lineHeight: "1.5",
}
