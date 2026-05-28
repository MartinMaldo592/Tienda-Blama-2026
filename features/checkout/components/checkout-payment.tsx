import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, MessageCircle, Wallet } from "lucide-react"

interface CheckoutPaymentProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    shippingMethod?: string // <-- Prop opcional
}

export function CheckoutPayment({ value, onChange, disabled, shippingMethod }: CheckoutPaymentProps) {
    const handleValueChange = (val: string) => {
        onChange(val);
        // Espera un milisegundo a que React actualice los estilos visuales (borde azul) 
        // y luego fuerza un scroll suave hacia abajo para revelar el botón verde de "Pagar"
        setTimeout(() => {
            if (typeof document !== "undefined") {
                const scrollArea = document.querySelector('.overflow-y-auto');
                if (scrollArea) {
                    scrollArea.scrollTo({
                        top: scrollArea.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }
        }, 150);
    };

    return (
        <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-lg text-foreground">Método de Pago</h3>
            <RadioGroup value={value} onValueChange={handleValueChange} disabled={disabled} className="grid grid-cols-1 gap-2">

                {/* Opción 1: WhatsApp (Contraentrega / Yape Manual) */}
                <label
                    htmlFor="pm-wa"
                    className={`relative flex items-start space-x-3 border p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${value === 'whatsapp' ? 'border-green-600 bg-green-50/50 shadow-sm ring-1 ring-green-600' : 'hover:border-gray-300'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <RadioGroupItem value="whatsapp" id="pm-wa" className="mt-0.5 text-green-600" />
                    <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2 text-[15px] leading-tight text-foreground">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            Pago Contraentrega / Transferencia
                        </div>
                        <p className="text-[12px] leading-tight text-muted-foreground mt-1">
                            Pagas al recibir o Yape/Plin manual (Prov. y Lima).
                        </p>
                    </div>
                </label>

                {/* Opción 2: Culqi (Tarjeta / Yape Automático) */}
                <label
                    htmlFor="pm-culqi"
                    className={`relative flex items-start space-x-3 border p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${value === 'culqi' ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'hover:border-gray-300'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <RadioGroupItem value="culqi" id="pm-culqi" className="mt-0.5 text-blue-600" />
                    <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2 text-[13px] sm:text-[15px] leading-tight text-foreground">
                            <CreditCard className="h-4 w-4 text-blue-600 shrink-0" />
                            Tarjetas o Yape (Cód. Aprobación)
                        </div>
                        <p className="text-[12px] leading-tight text-muted-foreground mt-1">
                            Pago al instante 100% seguro (Crédito, Débito, Yape).
                        </p>
                        <div className="flex gap-1.5 mt-2 opacity-80 grayscale hover:grayscale-0 transition-all">
                            {/* Iconos visuales simples y micro-compactos */}
                            <div className="h-5 w-8 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-700 tracking-tighter">VISA</div>
                            <div className="h-5 w-8 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-700 tracking-tighter">MC</div>
                            <div className="h-5 w-8 bg-purple-200 rounded flex items-center justify-center text-[8px] font-black text-purple-900 tracking-tighter">YAPE</div>
                        </div>
                    </div>
                </label>

            </RadioGroup>

            {/* Alerta dinámica para provincia con pagos flexibles */}
            {['provincia', 'Provincia'].includes(shippingMethod || '') && (
                <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 text-xs space-y-2 mt-4 animate-in fade-in duration-300">
                    <p className="font-bold flex items-center gap-1.5 text-slate-800">
                        <span>💡</span> Información de Envío a Provincia
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-650 font-medium">
                        <li><strong>Entrega:</strong> Retiro en la oficina o agencia principal de Shalom de tu distrito o ciudad.</li>
                        <li><strong>Pagos Flexibles:</strong> Puedes pagar por adelantado, dar un adelanto, o pagar el total contraentrega en la ventanilla de Shalom al recoger tu paquete.</li>
                        <li><strong>Coordinación:</strong> Tras finalizar el pedido, un asesor comercial te escribirá por WhatsApp para definir contigo las condiciones de pago que prefieras.</li>
                    </ul>
                </div>
            )}
        </div>
    )
}
