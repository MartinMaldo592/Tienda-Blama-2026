"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase.client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { m, AnimatePresence } from "framer-motion"
import { loginWithLockout } from "../actions"

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()
    
    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fetchedName, setFetchedName] = useState<string | null>(null)
    
    const [loading, setLoading] = useState(false)
    const [loadingNext, setLoadingNext] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            setErrorMsg("Por favor, ingresa un correo válido.")
            return
        }
        setErrorMsg("")
        setLoadingNext(true)
        
        try {
            const { data, error } = await supabase.rpc('get_user_name_by_email', { p_email: email })
            if (!error && data) {
                // Si la BD devuelve el nombre real, lo guardamos
                setFetchedName(data)
            } else {
                setFetchedName(null)
            }
        } catch (err) {
            setFetchedName(null)
        } finally {
            setLoadingNext(false)
            setStep(2)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        try {
            const result = await loginWithLockout(email, password)

            if (result.error) {
                setErrorMsg(result.error)
                setLoading(false)
            } else if (result.success) {
                // Login exitoso
                router.push("/admin/dashboard") 
                // Evitamos llamar a setLoading(false) aquí ya que el componente se desmontará al navegar
            }
        } catch (error: any) {
            setErrorMsg("Error interno procesando el inicio de sesión.")
            setLoading(false)
        }
    }

    const formatNameFromEmail = (email: string) => {
        const part = email.split('@')[0];
        const cleanPart = part.replace(/[._-]/g, ' ');
        return cleanPart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const displayName = fetchedName || formatNameFromEmail(email)

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <m.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <m.div 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-blue-50 text-blue-600 mb-6 shadow-inner">
                                        <Mail className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">¡Bienvenido!</h1>
                                    <p className="text-slate-500 font-medium">Ingresa tu correo electrónico para comenzar</p>
                                </div>

                                <form onSubmit={handleNext} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Correo Electrónico</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="tu@correo.com"
                                                className="pl-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl text-lg font-medium focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all"
                                                required
                                                autoFocus
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <m.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-2xl border border-rose-100 overflow-hidden">
                                            {errorMsg}
                                        </m.div>
                                    )}

                                    <Button type="submit" disabled={loadingNext} className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all group">
                                        {loadingNext ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Siguiente <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
                                    </Button>
                                </form>
                            </m.div>
                        )}

                        {step === 2 && (
                            <m.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <button 
                                    onClick={() => { setStep(1); setErrorMsg("") }}
                                    className="absolute top-8 left-8 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>

                                <div className="text-center mb-8 mt-2">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-inner">
                                        <Lock className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">¡Hola, {displayName}!</h1>
                                    <p className="text-slate-500 font-medium">Ahora pon tu contraseña para acceder</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="password" className="text-slate-700 font-bold">Contraseña</Label>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl text-lg font-medium focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all tracking-widest"
                                                required
                                                autoFocus
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <Link 
                                                href="/auth/forgot-password" 
                                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <m.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-2xl border border-rose-100 overflow-hidden">
                                            {errorMsg}
                                        </m.div>
                                    )}

                                    <Button type="submit" className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                                        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Ingresando...</> : "Iniciar Sesión"}
                                    </Button>
                                </form>
                            </m.div>
                        )}
                    </AnimatePresence>
                </m.div>
                
                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-slate-400">© 2026 Tienda Blama. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    )
}
