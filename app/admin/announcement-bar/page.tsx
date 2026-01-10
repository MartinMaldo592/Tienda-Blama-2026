"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRoleGuard } from "@/lib/use-role-guard"
import { AccessDenied } from "@/components/admin/access-denied"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnnouncementBar } from "@/components/announcement-bar"
import { fetchAnnouncementBarConfigViaApi, saveAnnouncementBarConfigViaApi } from "@/features/admin"

function toBoolSelectValue(v: boolean) {
  return v ? "true" : "false"
}

function parseBoolSelectValue(v: string) {
  return v === "true"
}

function normalizeMessagesText(v: string) {
  return v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10)
}

export default function AdminAnnouncementBarPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [enabled, setEnabled] = useState(true)
  const [intervalMs, setIntervalMs] = useState<string>("3500")
  const [messagesText, setMessagesText] = useState<string>("")

  const messagesPreview = useMemo(() => normalizeMessagesText(messagesText), [messagesText])

  const fetchConfig = useCallback(async () => {
    const data = await fetchAnnouncementBarConfigViaApi()
    setEnabled(Boolean(data.enabled))
    setIntervalMs(String(data.interval_ms || 3500))
    setMessagesText((Array.isArray(data.messages) ? data.messages : []).join("\n"))
  }, [])

  useEffect(() => {
    if (guard.loading || guard.accessDenied) return

    ;(async () => {
      try {
        setLoading(true)
        await fetchConfig()
      } catch (e: any) {
        alert(e?.message || "Error")
      } finally {
        setLoading(false)
      }
    })()
  }, [guard.loading, guard.accessDenied, fetchConfig])

  const canSave = useMemo(() => {
    const n = Number(intervalMs)
    if (!Number.isFinite(n)) return false
    if (n < 500 || n > 30000) return false
    return true
  }, [intervalMs])

  const onSave = async () => {
    try {
      setSaving(true)
      const payload = {
        enabled,
        interval_ms: Number(intervalMs),
        messages: normalizeMessagesText(messagesText),
      }
      await saveAnnouncementBarConfigViaApi(payload)
      alert("Guardado")
    } catch (e: any) {
      alert(e?.message || "Error")
    } finally {
      setSaving(false)
    }
  }

  if (guard.loading) {
    return <div className="p-6 text-muted-foreground">Cargando...</div>
  }

  if (guard.accessDenied) {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcement Bar</h1>
        <p className="text-muted-foreground mt-2">Configura los mensajes que aparecen arriba de la tienda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={toBoolSelectValue(enabled)} onValueChange={(v) => setEnabled(parseBoolSelectValue(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activado</SelectItem>
                  <SelectItem value="false">Desactivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Intervalo (ms)</Label>
              <Input value={intervalMs} onChange={(e) => setIntervalMs(e.target.value)} placeholder="3500" />
              <p className="text-xs text-muted-foreground">Mín 500ms, máx 30000ms.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mensajes (1 por línea)</Label>
            <Textarea
              value={messagesText}
              onChange={(e) => setMessagesText(e.target.value)}
              placeholder="Escribe un mensaje por línea"
              className="min-h-[160px]"
            />
            <p className="text-xs text-muted-foreground">Máximo 10 mensajes. Si dejas vacío, se usarán los mensajes por defecto.</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSave} disabled={!canSave || saving || loading}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMessagesText("")
              }}
              disabled={saving}
            >
              Usar mensajes por defecto
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista previa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg overflow-hidden border">
            {enabled ? (
              <AnnouncementBar messages={messagesPreview} intervalMs={Number(intervalMs) || 3500} />
            ) : (
              <div className="p-4 text-sm text-muted-foreground">Desactivado</div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && <div className="text-sm text-muted-foreground">Cargando configuración...</div>}
    </div>
  )
}
