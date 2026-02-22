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
                        "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-muted/50",
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
                    <div className={cn("rounded-full p-2.5 transition-colors duration-200", (value === 'Lima' || value === 'lima') ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5 mt-1">
                        <span className={cn("block text-sm font-bold", (value === 'Lima' || value === 'lima') ? "text-primary" : "text-foreground")}>Lima</span>
                        <span className="block text-xs text-muted-foreground">Envío local</span>
                    </div>
                    {(value === 'Lima' || value === 'lima') && (
                        <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                    )}
                </label>

                <label
                    className={cn(
                        "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:bg-muted/50",
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
                    <div className={cn("rounded-full p-2.5 transition-colors duration-200", (value === 'Provincia' || value === 'provincia') ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <Truck className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5 mt-1">
                        <span className={cn("block text-sm font-bold", (value === 'Provincia' || value === 'provincia') ? "text-primary" : "text-foreground")}>Provincia</span>
                        <span className="block text-xs text-muted-foreground">Envíos a agencia</span>
                    </div>
                    {(value === 'Provincia' || value === 'provincia') && (
                        <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                    )}
                </label>
            </div>
        </div>
    )
}
