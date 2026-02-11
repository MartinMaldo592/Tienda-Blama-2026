"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import type { ReactNode } from "react"

export function HomeScrollReveal({
    children,
    direction = "up",
    delay = 0,
    className = "",
}: {
    children: ReactNode
    direction?: "up" | "down" | "left" | "right" | "none"
    delay?: number
    className?: string
}) {
    return (
        <ScrollReveal direction={direction} delay={delay} className={className}>
            {children}
        </ScrollReveal>
    )
}
