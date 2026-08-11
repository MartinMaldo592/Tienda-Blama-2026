"use client"

import { useState } from "react"
import { CustomerProfile, updateCustomerProfileAction } from "@/app/cuenta/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, FileText, MapPin, Save, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ProfileTabProps {
    profile: CustomerProfile
    onProfileUpdated: () => void
}

export function ProfileTab({ profile, onProfileUpdated }: ProfileTabProps) {
    const [nombre, setNombre] = useState(profile.nombre || "")
    const [telefono, setTelefono] = useState(profile.telefono || "")
    const [dni, setDni] = useState(profile.dni || "")
    const [departamento, setDepartamento] = useState(profile.departamento || "")
    const [provincia, setProvincia] = useState(profile.provincia || "")
    const [distrito, setDistrito] = useState(profile.distrito || "")
    const [direccion, setDireccion] = useState(profile.direccion || "")
    const [referencia, setReferencia] = useState(profile.referencia || "")

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) {
            toast.error("El nombre es obligatorio.")
            return
        }

        setLoading(true)
        try {
            const res = await updateCustomerProfileAction({
                nombre,
                telefono,
                dni,
                departamento,
                provincia,
                distrito,
                direccion,
                referencia,
            })

            if (res.error) {
                toast.error("Error al guardar", { description: res.error })
            } else {
                toast.success("¡Perfil actualizado!", { description: "Tus datos personales y dirección guardada se han actualizado." })
                onProfileUpdated()
            }
        } catch (err) {
            toast.error("Error inesperado guardando cambios.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-xl font-black text-slate-900">Mi Perfil y Dirección</h2>
                <p className="text-xs text-slate-500 font-medium">
                    Actualiza tu información para agilizar el proceso de compra en el checkout
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos Personales */}
                <Card className="rounded-3xl border border-slate-200/80 shadow-sm">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" /> Información Personal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Nombre Completo <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Juan Pérez"
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Correo Electrónico (No editable)
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="pl-10 h-11 bg-slate-100 border-slate-200 text-slate-500 rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Teléfono / WhatsApp
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="telefono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="987654321"
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dni" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                DNI / CE
                            </Label>
                            <div className="relative">
                                <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="dni"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    placeholder="76543210"
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dirección de Envío Guardada */}
                <Card className="rounded-3xl border border-slate-200/80 shadow-sm">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-600" /> Dirección Principal de Envío
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dept" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Departamento
                                </Label>
                                <Input
                                    id="dept"
                                    value={departamento}
                                    onChange={(e) => setDepartamento(e.target.value)}
                                    placeholder="Ej: Lima"
                                    className="h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="prov" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Provincia
                                </Label>
                                <Input
                                    id="prov"
                                    value={provincia}
                                    onChange={(e) => setProvincia(e.target.value)}
                                    placeholder="Ej: Lima"
                                    className="h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dist" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Distrito
                                </Label>
                                <Input
                                    id="dist"
                                    value={distrito}
                                    onChange={(e) => setDistrito(e.target.value)}
                                    placeholder="Ej: Miraflores"
                                    className="h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direccion" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Calle / Avenida / Número
                            </Label>
                            <Input
                                id="direccion"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                placeholder="Av. Larco 123 Int 402"
                                className="h-11 bg-slate-50 border-slate-200 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="referencia" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Referencia
                            </Label>
                            <Input
                                id="referencia"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                placeholder="Frente al parque o supermercado"
                                className="h-11 bg-slate-50 border-slate-200 rounded-xl"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" /> Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
