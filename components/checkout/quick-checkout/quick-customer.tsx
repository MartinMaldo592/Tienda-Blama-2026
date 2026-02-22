"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, CreditCard, Phone, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
    const isNameValid = name.length > 5
    const isDniValid = dni.length === 8
    const isPhoneValid = phone.replace(/\D/g, '').length === 9

    return (
        <div className="space-y-4 bg-card rounded-xl p-4 border shadow-sm transition-all duration-300">
            <h4 className="font-bold text-base">Datos Personales</h4>

            <div className="space-y-1.5">
                <Label className="text-sm font-bold text-foreground">
                    Nombre y Apellidos <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                        isNameValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                    )}>
                        <User className="h-5 w-5" />
                    </div>
                    <Input
                        required
                        placeholder="Tu nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                            isNameValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                    />
                    {isNameValid && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-foreground">
                        DNI <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group">
                        <div className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                            isDniValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                        )}>
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
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isDniValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                        />
                        {isDniValid && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-foreground">
                        Celular <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group">
                        <div className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                            isPhoneValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                        )}>
                            <Phone className="h-5 w-5" />
                        </div>
                        <Input
                            required
                            placeholder="9 dígitos"
                            maxLength={11}
                            inputMode="numeric"
                            value={phone}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '').slice(0, 9)
                                setPhone(raw)
                            }}
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isPhoneValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                        />
                        {isPhoneValid && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
