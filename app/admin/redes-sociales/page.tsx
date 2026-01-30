"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Save, Trash2, ExternalLink } from "lucide-react"
import { fetchSocialLinks, saveSocialLink, deleteSocialLink, SocialLink } from "@/features/admin"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdminSocialLinksPage() {
    const guard = useRoleGuard({ allowedRoles: ["admin"] })

    const formRef = useRef<HTMLDivElement | null>(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [items, setItems] = useState<SocialLink[]>([])

    const [editingId, setEditingId] = useState<number | null>(null)
    const [platform, setPlatform] = useState("facebook")
    const [url, setUrl] = useState("")
    const [orden, setOrden] = useState("0")
    const [active, setActive] = useState(true)

    const isEditing = editingId != null

    const scrollToForm = () => {
        const el = formRef.current
        if (!el) return
        el.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const resetForm = () => {
        setEditingId(null)
        setPlatform("facebook")
        setUrl("")
        setOrden("0")
        setActive(true)
    }

    const startCreate = () => {
        resetForm()
        setOrden(String(items.length + 1))
        scrollToForm()
    }

    const fetchItems = useCallback(async () => {
        try {
            const data = await fetchSocialLinks()
            setItems((data as SocialLink[]) || [])
        } catch (e: any) {
            alert(e?.message || "Error")
            setItems([])
        }
    }, [])

    useEffect(() => {
        if (guard.loading || guard.accessDenied) return

            ; (async () => {
                setLoading(true)
                await fetchItems()
                setLoading(false)
            })()
    }, [guard.loading, guard.accessDenied, fetchItems])

    async function handleSave() {
        if (!url) {
            alert("La URL es obligatoria")
            return
        }

        setSaving(true)
        try {
            const payload = {
                platform,
                url,
                orden: Number(orden) || 0,
                active,
            }

            await saveSocialLink({ id: editingId, payload })

            await fetchItems()
            resetForm()
        } catch (e: any) {
            alert(e?.message || "Error guardando")
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("¿Eliminar esta red social?")) return

        try {
            await deleteSocialLink(id)
            await fetchItems()
            if (editingId === id) resetForm()
        } catch (e: any) {
            alert(e?.message || "Error eliminando")
        }
    }

    function startEdit(item: SocialLink) {
        setEditingId(item.id)
        setPlatform(item.platform)
        setUrl(item.url)
        setOrden(String(item.orden ?? 0))
        setActive(item.active)
        scrollToForm()
    }

    if (guard.loading || loading) {
        return <div className="p-10">Cargando...</div>
    }

    if (guard.accessDenied) {
        return <AccessDenied message="Solo administradores pueden gestionar redes sociales." />
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Redes Sociales</h1>
                    <p className="text-muted-foreground">
                        Administra los enlaces a tus redes sociales que aparecen en el pie de página.
                    </p>
                </div>
                <Button variant="outline" onClick={fetchItems}>Actualizar</Button>
            </div>

            <div ref={formRef} className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-semibold">
                        {isEditing ? `Editando #${editingId}` : "Agregar nueva red social"}
                    </div>
                    <Button variant="outline" onClick={startCreate} disabled={saving}>
                        <Plus className="h-4 w-4" />
                        Nuevo
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="platform">Plataforma</Label>
                        <Select value={platform} onValueChange={setPlatform}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="twitter">X (Twitter)</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">URL del Perfil</Label>
                        <Input
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.instagram.com/mi-tienda"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="orden">Orden</Label>
                        <Input
                            id="orden"
                            inputMode="numeric"
                            value={orden}
                            onChange={(e) => setOrden(e.target.value.replace(/[^0-9-]/g, ""))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Visible</Label>
                        <div className="flex items-center gap-2 h-10">
                            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                Mostrar enlace en el footer
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    {isEditing ? (
                        <Button variant="ghost" onClick={resetForm} disabled={saving}>
                            Cancelar
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={resetForm} disabled={saving}>
                            Limpiar
                        </Button>
                    )}
                    <Button onClick={handleSave} disabled={!url || saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar"}
                    </Button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Icono</TableHead>
                            <TableHead>Plataforma</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead className="w-[80px]">Orden</TableHead>
                            <TableHead className="w-[100px]">Estado</TableHead>
                            <TableHead className="text-right w-[140px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id} className={editingId === item.id ? "bg-muted/50" : undefined}>
                                <TableCell>
                                    {/* Simple icon preview based on platform name */}
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center capitalize font-bold text-xs text-muted-foreground">
                                        {item.platform.slice(0, 2)}
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize font-medium">{item.platform}</TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                    <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center hover:underline text-muted-foreground hover:text-foreground">
                                        {item.url} <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </TableCell>
                                <TableCell>{item.orden}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                                        {item.active ? "Activo" : "Oculto"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                                        <span className="sr-only">Editar</span>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No hay redes sociales configuradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
