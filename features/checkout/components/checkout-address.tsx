"use client"

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
        <div className="space-y-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs transition-all duration-300">
            <div>
                <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#FF6FA7]" /> Paso 2: Dirección de Envío
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Indica el lugar donde entregaremos tu pedido o agencia de destino
                </p>
            </div>


            {/* 1. DIRECCIÓN AL PRINCIPIO CON AUTOCOMPLETADO */}
            <div className="space-y-1.5 relative">
                <Label htmlFor="address" className="text-sm font-extrabold text-slate-800">
                    Dirección (Calle, Av, Jr y Número) <span className="text-[#FF6FA7]">*</span>
                </Label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <Input
                        id="address"
                        placeholder="Ej: Av. Larco 1234, Dpto 501"
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20",
                            isAddressValid ? "border-emerald-500/60" : ""
                        )}
                        value={addressValue}
                        onChange={(e) => onAddressChange(e.target.value)}
                    />
                    {isAddressValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                    )}
                </div>

                {/* Autocomplete Suggestions Dropdown */}
                {suggestionsStatus === "OK" && suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-lg overflow-hidden divide-y divide-slate-100 text-xs">
                        {suggestions.map(({ place_id, description }) => (
                            <li
                                key={place_id}
                                onClick={() => onSuggestionSelect(description)}
                                className="px-4 py-2.5 hover:bg-[#FFE6EF] hover:text-[#FF6FA7] cursor-pointer transition-colors font-medium flex items-center gap-2"
                            >
                                <MapPin className="h-3.5 w-3.5 text-[#FF6FA7] shrink-0" />
                                <span className="truncate">{description}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {errors.address && <p className="text-xs text-rose-500 font-bold animate-in fade-in slide-in-from-top-1">{errors.address.message}</p>}
            </div>

            {/* 2. DEPARTAMENTO, PROVINCIA, DISTRITO GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="department" className="text-sm font-extrabold text-slate-800">
                        Departamento <span className="text-[#FF6FA7]">*</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                            <Landmark className="h-4 w-4" />
                        </div>
                        <Input
                            id="department"
                            placeholder="Ej: Lima"
                            disabled={disabled}
                            className={cn(
                                "pl-9 pr-8 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20 text-xs",
                                isValid("department", departmentValue) ? "border-emerald-500/60" : ""
                            )}
                            {...register("department")}
                        />
                        {isValid("department", departmentValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                        )}
                    </div>
                    {errors.department && <p className="text-[11px] text-rose-500 font-bold">{errors.department.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="province" className="text-sm font-extrabold text-slate-800">
                        Provincia <span className="text-[#FF6FA7]">*</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <Input
                            id="province"
                            placeholder="Ej: Lima"
                            disabled={disabled}
                            className={cn(
                                "pl-9 pr-8 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20 text-xs",
                                isValid("province", provinceValue) ? "border-emerald-500/60" : ""
                            )}
                            {...register("province")}
                        />
                        {isValid("province", provinceValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                        )}
                    </div>
                    {errors.province && <p className="text-[11px] text-rose-500 font-bold">{errors.province.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="district" className="text-sm font-extrabold text-slate-800">
                        Distrito <span className="text-[#FF6FA7]">*</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <Input
                            id="district"
                            placeholder="Ej: Miraflores"
                            disabled={disabled}
                            className={cn(
                                "pl-9 pr-8 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20 text-xs",
                                isValid("district", districtValue) ? "border-emerald-500/60" : ""
                            )}
                            {...register("district")}
                        />
                        {isValid("district", districtValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                        )}
                    </div>
                    {errors.district && <p className="text-[11px] text-rose-500 font-bold">{errors.district.message}</p>}
                </div>
            </div>

            {/* 3. REFERENCIA */}
            <div className="space-y-1.5">
                <Label htmlFor="reference" className="text-sm font-extrabold text-slate-800 flex justify-between">
                    <span>Referencia de Entrega</span>
                    <span className="text-slate-400 font-normal text-xs">(Opcional)</span>
                </Label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                        <Navigation className="h-5 w-5" />
                    </div>
                    <Input
                        id="reference"
                        placeholder="Ej: Frente al parque central, casa de 2 pisos"
                        disabled={disabled}
                        className="pl-11 pr-4 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20"
                        {...register("reference")}
                    />
                </div>
            </div>
        </div>
    )
}
