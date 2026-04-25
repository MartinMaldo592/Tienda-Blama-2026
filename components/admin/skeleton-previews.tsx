import { Skeleton } from "@/components/ui/skeleton"
import { TableRow, TableCell } from "@/components/ui/table"

export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-xl" />
                    </div>
                    <Skeleton className="h-4 w-20 rounded-full" />
                </div>
            ))}
        </div>
    )
}

interface TableRowSkeletonProps {
    columns: number
    rows?: number
    hasCheckbox?: boolean
}

export function TableRowsSkeleton({ columns, rows = 5, hasCheckbox = true }: TableRowSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i}>
                    {hasCheckbox && (
                        <TableCell className="pl-4">
                            <Skeleton className="h-4 w-4 rounded" />
                        </TableCell>
                    )}
                    {Array.from({ length: columns - (hasCheckbox ? 1 : 0) - 1 }).map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton className={`h-4 ${j === 0 ? 'w-32' : 'w-24'}`} />
                        </TableCell>
                    ))}
                    <TableCell className="text-right pr-4">
                        <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

export function OrderRowSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="pl-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 font-bold" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-[135px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[160px] rounded-md" /></TableCell>
                    <TableCell className="text-right pr-4"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export function ProductRowSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </TableCell>
                    <TableCell>
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
