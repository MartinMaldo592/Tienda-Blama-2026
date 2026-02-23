import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, MessageCircle, Wallet } from "lucide-react"

interface CheckoutPaymentProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function CheckoutPayment({ value, onChange, disabled }: CheckoutPaymentProps) {
    return (
        <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Método de Pago</h3>
            <RadioGroup value={value} onValueChange={onChange} disabled={disabled} className="grid grid-cols-1 gap-3">

                {/* Opción 1: WhatsApp (Contraentrega / Yape Manual) */}
                <div
                    onClick={() => { if (!disabled) onChange('whatsapp') }}
                    className={`relative flex items-start space-x-3 border p-4 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${value === 'whatsapp' ? 'border-green-600 bg-green-50/50 shadow-sm ring-1 ring-green-600' : 'hover:border-gray-300'}`}
                >
                    <RadioGroupItem value="whatsapp" id="pm-wa" className="mt-1 text-green-600 pointer-events-none" />
                    <div className="flex-1 pointer-events-none">
                        <Label htmlFor="pm-wa" className="cursor-pointer font-medium flex items-center gap-2 text-base">
                            <MessageCircle className="h-5 w-5 text-green-600" />
                            Coordinar por WhatsApp
                        </Label>
                        <p className="text-sm text-gray-500 mt-1 pl-7">
                            Pagas al recibir (Lima) o Yape/Plin manual (Provincia).
                        </p>
                    </div>
                </div>

                {/* Opción 2: Culqi (Tarjeta / Yape Automático) */}
                <div
                    onClick={() => { if (!disabled) onChange('culqi') }}
                    className={`relative flex items-start space-x-3 border p-4 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${value === 'culqi' ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'hover:border-gray-300'}`}
                >
                    <RadioGroupItem value="culqi" id="pm-culqi" className="mt-1 text-blue-600 pointer-events-none" />
                    <div className="flex-1 pointer-events-none">
                        <Label htmlFor="pm-culqi" className="cursor-pointer font-medium flex items-center gap-2 text-base">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            Tarjeta de Crédito / Débito
                        </Label>
                        <p className="text-sm text-gray-500 mt-1 pl-7">
                            Paga al instante de forma 100% segura con Culqi. Aceptamos todas las tarjetas.
                        </p>
                        <div className="flex gap-2 mt-2 pl-7 opacity-70 grayscale hover:grayscale-0 transition-all">
                            {/* Iconos visuales simples */}
                            <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">VISA</div>
                            <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">MC</div>
                            <div className="h-6 w-10 bg-purple-200 rounded flex items-center justify-center text-[10px] font-bold text-purple-800">YAPE</div>
                        </div>
                    </div>
                </div>

            </RadioGroup>
        </div>
    )
}
