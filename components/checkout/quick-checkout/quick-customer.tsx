"use client"

import { Input } from "@/components/ui/input"
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
        <div className="space-y-4 bg-card rounded-xl p-4 border shadow-sm">
            <h4 className="font-bold text-base">Datos Personales</h4>

            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Nombre y Apellidos <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <User className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Tu nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-foreground">
                        DNI <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <Input
                            required
                            placeholder="8 dígitos"
                            maxLength={8}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={dni}
                            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                            disabled={disabled}
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-foreground">
                        Celular <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                            <Phone className="h-5 w-5" />
                        </div>
                        <Input
                            required
                            placeholder="9 dígitos"
                            maxLength={11}
                            inputMode="numeric"
                            value={phone}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '')
                                let formatted = raw
                                if (raw.length > 3) formatted = raw.slice(0, 3) + ' ' + raw.slice(3)
                                if (raw.length > 6) formatted = formatted.slice(0, 7) + ' ' + raw.slice(6)
                                setPhone(formatted)
                            }}
                            disabled={disabled}
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
