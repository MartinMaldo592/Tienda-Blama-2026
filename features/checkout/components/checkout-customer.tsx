"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, CreditCard, CheckCircle2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutCustomerProps {
    register: any
    errors: any
    watch: any
    disabled?: boolean
}

export function CheckoutCustomer({
    register, errors, watch, disabled
}: CheckoutCustomerProps) {
    const nameValue = watch("name")
    const phoneValue = watch("phone")
    const dniValue = watch("dni")
    const emailValue = watch("email")
    const [showEmail, setShowEmail] = useState(false)

    const isValid = (name: string, value: string) => {
        if (name === 'email') {
            return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !errors[name]
        }
        if (name === 'phone') {
            const cleanVal = (value || "").replace(/\D/g, '')
            return cleanVal.length === 9 && cleanVal.startsWith('9') && !errors[name]
        }
        return value && value.length >= (name === 'dni' ? 8 : 3) && !errors[name]
    }

    return (
        <div className="space-y-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs transition-all duration-300">
            <div>
                <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#FF6FA7]" /> Paso 1: Datos Personales
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Ingresa tus datos para la boleta/factura y confirmación del pedido
                </p>
            </div>

            {/* Nombre Completo */}
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-extrabold text-slate-800 flex justify-between">
                    <span>Nombre Completo <span className="text-[#FF6FA7]">*</span></span>
                </Label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                        <User className="h-5 w-5" />
                    </div>
                    <Input
                        id="name"
                        placeholder="Tu nombre completo"
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20",
                            isValid("name", nameValue) ? "border-emerald-500/60 focus-visible:ring-emerald-500/20" : ""
                        )}
                        {...register("name", {
                            onChange: (e: any) => {
                                e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
                            }
                        })}
                    />
                    {isValid("name", nameValue) && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                    )}
                </div>
                {errors.name && <p className="text-xs text-rose-500 font-bold animate-in fade-in slide-in-from-top-1">{errors.name.message}</p>}
            </div>

            {/* Celular y DNI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-extrabold text-slate-800">Celular (WhatsApp) <span className="text-[#FF6FA7]">*</span></Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                            <Phone className="h-5 w-5" />
                        </div>
                        <Input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={9}
                            placeholder="987654321"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20",
                                isValid("phone", phoneValue) ? "border-emerald-500/60 focus-visible:ring-emerald-500/20" : ""
                            )}
                            {...register("phone", {
                                onChange: (e: any) => {
                                    let val = e.target.value.replace(/\D/g, '');
                                    if (val.length > 0 && !val.startsWith('9')) {
                                        val = '';
                                    }
                                    e.target.value = val.slice(0, 9);
                                }
                            })}
                        />
                        {isValid("phone", phoneValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                        )}
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 font-bold animate-in fade-in slide-in-from-top-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="dni" className="text-sm font-extrabold text-slate-800">DNI / RUC <span className="text-[#FF6FA7]">*</span></Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <Input
                            id="dni"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={8}
                            placeholder="8 dígitos"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20",
                                isValid("dni", dniValue) ? "border-emerald-500/60 focus-visible:ring-emerald-500/20" : ""
                            )}
                            {...register("dni", {
                                onChange: (e: any) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                }
                            })}
                        />
                        {isValid("dni", dniValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                        )}
                    </div>
                    {errors.dni && <p className="text-xs text-rose-500 font-bold animate-in fade-in slide-in-from-top-1">{errors.dni.message}</p>}
                </div>
            </div>

            {/* Email Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-slate-700 mt-2 bg-slate-50 border border-slate-200 p-3 rounded-xl w-full hover:bg-slate-100/60 transition-colors">
                <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#FF6FA7] cursor-pointer"
                />
                <span>Recibir alertas de mi envío gratis, código Shalom y alertas por correo</span>
            </label>

            {showEmail && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
                        <span>Correo Electrónico</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#FF6FA7] font-extrabold bg-[#FFE6EF] px-2 py-0.5 rounded-full border border-[#FF6FA7]/30">Muy Recomendado</span>
                    </Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#FF6FA7] transition-colors">
                            <Mail className="h-5 w-5" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-slate-50 border-slate-200 transition-all rounded-xl font-medium text-slate-900 focus-visible:border-[#FF6FA7] focus-visible:ring-[#FF6FA7]/20",
                                isValid("email", emailValue) ? "border-emerald-500/60 focus-visible:ring-emerald-500/20" : ""
                            )}
                            {...register("email")}
                        />
                        {isValid("email", emailValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                        )}
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 font-bold animate-in fade-in slide-in-from-top-1">{errors.email.message}</p>}
                </div>
            )}
        </div>
    )
}
