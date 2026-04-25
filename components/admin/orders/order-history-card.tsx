import { History, Zap, Clock, User } from "lucide-react"
import { PedidoLog } from "@/features/admin/types"

interface OrderHistoryCardProps {
    logs: PedidoLog[]
}

const ACTION_STYLES: Record<string, { bg: string, dot: string, text: string }> = {
    'Cambio de Estado': { bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700' },
    'Datos Cliente Editados': { bg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700' },
    'Pago Registrado': { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    'Asignación': { bg: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-700' },
    'Guía Subida': { bg: 'bg-indigo-50', dot: 'bg-indigo-500', text: 'text-indigo-700' },
    'Nota Agregada': { bg: 'bg-slate-50', dot: 'bg-slate-500', text: 'text-slate-700' },
}

function getActionStyle(accion: string) {
    return ACTION_STYLES[accion] || { bg: 'bg-slate-50', dot: 'bg-slate-400', text: 'text-slate-700' }
}

export function OrderHistoryCard({ logs }: OrderHistoryCardProps) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 p-8">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 bg-slate-900 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-slate-200">
                    <History size={22} strokeWidth={1.5} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Auditoría</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {logs.length} {logs.length === 1 ? 'evento' : 'eventos'} registrados
                    </p>
                </div>
            </div>

            {logs.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-slate-200">
                    <Zap size={48} strokeWidth={1} />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin actividad aún</p>
                </div>
            ) : (
                <div className="relative space-y-0">
                    {/* Timeline Line */}
                    <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-100 to-transparent" />
                    
                    {logs.map((log, idx) => {
                        const style = getActionStyle(log.accion)
                        return (
                            <div key={log.id} className="relative flex gap-6 pb-8 last:pb-0 group">
                                {/* Dot */}
                                <div className="relative z-10 shrink-0">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border-2 border-white shadow-md transition-all group-hover:scale-110 duration-300 ${style.bg}`}>
                                        <div className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={`flex-1 p-5 rounded-2xl border border-slate-50 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 ${style.bg}`}>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
                                            {log.accion}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 shrink-0">
                                            <Clock size={10} />
                                            {new Date(log.created_at).toLocaleString('es-PE', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    {log.detalles && (
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed mb-3">
                                            {log.detalles}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-1.5">
                                        <User size={11} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {log.usuario_nombre || 'Sistema'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
