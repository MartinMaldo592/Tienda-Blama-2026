"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase.client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, AlertTriangle, AlertCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type Note = {
    id: number
    autor_nombre: string
    contenido: string
    tipo: 'info' | 'alerta' | 'urgente'
    created_at: string
}

export function OrderNotesCard({
    pedidoId,
    isLocked,
    onLogAction
}: {
    pedidoId: number,
    isLocked: boolean,
    onLogAction?: (accion: string, detalles: string) => Promise<void>
}) {
    const [notes, setNotes] = useState<Note[]>([])
    const [newNote, setNewNote] = useState("")
    const [noteType, setNoteType] = useState<'info' | 'alerta' | 'urgente'>('info')
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Fetch notes on mount
    useEffect(() => {
        fetchNotes()
    }, [pedidoId])

    async function fetchNotes() {
        setRefreshing(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('pedido_notas')
            .select('*')
            .eq('pedido_id', pedidoId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setNotes(data || [])
        }
        setRefreshing(false)
    }

    async function handleAddNote() {
        if (!newNote.trim()) return

        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error("No autenticado")

            // Get user profile name from usuarios table
            const { data: profile } = await supabase
                .from('usuarios')
                .select('nombre')
                .eq('id', user.id)
                .single()

            const userName = profile?.nombre || 'Equipo'

            const { error } = await supabase.from('pedido_notas').insert({
                pedido_id: pedidoId,
                autor_id: user.id,
                autor_nombre: userName,
                contenido: newNote,
                tipo: noteType
            })

            if (error) throw error

            setNewNote("")
            setNoteType('info')
            fetchNotes()

            // Also log to activity history if callback provided
            if (onLogAction) {
                await onLogAction('Nota Interna Agregada', `[${noteType.toUpperCase()}] ${newNote.substring(0, 50)}${newNote.length > 50 ? '...' : ''}`)
            }

            toast.success("Nota añadida")
        } catch (error) {
            toast.error("Error al guardar nota")
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteNote(noteId: number) {
        if (!confirm("¿Borrar nota?")) return
        try {
            const supabase = createClient()
            const { error } = await supabase.from('pedido_notas').delete().eq('id', noteId)
            if (error) throw error
            fetchNotes()
            toast.success("Nota eliminada")
        } catch (e) {
            toast.error("No tienes permiso para borrar notas")
        }
    }

    return (
        <Card className="shadow-sm border-amber-100/50 overflow-hidden">
            <CardHeader className="bg-amber-50/50 pb-3 border-b border-amber-100/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900">
                    <MessageSquare className="h-4 w-4" />
                    Notas Internas del Equipo
                    <span className="ml-auto text-xs font-normal text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Solo visible para staff
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col h-[300px]">
                    {/* Notes List */}
                    <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                        {notes.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs italic gap-2 opacity-70">
                                <MessageSquare className="h-8 w-8 text-gray-300" />
                                No hay notas internas en este pedido.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notes.map((note) => (
                                    <div key={note.id} className="flex gap-3 group">
                                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                            <AvatarFallback className={`text-[10px] font-bold ${note.tipo === 'urgente' ? 'bg-red-100 text-red-600' :
                                                note.tipo === 'alerta' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {note.autor_nombre.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-900">{note.autor_nombre}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: es })}
                                                </span>
                                                {note.tipo === 'urgente' && (
                                                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" /> Urgente
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-sm p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm text-gray-700 relative ${note.tipo === 'urgente' ? 'bg-red-50 border border-red-100' :
                                                note.tipo === 'alerta' ? 'bg-orange-50 border border-orange-100' :
                                                    'bg-white border border-gray-100'
                                                }`}>
                                                {note.contenido}
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                                    title="Borrar nota"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t flex gap-2 items-end">
                        <Select value={noteType} onValueChange={(v: any) => setNoteType(v)}>
                            <SelectTrigger className="w-[100px] h-10 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="alerta">Alerta ⚠️</SelectItem>
                                <SelectItem value="urgente">Urgente 🚨</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex-1 relative">
                            <Input
                                placeholder="Escribe una nota interna..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                                className="pr-10"
                                disabled={isLocked}
                            />
                        </div>

                        <Button
                            size="icon"
                            disabled={!newNote.trim() || loading || isLocked}
                            onClick={handleAddNote}
                            className={noteType === 'urgente' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
