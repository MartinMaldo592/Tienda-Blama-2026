import { Calendar } from "lucide-react"
import { PedidoLog } from "@/features/admin/types"

interface OrderHistoryCardProps {
    logs: PedidoLog[]
}

export function OrderHistoryCard({ logs }: OrderHistoryCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Historial de Actividad
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {logs.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No hay actividad registrada aún.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <div className="text-[10px] font-bold">LOG</div>
                            </div>

                            {/* Content Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900 text-sm">{log.accion}</div>
                                    <time className="font-caveat font-medium text-xs text-indigo-500">
                                        {new Date(log.created_at).toLocaleString()}
                                    </time>
                                </div>
                                <div className="text-slate-500 text-sm">{log.detalles}</div>
                                <div className="text-slate-400 text-xs mt-1">Por: {log.usuario_nombre || 'Sistema'}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
