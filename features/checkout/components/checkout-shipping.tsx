"use client"

import { Label } from "@/components/ui/label"
import { Truck, MapPin, Store, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutShippingProps {
    value: string
    onChange: (val: string) => void
    disabled?: boolean
}

export function CheckoutShipping({ value, onChange, disabled }: CheckoutShippingProps) {
    const shippingOptions = [
        {
            id: "Lima - Domicilio",
            category: "Lima",
            title: "Envío a Domicilio - Lima",
            subtitle: "Entrega directa en tu puerta (24 - 48 horas)",
            price: "S/ 10.00",
            icon: MapPin,
            badge: "Popular en Lima",
        },
        {
            id: "Lima - Shalom",
            category: "Lima",
            title: "Recojo en Agencia Shalom - Lima",
            subtitle: "Recoge en la agencia Shalom de tu preferencia en Lima",
            price: "S/ 8.00",
            icon: Store,
            badge: "Económico",
        },
        {
            id: "Lima - Express",
            category: "Lima",
            title: "Envío Express Mismo Día - Lima",
            subtitle: "Entrega prioritaria hoy mismo en Lima Metropolitana",
            price: "S/ 15.00",
            icon: Zap,
            badge: "Super Rápido",
        },
        {
            id: "Provincia - Shalom",
            category: "Provincia",
            title: "Agencia Shalom - Provincia",
            subtitle: "Envío a agencia Shalom en todo el Perú (Flete se paga al recoger)",
            price: "Pago en destino",
            icon: Truck,
            badge: "Todo el Perú",
        },
        {
            id: "Provincia - Olva",
            category: "Provincia",
            title: "Olva Courier - Domicilio Provincia",
            subtitle: "Entrega directa a tu domicilio en provincia",
            price: "S/ 15.00",
            icon: Truck,
            badge: "Puerta a Puerta",
        },
    ]

    return (
        <div className="space-y-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div>
                <Label className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Selecciona tu Método de Envío <span className="text-[#FF6FA7]">*</span></span>
                </Label>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Elige si te encuentras en Lima Metropolitana o Provincias
                </p>
            </div>

            <div className="space-y-3 pt-1">
                {shippingOptions.map((opt) => {
                    const isSelected = value === opt.id || (!value && opt.id === "Lima - Domicilio")
                    const Icon = opt.icon

                    return (
                        <label
                            key={opt.id}
                            onClick={() => onChange(opt.id)}
                            className={cn(
                                "relative flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all duration-200",
                                isSelected
                                    ? "border-[#FF6FA7] bg-[#FFE6EF]/30 shadow-xs"
                                    : "border-slate-200 hover:border-rose-200 hover:bg-slate-50/50",
                                disabled ? "pointer-events-none opacity-50" : ""
                            )}
                        >
                            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                <div
                                    className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                        isSelected
                                            ? "bg-[#FF6FA7] text-white shadow-xs"
                                            : "bg-slate-100 text-slate-500"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn("text-sm font-bold truncate", isSelected ? "text-slate-900 font-extrabold" : "text-slate-700")}>
                                            {opt.title}
                                        </span>
                                        {opt.badge && (
                                            <span className={cn(
                                                "text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                                isSelected
                                                    ? "bg-[#FF6FA7]/10 text-[#FF6FA7] border-[#FF6FA7]/30"
                                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                            )}>
                                                {opt.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium truncate">{opt.subtitle}</p>
                                </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-3">
                                <span className={cn("text-xs font-black", isSelected ? "text-[#FF6FA7]" : "text-slate-800")}>
                                    {opt.price}
                                </span>
                                {isSelected ? (
                                    <CheckCircle2 className="h-5 w-5 text-[#FF6FA7] fill-[#FF6FA7]/20" />
                                ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                                )}
                            </div>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
