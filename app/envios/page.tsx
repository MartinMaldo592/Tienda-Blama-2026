import { Truck, PackageCheck, Clock, ShieldCheck, Sparkles, MapPin, Gift, PhoneCall } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: 'Políticas de Envío & Tiempos de Entrega | Blama Shop',
    description: 'Conoce los tiempos de entrega express en Lima (24-48h) y provincias por Olva y Shalom. Unboxing experiencia rosada BLAMA.',
}

export default function PoliticaEnviosPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* --- HERO BANNER --- */}
            <div className="relative pt-16 pb-12 overflow-hidden bg-gradient-to-b from-[#FFF7F9] via-[#FFE6EF]/30 to-[#fafafa]">
                <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-black mb-4 border border-[#FFD4E2] uppercase tracking-wider">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Envíos Rápidos a Todo el Perú</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] tracking-tighter mb-4 font-serif">
                        Políticas de Envío & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7]">
                            Experiencia de Unboxing 💖
                        </span>
                    </h1>

                    <p className="text-base text-[#7C6A72] font-medium leading-relaxed max-w-2xl mx-auto">
                        En BLAMA enviamos tu pedido con stock local propio y embalaje regalo distintivo. Revisa nuestros tiempos y coberturas a continuación.
                    </p>
                </div>
            </div>

            {/* --- CONTENT CARDS --- */}
            <div className="container mx-auto px-4 pb-20 max-w-4xl space-y-8">
                
                {/* 1. COBERTURA Y TIEMPOS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#FFD4E2] p-6 rounded-3xl shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFE6EF] text-[#FF6FA7] flex items-center justify-center font-bold">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-[#2D2D2D]">Lima Metropolitana</h2>
                        <span className="inline-block bg-[#FFE6EF] text-[#FF6FA7] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            Despacho Express (24h - 48h)
                        </span>
                        <p className="text-sm text-[#7C6A72] leading-relaxed">
                            Recibe tu paquete en la puerta de tu casa o trabajo. Opción de <strong>Pago Contraentrega</strong> o Yape/Tarjeta al recibir.
                        </p>
                    </div>

                    <div className="bg-white border border-[#FFD4E2] p-6 rounded-3xl shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFE6EF] text-[#FF6FA7] flex items-center justify-center font-bold">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-[#2D2D2D]">Provincias de Perú</h2>
                        <span className="inline-block bg-[#FFE6EF] text-[#FF6FA7] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            Olva Courier / Shalom (2 - 4 Días)
                        </span>
                        <p className="text-sm text-[#7C6A72] leading-relaxed">
                            Envíos diarios a agencias autorizadas Shalom o domicilio vía Olva Courier con código de seguimiento en tiempo real.
                        </p>
                    </div>
                </div>

                {/* 2. EXPERIENCIA UNBOXING BLAMA */}
                <div className="bg-gradient-to-r from-[#FFF7F9] to-white border border-[#FFD4E2] p-8 rounded-3xl shadow-xs flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-[#FF6FA7] text-white flex items-center justify-center shrink-0 shadow-md">
                        <Gift className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-black text-[#2D2D2D]">El "Efecto WoW" - Unboxing Rosado BLAMA 🎁</h3>
                        <p className="text-sm text-[#7C6A72] leading-relaxed">
                            Cada pedido se despacha en nuestra caja o bolsa distintiva rosada, incluye tarjeta motivacional, sticker de regalo y un aroma exclusivo al abrir tu paquete.
                        </p>
                    </div>
                </div>

                {/* 3. SEGUIMIENTO & SOPORTE */}
                <div className="bg-white border border-[#FFD4E2] p-8 rounded-3xl shadow-xs text-center space-y-4">
                    <h3 className="text-xl font-black text-[#2D2D2D]">¿Quieres consultar el estado de tu envío?</h3>
                    <p className="text-sm text-[#7C6A72] max-w-lg mx-auto">
                        Nuestras asesoras te enviarán el número de seguimiento por WhatsApp apenas tu paquete sea despachado.
                    </p>
                    <a 
                        href="https://api.whatsapp.com/send?phone=51958279604&text=Hola%20BLAMA%20%E2%99%A1%2C%20quisiera%20consultar%20el%20estado%20de%20mi%20env%C3%ADo."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#FF6FA7] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-wider hover:bg-[#FF85B3] transition-all shadow-md"
                    >
                        <PhoneCall className="w-4 h-4" />
                        Consultar Seguimiento por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
