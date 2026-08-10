import { ShieldCheck, RefreshCw, HeartHandshake, CheckCircle2, PhoneCall, Sparkles } from "lucide-react"

export const metadata = {
    title: 'Garantías & Cambios Sin Complicaciones | Blama Shop',
    description: 'Políticas de garantía de 30 días y cambios sencillos en 7 días sin costo por fallas de fábrica en todo el Perú.',
}

export default function DevolucionesPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* --- HERO BANNER --- */}
            <div className="relative pt-16 pb-12 overflow-hidden bg-gradient-to-b from-[#FFF7F9] via-[#FFE6EF]/30 to-[#fafafa]">
                <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-black mb-4 border border-[#FFD4E2] uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Garantía de Satisfacción 100% BLAMA</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] tracking-tighter mb-4 font-serif">
                        Cambios & Garantías <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7]">
                            Sin Complicaciones 💖
                        </span>
                    </h1>

                    <p className="text-base text-[#7C6A72] font-medium leading-relaxed max-w-2xl mx-auto">
                        Queremos que te sientas segura y feliz con tu compra. Si tu artículo no es lo que esperabas o presenta algún inconveniente, te ayudamos de inmediato.
                    </p>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="container mx-auto px-4 pb-20 max-w-4xl space-y-8">
                
                {/* 3 STEPS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#FFD4E2] p-6 rounded-3xl shadow-xs space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFE6EF] text-[#FF6FA7] flex items-center justify-center font-bold text-sm">
                            01
                        </div>
                        <h3 className="text-lg font-black text-[#2D2D2D]">Plazo de 7 Días</h3>
                        <p className="text-xs text-[#7C6A72] leading-relaxed">
                            Dispones de 7 días calendario tras recibir tu pedido para solicitar un cambio de artículo o modelo en estado impecable.
                        </p>
                    </div>

                    <div className="bg-white border border-[#FFD4E2] p-6 rounded-3xl shadow-xs space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFE6EF] text-[#FF6FA7] flex items-center justify-center font-bold text-sm">
                            02
                        </div>
                        <h3 className="text-lg font-black text-[#2D2D2D]">30 Días Garantía</h3>
                        <p className="text-xs text-[#7C6A72] leading-relaxed">
                            Cualquier falla técnica de fábrica (costuras, cierres o látex) cuenta con <strong>30 días de garantía total</strong> con reemplazo nuevo.
                        </p>
                    </div>

                    <div className="bg-white border border-[#FFD4E2] p-6 rounded-3xl shadow-xs space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFE6EF] text-[#FF6FA7] flex items-center justify-center font-bold text-sm">
                            03
                        </div>
                        <h3 className="text-lg font-black text-[#2D2D2D]">Envío Gratuito por Falla</h3>
                        <p className="text-xs text-[#7C6A72] leading-relaxed">
                            Si el cambio se debe a un error de envío o defecto de producto, <strong>BLAMA asume el 100% de los fletes</strong>.
                        </p>
                    </div>
                </div>

                {/* DETALLE Y CONDICIONES */}
                <div className="bg-white border border-[#FFD4E2] p-8 rounded-3xl shadow-xs space-y-6">
                    <h3 className="text-xl font-black text-[#2D2D2D] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6FA7]" />
                        Condiciones para un Cambio Rápido
                    </h3>
                    <ul className="space-y-3 text-sm text-[#7C6A72]">
                        <li className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6FA7] mt-2 shrink-0" />
                            El artículo debe estar sin uso de gimnasio ni lavado, conservando sus etiquetas y empaque original.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6FA7] mt-2 shrink-0" />
                            Presentar tu número de pedido o comprobante de compra (factura/boleta electrónica).
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6FA7] mt-2 shrink-0" />
                            Coordinar el recojo o entrega en agencia a través de nuestro equipo de atención por WhatsApp.
                        </li>
                    </ul>
                </div>

                {/* CTA BUTTON */}
                <div className="bg-[#FFF7F9] border border-[#FFD4E2] p-8 rounded-3xl shadow-xs text-center space-y-4">
                    <h3 className="text-xl font-black text-[#2D2D2D]">¿Necesitas solicitar un cambio o atención?</h3>
                    <p className="text-sm text-[#7C6A72] max-w-lg mx-auto">
                        Escríbenos directamente por WhatsApp y una asesora gestionará tu reemplazo en minutos.
                    </p>
                    <a 
                        href="https://api.whatsapp.com/send?phone=51958279604&text=Hola%20BLAMA%20%E2%99%A1%2C%20quisiera%20solicitar%20un%20cambio%20o%20atenci%C3%B3n%20por%20garant%C3%ADa."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#FF6FA7] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-wider hover:bg-[#FF85B3] transition-all shadow-md"
                    >
                        <PhoneCall className="w-4 h-4" />
                        Solicitar Cambio por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
