"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductForm } from "@/features/admin/components/product-form"
import { ArrowLeft } from "lucide-react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { useEffect, useState } from "react"
import { fetchAdminCategorias } from "@/features/admin"
import { Skeleton } from "@/components/ui/skeleton"

export default function NuevoProductoPage() {
    const router = useRouter()
    const guard = useRoleGuard({ allowedRoles: ['superadmin', 'admin'] })
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        if (!guard.loading && !guard.accessDenied) {
            fetchAdminCategorias()
                .then(setCategories)
                .catch(err => console.error("Error loading categories:", err))
        }
    }, [guard.loading, guard.accessDenied])

    if (guard.accessDenied) return <AccessDenied />

    if (guard.loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-10 w-48" />
                <Card className="p-6 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-full" />
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" className="gap-2" asChild>
                    <Link href="/admin/productos">
                        <ArrowLeft className="h-4 w-4" /> Volver
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
                    <p className="text-gray-500">Completa la información del producto.</p>
                </div>
                <div />
            </div>

            <Card className="bg-white rounded-xl shadow-sm border">
                <CardContent className="p-6">
                    <ProductForm
                        categories={categories}
                        onSuccess={() => router.push('/admin/productos')}
                        onCancel={() => router.push('/admin/productos')}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

