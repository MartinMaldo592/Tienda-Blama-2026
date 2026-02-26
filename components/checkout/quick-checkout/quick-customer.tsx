"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, CreditCard, Phone, CheckCircle2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickCustomerProps {
    name: string
    setName: (v: string) => void
    phone: string
    setPhone: (v: string) => void
    dni: string
    setDni: (v: string) => void
    email: string
    setEmail: (v: string) => void
    disabled?: boolean
}

export function QuickCustomer({ name, setName, phone, setPhone, dni, setDni, email, setEmail, disabled }: QuickCustomerProps) {
    const [showEmail, setShowEmail] = useState(!!email)
    const isNameValid = name.length > 5
    const isDniValid = dni.length === 8
    const isPhoneValid = phone.replace(/\D/g, '').length === 9
    const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

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

            {!showEmail ? (
                <button
                    type="button"
                    onClick={() => setShowEmail(true)}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 py-1 w-fit group"
                >
                    <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    <span>+ Agregar correo electrónico (Opcional)</span>
                </button>
            ) : (
                <div className="space-y-1.5 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <span>Correo Electrónico</span>
                        <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">Opcional</span>
                    </Label>
                    <div className="relative group">
                        <div className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                            isEmailValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                        )}>
                            <Mail className="h-5 w-5" />
                        </div>
                        <Input
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isEmailValid ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                        />
                        {isEmailValid && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
