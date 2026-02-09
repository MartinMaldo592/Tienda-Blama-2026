import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="pb-20 font-sans space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Hero Carousel Skeleton */}
            <section className="p-4">
                <Skeleton className="w-full aspect-[2/1] md:aspect-[3/1] rounded-xl" />
            </section>

            {/* Product Section 1 Skeleton */}
            <section className="p-4 px-2 space-y-4">
                <div className="flex justify-between items-center px-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-xl" />
                            <div className="space-y-2 px-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Section 2 Skeleton */}
            <section className="p-4 px-2 space-y-4">
                <div className="flex justify-between items-center px-2">
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-xl" />
                            <div className="space-y-2 px-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
