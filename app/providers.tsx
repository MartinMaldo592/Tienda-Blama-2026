"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { LoadScript, Libraries } from "@react-google-maps/api"

const libraries: Libraries = ["places"]

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
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                libraries={libraries}
            >
                {children}
            </LoadScript>
        </QueryClientProvider>
    )
}
