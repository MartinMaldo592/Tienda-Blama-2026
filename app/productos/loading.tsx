import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Skeleton className="h-10 w-full md:w-40" />
                    <Skeleton className="h-10 w-full md:w-40" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters Skeleton */}
                <div className="hidden lg:block space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="col-span-1 lg:col-span-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-square rounded-xl w-full" />
                                <div className="space-y-2 px-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
