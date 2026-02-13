import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="pb-20 font-sans space-y-12 animate-in fade-in zoom-in-95 duration-500">

            {/* Minimal Hero Skeleton */}
            <section className="p-0 sm:p-4">
                <div className="relative overflow-hidden rounded-3xl mx-4 my-2 border border-border/50 shadow-md h-[400px] md:h-[500px] flex flex-col items-center justify-center p-8 space-y-6">
                    <Skeleton className="w-3/4 h-12 md:h-20 rounded-lg" />
                    <Skeleton className="w-1/2 h-6 md:h-8 rounded-lg" />
                    <div className="flex gap-4 mt-8">
                        <Skeleton className="w-32 h-12 rounded-full" />
                        <Skeleton className="w-32 h-12 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Category Grid Skeleton */}
            <section className="py-6 md:py-10 px-4 space-y-6">
                <Skeleton className="h-8 w-48 rounded-md" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-80">
                    <Skeleton className="col-span-2 row-span-2 md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-1 rounded-xl h-full" />
                    <Skeleton className="rounded-xl h-full hidden md:block" />
                    <Skeleton className="rounded-xl h-full hidden md:block" />
                    <Skeleton className="rounded-xl h-full hidden md:block" />
                </div>
            </section>

            {/* Product Section 1 Skeleton (Best Sellers) */}
            <section className="p-4 px-2 space-y-6">
                <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-1 h-6 rounded-full" />
                        <Skeleton className="h-8 w-40" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-xl" />
                            <div className="space-y-2 px-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-6 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Section 2 Skeleton (Offers) */}
            <section className="p-4 px-2 space-y-6">
                <div className="flex justify-between items-center px-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-1 h-6 rounded-full" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                        <Skeleton className="h-3 w-48 ml-3" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-xl" />
                            <div className="space-y-2 px-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-6 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter Skeleton */}
            <section className="py-16 px-4 my-10 mx-4 rounded-3xl relative overflow-hidden">
                <Skeleton className="w-full h-64 rounded-3xl" />
            </section>

            {/* Benefits Bar Skeleton */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border">
                                <Skeleton className="w-12 h-12 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Store Location Skeleton */}
            <section className="py-8 px-4">
                <div className="max-w-7xl mx-auto h-[500px] flex flex-col md:flex-row gap-6">
                    <Skeleton className="w-full md:w-1/2 h-full rounded-3xl" />
                    <Skeleton className="w-full md:w-1/2 h-full rounded-3xl" />
                </div>
            </section>

        </div>
    )
}
