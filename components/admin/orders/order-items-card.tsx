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
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingBagIcon className="h-5 w-5" /> Productos
            </h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            {item.productos?.imagen_url ? (
                                <img src={item.productos.imagen_url} alt={item.productos.nombre || "Producto"} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{item.productos?.nombre || 'Producto eliminado'}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                            {item.variante_nombre && (
                                <p className="text-xs text-gray-400">Variante: {item.variante_nombre}</p>
                            )}
                            {/* Partial Return Badge */}
                            {(item.cantidad_devuelta || 0) > 0 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                    Devuelto: {item.cantidad_devuelta}
                                </span>
                            )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <p className="font-medium">{formatCurrency((item.precio_unitario || item.productos?.precio || 0) * (item.cantidad || 0))}</p>
                            <p className="text-xs text-gray-400">{formatCurrency(item.precio_unitario || item.productos?.precio || 0)} c/u</p>

                            {/* Return Action Button */}
                            {!isLocked && (item.cantidad - (item.cantidad_devuelta || 0) > 0) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    title="Devolver parcialmente"
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
            <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(pedido.subtotal || pedido.total)}</span>
                </div>

                {(pedido.descuento || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Descuento {pedido.cupon_codigo ? `(${pedido.cupon_codigo})` : ''}</span>
                        <span>- {formatCurrency(pedido.descuento || 0)}</span>
                    </div>
                )}

                {/* Shipping Cost Logic Display */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Costo de Envío</span>
                    <span>
                        {displayedShippingMethod === 'provincia' ? 'Por Pagar (Shalom/Agencia)' : 'Gratis'}
                    </span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(pedido.total)}</span>
                </div>
            </div>
        </div>
    )
}
