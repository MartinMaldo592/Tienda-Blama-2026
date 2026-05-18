"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase.client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react"
import Link from "next/link"
import { m } from "framer-motion"

export default function ForgotPasswordPage() {
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })

            if (error) throw error

            setMessage({
                type: 'success',
                text: "Se ha enviado un enlace de recuperación a tu correo electrónico."
            })
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: "Error al enviar el correo. Por favor, verifica e inténtalo nuevamente."
            })
        } finally {
            setLoading(false)
        }
    }

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
                    <Link 
                        href="/auth/login" 
                        className="absolute top-8 left-8 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <div className="text-center mb-8 mt-2">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-inner">
                            <KeyRound className="h-8 w-8" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Recuperar Acceso</h1>
                        <p className="text-slate-500 font-medium">Te enviaremos un enlace para restablecer tu contraseña</p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Correo Electrónico</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@tienda.com"
                                    className="pl-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl text-lg font-medium focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {message && (
                            <m.div 
                                initial={{opacity:0, height:0}} 
                                animate={{opacity:1, height:'auto'}} 
                                className={`p-4 text-sm font-semibold rounded-2xl border overflow-hidden ${
                                    message.type === 'success' 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                        : 'bg-rose-50 text-rose-600 border-rose-100'
                                }`}
                            >
                                {message.text}
                            </m.div>
                        )}

                        <Button type="submit" className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando...</> : "Enviar enlace"}
                        </Button>
                    </form>
                </m.div>
                
                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-slate-400">© 2026 Tienda Blama. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    )
}
