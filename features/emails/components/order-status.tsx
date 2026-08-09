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
    status = "Confirmado",
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
    let badgeColor = "#2563eb"
    let badgeText = "✓ CONFIRMADO"
    let statusIcon = "📦"

    const currentStatus = String(status || "").toLowerCase().trim()

    if (currentStatus === "confirmado") {
        statusTitle = "¡Tu pedido ha sido confirmado!"
        statusDescription = "Tu orden ha sido registrada con éxito y está siendo procesada para su posterior envío."
        badgeColor = "#2563eb"
        badgeText = "✓ CONFIRMADO"
        statusIcon = "📦"
    } else if (currentStatus === "enviado") {
        statusTitle = "¡Tu pedido está en camino!"
        statusDescription = "¡Grandes noticias! Ya entregamos tu paquete al courier. Abajo encontrarás los datos necesarios para realizar el seguimiento o el recojo."
        badgeColor = "#7c3aed" // Púrpura para Enviado
        badgeText = "🚀 EN CAMINO"
        statusIcon = "🚚"
    } else if (currentStatus === "llegó a agencia" || currentStatus === "llego a agencia") {
        statusTitle = "¡Tu pedido está listo para retirar!"
        statusDescription = "¡Excelentes noticias! Tu paquete ya se encuentra en la agencia de destino listo para ser retirado. A continuación tienes los datos y claves necesarios."
        badgeColor = "#0d9488" // Teal para Listo en Agencia
        badgeText = "📦 LISTO EN AGENCIA"
        statusIcon = "📦"
    } else if (currentStatus === "entregado") {
        statusTitle = "¡Tu pedido fue entregado!"
        statusDescription = "Confirmamos que tu paquete ha sido recibido exitosamente. ¡Muchas gracias por comprar en Blama Shop! Esperamos volver a verte pronto."
        badgeColor = "#059669" // Verde para Entregado
        badgeText = "✅ ENTREGADO"
        statusIcon = "🎉"
    } else if (currentStatus === "fallido") {
        statusTitle = "Inconveniente con tu Pedido"
        statusDescription = "Hubo un inconveniente con la entrega de tu pedido. Por favor, comunícate con nosotros por WhatsApp para solucionarlo a la brevedad."
        badgeColor = "#dc2626" // Rojo para Fallido
        badgeText = "⚠️ FALLIDO"
        statusIcon = "⚠️"
    } else if (currentStatus === "cancelado") {
        statusTitle = "Pedido Cancelado"
        statusDescription = "Tu pedido ha sido cancelado en nuestro sistema. Si tienes alguna duda o consideras que es un error, por favor contáctanos."
        badgeColor = "#4b5563" // Gris para Cancelado
        badgeText = "✕ CANCELADO"
        statusIcon = "✕"
    }

    // Tracker Visual (recibido -> preparando -> enviado/agencia -> entregado)
    const step1Done = true
    const step2Done = currentStatus === "preparando" || currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia" || currentStatus === "entregado"
    const step3Done = currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia" || currentStatus === "entregado"
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

                            {/* Paso 2: Confirmado */}
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
                                    backgroundColor: step4Done ? "#10b981" : (currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia") ? "#7c3aed" : "#e5e7eb",
                                    color: step4Done || currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia" ? "#ffffff" : "#9ca3af"
                                }}>
                                    {step4Done ? "✓" : "3"}
                                </div>
                                <Text style={{ 
                                    ...trackerLabelStyle, 
                                    color: step4Done ? "#047857" : (currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia") ? "#7c3aed" : "#9ca3af",
                                    fontWeight: step4Done || currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia" ? "600" : "400"
                                }}>
                                    {(currentStatus === "llegó a agencia" || currentStatus === "llego a agencia") ? "Listo en Agencia" : "En camino"}
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
                    {(currentStatus === "enviado" || currentStatus === "llegó a agencia" || currentStatus === "llego a agencia") && (trackingCode || keyRecojo) && (() => {
                        const normalizedEnvio = String(metodoEnvio || '').toLowerCase()
                        const isShalom = normalizedEnvio.includes('shalom')
                        const isOlva = normalizedEnvio.includes('olva')

                        let shalomOrderNumber = trackingCode || ''
                        let shalomCodeNumber = ''
                        if (isShalom && trackingCode && trackingCode.includes('|')) {
                            const parts = trackingCode.split('|')
                            shalomOrderNumber = parts[0]
                            shalomCodeNumber = parts[1]
                        }

                        return (
                            <>
                                <Hr style={dividerStyle} />
                                <Section style={{ 
                                    ...orderInfoSection, 
                                    backgroundColor: isShalom ? "#f0fdf4" : "#faf5ff", 
                                    border: isShalom ? "1px solid #bbf7d0" : "1px solid #e9d5ff", 
                                    margin: "16px 40px", 
                                    borderRadius: "12px",
                                    padding: "24px"
                                }}>
                                    <Heading as="h2" style={{ ...sectionTitleStyle, padding: "0", color: isShalom ? "#166534" : "#581c87", fontSize: "15px", marginBottom: "16px" }}>
                                        📦 Detalles del Envío {isShalom ? "(Agencia Shalom)" : isOlva ? "(Olva Courier)" : ""}
                                    </Heading>
                                    {metodoEnvio && (
                                        <div style={{ marginBottom: "12px" }}>
                                            <Text style={{ ...labelStyle, color: isShalom ? "#15803d" : "#a855f7" }}>Agencia / Courier de Destino</Text>
                                            <Text style={{ ...valueStyle, color: "#1f2937" }}>{metodoEnvio}</Text>
                                        </div>
                                    )}
                                    
                                    {isShalom ? (
                                        <>
                                            {shalomOrderNumber && (
                                                <div style={{ marginBottom: "12px" }}>
                                                    <Text style={{ ...labelStyle, color: "#15803d" }}>Número de Orden Shalom</Text>
                                                    <Text style={{ ...valueStyle, fontSize: "16px", color: "#166534", fontFamily: "monospace", fontWeight: "700" }}>{shalomOrderNumber}</Text>
                                                </div>
                                            )}
                                            {shalomCodeNumber && (
                                                <div style={{ marginBottom: "12px" }}>
                                                    <Text style={{ ...labelStyle, color: "#15803d" }}>Código de Orden</Text>
                                                    <Text style={{ ...valueStyle, fontSize: "16px", color: "#166534", fontFamily: "monospace", fontWeight: "700" }}>{shalomCodeNumber}</Text>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        trackingCode && (
                                            <div style={{ marginBottom: "12px" }}>
                                                <Text style={{ ...labelStyle, color: isOlva ? "#0369a1" : "#a855f7" }}>Número de Guía / Tracking</Text>
                                                <Text style={{ ...valueStyle, fontSize: "16px", color: isOlva ? "#075985" : "#581c87", fontFamily: "monospace", fontWeight: "700" }}>{trackingCode}</Text>
                                            </div>
                                        )
                                    )}

                                    {/* PIN de Shalom block / Olva Tracking link */}
                                    {isShalom ? (
                                        estaPagado ? (
                                            keyRecojo && (
                                                <div style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "16px", borderRadius: "10px", marginTop: "8px", textAlign: "center" as const }}>
                                                    <Text style={{ ...labelStyle, color: "#065f46", fontSize: "10px", marginBottom: "4px" }}>🔑 PIN DE RETIRO EXCLUSIVO</Text>
                                                    <Text style={{ fontSize: "28px", color: "#047857", fontFamily: "monospace", fontWeight: "900", margin: "6px 0", letterSpacing: "4px" }}>{keyRecojo}</Text>
                                                    <Text style={{ fontSize: "11px", color: "#065f46", marginTop: "2px", marginBottom: "0", fontWeight: "500" }}>
                                                        ✓ Presenta este PIN de 4 dígitos en ventanilla de Shalom para retirar tu paquete.
                                                    </Text>
                                                </div>
                                            )
                                        ) : (
                                            <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "14px", borderRadius: "10px", marginTop: "8px" }}>
                                                <Text style={{ ...labelStyle, color: "#b45309", marginBottom: "4px", fontSize: "11px" }}>🔒 CLAVE DE RETIRO BLOQUEADA (SALDO PENDIENTE)</Text>
                                                <Text style={{ fontSize: "12px", color: "#92400e", margin: "0", lineHeight: "1.4", fontWeight: "500" }}>
                                                    Tu paquete ya está listo. Para obtener tu <strong>Clave de Retiro (PIN)</strong> y poder recoger tu pedido de la ventanilla de Shalom, por favor cancela el saldo restante de tu producto y envíanos el comprobante por WhatsApp presionando el botón verde de abajo.
                                                </Text>
                                            </div>
                                        )
                                    ) : isOlva ? (
                                        <div style={{ marginTop: "16px" }}>
                                            <Link
                                                href="https://www.olvacourier.com/"
                                                style={{ ...ctaButton, backgroundColor: "#0284c7", color: "#ffffff", padding: "10px 20px", fontSize: "12px", borderRadius: "8px" }}
                                            >
                                                🔍 Rastrear en Olva Courier
                                            </Link>
                                        </div>
                                    ) : null}

                                    {/* Warning / Custody message for Shalom */}
                                    {isShalom && (
                                        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", padding: "14px", borderRadius: "10px", marginTop: "12px" }}>
                                            <Text style={{ ...labelStyle, color: "#dc2626", marginBottom: "4px", fontSize: "11px", fontWeight: "700" }}>⚠️ ADVERTENCIA DE ALMACENAJE (MÁX. 5 DÍAS)</Text>
                                            <Text style={{ fontSize: "12px", color: "#991b1b", margin: "0", lineHeight: "1.4" }}>
                                                Tienes un plazo límite de <strong>5 días hábiles</strong> para retirar tu paquete de la oficina Shalom una vez que llega a destino. Transcurrido este plazo, la agencia comenzará a cobrar cargos diarios por almacenaje o custodia del paquete.
                                            </Text>
                                        </div>
                                    )}
                                </Section>
                            </>
                        )
                    })()}

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
