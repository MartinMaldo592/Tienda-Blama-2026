"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase.client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, AlertCircle, AlertTriangle, Trash2, Info } from "lucide-react"
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

const NOTE_STYLES = {
    info: {
        bubble: 'bg-sky-50 border-sky-100 text-sky-900',
        badge: 'bg-sky-100 text-sky-700',
        avatar: 'bg-sky-900 text-white',
        icon: Info,
        label: 'INFO'
    },
    alerta: {
        bubble: 'bg-amber-50 border-amber-100 text-amber-900',
        badge: 'bg-amber-100 text-amber-700',
        avatar: 'bg-amber-500 text-white',
        icon: AlertTriangle,
        label: 'ALERTA'
    },
    urgente: {
        bubble: 'bg-rose-50 border-rose-100 text-rose-900',
        badge: 'bg-rose-100 text-rose-700',
        avatar: 'bg-rose-600 text-white',
        icon: AlertCircle,
        label: '🚨 URGENTE'
    },
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

        if (!error) setNotes(data || [])
        setRefreshing(false)
    }

    async function handleAddNote() {
        if (!newNote.trim()) return

        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No autenticado")

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

            if (onLogAction) {
                await onLogAction('Nota Interna Agregada', `[${noteType.toUpperCase()}] ${newNote.substring(0, 50)}${newNote.length > 50 ? '...' : ''}`)
            }

            toast.success("Nota guardada en el expediente")
        } catch {
            toast.error("Error al guardar nota")
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteNote(noteId: number) {
        if (!confirm("¿Eliminar esta nota del expediente?")) return
        try {
            const supabase = createClient()
            const { error } = await supabase.from('pedido_notas').delete().eq('id', noteId)
            if (error) throw error
            fetchNotes()
            toast.success("Nota eliminada")
        } catch {
            toast.error("Sin permisos para eliminar")
        }
    }

    const currentStyle = NOTE_STYLES[noteType]

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-amber-500 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-amber-100">
                        <MessageSquare size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Notas</h2>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            Solo visible para staff · {notes.length} nota{notes.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* Notes List */}
            <ScrollArea className="h-[280px] px-8">
                {notes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-200 pb-6">
                        <MessageSquare size={40} strokeWidth={1} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expediente vacío</p>
                    </div>
                ) : (
                    <div className="space-y-4 pb-4">
                        {notes.map((note) => {
                            const style = NOTE_STYLES[note.tipo] || NOTE_STYLES.info
                            const NoteIcon = style.icon
                            return (
                                <div key={note.id} className="group flex gap-3">
                                    {/* Avatar */}
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm ${style.avatar}`}>
                                        {note.autor_nombre.substring(0, 2).toUpperCase()}
                                    </div>

                                    {/* Bubble */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-xs font-black text-slate-900">{note.autor_nombre}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 ${style.badge}`}>
                                                <NoteIcon size={9} />
                                                {style.label}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400 ml-auto">
                                                {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>
                                        <div className={`relative text-sm font-medium p-4 rounded-2xl rounded-tl-sm border leading-relaxed ${style.bubble}`}>
                                            {note.contenido}
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 rounded-lg bg-white/80 hover:bg-rose-50 text-slate-300 hover:text-rose-500 flex items-center justify-center"
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* Input Area */}
            {!isLocked && (
                <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/50 space-y-3">
                    <div className="flex gap-3">
                        <Select value={noteType} onValueChange={(v: any) => setNoteType(v)}>
                            <SelectTrigger className="w-[120px] h-12 bg-white border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-0 shadow-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                <SelectItem value="info" className="font-bold py-3 text-xs">Info</SelectItem>
                                <SelectItem value="alerta" className="font-bold py-3 text-xs">Alerta ⚠️</SelectItem>
                                <SelectItem value="urgente" className="font-bold py-3 text-xs">Urgente 🚨</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Escribe una nota de expediente..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                            className="flex-1 h-12 bg-white border-slate-100 rounded-2xl font-medium text-sm placeholder:text-slate-300 focus:ring-4 focus:ring-slate-900/5 shadow-sm"
                            disabled={isLocked}
                        />

                        <Button
                            size="icon"
                            disabled={!newNote.trim() || loading || isLocked}
                            onClick={handleAddNote}
                            className={`h-12 w-12 rounded-2xl shadow-lg font-bold transition-all haptic-scale ${
                                noteType === 'urgente' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' :
                                noteType === 'alerta' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' :
                                'bg-slate-900 hover:bg-blue-600 shadow-slate-200'
                            }`}
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
