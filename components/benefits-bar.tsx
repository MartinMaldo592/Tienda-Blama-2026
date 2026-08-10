"use client"
import { Truck, ShieldCheck, Sparkles, MessageCircleHeart } from "lucide-react"

export function BenefitsBar() {
    const benefits = [
        {
            icon: Truck,
            title: "Envíos Rápidos Perú",
            description: "Express Lima & Provincia Shalom",
        },
        {
            icon: ShieldCheck,
            title: "Pago 100% Seguro",
            description: "Yape, PLIN & Contraentrega",
        },
        {
            icon: Sparkles,
            title: "Calidad Pilates & Gym",
            description: "Materiales premium seleccionados",
        },
        {
            icon: MessageCircleHeart,
            title: "Asesoría por WhatsApp",
            description: "Atención directa y cercana ♡",
        },
    ]

    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-5 rounded-2xl bg-[#F9F7F8] border border-slate-100 hover:border-[#FFD4E2] transition-colors"
                    >
                        <div className="p-3 rounded-xl bg-white text-[#FF4081] shadow-2xs shrink-0">
                            <benefit.icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xs md:text-sm text-[#1C1819] leading-tight uppercase tracking-wider">
                                {benefit.title}
                            </span>
                            <span className="text-[11px] md:text-xs text-slate-500 mt-1 font-medium">
                                {benefit.description}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
