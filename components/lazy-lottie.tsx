"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const Lottie = dynamic(() => import("lottie-react"), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full rounded-full" />
})

export default Lottie
