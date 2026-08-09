"use client"

import { m } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { ReactNode } from "react"

interface AdminPageHeaderProps {
    /** Lucide icon element, e.g. <Percent size={28} strokeWidth={1.5} /> */
    icon: ReactNode
    /** Tailwind bg color class for the icon container, e.g. "bg-amber-600" */
    iconColor?: string
    /** Tailwind shadow color class, e.g. "shadow-amber-200" */
    iconShadow?: string
    /** Page title */
    title: string
    /** Subtitle or description shown below the title */
    subtitle?: string
    /** Total number of items to display as a live counter */
    totalItems?: number
    /** Label for the total counter, e.g. "cupones registrados" */
    totalLabel?: string
    /** Whether data is currently being fetched (shows spinner next to title) */
    isFetching?: boolean
    /** Dot color for the live indicator, defaults to "bg-emerald-500" */
    dotColor?: string
    /** Action buttons rendered on the right side */
    actions?: ReactNode
}

export function AdminPageHeader({
    icon,
    iconColor = "bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900",
    iconShadow = "shadow-slate-900/20",
    title,
    subtitle,
    totalItems,
    totalLabel = "registros",
    isFetching = false,
    dotColor = "bg-emerald-500",
    actions,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-2">
            <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
            >
                <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 sm:h-14 sm:w-14 ${iconColor} rounded-2xl flex items-center justify-center text-white shadow-xl ring-1 ring-white/20 ${iconShadow} shrink-0`}>
                        {icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {title}
                            </h1>
                            {isFetching && (
                                <m.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2 rounded-xl border border-blue-500/20"
                                >
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                </m.div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`} />
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`} />
                            </span>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                                {totalItems !== undefined
                                    ? `${totalItems} ${totalLabel}`
                                    : subtitle || ''
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </m.div>

            {actions && (
                <m.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap items-center gap-3 w-full lg:w-auto"
                >
                    {actions}
                </m.div>
            )}
        </div>
    )
}
