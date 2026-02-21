import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface CheckoutAddressProps {
    register: any
    errors: any

    // Autocomplete props
    addressValue: string
    onAddressChange: (val: string) => void
    addressReady: boolean
    suggestions: { place_id: string; description: string }[]
    suggestionsStatus: string
    onSuggestionSelect: (val: string) => void

    disabled?: boolean
    apiKeyMissing?: boolean
}

export function CheckoutAddress({
    register, errors,
    addressValue, onAddressChange, addressReady,
    suggestions, suggestionsStatus, onSuggestionSelect,
    disabled, apiKeyMissing
}: CheckoutAddressProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2 relative">
                <Label htmlFor="address">Dirección (Google Maps) <span className="text-destructive">*</span></Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="address"
                        value={addressValue}
                        onChange={(e) => onAddressChange(e.target.value)}
                        disabled={!addressReady || disabled}
                        placeholder="Escribe tu dirección..."
                        className="pl-9"
                        autoComplete="off"
                    />
                </div>
                {suggestionsStatus === "OK" && (
                    <ul className="absolute z-10 w-full bg-card border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                        {suggestions.map(({ place_id, description }) => (
                            <li key={place_id} onClick={() => onSuggestionSelect(description)} className="px-4 py-2 hover:bg-popover cursor-pointer text-sm text-muted-foreground">
                                {description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="department">Departamento <span className="text-destructive">*</span></Label>
                <Input
                    id="department"
                    placeholder="Ej: Lima"
                    disabled={disabled}
                    {...register("department")}
                />
                {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="province">Provincia <span className="text-destructive">*</span></Label>
                <Input
                    id="province"
                    placeholder="Ej: Cañete"
                    disabled={disabled}
                    {...register("province")}
                />
                {errors.province && <p className="text-xs text-destructive">{errors.province.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="district">Distrito <span className="text-destructive">*</span></Label>
                <Input
                    id="district"
                    placeholder="Ej: Miraflores"
                    disabled={disabled}
                    {...register("district")}
                />
                {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="reference">Referencia (Opcional)</Label>
                <Input id="reference" placeholder="Frente al parque, casa azul..." disabled={disabled} {...register("reference")} />
            </div>

            {apiKeyMissing && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">⚠️ Nota: Autocompletado deshabilitado. Falta API Key.</div>
            )}
        </div>
    )
}
