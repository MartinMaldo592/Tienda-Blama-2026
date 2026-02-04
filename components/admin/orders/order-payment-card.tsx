import { CreditCard, ExternalLink, Trash2, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import { PedidoRow } from "@/features/admin/types"

interface OrderPaymentCardProps {
    pedido: PedidoRow
    isLocked: boolean
    paymentUpload: any // Using specific hook type would be better but any for now
    onDeletePayment: (index: number) => void
}

export function OrderPaymentCard({ pedido, isLocked, paymentUpload, onDeletePayment }: OrderPaymentCardProps) {
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null)

    const handleDelete = () => {
        if (confirmDeleteIndex !== null) {
            onDeletePayment(confirmDeleteIndex)
            setConfirmDeleteIndex(null)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Pago
            </h2>
            <div className="space-y-2">
                <div>
                    <p className="text-sm text-gray-500">Estado de pago</p>
                    <Badge variant="secondary" className="mt-1">
                        {pedido.pago_status}
                    </Badge>
                </div>
                {pedido.cupon_codigo && (
                    <div className="mt-2 pt-2 border-t">
                        <p className="text-sm text-gray-500">Cupón aplicado</p>
                        <p className="font-mono text-sm font-bold text-green-700">{pedido.cupon_codigo}</p>
                    </div>
                )}
                <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="text-sm">
                        {pedido.stock_descontado ?
                            <span className="text-green-600 flex items-center gap-1">✔ Descontado</span> :
                            <span className="text-amber-600">⚠ No descontado</span>
                        }
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Comprobantes de Pago</p>

                    <div className="space-y-3">
                        {pedido.comprobante_pago_url && Array.isArray(pedido.comprobante_pago_url) && pedido.comprobante_pago_url.length > 0 ? (
                            pedido.comprobante_pago_url.map((url: string, index: number) => (
                                <div key={index} className="space-y-2">
                                    {/* Thumbnail Preview */}
                                    {url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) && (
                                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                            <img
                                                src={url}
                                                alt={`Voucher ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-2 border rounded bg-gray-50 flex items-center gap-2">
                                        <div className="bg-green-100 p-1.5 rounded text-green-600">
                                            <ExternalLink className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">Voucher {index + 1}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => window.open(url, '_blank')}>
                                            Ver Voucher
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-none h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setConfirmDeleteIndex(index)} disabled={isLocked}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : null}

                        {/* Upload Button - Only show if less than 2 files */}
                        {(!pedido.comprobante_pago_url || pedido.comprobante_pago_url.length < 2) && (
                            <div className="relative">
                                <input
                                    type="file"
                                    id="payment-upload"
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const files = pedido.comprobante_pago_url || []
                                        if (files.length >= 2) {
                                            toast.error("Solo puedes subir máximo 2 comprobantes.")
                                            return
                                        }
                                        if (e.target.files?.[0]) {
                                            const id = pedido.id
                                            paymentUpload.upload(e.target.files[0], `pago_${id}_${Date.now()}.${e.target.files[0].name.split('.').pop()}`)
                                        }
                                        e.target.value = ''
                                    }}
                                    disabled={paymentUpload.isUploading || isLocked}
                                />
                                <label htmlFor="payment-upload" className="cursor-pointer block w-full text-center border border-dashed rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                    <span className="text-xs font-medium text-blue-600">
                                        {paymentUpload.isUploading ? 'Subiendo...' : '+ Subir Voucher/Foto'}
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Payment Confirmation Dialog */}
            <Dialog open={confirmDeleteIndex !== null} onOpenChange={(open) => !open && setConfirmDeleteIndex(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Comprobante</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-gray-500">¿Estás seguro que deseas eliminar este comprobante de pago?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteIndex(null)} disabled={paymentUpload.isUploading}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={paymentUpload.isUploading}>
                            {paymentUpload.isUploading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
