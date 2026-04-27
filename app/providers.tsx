"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { LazyMotion, domMax } from "framer-motion"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                refetchOnWindowFocus: true,
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
