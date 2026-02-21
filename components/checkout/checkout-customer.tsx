import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CheckoutCustomerProps {
    register: any
    errors: any
    disabled?: boolean
}

export function CheckoutCustomer({
    register, errors, disabled
}: CheckoutCustomerProps) {

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                    id="name"
                    placeholder="Juan Pérez"
                    disabled={disabled}
                    {...register("name")}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={9}
                    placeholder="999 999 999"
                    disabled={disabled}
                    {...register("phone", {
                        onChange: (e: any) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
                        }
                    })}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input
                    id="dni"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    placeholder="12345678"
                    disabled={disabled}
                    {...register("dni", {
                        onChange: (e: any) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
                        }
                    })}
                />
                {errors.dni && <p className="text-xs text-destructive">{errors.dni.message}</p>}
            </div>
        </div>
    )
}

export const IconInput = ({ icon: Icon, ...props }: any) => (
    <div className="flex w-full items-center rounded-md border text-sm overflow-hidden h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex h-full w-10 items-center justify-center bg-muted/50 border-r">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
            {...props}
            className={`flex h-full w-full bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}
        />
    </div>
)
