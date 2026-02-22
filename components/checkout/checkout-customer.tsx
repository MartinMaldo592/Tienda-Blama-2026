import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, CreditCard, CheckCircle2 } from "lucide-react"
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

    const isValid = (name: string, value: string) => {
        return value && value.length >= (name === 'dni' ? 8 : name === 'phone' ? 9 : 3) && !errors[name]
    }

    return (
        <div className="space-y-4 bg-card rounded-xl p-4 sm:p-5 border shadow-sm transition-all duration-300">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                Datos Personales
            </h4>

            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-bold text-foreground flex justify-between">
                    <span>Nombre Completo <span className="text-destructive">*</span></span>
                </Label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <User className="h-5 w-5" />
                    </div>
                    <Input
                        id="name"
                        placeholder="Tu nombre completo"
                        disabled={disabled}
                        className={cn(
                            "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                            isValid("name", nameValue) ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                        )}
                        {...register("name")}
                    />
                    {isValid("name", nameValue) && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                </div>
                {errors.name && <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-bold text-foreground">Celular <span className="text-destructive">*</span></Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Phone className="h-5 w-5" />
                        </div>
                        <Input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={9}
                            placeholder="9 dígitos"
                            disabled={disabled}
                            className={cn(
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isValid("phone", phoneValue) ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                            {...register("phone", {
                                onChange: (e: any) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
                                }
                            })}
                        />
                        {isValid("phone", phoneValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {errors.phone && <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="dni" className="text-sm font-bold text-foreground">DNI <span className="text-destructive">*</span></Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
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
                                "pl-11 pr-10 h-12 bg-background border-border transition-all rounded-lg font-medium text-foreground",
                                isValid("dni", dniValue) ? "border-green-500/50 focus-visible:ring-green-500/20" : "focus-visible:border-primary"
                            )}
                            {...register("dni", {
                                onChange: (e: any) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                }
                            })}
                        />
                        {isValid("dni", dniValue) && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {errors.dni && <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.dni.message}</p>}
                </div>
            </div>
        </div>
    )
}

export const IconInput = ({ icon: Icon, ...props }: any) => (
    <div className="flex w-full items-center rounded-lg border text-sm overflow-hidden h-12 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-muted/30 border-muted-foreground/20 transition-colors focus-within:bg-background">
        <div className="flex h-full w-12 items-center justify-center text-muted-foreground">
            <Icon className="h-5 w-5" />
        </div>
        <input
            {...props}
            className={`flex h-full w-full bg-transparent px-2 py-2 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-medium ${props.className || ''}`}
        />
    </div>
)
