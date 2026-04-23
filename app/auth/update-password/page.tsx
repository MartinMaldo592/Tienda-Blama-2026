"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase.client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2 } from "lucide-react"

export default function UpdatePasswordPage() {
    const supabase = createClient()
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                router.push("/auth/login")
            } else {
                setSession(data.session)
            }
        })
    }, [router])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password) return

        try {
            setLoading(true)
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            alert("Contraseña actualizada correctamente.")
            router.push("/admin/dashboard")
        } catch (err: any) {
            alert(err.message || "Error al actualizar")
        } finally {
            setLoading(false)
        }
    }

    if (!session) return <div className="p-10 text-center">Verificando sesión...</div>

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

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Actualizar y Entrar"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
