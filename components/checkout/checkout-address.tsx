import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Building2, Landmark, Navigation } from "lucide-react"

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
        <div className="space-y-4 bg-card rounded-xl p-4 sm:p-5 border shadow-sm">
            <h4 className="font-bold text-lg mb-2">Dirección de Envío</h4>

            {/* Google Maps Address */}
            <div className="space-y-1.5 relative">
                <Label htmlFor="address" className="text-sm font-bold text-foreground">
                    Dirección <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-primary">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        id="address"
                        value={addressValue}
                        onChange={(e) => onAddressChange(e.target.value)}
                        disabled={!addressReady || disabled}
                        placeholder="Escribe tu dirección..."
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                        autoComplete="off"
                    />
                </div>
                {suggestionsStatus === "OK" && (
                    <ul className="absolute z-10 w-full bg-card border border-border rounded-xl shadow-xl mt-1 max-h-60 overflow-auto divide-y divide-border">
                        {suggestions.map(({ place_id, description }) => (
                            <li
                                key={place_id}
                                onClick={() => onSuggestionSelect(description)}
                                className="px-4 py-3 hover:bg-primary/5 cursor-pointer text-sm text-foreground flex items-start gap-2 transition-colors"
                            >
                                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Department / Province / District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="department" className="text-sm font-bold text-foreground">
                        Departamento <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <Input
                            id="department"
                            placeholder="Departamento"
                            disabled={disabled}
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                            {...register("department")}
                        />
                    </div>
                    {errors.department && <p className="text-xs text-destructive font-medium">{errors.department.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="province" className="text-sm font-bold text-foreground">
                        Provincia <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                            <Landmark className="h-5 w-5" />
                        </div>
                        <Input
                            id="province"
                            placeholder="Provincia"
                            disabled={disabled}
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                            {...register("province")}
                        />
                    </div>
                    {errors.province && <p className="text-xs text-destructive font-medium">{errors.province.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="district" className="text-sm font-bold text-foreground">
                        Distrito <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                            <Navigation className="h-5 w-5" />
                        </div>
                        <Input
                            id="district"
                            placeholder="Distrito"
                            disabled={disabled}
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                            {...register("district")}
                        />
                    </div>
                    {errors.district && <p className="text-xs text-destructive font-medium">{errors.district.message}</p>}
                </div>
            </div>

            {/* Reference */}
            <div className="space-y-1.5">
                <Label htmlFor="reference" className="text-sm font-bold text-foreground">
                    Referencia <span className="text-muted-foreground font-normal text-xs">(Opcional)</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        id="reference"
                        placeholder="Frente al parque, casa azul..."
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                        {...register("reference")}
                    />
                </div>
            </div>

            {apiKeyMissing && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2">
                    ⚠️ Autocompletado deshabilitado — falta configurar la API Key de Google Maps.
                </div>
            )}
        </div>
    )
}
