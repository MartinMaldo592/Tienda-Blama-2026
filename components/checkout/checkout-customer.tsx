import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, CreditCard } from "lucide-react"

interface CheckoutCustomerProps {
    register: any
    errors: any
    disabled?: boolean
}

export function CheckoutCustomer({
    register, errors, disabled
}: CheckoutCustomerProps) {

    return (
        <div className="space-y-4 bg-card rounded-xl p-4 sm:p-5 border shadow-sm">
            <h4 className="font-bold text-lg mb-2">Datos Personales</h4>
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-bold text-foreground">Nombre Completo <span className="text-destructive">*</span></Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                        <User className="h-5 w-5" />
                    </div>
                    <Input
                        id="name"
                        placeholder="Tu nombre completo"
                        disabled={disabled}
                        className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                        {...register("name")}
                    />
                </div>
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-bold text-foreground">Celular <span className="text-destructive">*</span></Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
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
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                            {...register("phone", {
                                onChange: (e: any) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
                                }
                            })}
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="dni" className="text-sm font-bold text-foreground">DNI <span className="text-destructive">*</span></Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <Input
                            id="dni"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={8}
                            placeholder="8 dígitos"
                            disabled={disabled}
                            className="pl-11 h-12 bg-background border-border focus-visible:border-primary transition-colors rounded-lg font-medium text-foreground"
                            {...register("dni", {
                                onChange: (e: any) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                }
                            })}
                        />
                    </div>
                    {errors.dni && <p className="text-xs text-destructive font-medium">{errors.dni.message}</p>}
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
