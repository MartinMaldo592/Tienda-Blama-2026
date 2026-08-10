"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { sendGTMEvent } from "@/lib/gtm"

export function ContactSection() {
    return (
        <div className="w-full">
            {/* Features Banner */}


            {/* Contact Section */}
            <div className="py-16 px-4 bg-background relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    {/* Contact Card with Glassmorphism */}
                    <div className="relative w-full min-h-[500px] group overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-8 md:p-16 flex flex-col justify-center items-center text-center">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-foreground">
                            <svg className="w-80 h-80 rotate-12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>

                        <div className="relative z-20 space-y-8 flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6EF] border border-[#FFD4E2] text-[#FF6FA7] text-xs font-bold tracking-widest uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6FA7] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6FA7]"></span>
                                </span>
                                Atención Personalizada BLAMA ♡
                            </div>

                            <h3 className="text-4xl md:text-6xl font-black text-[#2D2D2D] leading-[1.1] tracking-tight">
                                ¿Tienes dudas sobre <br />
                                <span className="text-[#FF6FA7] bg-clip-text text-transparent bg-gradient-to-r from-[#FF6FA7] to-[#FF85B3]">
                                    tu pedido de Pilates o Gym?
                                </span>
                            </h3>

                            <p className="text-lg md:text-xl text-[#7C6A72] max-w-xl mx-auto leading-relaxed">
                                Nuestras asesoras están listas para ayudarte a elegir el equipamiento ideal para entrenar a tu manera.
                            </p>

                            <div className="flex flex-wrap justify-center gap-6 py-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-[#7C6A72]">
                                    <div className="h-6 w-6 rounded-full bg-[#FFE6EF] flex items-center justify-center">
                                        <CheckCircle className="h-4 w-4 text-[#FF6FA7]" />
                                    </div>
                                    <span>Respuestas inmediatas</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-[#7C6A72]">
                                    <div className="h-6 w-6 rounded-full bg-[#FFE6EF] flex items-center justify-center">
                                        <CheckCircle className="h-4 w-4 text-[#FF6FA7]" />
                                    </div>
                                    <span>Asesoría personalizada</span>
                                </div>
                            </div>

                            <Button
                                className="group/btn relative mt-4 h-16 px-10 rounded-full bg-[#FF6FA7] hover:bg-[#E0528F] text-white font-black text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-[#FF6FA7]/30 flex items-center gap-3"
                                onClick={() => {
                                    sendGTMEvent({
                                        event: 'click_whatsapp',
                                        whatsapp_type: 'seccion_contacto_global'
                                    })
                                    window.open(`https://api.whatsapp.com/send/?phone=${process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "958279604"}&text=Hola%20BLAMA%2C%20quisiera%20asesor%C3%ADa%20sobre%20sus%20productos%20de%20Pilates%20y%20Fitness`, "_blank")
                                }}
                            >
                                <span>Hablar con una Asesora</span>
                                <div className="bg-white/20 p-1 rounded-full transition-transform group-hover/btn:translate-x-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
