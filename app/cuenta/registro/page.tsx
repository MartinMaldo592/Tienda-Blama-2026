"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, User, Phone, Loader2, ArrowRight, UserPlus, Sparkles, CheckCircle2 } from "lucide-react"
import { m } from "framer-motion"
import { registerCustomerAction } from "../actions"

export default function CustomerRegisterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/mi-cuenta"

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [password, setPassword] = useState("")
    
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre || !email || !password) {
            setErrorMsg("Por favor, completa los campos requeridos.")
            return
        }

        if (password.length < 6) {
            setErrorMsg("La contraseña debe tener al menos 6 caracteres.")
            return
        }

        setErrorMsg("")
        setSuccessMsg("")
        setLoading(true)

        try {
            const res = await registerCustomerAction({
                nombre,
                email,
                telefono,
                password,
            })

            if (res.error) {
                setErrorMsg(res.error)
                setLoading(false)
            } else if (res.autoLogin) {
                router.push(redirectTo)
                router.refresh()
            } else {
                setSuccessMsg(res.message || "¡Cuenta creada exitosamente!")
                setLoading(false)
                setTimeout(() => {
                    router.push(`/cuenta/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`)
                }, 1500)
            }
        } catch (err) {
            setErrorMsg("Ocurrió un error al procesar el registro.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
            {/* Background Light Elements */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center space-y-4">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                        B
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white">
                        BLAMA <span className="text-blue-500 font-medium">FITNESS</span>
                    </span>
                </Link>

                <div>
                    <h2 className="text-3xl font-black tracking-tight text-white">
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 font-medium">
                        Regístrate para acumular puntos y comprar más rápido
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
                {/* Switcher Tab */}
                <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex gap-1 mb-6 shadow-inner">
                    <Link
                        href={`/cuenta/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-slate-800/50"
                    >
                        <Mail className="h-4 w-4" /> Iniciar Sesión
                    </Link>
                    <button
                        type="button"
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <UserPlus className="h-4 w-4" /> Crear Cuenta
                    </button>
                </div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-900/90 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 relative"
                >
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nombre" className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                Nombre Completo <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    id="nombre"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="pl-12 h-12 bg-slate-950/60 border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                Correo Electrónico <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-12 bg-slate-950/60 border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="telefono" className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                Teléfono / WhatsApp (Opcional)
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    id="telefono"
                                    type="tel"
                                    placeholder="987654321"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="pl-12 h-12 bg-slate-950/60 border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                Contraseña <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 h-12 bg-slate-950/60 border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-base shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Creando cuenta...
                                </>
                            ) : (
                                <>
                                    Registrarme <Sparkles className="h-4 w-4 text-amber-300" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        Al registrarte, aceptas nuestros{" "}
                        <Link href="/terminos" className="text-indigo-400 underline hover:text-indigo-300">
                            Términos y Condiciones
                        </Link>{" "}
                        y{" "}
                        <Link href="/privacidad" className="text-indigo-400 underline hover:text-indigo-300">
                            Política de Privacidad
                        </Link>.
                    </div>
                </m.div>
            </div>
        </div>
    )
}
