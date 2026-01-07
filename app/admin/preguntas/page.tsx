"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
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
import { Textarea } from "@/components/ui/textarea"
import { Check, MessageSquare, RefreshCw, Save, X } from "lucide-react"

type QuestionRow = {
  id: number
  product_id: number
  question: string
  asker_name: string | null
  asker_phone: string | null
  published: boolean
  created_at: string
  productos?: { nombre: string } | null
  product_answers?: { id: number; answer: string; answered_by: string | null; created_at: string; published: boolean }[]
}

export default function AdminPreguntasPage() {
  const guard = useRoleGuard({ allowedRoles: ["admin"] })

  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [items, setItems] = useState<QuestionRow[]>([])
  const [search, setSearch] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [answer, setAnswer] = useState("")

  const fetchItems = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("product_questions")
      .select(
        "id, product_id, question, asker_name, asker_phone, published, created_at, productos(nombre), product_answers(id, answer, answered_by, created_at, published)"
      )
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) {
      alert(error.message)
      setItems([])
      setLoading(false)
      return
    }

    setItems(((data as any[]) || []) as QuestionRow[])
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
      const prod = String(r.productos?.nombre || "").toLowerCase()
      const question = String(r.question || "").toLowerCase()
      const asker = String(r.asker_name || "").toLowerCase()
      const phone = String(r.asker_phone || "").toLowerCase()
      return [prod, question, asker, phone].some((v) => v.includes(q))
    })
  }, [items, search])

  async function setPublished(id: number, published: boolean) {
    setBusyId(id)
    try {
      const { error } = await supabase.from("product_questions").update({ published }).eq("id", id)
      if (error) throw error
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, published } : x)))
    } catch (e: any) {
      alert(e?.message || "Error actualizando")
    } finally {
      setBusyId(null)
    }
  }

  function startAnswer(q: QuestionRow) {
    setEditingId(q.id)
    const existing = Array.isArray(q.product_answers) && q.product_answers.length > 0 ? q.product_answers[0] : null
    setAnswer(existing?.answer || "")
  }

  async function saveAnswer(questionId: number) {
    if (!answer.trim() || answer.trim().length < 6) {
      alert("Escribe una respuesta más completa")
      return
    }

    setBusyId(questionId)

    try {
      const { data: sessionRes } = await supabase.auth.getSession()
      const userId = sessionRes?.session?.user?.id || null

      let answeredBy: string | null = null
      if (userId) {
        const { data: profile } = await supabase.from("profiles").select("email, nombre").eq("id", userId).maybeSingle()
        answeredBy = String((profile as any)?.nombre || (profile as any)?.email || "Admin")
      }

      const current = items.find((x) => x.id === questionId) || null
      const existing = current && Array.isArray(current.product_answers) && current.product_answers.length > 0 ? current.product_answers[0] : null

      if (existing) {
        const { error } = await supabase
          .from("product_answers")
          .update({ answer: answer.trim(), answered_by: answeredBy, published: true })
          .eq("id", existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("product_answers")
          .insert({ question_id: questionId, answer: answer.trim(), answered_by: answeredBy, published: true })
        if (error) throw error
      }

      await supabase.from("product_questions").update({ published: true }).eq("id", questionId)

      await fetchItems()
      setEditingId(null)
      setAnswer("")
    } catch (e: any) {
      alert(e?.message || "Error guardando respuesta")
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
          <h1 className="text-3xl font-bold">Preguntas</h1>
          <p className="text-muted-foreground">Responde y publica preguntas para reducir consultas por WhatsApp.</p>
        </div>
        <Button variant="outline" onClick={fetchItems} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por producto o texto..." />
      </div>

      {editingId != null ? (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Responder pregunta #{editingId}
            </div>
            <Button variant="outline" onClick={() => { setEditingId(null); setAnswer("") }}>
              Cancelar
            </Button>
          </div>
          <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Escribe una respuesta clara..." />
          <div className="flex justify-end">
            <Button onClick={() => saveAnswer(editingId)} className="gap-2" disabled={busyId === editingId}>
              <Save className="h-4 w-4" />
              Guardar y publicar
            </Button>
          </div>
        </div>
      ) : null}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Pregunta</TableHead>
              <TableHead className="w-[120px]">Estado</TableHead>
              <TableHead className="text-right w-[260px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => {
              const disabled = busyId === q.id
              const hasAnswer = Array.isArray(q.product_answers) && q.product_answers.length > 0

              return (
                <TableRow key={q.id} className={editingId === q.id ? "bg-muted/50" : undefined}>
                  <TableCell className="max-w-[220px] truncate">
                    <div className="font-medium">{q.productos?.nombre || `Producto #${q.product_id}`}</div>
                    <div className="text-xs text-muted-foreground">
                      {q.asker_name ? `${q.asker_name}${q.asker_phone ? ` • ${q.asker_phone}` : ""}` : ""}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[520px]">
                    <div className="text-sm font-semibold">{q.question}</div>
                    {hasAnswer ? (
                      <div className="mt-2 text-xs text-muted-foreground line-clamp-2">Respuesta: {q.product_answers?.[0]?.answer}</div>
                    ) : (
                      <div className="mt-2 text-xs text-muted-foreground">Sin respuesta</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">{new Date(q.created_at).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    {q.published ? <Badge>Publicado</Badge> : <Badge variant="outline">Pendiente</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startAnswer(q)} className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Responder
                    </Button>

                    {q.published ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={disabled}
                        onClick={() => setPublished(q.id, false)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Ocultar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={disabled}
                        onClick={() => setPublished(q.id, true)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Publicar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}

            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                  No hay preguntas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
