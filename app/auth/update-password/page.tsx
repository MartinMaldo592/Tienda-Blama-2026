"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase.client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, CheckCircle2, ShieldAlert } from "lucide-react"

export default function UpdatePasswordPage() {
    const supabase = createClient()
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                router.push("/auth/login")
            } else {
                setChecking(false)
            }
        })
    }, [router])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!password || !confirmPassword) return

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.")
            return
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.")
            return
        }

        try {
            setLoading(true)

            // 1. Actualizar la contraseña
            const { error: updateError } = await supabase.auth.updateUser({ password })
            if (updateError) throw updateError

            // 2. Cerrar sesión para invalidar el token de recuperación
            //    Esto previene que alguien reutilice el enlace del correo
            await supabase.auth.signOut()

            // 3. Mostrar éxito y redirigir a login
            setSuccess(true)
            setTimeout(() => router.push("/auth/login"), 3000)
        } catch (err: any) {
            setError(err.message || "Error al actualizar la contraseña")
        } finally {
            setLoading(false)
        }
    }

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background px-4">
                <div className="w-full max-w-sm bg-card p-8 rounded-xl shadow-lg border border-border text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">¡Contraseña Actualizada!</h1>
                    <p className="text-muted-foreground text-sm mb-4">
                        Tu contraseña se cambió correctamente. Serás redirigido al inicio de sesión.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Redirigiendo...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <div className="w-full max-w-sm bg-card p-8 rounded-xl shadow-lg border border-border">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground mb-4">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Nueva Contraseña</h1>
                    <p className="text-muted-foreground text-sm">Establece una contraseña segura para tu cuenta</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pass">Contraseña Nueva</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="pass"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-pass">Confirmar Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirm-pass"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 p-3 text-xs rounded-md border bg-red-50 text-red-600 border-red-100">
                            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Actualizar Contraseña"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

