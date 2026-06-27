import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Building2, Landmark, Navigation, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutAddressProps {
    register: any
    errors: any
    watch: any

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
    register, errors, watch,
    addressValue, onAddressChange, addressReady,
    suggestions, suggestionsStatus, onSuggestionSelect,
    disabled, apiKeyMissing
}: CheckoutAddressProps) {
    const departmentValue = watch("department")
    const provinceValue = watch("province")
    const districtValue = watch("district")
    const shippingMethod = watch("shippingMethod")

    const isValid = (name: string, value: string) => {
        return value && value.length >= 1 && !errors[name]
    }

    const isAddressValid = addressValue && addressValue.length >= 1

    return (
        <div className="space-y-4 bg-card rounded-xl p-4 sm:p-5 border shadow-sm transition-all duration-300">
            <h4 className="font-bold text-lg mb-2">Dirección de Envío</h4>

            {/* Alerta de envíos a provincia */}
            {['provincia', 'Provincia'].includes(shippingMethod || '') && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-300">
                    <span className="text-sm shrink-0">💡</span>
                    <span>Envíos a Provincia: Todos los paquetes se envían para retiro en la oficina o agencia principal de Shalom de tu distrito o ciudad.</span>
                </div>
            )}

            {/* Google Maps Address */}
            <div className="space-y-1.5 relative">
                <Label htmlFor="address" className="text-sm font-bold text-foreground">
                    Dirección <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isAddressValid ? "text-green-500" : "text-primary transition-colors group-focus-within:text-primary"
                    )}>
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        id="address"
                        value={addressValue}
                        onChange={(e) => onAddressChange(e.target.value)}
                        disabled={disabled}
                        placeholder="Escribe tu dirección..."
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                            isAddressValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                        autoComplete="off"
                    />
                    {isAddressValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
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
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="department" className="text-sm font-bold text-foreground">
                        Departamento <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <Input
                            id="department"
                            placeholder="Departamento"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isValid("department", departmentValue) ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                            {...register("department")}
                        />
                        {isValid("department", departmentValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {errors.department && <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.department.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="province" className="text-sm font-bold text-foreground">
                        Provincia <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Landmark className="h-5 w-5" />
                        </div>
                        <Input
                            id="province"
                            placeholder="Provincia"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isValid("province", provinceValue) ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                            {...register("province")}
                        />
                        {isValid("province", provinceValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {errors.province && <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.province.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="district" className="text-sm font-bold text-foreground">
                        Distrito <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Navigation className="h-5 w-5" />
                        </div>
                        <Input
                            id="district"
                            placeholder="Distrito"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isValid("district", districtValue) ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                            {...register("district")}
                        />
                        {isValid("district", districtValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {errors.district && <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.district.message}</p>}
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
