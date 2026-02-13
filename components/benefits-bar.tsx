"use client"
import { Truck, Banknote, ShieldCheck, CheckCircle } from "lucide-react"

export function BenefitsBar() {
    const benefits = [
        {
            icon: Truck,
            title: "Envío Gratuito",
            description: "En Lima Metropolitana",
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            icon: Banknote,
            title: "Pago Contraentrega",
            description: "Paga al recibir",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            icon: ShieldCheck,
            title: "Garantía Total",
            description: "30 días de cobertura",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            icon: CheckCircle,
            title: "100% Confiable",
            description: "Compra segura",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
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
