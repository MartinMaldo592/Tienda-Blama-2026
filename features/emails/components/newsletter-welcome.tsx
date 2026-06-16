import {
    Html, Head, Body, Container, Section, Row, Column,
    Text, Hr, Img, Link, Preview, Heading, Font
} from "@react-email/components"

interface NewsletterWelcomeProps {
    cuponCodigo: string
    descuentoPorcentaje?: number
    diasValidez?: number
    whatsappTienda?: string
}

export function NewsletterWelcomeEmail({
    cuponCodigo = "WELCOME-XXXX",
    descuentoPorcentaje = 10,
    diasValidez = 30,
    whatsappTienda = "+51958279604",
}: NewsletterWelcomeProps) {
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
                {`🎉 ¡Bienvenido a Blama Shop! Aquí tienes tu cupón de descuento del ${descuentoPorcentaje}%`}
            </Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>

                    {/* Header */}
                    <Section style={headerStyle}>
                        <Text style={logoStyle}>BLAMA</Text>
                        <Text style={logoSubtitleStyle}>SHOP</Text>
                    </Section>

                    {/* Content Section */}
                    <Section style={contentSection}>
                        <Heading as="h1" style={mainTitleStyle}>
                            ¡Gracias por unirte a nuestra comunidad!
                        </Heading>
                        <Text style={subtitleStyle}>
                            Estamos encantados de tenerte aquí. A partir de ahora serás el primero en enterarte de nuestras últimas novedades, lanzamientos y ofertas exclusivas.
                        </Text>
                        <Text style={giftTextStyle}>
                            Como agradecimiento, te regalamos un cupón de <strong>{descuentoPorcentaje}% de descuento</strong> para tu primera compra.
                        </Text>
                    </Section>

                    {/* Coupon Box */}
                    <Section style={couponBoxSection}>
                        <div style={couponBox}>
                            <Text style={couponLabel}>TU CÓDIGO DE CUPÓN</Text>
                            <Text style={couponCode}>{cuponCodigo}</Text>
                            <Text style={couponExpiry}>
                                * Válido por {diasValidez} días desde hoy. Uso único para tu correo.
                            </Text>
                        </div>
                    </Section>

                    {/* CTA Button */}
                    <Section style={ctaSection}>
                        <Link
                            href="https://blama.shop/productos"
                            style={ctaButton}
                        >
                            🛍️ Ir a la Tienda y Aplicar
                        </Link>
                        <Text style={helperText}>
                            Ingresa este código en el checkout al momento de realizar tu pago para aplicar el descuento.
                        </Text>
                    </Section>

                    <Hr style={dividerStyle} />

                    {/* Support Section */}
                    <Section style={supportSection}>
                        <Text style={supportText}>
                            ¿Tienes dudas de cómo usar tu cupón? Escríbenos por WhatsApp:
                        </Text>
                        <Link
                            href={`https://wa.me/${whatsappTienda.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola, tengo dudas sobre cómo usar mi cupón de bienvenida ${cuponCodigo}`)}`}
                            style={whatsappLink}
                        >
                            💬 Contactar por WhatsApp
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={footerStyle}>
                        <Text style={footerText}>
                            Este correo fue enviado porque te suscribiste al boletín informativo de Tienda Blama.
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

const contentSection = {
    padding: "32px 40px 16px",
    textAlign: "center" as const,
}

const mainTitleStyle = {
    fontSize: "22px",
    fontWeight: "700" as const,
    color: "#111827",
    margin: "0 0 16px",
    lineHeight: "1.3",
}

const subtitleStyle = {
    fontSize: "15px",
    color: "#4b5563",
    lineHeight: "1.6",
    margin: "0 0 12px",
}

const giftTextStyle = {
    fontSize: "16px",
    color: "#0f172a",
    lineHeight: "1.6",
    margin: "0",
}

const couponBoxSection = {
    padding: "0 40px 24px",
    textAlign: "center" as const,
}

const couponBox = {
    backgroundColor: "#f8fafc",
    border: "2px dashed #cbd5e1",
    borderRadius: "8px",
    padding: "20px",
    display: "inline-block",
    width: "100%",
    boxSizing: "border-box" as const,
}

const couponLabel = {
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "#64748b",
    letterSpacing: "1.5px",
    margin: "0 0 8px",
}

const couponCode = {
    fontSize: "26px",
    fontWeight: "800" as const,
    color: "#0f172a",
    fontFamily: "monospace",
    letterSpacing: "2px",
    margin: "0 0 8px",
}

const couponExpiry = {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "0",
}

const ctaSection = {
    padding: "0 40px 24px",
    textAlign: "center" as const,
}

const ctaButton = {
    display: "inline-block",
    backgroundColor: "#0a0a0a",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600" as const,
    textDecoration: "none",
    marginBottom: "12px",
}

const helperText = {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0",
    lineHeight: "1.4",
}

const dividerStyle = {
    borderColor: "#e5e7eb",
    margin: "0 40px",
}

const supportSection = {
    padding: "24px 40px",
    textAlign: "center" as const,
}

const supportText = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 8px",
}

const whatsappLink = {
    color: "#25d366",
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
