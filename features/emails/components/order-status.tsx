import {
    Html, Head, Body, Container, Section, Row, Column,
    Text, Hr, Link, Preview, Heading, Font
} from "@react-email/components"

interface OrderStatusProps {
    clienteNombre: string
    pedidoId: number
    status: string
    trackingCode?: string | null
    keyRecojo?: string | null // PIN
    metodoEnvio?: string | null
    direccion?: string | null
    estaPagado?: boolean // <-- Nuevo parámetro!
    whatsappTienda?: string
}

export function OrderStatusEmail({
    clienteNombre = "Cliente",
    pedidoId = 0,
    status = "Preparando",
    trackingCode,
    keyRecojo,
    metodoEnvio,
    direccion,
    estaPagado = false,
    whatsappTienda = "+51958279604",
}: OrderStatusProps) {
    const pedidoFormateado = `#${pedidoId.toString().padStart(6, "0")}`

    // Determinar textos y colores según el estado
    let statusTitle = "Actualización de tu Pedido"
    let statusDescription = `El estado de tu pedido ${pedidoFormateado} ha cambiado.`
    let badgeColor = "#eab308" // Amber para Preparando
    let badgeText = "🟡 PREPARANDO"
    let statusIcon = "📦"

    const currentStatus = String(status || "").toLowerCase()

    if (currentStatus === "preparando") {
        statusTitle = "¡Tu pedido se está preparando!"
        statusDescription = "Nuestro equipo está seleccionando y empaquetando tus productos con el máximo cuidado. Te avisaremos apenas lo entreguemos a la agencia de envíos."
        badgeColor = "#d97706"
        badgeText = "📦 EN PREPARACIÓN"
        statusIcon = "📦"
    } else if (currentStatus === "enviado") {
        statusTitle = "¡Tu pedido está en camino!"
        statusDescription = "¡Grandes noticias! Ya entregamos tu paquete al courier. Abajo encontrarás los datos necesarios para realizar el seguimiento o el recojo."
        badgeColor = "#7c3aed" // Púrpura para Enviado
        badgeText = "🚀 EN CAMINO"
        statusIcon = "🚚"
    } else if (currentStatus === "entregado") {
        statusTitle = "¡Tu pedido fue entregado!"
        statusDescription = "Confirmamos que tu paquete ha sido recibido exitosamente. ¡Muchas gracias por comprar en Blama Shop! Esperamos volver a verte pronto."
        badgeColor = "#059669" // Verde para Entregado
        badgeText = "✅ ENTREGADO"
        statusIcon = "🎉"
    }

    // Tracker Visual (recibido -> preparando -> enviado)
    const step1Done = true
    const step2Done = currentStatus === "preparando" || currentStatus === "enviado" || currentStatus === "entregado"
    const step3Done = currentStatus === "enviado" || currentStatus === "entregado"
    const step4Done = currentStatus === "entregado"

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
                {statusIcon} {statusTitle} - Pedido {pedidoFormateado}
            </Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>

                    {/* Header */}
                    <Section style={headerStyle}>
                        <Text style={logoStyle}>BLAMA</Text>
                        <Text style={logoSubtitleStyle}>SHOP</Text>
                    </Section>

                    {/* Status Badge & Title */}
                    <Section style={successBadgeSection}>
                        <span style={{ ...badgeStyle, backgroundColor: badgeColor + "15", color: badgeColor, border: `1px solid ${badgeColor}30` }}>
                            {badgeText}
                        </span>
                        <Heading as="h1" style={mainTitleStyle}>
                            {statusTitle}
                        </Heading>
                        <Text style={subtitleStyle}>
                            Hola <strong>{clienteNombre}</strong>, {statusDescription}
                        </Text>
                    </Section>

                    <Hr style={dividerStyle} />

                    {/* Progress Tracker (3 steps) */}
                    <Section style={trackerSection}>
                        <Row style={{ width: "100%", maxWidth: "340px", margin: "0 auto" }}>
                            {/* Paso 1: Recibido */}
                            <Column style={{ width: "25%", textAlign: "center" as const }}>
                                <div style={{ ...trackerDotStyle, backgroundColor: "#10b981", color: "#ffffff" }}>✓</div>
                                <Text style={{ ...trackerLabelStyle, color: "#047857", fontWeight: "600" }}>Confirmado</Text>
                            </Column>
                            
                            {/* Linea 1 */}
                            <Column style={{ width: "12%", paddingBottom: "16px" }}>
                                <div style={{ height: "2px", backgroundColor: step2Done ? "#10b981" : "#e5e7eb" }} />
                              </Column>

                            {/* Paso 2: Preparando */}
                            <Column style={{ width: "26%", textAlign: "center" as const }}>
                                <div style={{ 
                                    ...trackerDotStyle, 
                                    backgroundColor: step3Done ? "#10b981" : currentStatus === "preparando" ? "#f59e0b" : "#e5e7eb",
                                    color: step3Done || currentStatus === "preparando" ? "#ffffff" : "#9ca3af"
                                }}>
                                    {step3Done ? "✓" : "2"}
                                </div>
                                <Text style={{ 
                                    ...trackerLabelStyle, 
                                    color: step3Done ? "#047857" : currentStatus === "preparando" ? "#d97706" : "#9ca3af",
                                    fontWeight: step3Done || currentStatus === "preparando" ? "600" : "400"
                                }}>
                                    Preparación
                                </Text>
                            </Column>

                            {/* Linea 2 */}
                            <Column style={{ width: "12%", paddingBottom: "16px" }}>
                                <div style={{ height: "2px", backgroundColor: step3Done ? "#10b981" : "#e5e7eb" }} />
                            </Column>

                            {/* Paso 3: Enviado */}
                            <Column style={{ width: "25%", textAlign: "center" as const }}>
                                <div style={{ 
                                    ...trackerDotStyle, 
                                    backgroundColor: step4Done ? "#10b981" : currentStatus === "enviado" ? "#7c3aed" : "#e5e7eb",
                                    color: step4Done || currentStatus === "enviado" ? "#ffffff" : "#9ca3af"
                                }}>
                                    {step4Done ? "✓" : "3"}
                                </div>
                                <Text style={{ 
                                    ...trackerLabelStyle, 
                                    color: step4Done ? "#047857" : currentStatus === "enviado" ? "#7c3aed" : "#9ca3af",
                                    fontWeight: step4Done || currentStatus === "enviado" ? "600" : "400"
                                }}>
                                    En camino
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={dividerStyle} />

                    {/* Order Details & Summary */}
                    <Section style={orderInfoSection}>
                        <Row>
                            <Column style={{ width: "50%" }}>
                                <Text style={labelStyle}>Número de Pedido</Text>
                                <Text style={valueStyle}>{pedidoFormateado}</Text>
                            </Column>
                            <Column style={{ width: "50%" }}>
                                <Text style={labelStyle}>Última Actualización</Text>
                                <Text style={valueStyle}>{new Date().toLocaleDateString("es-PE", { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Tracking Info Card */}
                    {currentStatus === "enviado" && (trackingCode || keyRecojo) && (
                        <>
                            <Hr style={dividerStyle} />
                            <Section style={{ ...orderInfoSection, backgroundColor: "#faf5ff", border: "1px solid #e9d5ff", margin: "16px 40px", borderRadius: "8px" }}>
                                <Heading as="h2" style={{ ...sectionTitleStyle, padding: "0", color: "#581c87", fontSize: "15px", marginBottom: "12px" }}>
                                    📦 Datos del Courier / Agencia
                                </Heading>
                                {metodoEnvio && (
                                    <div style={{ marginBottom: "10px" }}>
                                        <Text style={{ ...labelStyle, color: "#a855f7" }}>Agencia / Courier</Text>
                                        <Text style={valueStyle}>{metodoEnvio}</Text>
                                    </div>
                                )}
                                {trackingCode && (
                                    <div style={{ marginBottom: "10px" }}>
                                        <Text style={{ ...labelStyle, color: "#a855f7" }}>Código de Rastreo / Número de Guía</Text>
                                        <Text style={{ ...valueStyle, fontSize: "16px", color: "#581c87", fontFamily: "monospace" }}>{trackingCode}</Text>
                                    </div>
                                )}
                                {estaPagado ? (
                                    keyRecojo && (
                                        <div>
                                            <Text style={{ ...labelStyle, color: "#a855f7" }}>Clave / Código de Recojo (PIN)</Text>
                                            <Text style={{ ...valueStyle, fontSize: "16px", color: "#7e22ce", fontFamily: "monospace" }}>{keyRecojo}</Text>
                                            <Text style={{ fontSize: "11px", color: "#a21caf", marginTop: "2px", marginBottom: "0" }}>
                                                ⚠️ Presenta este código al recoger tu paquete en la agencia.
                                            </Text>
                                        </div>
                                    )
                                ) : (
                                    <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "12px", borderRadius: "6px", marginTop: "8px" }}>
                                        <Text style={{ ...labelStyle, color: "#b45309", marginBottom: "4px" }}>🔐 Clave de Retiro Protegida</Text>
                                        <Text style={{ fontSize: "12px", color: "#b45309", margin: "0", lineHeight: "1.4" }}>
                                            Tu paquete ya está en la agencia Shalom. Para obtener tu <strong>Clave de Retiro (PIN)</strong> de 4 dígitos y poder recoger tu pedido, por favor cancela el saldo restante y envíanos el comprobante por WhatsApp presionando el botón de abajo.
                                        </Text>
                                    </div>
                                )}
                            </Section>
                        </>
                    )}

                    {/* Shipping Address */}
                    {direccion && (
                        <>
                            <Hr style={dividerStyle} />
                            <Section style={orderInfoSection}>
                                <Text style={labelStyle}>Dirección de Entrega</Text>
                                <Text style={{ ...valueStyle, fontSize: "14px", fontWeight: "normal" }}>{direccion}</Text>
                            </Section>
                        </>
                    )}

                    <Hr style={dividerStyle} />

                    {/* CTA / WhatsApp Support */}
                    <Section style={ctaSection}>
                        <Text style={ctaText}>
                            ¿Quieres coordinar algo adicional o tienes dudas?
                        </Text>
                        <Link
                            href={`https://wa.me/${whatsappTienda.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola, consulto por mi pedido ${pedidoFormateado}`)}`}
                            style={ctaButton}
                        >
                            💬 Escríbenos por WhatsApp
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={footerStyle}>
                        <Text style={footerText}>
                            Este correo fue generado automáticamente al actualizar el estado de tu compra en nuestro sistema logístico.
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
    padding: "32px 40px 20px",
    textAlign: "center" as const,
}

const badgeStyle = {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: "700" as const,
    letterSpacing: "0.8px",
    marginBottom: "16px",
}

const mainTitleStyle = {
    fontSize: "22px",
    fontWeight: "700" as const,
    color: "#111827",
    margin: "0 0 8px",
    lineHeight: "1.2",
}

const subtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
    margin: "0",
}

const dividerStyle = {
    borderColor: "#e5e7eb",
    margin: "0 40px",
}

const orderInfoSection = {
    padding: "20px 40px",
}

const trackerSection = {
    padding: "24px 40px",
}

const trackerDotStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    fontSize: "14px",
    fontWeight: "700" as const,
    lineHeight: "32px",
    margin: "0 auto 6px",
    textAlign: "center" as const,
}

const trackerLabelStyle = {
    fontSize: "11px",
    margin: "0",
    lineHeight: "1.1",
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
    fontSize: "11px",
    color: "#a1a1aa",
    margin: "2px 0",
    lineHeight: "1.5",
}
