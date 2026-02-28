"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Building2, Landmark, Navigation } from "lucide-react"

interface QuickAddressProps {
    department: string
    setDepartment: (v: string) => void
    province: string
    setProvince: (v: string) => void
    district: string
    setDistrict: (v: string) => void
    addressValue: string
    setAddressValue: (v: string) => void
    reference: string
    setReference: (v: string) => void
    disabled?: boolean

    // Auto-complete props
    ready: boolean
    suggestionsStatus: string
    suggestionsData: any[]
    onSuggestionSelect: (desc: string) => void
}

export function QuickAddress({
    department, setDepartment,
    province, setProvince,
    district, setDistrict,
    addressValue, setAddressValue,
    reference, setReference,
    disabled,
    ready, suggestionsStatus, suggestionsData, onSuggestionSelect
}: QuickAddressProps) {
    return (
        <div className="space-y-4 bg-card rounded-xl p-4 border shadow-sm">
            <h4 className="font-bold text-base">Dirección de Envío</h4>

            {/* Google Maps address */}
            <div className="space-y-1.5 relative">
                <Label className="text-sm font-bold text-foreground">
                    Dirección <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-primary">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        value={addressValue}
                        onChange={(e) => setAddressValue(e.target.value)}
                        disabled={disabled || !ready}
                        placeholder="Escribe tu dirección..."
                        autoComplete="off"
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                    />
                </div>
                {suggestionsStatus === "OK" && (
                    <ul className="absolute z-10 w-full bg-card border border-border rounded-xl shadow-xl mt-1 max-h-48 overflow-auto divide-y divide-border">
                        {suggestionsData.map(({ place_id, description }) => (
                            <li
                                key={place_id}
                                onClick={() => onSuggestionSelect(description)}
                                className="px-4 py-3 hover:bg-primary/5 cursor-pointer text-sm flex items-start gap-2 transition-colors"
                            >
                                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Dept */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Departamento <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Departamento"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                    />
                </div>
            </div>

            {/* Province */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Provincia <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <Landmark className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Provincia"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                    />
                </div>
            </div>

            {/* District */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Distrito <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <Navigation className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Distrito"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                    />
                </div>
            </div>

            {/* Reference */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Referencia <span className="text-muted-foreground font-normal text-xs">(Opcional)</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        placeholder="Frente al parque, casa azul..."
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                    />
                </div>
            </div>
        </div>
    )
}
