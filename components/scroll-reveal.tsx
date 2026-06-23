"use client"

import type { ReactNode } from "react"

type Direction = "up" | "down" | "left" | "right" | "none"

interface ScrollRevealProps {
    children: ReactNode
    direction?: Direction
    delay?: number
    duration?: number
    className?: string
    once?: boolean
}

export function ScrollReveal({
    children,
    className = "",
}: ScrollRevealProps) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

