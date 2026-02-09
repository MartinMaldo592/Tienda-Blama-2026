import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 md:pb-0 font-sans p-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Back Button Skeleton */}
            <Skeleton className="h-4 w-24 mb-4" />

            {/* Breadcrumbs Skeleton */}
            <div className="flex gap-2 text-sm text-muted-foreground mb-6">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <div className="grid grid-cols-4 gap-2">
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                    </div>
                </div>

                {/* Product Details Skeleton */}
                <div className="space-y-6 md:pl-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>

                    <div className="space-y-2 py-4 border-y border-dashed">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex items-end gap-3">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border">
                        <div className="flex gap-3 items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="mt-12 space-y-6">
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                </div>
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
        </div>
    )
}
