"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Loader2, ArrowRight, UserPlus, ShoppingBag, CheckCircle2 } from "lucide-react"
import { m } from "framer-motion"
import { loginCustomerAction } from "../actions"

export default function CustomerLoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/mi-cuenta"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setErrorMsg("Por favor, ingresa tu correo y contraseña.")
            return
        }

        setErrorMsg("")
        setLoading(true)

        try {
            const res = await loginCustomerAction(email, password)
            if (res.error) {
                setErrorMsg(res.error)
                setLoading(false)
            } else {
                router.push(redirectTo)
                router.refresh()
            }
        } catch (err) {
            setErrorMsg("Ocurrió un error inesperado al iniciar sesión.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

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
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 font-medium">
                        Accede a tus pedidos, direcciones guardadas y puntos
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
                {/* Switcher Tab */}
                <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex gap-1 mb-6 shadow-inner">
                    <button
                        type="button"
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <Mail className="h-4 w-4" /> Iniciar Sesión
                    </button>
                    <Link
                        href={`/cuenta/registro${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-slate-800/50"
                    >
                        <UserPlus className="h-4 w-4" /> Crear Cuenta
                    </Link>
                </div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-900/90 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 relative"
                >
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-12 bg-slate-950/60 border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                                    Contraseña
                                </Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 h-12 bg-slate-950/60 border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-base shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Ingresando...
                                </>
                            ) : (
                                <>
                                    Ingresar a Mi Cuenta <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    {redirectTo.includes("checkout") && (
                        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3 text-xs text-blue-300 bg-blue-500/10 p-3 rounded-xl">
                            <ShoppingBag className="h-5 w-5 text-blue-400 flex-shrink-0" />
                            <span>Inicia sesión para autocompletar tus datos de envío en el checkout.</span>
                        </div>
                    )}
                </m.div>

                <div className="mt-8 text-center text-xs text-slate-500 font-medium">
                    © 2026 Tienda Blama. Todos los derechos reservados.
                </div>
            </div>
        </div>
    )
}
