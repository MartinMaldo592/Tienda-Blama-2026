"use client"
import { Truck, Banknote, ShieldCheck, CheckCircle } from "lucide-react"

export function BenefitsBar() {
    const benefits = [
        {
            icon: Truck,
            title: "Envíos Rápidos Perú",
            description: "Express en Lima & Agencia Shalom",
            color: "text-[#FF6FA7]",
            bgColor: "bg-[#FFE6EF]",
        },
        {
            icon: Banknote,
            title: "Contraentrega Disponible",
            description: "Paga seguro al recibir tu paquete",
            color: "text-[#FF6FA7]",
            bgColor: "bg-[#FFE6EF]",
        },
        {
            icon: ShieldCheck,
            title: "Garantía & Calidad",
            description: "Productos probados para tu entrenamiento",
            color: "text-[#FF6FA7]",
            bgColor: "bg-[#FFE6EF]",
        },
        {
            icon: CheckCircle,
            title: "Gracias por elegir cuidarte",
            description: "Asesoría personalizada por WhatsApp",
            color: "text-[#FF6FA7]",
            bgColor: "bg-[#FFE6EF]",
        },
    ]

    return (
        <section className="py-8 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow dark:bg-card"
                        >
                            <div className={`p-3 rounded-xl ${benefit.bgColor}`}>
                                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground leading-tight">
                                    {benefit.title}
                                </span>
                                <span className="text-xs text-muted-foreground mt-0.5">
                                    {benefit.description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
