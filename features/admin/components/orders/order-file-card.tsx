import Image from "next/image"
import { Trash2, ExternalLink, FileUp, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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

const ACCENT_MAP = {
    blue:   { zone: 'border-blue-100 bg-blue-50/50 hover:bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-600', dot: 'bg-blue-500'   },
    green:  { zone: 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    purple: { zone: 'border-purple-100 bg-purple-50/50 hover:bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600', dot: 'bg-purple-500' },
    orange: { zone: 'border-orange-100 bg-orange-50/50 hover:bg-orange-50', icon: 'bg-orange-100 text-orange-600', text: 'text-orange-600', dot: 'bg-orange-500' },
}

const inputId = (title: string) => `upload-${title.replace(/\s+/g, '-').toLowerCase()}`
const isImage = (url: string) => /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url)

export function OrderFileCard({
    title,
    icon,
    fileUrl,
    isLocked,
    isUploading,
    onUpload,
    onDelete,
    uploadLabel = "Vincular Archivo",
    uploadSubLabel = "Imagen o PDF",
    accept = "image/*,.pdf",
    accentColor = "blue"
}: OrderFileCardProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [showPreview, setShowPreview] = useState(true)

    const a = ACCENT_MAP[accentColor] || ACCENT_MAP.blue

    const handleDelete = () => {
        onDelete()
        setIsDeleteDialogOpen(false)
    }

    return (
        <div className="space-y-4">
            {fileUrl ? (
                <div className="space-y-4">
                    {/* File Row */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                        {/* Status Icon */}
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${a.icon}`}>
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</p>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-medium text-slate-400 hover:text-blue-600 transition-colors truncate block max-w-[180px]"
                            >
                                {fileUrl.split('/').pop()}
                            </a>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            {isImage(fileUrl) && (
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                                    title={showPreview ? 'Ocultar' : 'Ver'}
                                >
                                    {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            )}
                            <button
                                onClick={() => window.open(fileUrl || '', '_blank')}
                                className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                                title="Abrir en nueva pestaña"
                            >
                                <ExternalLink size={15} />
                            </button>
                            {!isLocked && (
                                <button
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                                    title="Eliminar archivo"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Image Preview */}
                    {showPreview && isImage(fileUrl) && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <img
                                src={fileUrl}
                                alt={title}
                                className="w-full h-auto rounded-2xl border border-slate-100 shadow-sm object-cover max-h-[280px]"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
            ) : (
                /* Upload Zone */
                <div className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${a.zone} ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}>
                    <input
                        type="file"
                        id={inputId(title)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept={accept}
                        onChange={(e) => {
                            if (e.target.files?.[0]) onUpload(e.target.files[0])
                            e.target.value = ''
                        }}
                        disabled={isUploading || isLocked}
                    />
                    <label htmlFor={inputId(title)} className="flex flex-col items-center gap-4 py-8 px-6 cursor-pointer w-full">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${a.icon} shadow-sm`}>
                            {isUploading
                                ? <Loader2 size={24} className="animate-spin" />
                                : (icon || <FileUp size={24} />)
                            }
                        </div>
                        <div className="text-center">
                            <p className={`text-sm font-black uppercase tracking-widest ${a.text}`}>
                                {isUploading ? 'Procesando...' : uploadLabel}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                {uploadSubLabel}
                            </p>
                        </div>
                    </label>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">Eliminar Archivo</DialogTitle>
                    </DialogHeader>
                    <div className="py-6">
                        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                            <p className="text-sm font-medium text-rose-800 leading-relaxed">
                                ¿Estás seguro? El archivo <span className="font-black">{title}</span> será eliminado permanentemente del sistema.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="h-14 px-8 rounded-2xl font-bold">
                            CANCELAR
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="h-14 px-10 rounded-2xl font-black bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 haptic-scale"
                        >
                            ELIMINAR
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
