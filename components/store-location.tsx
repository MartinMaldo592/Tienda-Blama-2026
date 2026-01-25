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
                        <Truck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        <span className="font-bold text-sm md:text-base tracking-wide">ENVÍO GRATUITO</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Banknote className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        <span className="font-bold text-sm md:text-base tracking-wide">PAGO CONTRAENTREGA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        <span className="font-bold text-sm md:text-base tracking-wide">30 DÍAS GARANTÍA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        <span className="font-bold text-sm md:text-base tracking-wide">100% CONFIABLE</span>
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="py-8 px-4 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-[800px] md:h-[500px]">
                    {/* Store Image */}
                    <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden rounded-3xl shadow-lg">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1547844033-5c0c8df6342e?q=80&w=2672&auto=format&fit=crop')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-black/40" /> {/* Darker overlay */}

                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="text-center space-y-4 max-w-lg">
                                <h3 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
                                    ¿Tienes alguna duda?
                                </h3>
                                <p className="text-lg text-white/90 drop-shadow-sm font-medium">
                                    Escríbenos y te atenderemos al instante.
                                </p>
                                <Button
                                    className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 font-bold text-lg px-8 py-6 transition-all shadow-xl"
                                    onClick={() => window.open(`https://api.whatsapp.com/send/?phone=${process.env.NEXT_PUBLIC_WHATSAPP_TIENDA || "982432561"}&text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n`, "_blank")}
                                >
                                    Contactanos
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full relative rounded-3xl overflow-hidden shadow-lg border-2 border-muted group">
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
