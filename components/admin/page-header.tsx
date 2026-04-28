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
    iconColor = "bg-slate-900",
    iconShadow = "shadow-slate-200",
    title,
    subtitle,
    totalItems,
    totalLabel = "registros",
    isFetching = false,
    dotColor = "bg-emerald-500",
    actions,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pt-4">
            <m.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 ${iconColor} rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl ${iconShadow}`}>
                        {icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                                {title}
                            </h1>
                            {isFetching && (
                                <m.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-blue-50 text-blue-600 p-2 rounded-xl"
                                >
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                </m.div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`h-2 w-2 rounded-full ${dotColor} animate-pulse`} />
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
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
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap gap-3 w-full lg:w-auto"
                >
                    {actions}
                </m.div>
            )}
        </div>
    )
}
