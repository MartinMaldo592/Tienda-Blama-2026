'use client'

import { m, AnimatePresence } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface PDFPreviewModalProps {
    url: string | null
    isOpen: boolean
    onClose: () => void
    title?: string
}

export function PDFPreviewModal({
    url,
    isOpen,
    onClose,
    title = "Previsualización de Documento"
}: PDFPreviewModalProps) {

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && url && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-6"
                    onClick={onClose}
                >
                    <m.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="bg-white w-full max-w-5xl h-[90vh] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del Visor */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm z-10">
                            <h3 className="font-bold text-slate-800 ml-4 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                <span className="truncate max-w-[300px]">{title}</span>
                            </h3>
                            <div className="flex items-center gap-2 pr-2 shrink-0">
                                <Button
                                    variant="outline"
                                    className="h-9 px-3 gap-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-slate-200 transition-colors"
                                    onClick={() => window.open(url, '_blank')}
                                >
                                    <ExternalLink size={16} />
                                    <span className="hidden sm:inline font-semibold text-xs">Abrir en Pestaña</span>
                                </Button>
                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                        </div>

                        {/* Cuerpo del Visor */}
                        <div className="flex-1 bg-slate-200/50 relative overflow-hidden">
                            {/* Loader de fondo mientras carga el iframe */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                <p className="font-medium text-sm">Cargando documento...</p>
                            </div>
                            <iframe
                                src={`${url}#toolbar=1&navpanes=0&zoom=100`}
                                className="w-full h-full border-none relative z-10"
                                title="PDF Preview"
                            />
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>
    )
}
