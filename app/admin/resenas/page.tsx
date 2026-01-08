"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, RefreshCw, Trash2, X } from "lucide-react"
import { deleteReview, fetchAdminReviews, setReviewApproved } from "@/features/admin"

type ReviewRow = {
  id: number
  product_id: number
  rating: number
  title: string | null
  body: string
  customer_name: string | null
  customer_city: string | null
  verified: boolean
  approved: boolean
  created_at: string
  productos?: { nombre: string } | null
}

export default function AdminResenasPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [items, setItems] = useState<ReviewRow[]>([])
  const [search, setSearch] = useState("")

  const fetchItems = useCallback(async () => {
    setLoading(true)

    try {
      const data = await fetchAdminReviews()
      setItems(((data as any[]) || []) as ReviewRow[])
    } catch (e: any) {
      alert(e?.message || "Error")
      setItems([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (guard.loading || guard.accessDenied) return
    fetchItems()
  }, [guard.loading, guard.accessDenied, fetchItems])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items

    return items.filter((r) => {
      const name = String(r.customer_name || "").toLowerCase()
      const city = String(r.customer_city || "").toLowerCase()
      const title = String(r.title || "").toLowerCase()
      const body = String(r.body || "").toLowerCase()
      const prod = String(r.productos?.nombre || "").toLowerCase()
      return [name, city, title, body, prod].some((v) => v.includes(q))
    })
  }, [items, search])

  async function setApproved(id: number, approved: boolean) {
    setBusyId(id)
    try {
      await setReviewApproved({ id, approved })
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, approved } : x)))
    } catch (e: any) {
      alert(e?.message || "Error actualizando")
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar esta reseña?")) return

    setBusyId(id)
    try {
      await deleteReview(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (e: any) {
      alert(e?.message || "Error eliminando")
    } finally {
      setBusyId(null)
    }
  }

  if (guard.loading || loading) return <div className="p-10">Cargando...</div>
  if (guard.accessDenied) return <AccessDenied message="Solo administradores." />

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Reseñas</h1>
          <p className="text-muted-foreground">Aprueba reseñas para que se muestren en productos.</p>
        </div>
        <Button variant="outline" onClick={fetchItems} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por producto, texto o cliente..." />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="w-[90px]">Rating</TableHead>
              <TableHead>Reseña</TableHead>
              <TableHead className="w-[120px]">Estado</TableHead>
              <TableHead className="text-right w-[220px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const disabled = busyId === r.id
              return (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[220px] truncate">
                    <div className="font-medium">{r.productos?.nombre || `Producto #${r.product_id}`}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.customer_name ? `${r.customer_name}${r.customer_city ? ` • ${r.customer_city}` : ""}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{r.rating}/5</span>
                    {r.verified ? <div className="mt-1"><Badge>Verificado</Badge></div> : null}
                  </TableCell>
                  <TableCell className="max-w-[520px]">
                    <div className="font-semibold">{r.title || "Reseña"}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{r.body}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    {r.approved ? <Badge>Publicado</Badge> : <Badge variant="outline">Pendiente</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {r.approved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={disabled}
                        onClick={() => setApproved(r.id, false)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Despublicar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={disabled}
                        onClick={() => setApproved(r.id, true)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Aprobar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={disabled}
                      onClick={() => remove(r.id)}
                      className="border-destructive/40 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}

            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                  No hay reseñas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
