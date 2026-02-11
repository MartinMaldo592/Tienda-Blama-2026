import { User, Pencil, Phone, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PedidoRow } from "@/features/admin/types"

interface OrderCustomerCardProps {
    pedido: PedidoRow
    isLocked: boolean
    isEditOpen: boolean
    onEditOpenChange: (open: boolean) => void
    form: any
    setForm: (form: any) => void
    onSave: () => void
}

export function OrderCustomerCard({ pedido, isLocked, isEditOpen, onEditOpenChange, form, setForm, onSave }: OrderCustomerCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5" /> Cliente
                </h2>
                <Dialog open={isEditOpen} onOpenChange={onEditOpenChange}>
                    <DialogTrigger asChild>
                        {!isLocked && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                            </Button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Editar Datos del Pedido</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>DNI</Label>
                                    <Input value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Método de Envío</Label>
                                <Select
                                    value={form.metodo_envio === 'lima' ? 'Lima' : form.metodo_envio === 'provincia' ? 'Provincia' : form.metodo_envio}
                                    onValueChange={(val) => setForm({ ...form, metodo_envio: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lima">Lima</SelectItem>
                                        <SelectItem value="Provincia">Provincia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Dirección</Label>
                                <Input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Referencia</Label>
                                <Input value={form.referencia} onChange={e => setForm({ ...form, referencia: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Dpto</Label>
                                    <Input className="text-xs" value={form.departamento} onChange={e => setForm({ ...form, departamento: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Prov</Label>
                                    <Input className="text-xs" value={form.provincia} onChange={e => setForm({ ...form, provincia: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Dist</Label>
                                    <Input className="text-xs" value={form.distrito} onChange={e => setForm({ ...form, distrito: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={onSave}>Guardar Cambios</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium">{pedido.nombre_contacto || pedido.clientes?.nombre}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="font-medium">{pedido.dni_contacto || pedido.clientes?.dni || '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${pedido.telefono_contacto || pedido.clientes?.telefono}`} className="font-medium text-blue-600 hover:underline">
                        {pedido.telefono_contacto || pedido.clientes?.telefono}
                    </a>
                </div>
                <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-500">Dirección de Entrega</p>
                    <p className="font-medium text-sm mt-1">{pedido.direccion_calle || pedido.clientes?.direccion}</p>
                    {pedido.referencia_direccion && <p className="text-xs text-gray-500 mt-1">Ref: {pedido.referencia_direccion}</p>}
                    <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                        {pedido.departamento && (
                            <div className="col-span-2 sm:col-span-1">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">Departamento</span>
                                <span className="text-xs text-gray-700">{pedido.departamento}</span>
                            </div>
                        )}
                        {pedido.provincia && (
                            <div className="col-span-2 sm:col-span-1">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">Provincia</span>
                                <span className="text-xs text-gray-700">{pedido.provincia}</span>
                            </div>
                        )}
                        {pedido.distrito && (
                            <div className="col-span-2">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">Distrito</span>
                                <span className="text-xs text-gray-700">{pedido.distrito}</span>
                            </div>
                        )}
                    </div>
                </div>
                {pedido.metodo_envio && (
                    <div className="mt-2 pt-2 border-t">
                        <p className="text-sm text-gray-500">Método de Envío</p>
                        <p className="font-medium capitalize">{pedido.metodo_envio}</p>
                    </div>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 gap-2 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
                    onClick={() => {
                        const link = pedido.link_ubicacion
                        if (link && link.startsWith('http')) {
                            window.open(link, '_blank')
                        } else {
                            const query = pedido.direccion_calle
                                ? `${pedido.direccion_calle}, ${pedido.distrito || ''}, ${pedido.departamento || ''}, Peru`
                                : pedido.clientes?.direccion
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || '')}`, '_blank')
                        }
                    }}
                >
                    <MapPin className="h-4 w-4" />
                    Ver Ubicación GPS
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 gap-2 text-green-700 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-800"
                    onClick={() => {
                        const phone = pedido.telefono_contacto || pedido.clientes?.telefono
                        if (phone) {
                            const clean = String(phone).replace(/\D/g, '')
                            window.open(`https://wa.me/51${clean}`, '_blank')
                        }
                    }}
                >
                    <MessageCircle className="h-4 w-4" />
                    Chat WhatsApp
                </Button>
            </div>
        </div>
    )
}
