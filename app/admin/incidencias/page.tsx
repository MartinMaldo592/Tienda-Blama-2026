
"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Wrench } from "lucide-react"

export default function IncidenciasPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <Wrench className="h-12 w-12" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Módulo en Construcción</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    Aquí podrás gestionar reclamos y devoluciones. Estamos trabajando para tenerlo listo pronto.
                </p>
            </div>
            <Button onClick={() => window.history.back()}>
                Volver Atrás
            </Button>
        </div>
    )
}
