import { Label } from "@/components/ui/label"
import { Truck, MapPin, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutShippingProps {
    value: string
    onChange: (val: string) => void
    disabled?: boolean
}

export function CheckoutShipping({ value, onChange, disabled }: CheckoutShippingProps) {
    const isLimaActive = String(value || '').toLowerCase().includes('lima')
    const isProvinciaActive = !isLimaActive && (
        String(value || '').toLowerCase() === 'provincia' || 
        String(value || '').toLowerCase().includes('provincia') ||
        String(value || '').toLowerCase().includes('shalom')
    )

    // Sub-metodos para Lima
    const subMethod = value === 'Lima (Retiro en Agencia Shalom)' ? 'shalom' : 'delivery'

    const handleLimaSelect = (type: 'delivery' | 'shalom') => {
        if (type === 'delivery') {
            onChange('Lima (Entrega a Domicilio)')
        } else {
            onChange('Lima (Retiro en Agencia Shalom)')
        }
    }

    return (
        <div className="space-y-4 pb-2">
            <Label className="text-base font-bold text-foreground">Método de Envío <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-2 gap-3">
                <label
                    className={cn(
                        "relative flex cursor-pointer flex-row items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 hover:bg-muted/50",
                        isLimaActive ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                        disabled ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    <input
                        type="radio"
                        name="shipping"
                        value="Lima"
                        checked={isLimaActive}
                        onChange={() => handleLimaSelect('delivery')}
                        className="sr-only"
                        disabled={disabled}
                    />
                    <div className={cn("rounded-lg p-2 transition-colors duration-200 shrink-0", isLimaActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("block text-sm font-bold leading-tight", isLimaActive ? "text-primary" : "text-foreground")}>Lima</span>
                        <span className="block text-[11px] leading-tight mt-0.5 text-muted-foreground">Envío local</span>
                    </div>
                    {isLimaActive && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    )}
                </label>

                <label
                    className={cn(
                        "relative flex cursor-pointer flex-row items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 hover:bg-muted/50",
                        isProvinciaActive ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                        disabled ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    <input
                        type="radio"
                        name="shipping"
                        value="Provincia"
                        checked={isProvinciaActive}
                        onChange={() => onChange('Provincia')}
                        className="sr-only"
                        disabled={disabled}
                    />
                    <div className={cn("rounded-lg p-2 transition-colors duration-200 shrink-0", isProvinciaActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("block text-sm font-bold leading-tight", isProvinciaActive ? "text-primary" : "text-foreground")}>Provincia</span>
                        <span className="block text-[11px] leading-tight mt-0.5 text-muted-foreground">Envíos a agencia</span>
                    </div>
                    {isProvinciaActive && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    )}
                </label>
            </div>

            {/* Sub-selector de Lima */}
            {isLimaActive && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-bold text-slate-700">Selecciona la modalidad de envío en Lima:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleLimaSelect('delivery')}
                            disabled={disabled}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all text-left cursor-pointer",
                                subMethod === 'delivery'
                                    ? "bg-white border-primary text-primary shadow-sm"
                                    : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                            )}
                        >
                            <span>🛵 Entrega a Domicilio</span>
                            {subMethod === 'delivery' && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleLimaSelect('shalom')}
                            disabled={disabled}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all text-left cursor-pointer",
                                subMethod === 'shalom'
                                    ? "bg-white border-primary text-primary shadow-sm"
                                    : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                            )}
                        >
                            <span>📦 Retiro en Agencia Shalom</span>
                            {subMethod === 'shalom' && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </button>
                    </div>
                    {subMethod === 'shalom' && (
                        <p className="text-[10px] text-indigo-700 font-medium leading-relaxed bg-indigo-50/50 p-2.5 rounded-md border border-indigo-100">
                            💡 **Retiro en Agencia**: Recoge tu paquete en la oficina de Shalom de tu preferencia en Lima. El costo del flete se paga en ventanilla al retirar.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
