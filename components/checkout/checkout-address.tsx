import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface CheckoutAddressProps {
    department: string
    setDepartment: (val: string) => void
    province: string
    setProvince: (val: string) => void
    district: string
    setDistrict: (val: string) => void
    reference: string
    setReference: (val: string) => void

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
    department, setDepartment,
    province, setProvince,
    district, setDistrict,
    reference, setReference,
    addressValue, onAddressChange, addressReady,
    suggestions, suggestionsStatus, onSuggestionSelect,
    disabled, apiKeyMissing
}: CheckoutAddressProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="department">Departamento <span className="text-destructive">*</span></Label>
                <Input
                    id="department"
                    required
                    placeholder="Ej: Lima"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="province">Provincia <span className="text-destructive">*</span></Label>
                <Input
                    id="province"
                    required
                    placeholder="Ej: Cañete"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="district">Distrito <span className="text-destructive">*</span></Label>
                <Input
                    id="district"
                    required
                    placeholder="Ej: Miraflores"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-2 relative">
                <Label htmlFor="address">Dirección (Google Maps)</Label>
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
                <Label htmlFor="reference">Referencia (Opcional)</Label>
                <Input id="reference" placeholder="Frente al parque, casa azul..." value={reference} onChange={(e) => setReference(e.target.value)} disabled={disabled} />
            </div>

            {apiKeyMissing && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">⚠️ Nota: Autocompletado deshabilitado. Falta API Key.</div>
            )}
        </div>
    )
}
