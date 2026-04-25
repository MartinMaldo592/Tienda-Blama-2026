export function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Pendiente': 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_2px_10px_-3px_rgba(251,191,36,0.2)]',
        'Confirmado': 'bg-sky-50 text-sky-700 border-sky-100 shadow-[0_2px_10px_-3px_rgba(14,165,233,0.2)]',
        'Preparando': 'bg-orange-50 text-orange-700 border-orange-100 shadow-[0_2px_10px_-3px_rgba(249,115,22,0.2)]',
        'Enviado': 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_2px_10px_-3px_rgba(79,70,229,0.2)]',
        'Entregado': 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]',
        'Fallido': 'bg-rose-50 text-rose-700 border-rose-100 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)]',
        'Devuelto': 'bg-slate-50 text-slate-700 border-slate-100 shadow-[0_2px_10px_-3px_rgba(71,85,105,0.2)]',
    }
    return (
        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
            {status}
        </span>
    )
}

export function PaymentStatusBadge({ status }: { status: string | null }) {
    const styles: Record<string, string> = {
        'pending': 'bg-amber-50 text-amber-700 border-amber-100',
        'pendiente': 'bg-amber-50 text-amber-700 border-amber-100',
        'pago contraentrega': 'bg-blue-50 text-blue-700 border-blue-100',
        'paid': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'pagado': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'failed': 'bg-rose-50 text-rose-700 border-rose-100',
        'fallido': 'bg-rose-50 text-rose-700 border-rose-100',
    }
    const labels: Record<string, string> = {
        'pending': 'Pendiente',
        'pendiente': 'Pendiente',
        'pago contraentrega': 'Contraentrega',
        'paid': 'Pagado',
        'pagado': 'Pagado',
        'failed': 'Fallido',
        'fallido': 'Fallido',
    }

    const normalized = (status || 'pending').toLowerCase()

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[normalized] || 'bg-gray-50'}`}>
            <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${normalized === 'paid' || normalized === 'pagado' ? 'bg-emerald-500' : normalized === 'failed' || normalized === 'fallido' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
                {labels[normalized] || status || 'Pendiente'}
            </span>
        </span>
    )
}
