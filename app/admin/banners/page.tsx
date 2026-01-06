"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Save, Trash2 } from "lucide-react"

type HomeBanner = {
  id: number
  title: string | null
  subtitle: string | null
  cta: string | null
  href: string
  orden: number
  activo: boolean
  created_at: string
}

function normalizeText(v: unknown) {
  const s = String(v ?? "").trim()
  return s
}

function toBool(v: unknown) {
  return Boolean(v)
}

export default function AdminBannersPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  const formRef = useRef<HTMLDivElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [items, setItems] = useState<HomeBanner[]>([])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [cta, setCta] = useState("")
  const [href, setHref] = useState("/productos")
  const [orden, setOrden] = useState<string>("0")
  const [activo, setActivo] = useState(true)

  const isEditing = editingId != null

  const scrollToForm = () => {
    const el = formRef.current
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle("")
    setSubtitle("")
    setCta("")
    setHref("/productos")
    setOrden("0")
    setActivo(true)
  }

  const startCreate = () => {
    resetForm()
    scrollToForm()
  }

  const canSubmit = useMemo(() => {
    const h = normalizeText(href)
    if (!h) return false
    const orderNum = Number(orden)
    if (!Number.isFinite(orderNum)) return false
    return true
  }, [href, orden])

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("home_banners")
      .select("*")
      .order("orden", { ascending: true })
      .order("id", { ascending: true })

    if (error) {
      alert(error.message)
      setItems([])
      return
    }

    setItems((data as HomeBanner[]) || [])
  }, [])

  useEffect(() => {
    if (guard.loading || guard.accessDenied) return

    ;(async () => {
      setLoading(true)
      await fetchItems()
      setLoading(false)
    })()
  }, [guard.loading, guard.accessDenied, fetchItems])

  async function handleSave() {
    if (!canSubmit) return

    setSaving(true)
    try {
      const payload = {
        title: normalizeText(title) || null,
        subtitle: normalizeText(subtitle) || null,
        cta: normalizeText(cta) || null,
        href: normalizeText(href),
        orden: Number(orden) || 0,
        activo: toBool(activo),
      }

      if (isEditing && editingId != null) {
        const { error } = await supabase.from("home_banners").update(payload).eq("id", editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("home_banners").insert(payload)
        if (error) throw error
      }

      await fetchItems()
      resetForm()
    } catch (e: any) {
      alert(e?.message || "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este banner?")) return

    try {
      const { error } = await supabase.from("home_banners").delete().eq("id", id)
      if (error) throw error
      await fetchItems()
      if (editingId === id) resetForm()
    } catch (e: any) {
      alert(e?.message || "Error eliminando")
    }
  }

  function startEdit(b: HomeBanner) {
    setEditingId(b.id)
    setTitle(String(b.title || ""))
    setSubtitle(String(b.subtitle || ""))
    setCta(String(b.cta || ""))
    setHref(String(b.href || "/productos"))
    setOrden(String(b.orden ?? 0))
    setActivo(Boolean(b.activo))
    scrollToForm()
  }

  if (guard.loading || loading) {
    return <div className="p-10">Cargando...</div>
  }

  if (guard.accessDenied) {
    return <AccessDenied message="Solo administradores pueden gestionar banners." />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners (Home)</h1>
          <p className="text-muted-foreground">
            Administra los textos y destinos (href) del slider en la página de inicio.
          </p>
        </div>
        <Button variant="outline" onClick={fetchItems}>Actualizar</Button>
      </div>

      <div ref={formRef} className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">
            {isEditing ? `Editando banner #${editingId}` : "Crear nuevo banner"}
          </div>
          <Button variant="outline" onClick={startCreate} disabled={saving}>
            <Plus className="h-4 w-4" />
            Nuevo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Ofertas destacadas" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">CTA</Label>
            <Input id="cta" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Ej: Ver ofertas" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Textarea id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Descripción corta (opcional)" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="href">Destino (href)</Label>
            <Input id="href" value={href} onChange={(e) => setHref(e.target.value)} placeholder="/productos?sort=newest" />
            <div className="text-xs text-muted-foreground">
              Ejemplos: /productos | /productos?cat=2 | /productos?q=zapatillas | /productos?sort=price-asc&stock=1
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orden">Orden</Label>
            <Input id="orden" inputMode="numeric" value={orden} onChange={(e) => setOrden(e.target.value.replace(/[^0-9-]/g, ""))} />
          </div>

          <div className="space-y-2">
            <Label>Activo</Label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="h-4 w-4"
              />
              Mostrar en Home
            </label>
          </div>

        </div>

        <div className="flex justify-end gap-2">
          {isEditing ? (
            <Button variant="outline" onClick={resetForm} disabled={saving}>
              Cancelar edición
            </Button>
          ) : (
            <Button variant="outline" onClick={resetForm} disabled={saving}>
              Limpiar
            </Button>
          )}
          <Button onClick={handleSave} disabled={!canSubmit || saving}>
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear banner"}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Banners</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead className="w-[80px]">Orden</TableHead>
              <TableHead className="w-[80px]">Activo</TableHead>
              <TableHead className="text-right w-[140px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => (
              <TableRow key={b.id} className={editingId === b.id ? "bg-muted/50" : undefined}>
                <TableCell className="max-w-[260px] truncate">
                  <div className="font-medium">{b.title || "(sin título)"}</div>
                  <div className="text-xs text-muted-foreground truncate">{b.subtitle || ""}</div>
                </TableCell>
                <TableCell className="max-w-[320px] truncate">{b.href}</TableCell>
                <TableCell>{b.orden}</TableCell>
                <TableCell>
                  <span className={b.activo ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
                    {b.activo ? "Activo" : "Inactivo"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(b)}>
                    {editingId === b.id ? "Editando" : "Editar"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(b.id)} className="border-destructive/40 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                  No hay banners todavía. Crea el primero arriba.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
