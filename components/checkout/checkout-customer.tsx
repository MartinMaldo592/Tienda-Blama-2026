import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CheckoutCustomerProps {
    name: string
    setName: (val: string) => void
    phone: string
    setPhone: (val: string) => void
    phoneError: string
    setPhoneError: (val: string) => void
    dni: string
    setDni: (val: string) => void
    dniError: string
    setDniError: (val: string) => void
    disabled?: boolean
}

export function CheckoutCustomer({
    name, setName,
    phone, setPhone, phoneError, setPhoneError,
    dni, setDni, dniError, setDniError,
    disabled
}: CheckoutCustomerProps) {

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 9)
        setPhone(raw)
        if (phoneError) setPhoneError("")
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                    id="name"
                    required
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                    id="phone"
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{9}"
                    minLength={9}
                    maxLength={9}
                    placeholder="999 999 999"
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={disabled}
                    onInvalid={(e) => e.currentTarget.setCustomValidity('Ingresa un número de celular válido de 9 dígitos')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                />
                {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input
                    id="dni"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{8}"
                    minLength={8}
                    maxLength={8}
                    placeholder="12345678"
                    value={dni}
                    onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, '').slice(0, 8)
                        setDni(next)
                        if (dniError) setDniError("")
                    }}
                    onInvalid={(e) => e.currentTarget.setCustomValidity('Ingresa un DNI válido de 8 dígitos')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                    disabled={disabled}
                />
                {dniError && <p className="text-xs text-destructive">{dniError}</p>}
            </div>
        </div>
    )
}
