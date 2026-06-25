
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendGTMEvent } from "@/lib/gtm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactoPage() {
    const whatsappNumber = "51958279604"
    const defaultMessage = encodeURIComponent("Hola, quisiera información sobre sus productos.")

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Contáctanos</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Estamos aquí para ayudarte. Si tienes alguna pregunta sobre tu pedido, nuestros productos o políticas, no dudes en contactarnos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Info Cards */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Phone className="h-6 w-6" />
                        </div>
                        <CardTitle>Llámanos</CardTitle>
                        <CardDescription>Atención telefónica directa</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="font-semibold text-lg">+51 958 279 604</p>
                        <p className="text-sm text-muted-foreground mt-1">Lunes a Viernes: 9am - 6pm</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Mail className="h-6 w-6" />
                        </div>
                        <CardTitle>Escríbenos</CardTitle>
                        <CardDescription>Responderemos en 24 horas</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="font-semibold text-lg">{["soporte", "blamashop.com"].join("@")}</p>
                        <p className="text-sm text-muted-foreground mt-1">Consultas generales y pedidos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

                {/* Formulario */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Envíanos un mensaje</h2>
                    <form className="space-y-4 bg-card border rounded-xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <Input placeholder="Tu nombre" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apellido</label>
                                <Input placeholder="Tu apellido" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="Tu correo electrónico" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input placeholder="+51 999 999 999" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mensaje</label>
                            <Textarea placeholder="Cuéntanos en qué podemos ayudarte..." className="min-h-[120px]" />
                        </div>

                        <Button className="w-full h-11 text-base">Enviar Mensaje</Button>
                    </form>
                </div>

                {/* Canal de WhatsApp destacado */}
                <div className="space-y-6 lg:h-full lg:flex lg:flex-col lg:justify-center">
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-8 rounded-xl h-full flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">¿Prefieres Chat Directo?</h3>
                        <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                            Nuestros asesores de atención al cliente están disponibles a través de WhatsApp para resolver tus dudas sobre envíos, productos y pedidos al instante.
                        </p>
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-bold shadow-md hover:shadow-lg transition-all">
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
                                    Abrir WhatsApp
                                </span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
