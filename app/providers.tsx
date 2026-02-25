"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useJsApiLoader, Libraries } from "@react-google-maps/api"

const libraries: Libraries = ["places"]

export function Providers({ children }: { children: React.ReactNode }) {
    // Carga de Google Maps sin bloquear el renderizado de la app
    useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries,
    })

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
            {children}
        </QueryClientProvider>
    )
}
