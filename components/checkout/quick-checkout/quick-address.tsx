"use client"

import { IconInput } from "@/components/checkout/checkout-customer"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface QuickAddressProps {
    department: string
    setDepartment: (v: string) => void
    district: string // This is Province in modal usage
    setDistrict: (v: string) => void
    urbanDistrict: string // This is District in modal usage
    setUrbanDistrict: (v: string) => void
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
    district, setDistrict,
    urbanDistrict, setUrbanDistrict,
    addressValue, setAddressValue,
    reference, setReference,
    disabled,
    ready, suggestionsStatus, suggestionsData, onSuggestionSelect
}: QuickAddressProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label className="text-sm font-bold">Departamento <span className="text-destructive">*</span></Label>
                <IconInput icon={MapPin} required placeholder="Ej: Lima" value={department} onChange={(e: any) => setDepartment(e.target.value)} disabled={disabled} />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Provincia <span className="text-destructive">*</span></Label>
                <IconInput icon={MapPin} required placeholder="Ej: Cañete" value={district} onChange={(e: any) => setDistrict(e.target.value)} disabled={disabled} />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Distrito <span className="text-destructive">*</span></Label>
                <IconInput icon={MapPin} required placeholder="Ej: Miraflores" value={urbanDistrict} onChange={(e: any) => setUrbanDistrict(e.target.value)} disabled={disabled} />
            </div>

            <div className="space-y-1 relative">
                <Label className="text-sm font-bold">Dirección <span className="text-destructive">*</span></Label>
                <div className="flex w-full items-center rounded-md border text-sm overflow-hidden h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <div className="flex h-full w-10 items-center justify-center bg-muted/50 border-r">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        value={addressValue}
                        onChange={(e) => setAddressValue(e.target.value)}
                        disabled={disabled || !ready}
                        placeholder="Ej: Av. Larco 123"
                        className="flex h-full w-full bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                {suggestionsStatus === "OK" && (
                    <ul className="absolute z-10 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                        {suggestionsData.map(({ place_id, description }) => (
                            <li key={place_id} onClick={() => onSuggestionSelect(description)} className="px-4 py-2 hover:bg-muted cursor-pointer text-xs">
                                {description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Referencia</Label>
                <IconInput icon={MapPin} placeholder="Ej: Al costado del grifo" value={reference} onChange={(e: any) => setReference(e.target.value)} disabled={disabled} />
            </div>
        </div>
    )
}
