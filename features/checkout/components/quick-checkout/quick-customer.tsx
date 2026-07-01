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
    shippingMethod?: string
}

export function QuickCustomer({ name, setName, phone, setPhone, dni, setDni, email, setEmail, disabled, shippingMethod }: QuickCustomerProps) {
    const isProvincia = String(shippingMethod || '').toLowerCase().includes('provincia') || String(shippingMethod || '').toLowerCase().includes('shalom')
    const [showEmail, setShowEmail] = useState(email.length > 0)
    const [showDni, setShowDni] = useState(dni.length > 0)
    const isNameValid = name.length >= 2
    const isDniValid = dni.length === 8
    const isPhoneValid = phone.replace(/\D/g, '').length === 9 && phone.replace(/\D/g, '').startsWith('9')
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
                        minLength={4}
                        placeholder="Tu nombre completo"
                        value={name}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "")
                            setName(val)
                        }}
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
                            placeholder="987654321"
                            maxLength={9}
                            inputMode="numeric"
                            value={phone}
                            onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 0 && !val.startsWith('9')) {
                                    val = '';
                                }
                                setPhone(val.slice(0, 9));
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

                {/* Optional Buttons Group */}
                {(!showDni || !showEmail) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {!showDni && (
                            <button
                                type="button"
                                onClick={() => setShowDni(true)}
                                className="text-xs font-semibold text-primary hover:text-primary/95 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                            >
                                <span>+ Agregar DNI (Opcional)</span>
                            </button>
                        )}
                        {!showEmail && (
                            <button
                                type="button"
                                onClick={() => setShowEmail(true)}
                                className="text-xs font-semibold text-primary hover:text-primary/95 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                            >
                                <span>+ Agregar Correo (Opcional)</span>
                            </button>
                        )}
                    </div>
                )}

                {showDni && (
                    <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-bold text-foreground">
                                DNI <span className="text-muted-foreground font-normal text-xs">(Opcional)</span>
                            </Label>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDni(false)
                                    setDni("")
                                }}
                                className="text-[10px] text-destructive hover:text-destructive/80 font-bold transition-colors cursor-pointer"
                            >
                                Quitar
                            </button>
                        </div>
                        <div className="relative group">
                            <div className={cn(
                                "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors",
                                isDniValid ? "text-green-500" : "text-muted-foreground group-focus-within:text-primary"
                            )}>
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <Input
                                placeholder="8 dígitos"
                                minLength={8}
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
                )}

                {showEmail && (
                    <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <span>Correo Electrónico</span>
                                <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">Muy Recomendado</span>
                            </Label>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEmail(false)
                                    setEmail("")
                                }}
                                className="text-[10px] text-destructive hover:text-destructive/80 font-bold transition-colors cursor-pointer"
                            >
                                Quitar
                            </button>
                        </div>
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
        </div>
    )
}
