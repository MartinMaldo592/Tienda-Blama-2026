import React from 'react'

export function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Confirmado': 'bg-blue-100 text-blue-800 border-blue-200',
        'Preparando': 'bg-orange-100 text-orange-800 border-orange-200',
        'Enviado': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Entregado': 'bg-green-100 text-green-800 border-green-200',
        'Fallido': 'bg-red-100 text-red-800 border-red-200',
        'Devuelto': 'bg-red-100 text-red-800 border-red-200',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    )
}

export function PaymentStatusBadge({ status }: { status: string | null }) {
    const styles: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'pago contraentrega': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'paid': 'bg-green-100 text-green-800 border-green-200',
        'pagado': 'bg-green-100 text-green-800 border-green-200',
        'failed': 'bg-red-100 text-red-800 border-red-200',
        'fallido': 'bg-red-100 text-red-800 border-red-200',
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
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[normalized] || 'bg-gray-100'}`}>
            {labels[normalized] || status || 'Pendiente'}
        </span>
    )
}
