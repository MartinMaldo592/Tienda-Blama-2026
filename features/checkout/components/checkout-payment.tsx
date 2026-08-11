"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, MessageCircle, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutPaymentProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    shippingMethod?: string
}

export function CheckoutPayment({ value, onChange, disabled, shippingMethod }: CheckoutPaymentProps) {
    const handleValueChange = (val: string) => {
        onChange(val);
        setTimeout(() => {
            if (typeof window !== "undefined") {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 150);
    };

    return (
        <div className="space-y-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-[#FF6FA7]" /> Opciones de Pago
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Selecciona tu método de pago preferido para completar la transacción
                </p>
            </div>

            <RadioGroup value={value} onValueChange={handleValueChange} disabled={disabled} className="grid grid-cols-1 gap-3 pt-1">

                {/* Opción 1: WhatsApp (Contraentrega / Yape / Transferencia) */}
                <label
                    htmlFor="pm-wa"
                    className={cn(
                        "relative flex items-start space-x-3.5 border-2 p-4 rounded-xl cursor-pointer transition-all duration-200",
                        value === 'whatsapp'
                            ? 'border-[#FF6FA7] bg-[#FFE6EF]/40 shadow-xs'
                            : 'border-slate-200 hover:border-rose-200 hover:bg-slate-50/50',
                        disabled ? 'opacity-50 pointer-events-none' : ''
                    )}
                >
                    <RadioGroupItem value="whatsapp" id="pm-wa" className="mt-1 text-[#FF6FA7] border-[#FF6FA7]" />
                    <div className="flex-1 min-w-0">
                        <div className="font-extrabold flex items-center justify-between text-sm text-slate-900">
                            <span className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                                Pago Contraentrega / Yape / Transferencia
                            </span>
                            {value === 'whatsapp' && <CheckCircle2 className="h-4 w-4 text-[#FF6FA7]" />}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Pagas al recibir tu pedido en Lima o transfieres vía Yape / Plin / BCP. Coordinación directa por WhatsApp.
                        </p>
                    </div>
                </label>

                {/* Opción 2: Culqi (Tarjeta de Crédito, Débito o Yape Automático) */}
                <label
                    htmlFor="pm-culqi"
                    className={cn(
                        "relative flex items-start space-x-3.5 border-2 p-4 rounded-xl cursor-pointer transition-all duration-200",
                        value === 'culqi'
                            ? 'border-[#FF6FA7] bg-[#FFE6EF]/40 shadow-xs'
                            : 'border-slate-200 hover:border-rose-200 hover:bg-slate-50/50',
                        disabled ? 'opacity-50 pointer-events-none' : ''
                    )}
                >
                    <RadioGroupItem value="culqi" id="pm-culqi" className="mt-1 text-[#FF6FA7] border-[#FF6FA7]" />
                    <div className="flex-1 min-w-0">
                        <div className="font-extrabold flex items-center justify-between text-sm text-slate-900">
                            <span className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-purple-600 shrink-0" />
                                Pagar Online con Tarjeta o Yape (Culqi)
                            </span>
                            {value === 'culqi' && <CheckCircle2 className="h-4 w-4 text-[#FF6FA7]" />}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Pago en línea instantáneo 100% encriptado. Acepta todas las tarjetas de Crédito, Débito y Yape.
                        </p>
                        <div className="flex gap-1.5 mt-2.5">
                            <div className="h-5 px-2 bg-slate-100 border border-slate-200 rounded text-[9px] font-black text-slate-700 flex items-center justify-center">VISA</div>
                            <div className="h-5 px-2 bg-slate-100 border border-slate-200 rounded text-[9px] font-black text-slate-700 flex items-center justify-center">MASTERCARD</div>
                            <div className="h-5 px-2 bg-purple-100 border border-purple-200 rounded text-[9px] font-black text-purple-900 flex items-center justify-center">YAPE</div>
                        </div>
                    </div>
                </label>

            </RadioGroup>

            {/* Información para Envíos a Provincia */}
            {['provincia', 'Provincia'].some(p => String(shippingMethod || '').includes(p)) && (
                <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 text-xs space-y-2 mt-4 animate-in fade-in duration-300">
                    <p className="font-bold flex items-center gap-1.5 text-slate-900">
                        <span>💡</span> Información para envíos a Provincia
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 font-medium">
                        <li><strong>Agencia Shalom / Olva:</strong> Tu paquete será despachado a la agencia principal de tu localidad.</li>
                        <li><strong>Flexibilidad:</strong> Puedes pagar por adelantado o dar un adelanto por Yape y cancelar el saldo al retirar en Shalom.</li>
                    </ul>
                </div>
            )}
        </div>
    )
}
