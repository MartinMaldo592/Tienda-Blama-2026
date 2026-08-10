
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendGTMEvent } from "@/lib/gtm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactoPage() {
    const whatsappNumber = "51958279604"
    const defaultMessage = encodeURIComponent("Hola BLAMA ♡, quisiera asesoría sobre sus productos de Pilates y Fitness.")

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-bold mb-3 border border-[#FFD4E2]">
                    <span>Atención al Cliente BLAMA</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-[#2D2D2D]">Contáctanos</h1>
                <p className="text-lg text-[#7C6A72] max-w-2xl mx-auto">
                    Estamos aquí para ayudarte a elegir tu mejor equipamiento de pilates y gimnasio. No dudes en escribirnos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Info Cards */}
                <Card className="hover:shadow-md transition-shadow border-[#FFD4E2] bg-white rounded-3xl">
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                        <div className="h-12 w-12 bg-[#FFE6EF] rounded-full flex items-center justify-center mb-4 text-[#FF6FA7]">
                            <Phone className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-[#2D2D2D]">Llámanos</CardTitle>
                        <CardDescription className="text-[#7C6A72]">Atención directa por WhatsApp</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="font-bold text-lg text-[#FF6FA7]">+51 958 279 604</p>
                        <p className="text-sm text-[#7C6A72] mt-1">Lunes a Sábado: 9am - 7pm</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-[#FFD4E2] bg-white rounded-3xl">
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                        <div className="h-12 w-12 bg-[#FFE6EF] rounded-full flex items-center justify-center mb-4 text-[#FF6FA7]">
                            <Mail className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-[#2D2D2D]">Escríbenos</CardTitle>
                        <CardDescription className="text-[#7C6A72]">Respuesta en menos de 24 horas</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="font-bold text-lg text-[#FF6FA7]">hola@blama.shop</p>
                        <p className="text-sm text-[#7C6A72] mt-1">Consultas de productos y envíos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

                {/* Formulario */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#2D2D2D]">Envíanos un mensaje</h2>
                    <form className="space-y-4 bg-white border border-[#FFD4E2] rounded-3xl p-6 shadow-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#2D2D2D]">Nombre</label>
                                <Input placeholder="Tu nombre" className="rounded-xl border-[#FFD4E2] focus-visible:ring-[#FF6FA7]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#2D2D2D]">Apellido</label>
                                <Input placeholder="Tu apellido" className="rounded-xl border-[#FFD4E2] focus-visible:ring-[#FF6FA7]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#2D2D2D]">Email</label>
                            <Input type="email" placeholder="tu.email@ejemplo.com" className="rounded-xl border-[#FFD4E2] focus-visible:ring-[#FF6FA7]" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#2D2D2D]">Teléfono</label>
                            <Input placeholder="+51 999 999 999" className="rounded-xl border-[#FFD4E2] focus-visible:ring-[#FF6FA7]" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#2D2D2D]">Mensaje</label>
                            <Textarea placeholder="Cuéntanos en qué podemos ayudarte..." className="min-h-[120px] rounded-xl border-[#FFD4E2] focus-visible:ring-[#FF6FA7]" />
                        </div>

                        <Button className="w-full h-11 text-base rounded-full bg-[#FF6FA7] hover:bg-[#E0528F] text-white font-bold">Enviar Mensaje</Button>
                    </form>
                </div>

                {/* Canal de WhatsApp destacado */}
                <div className="space-y-6 lg:h-full lg:flex lg:flex-col lg:justify-center">
                    <div className="bg-[#FFF7F9] border border-[#FFD4E2] p-8 rounded-3xl h-full flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-[#FF6FA7] mb-3">¿Prefieres Chat Directo?</h3>
                        <p className="text-[#7C6A72] mb-6 text-base leading-relaxed">
                            Nuestras asesoras BLAMA están disponibles vía WhatsApp para ayudarte con tallas, resistencia de bandas, mats y envíos al instante.
                        </p>
                        <Button asChild className="w-full bg-[#FF6FA7] hover:bg-[#E0528F] text-white h-12 text-base font-extrabold rounded-full shadow-md transition-all">
                            <a
                                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${defaultMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    sendGTMEvent({
                                        event: 'click_whatsapp',
                                        whatsapp_type: 'pagina_contacto'
                                    })
                                }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.694c1.003.545 1.972.82 2.8.82 3.181 0 5.768-2.586 5.768-5.766s-2.586-5.766-5.762-5.766zM12 4.156c4.291 0 7.78 3.489 7.78 7.78a7.78 7.78 0 0 1-7.78 7.78 7.75 7.75 0 0 1-4-.9l-5.61 1.48 1.49-5.46a7.76 7.76 0 0 1-.67-2.91C3.21 7.64 6.7 4.16 12 4.16z" /></svg>
                                    Hablar por WhatsApp
                                </span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
