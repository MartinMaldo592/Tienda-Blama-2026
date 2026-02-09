import { Label } from "@/components/ui/label"

interface CheckoutShippingProps {
    value: string
    onChange: (val: string) => void
    disabled?: boolean
}

export function CheckoutShipping({ value, onChange, disabled }: CheckoutShippingProps) {
    return (
        <div className="space-y-3">
            <Label className="text-base">Método de envío <span className="text-destructive">*</span></Label>
            <div className="flex flex-col gap-2 pl-1">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="shipping"
                        value="lima"
                        checked={value === 'lima'}
                        onChange={(e) => onChange(e.target.value)}
                        className="accent-black h-4 w-4"
                        disabled={disabled}
                    />
                    <span className="text-sm font-medium">Lima (Gratis)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="shipping"
                        value="provincia"
                        checked={value === 'provincia'}
                        onChange={(e) => onChange(e.target.value)}
                        className="accent-black h-4 w-4"
                        disabled={disabled}
                    />
                    <span className="text-sm font-medium">Provincia (Shalom)</span>
                </label>
            </div>
        </div>
    )
}
