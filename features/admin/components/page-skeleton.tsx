import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface AdminPageSkeletonProps {
    /** Number of stat cards to show (0 to hide) */
    hasStats?: number
    /** Number of stat card columns on desktop (2 or 3 or 4) */
    statsCols?: 2 | 3 | 4
    /** Whether to show a filter bar skeleton */
    hasFilters?: boolean
    /** Number of table columns */
    tableColumns?: number
    /** Number of table rows */
    tableRows?: number
    /** Whether to show action button skeletons in the header */
    hasActions?: boolean
    /** Number of action buttons to show */
    actionCount?: number
}

export function AdminPageSkeleton({
    hasStats = 0,
    statsCols = 3,
    hasFilters = true,
    tableColumns = 5,
    tableRows = 8,
    hasActions = true,
    actionCount = 2,
}: AdminPageSkeletonProps) {
    const colsClass =
        statsCols === 4
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            : statsCols === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto pt-4">
            {/* Header skeleton */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-[1.25rem]" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-56 rounded-2xl" />
                        <Skeleton className="h-3 w-40 rounded-lg" />
                    </div>
                </div>
                {hasActions && (
                    <div className="flex gap-3">
                        {Array.from({ length: actionCount }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-40 rounded-2xl" />
                        ))}
                    </div>
                )}
            </div>

            {/* Stats cards skeleton */}
            {hasStats > 0 && (
                <div className={`grid ${colsClass} gap-6`}>
                    {Array.from({ length: hasStats }).map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-[2rem]" />
                    ))}
                </div>
            )}

            {/* Filter bar skeleton */}
            {hasFilters && (
                <Skeleton className="h-16 rounded-[2rem]" />
            )}

            {/* Table skeleton */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-16 hover:bg-transparent border-slate-100">
                            {Array.from({ length: tableColumns }).map((_, i) => (
                                <TableHead key={i} className={`h-16 ${i === 0 ? 'pl-8' : ''} ${i === tableColumns - 1 ? 'pr-8' : ''}`}>
                                    <Skeleton className="h-3 w-20 rounded-lg" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: tableRows }).map((_, rowIdx) => (
                            <TableRow key={rowIdx} className="h-[68px] border-slate-50">
                                {Array.from({ length: tableColumns }).map((_, colIdx) => (
                                    <TableCell
                                        key={colIdx}
                                        className={`${colIdx === 0 ? 'pl-8' : ''} ${colIdx === tableColumns - 1 ? 'pr-8' : ''}`}
                                    >
                                        <Skeleton
                                            className={`h-4 rounded-lg ${
                                                colIdx === 0
                                                    ? 'w-36'
                                                    : colIdx === tableColumns - 1
                                                    ? 'w-20 ml-auto'
                                                    : 'w-24'
                                            }`}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
