"use client"

import { Button } from "@/components/ui/button"
import { ShieldCheck, Truck, CheckCircle, Banknote, MapPin } from "lucide-react"

export function StoreLocation() {
    return (
        <div className="w-full">
            {/* Features Banner */}
            <div className="bg-black text-white py-6 md:py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-12 lg:gap-16">
                    <div className="flex items-center gap-3">
                        <Truck className="h-7 w-7 md:h-9 md:w-9 text-emerald-400" />
                        <span className="font-bold text-sm md:text-base tracking-wide text-white">ENVÍO GRATUITO</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Banknote className="h-7 w-7 md:h-9 md:w-9 text-green-400" />
                        <span className="font-bold text-sm md:text-base tracking-wide text-white">PAGO CONTRAENTREGA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-7 w-7 md:h-9 md:w-9 text-yellow-400" />
                        <span className="font-bold text-sm md:text-base tracking-wide text-white">30 DÍAS GARANTÍA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-7 w-7 md:h-9 md:w-9 text-blue-400" />
                        <span className="font-bold text-sm md:text-base tracking-wide text-white">100% CONFIABLE</span>
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="py-8 px-4 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:h-[500px]">
                    {/* Store Image */}
                    {/* Contact Card */}
                    <div className="relative w-full md:w-1/2 min-h-[500px] md:min-h-0 md:h-full group overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-slate-800 to-gray-900 p-8 md:p-12 flex flex-col justify-center items-start text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold border border-white/20">
                                Atención Personalizada
                            </div>

                            <h3 className="text-3xl md:text-5xl font-extrabold leading-tight">
                                ¿Necesitas ayuda<br />con tu pedido?
                            </h3>

                            <p className="text-lg text-gray-300 max-w-md">
                                Nuestro equipo está listo para resolver tus dudas y ayudarte a elegir el regalo perfecto.
                            </p>

                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    <span>Respuestas rápidas</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    <span>Seguimiento de envíos</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    <span>Asesoría gratuita</span>
                                </div>
                            </div>

                            <Button
                                className="mt-6 w-full md:w-auto rounded-full bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-8 py-6 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group/btn"
                                onClick={() => window.open(`https://api.whatsapp.com/send/?phone=${process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "982432561"}&text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n`, "_blank")}
                            >
                                <span>Chatear por WhatsApp</span>
                                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="w-full md:w-1/2 min-h-[400px] md:min-h-0 md:h-full relative rounded-3xl overflow-hidden shadow-lg border-2 border-muted group">
                        <iframe
                            src="https://maps.google.com/maps?q=Galer%C3%ADa%20Multicentro%2C%20Av.%20Jos%C3%A9%20Larco%20345%2C%20Miraflores&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(0%)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        />
                        <div className="absolute bottom-6 right-6">
                            <Button
                                className="rounded-full bg-white text-black hover:bg-white/90 font-bold text-sm px-6 py-4 shadow-xl border border-gray-100 flex items-center gap-2"
                                onClick={() => window.open(`https://www.google.com/maps/dir//Galer%C3%ADa+Multicentro,+Av.+Jos%C3%A9+Larco+345,+Miraflores`, "_blank")}
                            >
                                <MapPin className="h-4 w-4 text-red-500" />
                                Cómo llegar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
