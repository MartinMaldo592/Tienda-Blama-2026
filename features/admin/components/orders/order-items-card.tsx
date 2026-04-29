import Image from "next/image"
import { ShoppingBagIcon, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { PedidoItemRow, PedidoRow } from "@/features/admin/types"

interface OrderItemsCardProps {
    items: PedidoItemRow[]
    pedido: PedidoRow
    isLocked: boolean
    displayedShippingMethod: string
    onReturnClick: (item: PedidoItemRow) => void
}

export function OrderItemsCard({ items, pedido, isLocked, displayedShippingMethod, onReturnClick }: OrderItemsCardProps) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 p-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" strokeWidth={2.5} /> 
                Detalle de Compra
            </h2>
            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-center group">
                        <div className="h-20 w-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 relative border border-slate-100 group-hover:shadow-lg transition-all duration-500">
                            {item.productos?.imagen_url ? (
                                <Image
                                    src={item.productos.imagen_url}
                                    alt={item.productos.nombre || "Producto"}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="80px"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase">No Img</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">
                                {item.productos?.nombre || 'Producto eliminado'}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                                    CANT: {item.cantidad}
                                </span>
                                {item.variante_nombre && (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-0.5 rounded-md">
                                        VAR: {item.variante_nombre}
                                    </span>
                                )}
                            </div>
                            {/* Partial Return Badge */}
                            {(item.cantidad_devuelta || 0) > 0 && (
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 mt-2">
                                    <RotateCcw size={10} /> Retornado: {item.cantidad_devuelta}
                                </div>
                            )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <p className="font-black text-slate-900 text-lg tracking-tighter">
                                {formatCurrency((item.precio_unitario || item.productos?.precio || 0) * (item.cantidad || 0))}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {formatCurrency(item.precio_unitario || item.productos?.precio || 0)} UNIT.
                            </p>

                            {/* Return Action Button */}
                            {!isLocked && (item.cantidad - (item.cantidad_devuelta || 0) > 0) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl mt-1 transition-all"
                                    onClick={() => onReturnClick(item)}
                                >
                                    <RotateCcw className="h-3 w-3 mr-1" /> Devolver
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subtotal Bruto</span>
                    <span className="text-sm font-bold text-slate-600">{formatCurrency(pedido.subtotal || pedido.total)}</span>
                </div>

                {(pedido.descuento || 0) > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                        <span className="text-[10px] font-black uppercase tracking-widest">Descuento Especial {pedido.cupon_codigo ? `[${pedido.cupon_codigo}]` : ''}</span>
                        <span className="text-sm font-black">- {formatCurrency(pedido.descuento || 0)}</span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logística de Envío</span>
                    <span className="text-xs font-black text-slate-900 uppercase">
                        {displayedShippingMethod === 'provincia' ? 'Por Pagar (Agencia)' : 'Cortesía / Gratis'}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-900 mt-2">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Total Inversión</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(pedido.total)}</span>
                </div>
            </div>
        </div>
    )
}
