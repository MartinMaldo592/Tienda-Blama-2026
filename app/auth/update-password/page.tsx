"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UpdatePasswordPage() {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Establecer Contraseña</CardTitle>
                    <CardDescription>
                        Bienvenido. Por favor establece tu contraseña segura para continuar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pass">Nueva Contraseña</Label>
                            <Input
                                id="pass"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Actualizando..." : "Guardar y Entrar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
