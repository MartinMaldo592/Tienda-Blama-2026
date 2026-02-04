import { Trash2, ExternalLink, FileUp, Check, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"

interface OrderFileCardProps {
    title: string
    icon?: React.ReactNode
    fileUrl: string | null
    isLocked: boolean
    isUploading: boolean
    onUpload: (file: File) => void
    onDelete: () => void
    uploadLabel?: string
    uploadSubLabel?: string
    accept?: string
    accentColor?: "blue" | "green" | "purple" | "orange"
}

export function OrderFileCard({
    title,
    icon,
    fileUrl,
    isLocked,
    isUploading,
    onUpload,
    onDelete,
    uploadLabel = "Subir Archivo",
    uploadSubLabel = "Imagen o PDF",
    accept = "image/*,.pdf",
    accentColor = "blue"
}: OrderFileCardProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Color maps
    const bgColors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    }
    const borderColors = {
        blue: "hover:bg-blue-50",
        green: "hover:bg-green-50",
        purple: "hover:bg-purple-50",
        orange: "hover:bg-orange-50",
    }
    const textColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600",
    }

    const currentBg = bgColors[accentColor] || bgColors.blue
    const currentHover = borderColors[accentColor] || borderColors.blue
    const currentText = textColors[accentColor] || textColors.blue

    const handleDelete = () => {
        onDelete()
        setIsDeleteDialogOpen(false)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                {icon} {title}
            </h2>
            {fileUrl ? (
                <div className="space-y-3">
                    {/* Thumbnail Preview */}
                    {fileUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) ? (
                        <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border group cursor-pointer" onClick={() => window.open(fileUrl || '', '_blank')}>
                            <img
                                src={fileUrl}
                                alt={title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ExternalLink className="text-white drop-shadow-md" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                            <div className="bg-gray-200 p-2 rounded">
                                <FileUp className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Documento Adjunto</p>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                                    Ver archivo
                                </a>
                            </div>
                        </div>
                    )}

                    {!fileUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) && (
                        <div className="p-3 border rounded-lg bg-gray-50 flex items-center gap-3">
                            <div className={`p-2 rounded ${currentBg}`}>
                                {icon || <FileUp className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{title}</p>
                                <p className="text-xs text-gray-500">Documento cargado</p>
                            </div>
                        </div>
                    )}


                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => window.open(fileUrl || '', '_blank')}>
                            <ExternalLink className="h-4 w-4" /> Ver Completo
                        </Button>
                        <Button variant="outline" className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setIsDeleteDialogOpen(true)} disabled={isLocked}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={`text-center p-6 border-2 border-dashed rounded-xl ${currentHover} transition-colors`}>
                    <input
                        type="file"
                        id={`upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
                        className="hidden"
                        accept={accept}
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                onUpload(e.target.files[0])
                            }
                            e.target.value = ''
                        }}
                        disabled={isUploading || isLocked}
                    />
                    <label htmlFor={`upload-${title.replace(/\s+/g, '-').toLowerCase()}`} className="cursor-pointer flex flex-col items-center gap-2 w-full">
                        <div className={`p-3 rounded-full ${currentBg}`}>
                            {icon || <FileUp className="h-6 w-6" />}
                        </div>
                        <span className={`text-sm font-medium ${currentText}`}>
                            {isUploading ? 'Subiendo...' : uploadLabel}
                        </span>
                        <span className="text-xs text-gray-400">{uploadSubLabel}</span>
                    </label>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar {title}</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-gray-500">¿Estás seguro que deseas eliminar este archivo? Esta acción no se puede deshacer.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isUploading}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isUploading}>
                            {isUploading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
