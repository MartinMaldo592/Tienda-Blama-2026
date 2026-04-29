import { Label } from "@/components/ui/label"
import { Truck, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutShippingProps {
    value: string
    onChange: (val: string) => void
    disabled?: boolean
}

export function CheckoutShipping({ value, onChange, disabled }: CheckoutShippingProps) {
    return (
        <div className="space-y-3 pb-2">
            <Label className="text-base font-bold text-foreground">Método de Envío <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-2 gap-3">
                <label
                    className={cn(
                        "relative flex cursor-pointer flex-row items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 hover:bg-muted/50",
                        (value === 'Lima' || value === 'lima') ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                        disabled ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    <input
                        type="radio"
                        name="shipping"
                        value="Lima"
                        checked={value === 'Lima' || value === 'lima'}
                        onChange={(e) => onChange('Lima')}
                        className="sr-only"
                        disabled={disabled}
                    />
                    <div className={cn("rounded-lg p-2 transition-colors duration-200 shrink-0", (value === 'Lima' || value === 'lima') ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("block text-sm font-bold leading-tight", (value === 'Lima' || value === 'lima') ? "text-primary" : "text-foreground")}>Lima</span>
                        <span className="block text-[11px] leading-tight mt-0.5 text-muted-foreground">Envío local</span>
                    </div>
                    {(value === 'Lima' || value === 'lima') && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    )}
                </label>

                <label
                    className={cn(
                        "relative flex cursor-pointer flex-row items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 hover:bg-muted/50",
                        (value === 'Provincia' || value === 'provincia') ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                        disabled ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    <input
                        type="radio"
                        name="shipping"
                        value="Provincia"
                        checked={value === 'Provincia' || value === 'provincia'}
                        onChange={(e) => onChange('Provincia')}
                        className="sr-only"
                        disabled={disabled}
                    />
                    <div className={cn("rounded-lg p-2 transition-colors duration-200 shrink-0", (value === 'Provincia' || value === 'provincia') ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("block text-sm font-bold leading-tight", (value === 'Provincia' || value === 'provincia') ? "text-primary" : "text-foreground")}>Provincia</span>
                        <span className="block text-[11px] leading-tight mt-0.5 text-muted-foreground">Envíos a agencia</span>
                    </div>
                    {(value === 'Provincia' || value === 'provincia') && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    )}
                </label>
            </div>
        </div>
    )
}
