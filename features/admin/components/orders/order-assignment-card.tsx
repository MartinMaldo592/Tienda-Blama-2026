import { UserCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PedidoRow, ProfileRow, AdminRole } from "@/features/admin/types"

interface OrderAssignmentCardProps {
    pedido: PedidoRow
    userRole: string
    workers: ProfileRow[]
    assignedTo: string
    onAssign: (workerId: string) => Promise<void>
}

export function OrderAssignmentCard({ pedido, userRole, workers, assignedTo, onAssign }: OrderAssignmentCardProps) {
    if (userRole !== 'admin' && !(userRole === 'worker' && pedido.asignado_perfil)) {
        return null
    }

    if (userRole === 'worker') {
        return (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <p className="text-xs text-blue-600 font-medium">Este pedido te fue asignado</p>
                {pedido.fecha_asignacion && (
                    <p className="text-xs text-blue-500 mt-1">
                        {new Date(pedido.fecha_asignacion).toLocaleString()}
                    </p>
                )}
            </div>
        )
    }

    // Admin View
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <UserCheck className="h-5 w-5" /> Asignación
            </h2>
            <div>
                <p className="text-sm text-gray-500 mb-2">Trabajador asignado</p>
                <Select value={assignedTo} onValueChange={onAssign}>
                    <SelectTrigger>
                        <SelectValue>
                            {pedido.asignado_perfil?.nombre || pedido.asignado_perfil?.email || (
                                <span className="text-orange-600">Sin asignar</span>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unassigned">
                            <span className="text-gray-500">Sin asignar</span>
                        </SelectItem>
                        {workers.map(w => (
                            <SelectItem key={w.id} value={w.id}>
                                {w.nombre || w.email}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {pedido.fecha_asignacion && (
                <p className="text-xs text-gray-400">
                    Asignado el {new Date(pedido.fecha_asignacion).toLocaleString()}
                </p>
            )}
        </div>
    )
}
