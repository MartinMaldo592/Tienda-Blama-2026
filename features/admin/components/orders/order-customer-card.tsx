import { User, Pencil, Phone, MessageCircle, MapPin, Hash } from "lucide-react"
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

function DataRow({ label, value }: { label: string, value?: string | null }) {
    if (!value) return null
    return (
        <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">{value}</p>
        </div>
    )
}

export function OrderCustomerCard({ pedido, isLocked, isEditOpen, onEditOpenChange, form, setForm, onSave }: OrderCustomerCardProps) {
    const phone = pedido.telefono_contacto || pedido.clientes?.telefono
    const address = pedido.direccion_calle || pedido.clientes?.direccion

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <User size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cliente</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Datos de Contacto</p>
                    </div>
                </div>

                <Dialog open={isEditOpen} onOpenChange={onEditOpenChange}>
                    <DialogTrigger asChild>
                        {!isLocked && (
                            <button className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 text-slate-400 flex items-center justify-center transition-all haptic-scale">
                                <Pencil size={16} />
                            </button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-10">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-3xl font-black tracking-tight">Editar Contacto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Completo</Label>
                                    <Input 
                                        value={form.nombre} 
                                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-slate-900/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">DNI / Identificación</Label>
                                    <Input 
                                        value={form.dni} 
                                        onChange={e => setForm({ ...form, dni: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-slate-900/5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Método de Envío</Label>
                                <Select
                                    value={form.metodo_envio}
                                    onValueChange={(val) => setForm({ ...form, metodo_envio: val })}
                                >
                                    <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                        <SelectItem value="Lima (Entrega a Domicilio)" className="font-bold py-3">🛵 Lima (Entrega a Domicilio)</SelectItem>
                                        <SelectItem value="Lima (Retiro en Agencia Shalom)" className="font-bold py-3">📦 Lima (Retiro en Agencia Shalom)</SelectItem>
                                        <SelectItem value="Provincia" className="font-bold py-3">🚚 Provincia (Agencia Shalom)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teléfono</Label>
                                <Input 
                                    value={form.telefono} 
                                    onChange={e => setForm({ ...form, telefono: e.target.value })}
                                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-slate-900/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dirección de Entrega</Label>
                                <Input 
                                    value={form.direccion} 
                                    onChange={e => setForm({ ...form, direccion: e.target.value })}
                                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-slate-900/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Referencia Adicional</Label>
                                <Input 
                                    value={form.referencia} 
                                    onChange={e => setForm({ ...form, referencia: e.target.value })}
                                    className="h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-slate-900/5"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: 'departamento', label: 'Departamento' },
                                    { key: 'provincia', label: 'Provincia' },
                                    { key: 'distrito', label: 'Distrito' }
                                ].map(({ key, label }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</Label>
                                        <Input 
                                            className="h-12 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-4 focus:ring-slate-900/5" 
                                            value={form[key]} 
                                            onChange={e => setForm({ ...form, [key]: e.target.value })} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter className="mt-8 gap-3">
                            <Button 
                                variant="ghost" 
                                onClick={() => onEditOpenChange(false)}
                                className="h-14 px-8 rounded-2xl font-bold"
                            >
                                CANCELAR
                            </Button>
                            <Button 
                                onClick={onSave}
                                className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-200 haptic-scale"
                            >
                                GUARDAR CAMBIOS
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Client Info */}
            <div className="space-y-4">
                <DataRow label="Nombre Completo" value={pedido.nombre_contacto || pedido.clientes?.nombre} />
                <DataRow label="DNI / Identificación" value={pedido.dni_contacto || pedido.clientes?.dni || '—'} />
                
                {phone && (
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Teléfono</p>
                        <a 
                            href={`tel:${phone}`} 
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
                        >
                            <Phone size={14} />
                            {phone}
                        </a>
                    </div>
                )}
            </div>

            {/* Address Block */}
            {(address || pedido.departamento) && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                        <MapPin size={12} className="text-blue-500" /> Punto de Entrega
                    </p>
                    {address && <p className="text-sm font-bold text-slate-900">{address}</p>}
                    {pedido.referencia_direccion && (
                        <p className="text-xs text-slate-500 font-medium">Ref: {pedido.referencia_direccion}</p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                        {[
                            { label: 'Dpto.', value: pedido.departamento },
                            { label: 'Prov.', value: pedido.provincia },
                            { label: 'Dist.', value: pedido.distrito }
                        ].filter(d => d.value).map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
                                <p className="text-xs font-bold text-slate-900">{value}</p>
                            </div>
                        ))}
                    </div>

                    {pedido.metodo_envio && (
                        <div className="pt-2 border-t border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Modalidad de Envío</p>
                            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700">
                                {pedido.metodo_envio}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                    className="flex items-center justify-center gap-2.5 h-13 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-blue-100 transition-all haptic-scale"
                    onClick={() => {
                        const link = pedido.link_ubicacion
                        const query = address
                            ? `${address}, ${pedido.distrito || ''}, ${pedido.departamento || ''}, Peru`
                            : pedido.clientes?.direccion
                        window.open(
                            link?.startsWith('http') ? link : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || '')}`,
                            '_blank'
                        )
                    }}
                >
                    <MapPin size={16} />
                    GPS Maps
                </button>

                <button
                    className="flex items-center justify-center gap-2.5 h-13 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-emerald-100 transition-all haptic-scale"
                    onClick={() => {
                        if (phone) {
                            const clean = String(phone).replace(/\D/g, '')
                            window.open(`https://wa.me/51${clean}`, '_blank')
                        }
                    }}
                >
                    <MessageCircle size={16} />
                    WhatsApp
                </button>
            </div>
        </div>
    )
}
