"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { LazyMotion, domMax } from "framer-motion"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                gcTime: 30 * 60 * 1000, // 30 minutes (cache garbage collection)
                refetchOnWindowFocus: true,
                refetchOnMount: false, // Prevents refetching when navigating back/forth
                retry: 1, // Only retry once to avoid spamming the database
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <LazyMotion features={domMax} strict>
                {children}
            </LazyMotion>
        </QueryClientProvider>
    )
}
