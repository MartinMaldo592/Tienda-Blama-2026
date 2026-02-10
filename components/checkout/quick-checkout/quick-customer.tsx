"use client"

import { Input } from "@/components/ui/input"
import { IconInput } from "@/components/checkout/checkout-customer"
import { Label } from "@/components/ui/label"
import { User, CreditCard, Phone } from "lucide-react"

interface QuickCustomerProps {
    name: string
    setName: (v: string) => void
    phone: string
    setPhone: (v: string) => void
    dni: string
    setDni: (v: string) => void
    disabled?: boolean
}

export function QuickCustomer({ name, setName, phone, setPhone, dni, setDni, disabled }: QuickCustomerProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label className="text-sm font-bold">Nombre y Apellidos <span className="text-destructive">*</span></Label>
                <IconInput icon={User} required placeholder="Ej: Juan Pérez" value={name} onChange={(e: any) => setName(e.target.value)} disabled={disabled} />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">DNI <span className="text-destructive">*</span></Label>
                <IconInput
                    icon={CreditCard}
                    required
                    placeholder="DNI"
                    maxLength={8}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={dni}
                    onChange={(e: any) => setDni(e.target.value.replace(/\D/g, ''))}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-bold">Teléfono / Whatsapp <span className="text-destructive">*</span></Label>
                <IconInput
                    icon={Phone}
                    required
                    placeholder="Ej: 999 999 999"
                    maxLength={11}
                    inputMode="numeric"
                    value={phone}
                    onChange={(e: any) => {
                        const raw = e.target.value.replace(/\D/g, '')
                        let formatted = raw
                        if (raw.length > 3) {
                            formatted = raw.slice(0, 3) + ' ' + raw.slice(3)
                        }
                        if (raw.length > 6) {
                            formatted = formatted.slice(0, 7) + ' ' + raw.slice(6)
                        }
                        setPhone(formatted)
                    }}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}
