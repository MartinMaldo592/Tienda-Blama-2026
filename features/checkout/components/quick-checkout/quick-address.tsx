"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Building2, Landmark, Navigation, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
    onFocus?: () => void

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
    onFocus,
    ready, suggestionsStatus, suggestionsData, onSuggestionSelect
}: QuickAddressProps) {
    const [manualMode, setManualMode] = useState(false)

    const isAddressValid = addressValue && addressValue.length >= 1
    const isDepartmentValid = department && department.length >= 1
    const isProvinceValid = province && province.length >= 1
    const isDistrictValid = district && district.length >= 1
    const isReferenceValid = reference && reference.length >= 1

    return (
        <div className="space-y-4 bg-card rounded-xl p-4 border shadow-sm">
            <h4 className="font-bold text-base">Dirección de Envío</h4>

            {/* Google Maps address */}
            <div className="space-y-1.5 relative">
                <Label className="text-sm font-bold text-foreground">
                    Dirección <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isAddressValid ? "text-green-500" : "text-primary group-focus-within:text-primary"
                    )}>
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        value={addressValue}
                        onChange={(e) => setAddressValue(e.target.value)}
                        onFocus={onFocus}
                        disabled={disabled}
                        placeholder={manualMode ? "Escribe tu dirección completa..." : "Escribe tu dirección..."}
                        autoComplete={manualMode ? "street-address" : "off"}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground",
                            isAddressValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                    />
                    {isAddressValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
                {!manualMode && suggestionsStatus === "OK" && (
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
                <button
                    type="button"
                    onClick={() => setManualMode(!manualMode)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer mt-1"
                >
                    {manualMode ? "← Usar autocompletado de Google Maps" : "¿No encuentras tu dirección? Ingresar manualmente"}
                </button>
            </div>

            {/* Dept */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Departamento <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isDepartmentValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                    )}>
                        <Building2 className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Departamento"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground",
                            isDepartmentValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                    />
                    {isDepartmentValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* Province */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Provincia <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isProvinceValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                    )}>
                        <Landmark className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Provincia"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground",
                            isProvinceValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                    />
                    {isProvinceValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* District */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Distrito <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isDistrictValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                    )}>
                        <Navigation className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Distrito"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground",
                            isDistrictValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                    />
                    {isDistrictValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* Reference */}
            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Referencia <span className="text-muted-foreground font-normal text-xs">(Opcional)</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isReferenceValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                    )}>
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        placeholder="Frente al parque, casa azul..."
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground",
                            isReferenceValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                    />
                    {isReferenceValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
