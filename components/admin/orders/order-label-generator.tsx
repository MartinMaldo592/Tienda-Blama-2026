import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Printer, Download, Ticket, Package } from "lucide-react"
import { jsPDF } from 'jspdf'
import * as QRCode from 'qrcode'
import { toast } from "sonner"

interface OrderLabelGeneratorProps {
    pedido: any
    isLocked: boolean
}

export function OrderLabelGenerator({ pedido, isLocked }: OrderLabelGeneratorProps) {
    const [generating, setGenerating] = useState(false)

    // Datos del cliente
    const clienteNombre = pedido.nombre_contacto || pedido.clientes?.nombre || 'Cliente'
    const clienteDNI = pedido.dni_contacto || pedido.clientes?.dni || ''
    const clienteTelefono = pedido.telefono_contacto || pedido.clientes?.telefono || ''

    // Dirección completa
    const direccion = pedido.direccion_calle || pedido.clientes?.direccion || ''
    const distrito = pedido.distrito || ''
    const provincia = pedido.provincia || ''
    const departamento = pedido.departamento || ''
    const referencia = pedido.referencia_direccion || ''

    const direccionCompleta = `${direccion}, ${distrito}, ${provincia}, ${departamento}`.replace(/, ,/g, ',').replace(/^, /, '')

    const generateLabelPDF = async () => {
        setGenerating(true)
        try {
            // 1. Configurar PDF (10x15cm / 4x6 pulgadas)
            // 4x6 pulgadas = 101.6mm x 152.4mm
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [100, 150] // Aprox 4x6" estándar térmico
            })

            // Configuración de fuentes
            doc.setFont("helvetica", "bold")

            // --- HEADER ---
            // Borde grueso alrededor
            doc.setLineWidth(1)
            doc.rect(2, 2, 96, 146) // Margen de seguridad

            // Línea divisoria superior
            doc.line(2, 20, 98, 20)

            // ORIGEN / DESTINO
            doc.setFontSize(14)
            doc.text("ORIGEN:", 5, 12)
            doc.text("DESTINO:", 55, 12)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text("LIMA / BLAMA", 5, 17)
            doc.text(`${provincia.toUpperCase() || 'PERÚ'}`, 55, 17)

            // --- DESTINATARIO ---
            doc.setFont("helvetica", "bold")
            doc.setFontSize(18)
            doc.text("DESTINATARIO:", 5, 30)

            doc.setFontSize(11)
            doc.setFont("helvetica", "normal")

            // Nombre
            doc.setFontSize(9)
            doc.text("NOMBRE COMPLETO:", 5, 40)
            doc.setFontSize(12)
            doc.setFont("helvetica", "bold")
            doc.text(clienteNombre.toUpperCase(), 5, 46)

            // DNI / CEL
            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.text("DNI:", 5, 55)
            doc.text("CELULAR:", 50, 55)

            doc.setFont("helvetica", "bold")
            doc.setFontSize(12)
            doc.text(clienteDNI || "-", 5, 61)
            doc.text(clienteTelefono || "-", 50, 61)

            // Dirección
            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.text("DIRECCIÓN DE ENTREGA:", 5, 70)

            // Ajustar texto largo de dirección
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            const splitAddress = doc.splitTextToSize(direccionCompleta.toUpperCase(), 90)
            doc.text(splitAddress, 5, 76)

            let currentY = 76 + (splitAddress.length * 5)

            // Referencia
            if (referencia) {
                doc.setFont("helvetica", "normal")
                doc.setFontSize(8)
                doc.text("REFERENCIA:", 5, currentY + 5)
                doc.setFont("helvetica", "italic")
                const splitRef = doc.splitTextToSize(referencia.toUpperCase(), 90)
                doc.text(splitRef, 5, currentY + 10)
                currentY += 10 + (splitRef.length * 4)
            } else {
                currentY += 5
            }

            // Entrega a Domicilio Checkbox visual
            doc.rect(5, currentY + 5, 5, 5)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(10)
            doc.text("ENTREGA A DOMICILIO", 13, currentY + 9)

            // --- FOOTER GRANDE ---
            const footerY = 115
            doc.setLineWidth(0.5)
            doc.line(2, footerY, 98, footerY)

            doc.setFontSize(16)
            doc.text("N° DE ORDEN:", 5, footerY + 10)
            doc.setFontSize(24)
            doc.text(`#${pedido.id}`, 5, footerY + 22)

            // QR Code
            try {
                // Link de rastreo o datos del pedido
                const qrData = `PEDIDO:${pedido.id}|CLI:${clienteNombre}|DNI:${clienteDNI}|DEST:${distrito}-${provincia}`
                const qrUrl = await QRCode.toDataURL(qrData)
                doc.addImage(qrUrl, 'PNG', 65, footerY + 2, 30, 30) // QR a la derecha
            } catch (qrErr) {
                console.error("Error QR", qrErr)
            }

            // Icons simulados (Texto unicode o basic shapes si no tengo imgs)
            // Fragil / Este lado arriba
            doc.setFontSize(30)
            // Usaremos texto grande como placeholder gráfico simple o rectangulos
            doc.setDrawColor(0)
            doc.rect(5, 140, 10, 8) // Icon box 1
            doc.text("!", 7, 146) // Fragil

            doc.rect(18, 140, 10, 8) // Icon box 2
            doc.text("☂", 19, 146) // Umbrella

            // Footer Branding
            doc.setFontSize(14)
            doc.setFont("helvetica", "bolditalic")
            doc.text("BLAMA", 65, 145)

            // Descargar
            doc.save(`ETIQUETA_ENVIO_${pedido.id}_4x6.pdf`)
            toast.success("Etiqueta generada correctamente (4x6\")")

        } catch (error) {
            console.error("Error generando PDF", error)
            toast.error("Error al generar la etiqueta")
        } finally {
            setGenerating(false)
        }
    }

    const downloadTicket = () => {
        window.open(`/admin/pedidos/${pedido.id}/ticket`, '_blank')
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Generador de Etiquetas */}
                <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Printer className="w-32 h-32" />
                    </div>

                    <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5 text-purple-600" />
                        Etiqueta de Envío (Zebra/Térmica)
                    </h2>

                    <div className="flex-1 space-y-4">
                        <p className="text-sm text-gray-500">
                            Genera una etiqueta estándar de <b>10x15cm (4x6")</b> lista para impresoras térmicas o pegar en el paquete.
                            Incluye código QR y datos de entrega claros.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>REMITENTE: <b>BLAMA / LIMA</b></span>
                                <span>DESTINO: <b>{provincia.toUpperCase() || 'PERÚ'}</b></span>
                            </div>
                            <div className="font-bold text-lg text-gray-800 truncate">
                                {clienteNombre.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                                {direccionCompleta.toUpperCase()}
                            </div>
                            <div className="mt-2 text-xs flex gap-2">
                                <span className="bg-gray-200 px-1 rounded">FRÁGIL</span>
                                <span className="bg-gray-200 px-1 rounded">URGENTE</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md group"
                            size="lg"
                            onClick={generateLabelPDF}
                            disabled={generating}
                        >
                            {generating ? 'Generando PDF...' : (
                                <>
                                    <Printer className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                                    Imprimir Etiqueta (PDF)
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* 2. Ticket de Venta */}
                <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Ticket className="w-32 h-32" />
                    </div>

                    <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <Ticket className="h-5 w-5 text-blue-600" />
                        Ticket de Venta (Comprobante)
                    </h2>

                    <div className="flex-1 space-y-4">
                        <p className="text-sm text-gray-500">
                            Descarga el comprobante de venta interno con el detalle de items y precios.
                            Útil para control interno o entregar al cliente como nota de venta.
                        </p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm py-2 border-b">
                                <span className="text-gray-500">Pedido:</span>
                                <span className="font-mono font-bold">#{pedido.id}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b">
                                <span className="text-gray-500">Fecha:</span>
                                <span>{new Date(pedido.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b">
                                <span className="text-gray-500">Total:</span>
                                <span className="font-bold text-green-600">S/ {pedido.total || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                            size="lg"
                            variant="outline"
                            onClick={downloadTicket}
                        >
                            <Download className="mr-2 h-5 w-5" />
                            Descargar Ticket
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
