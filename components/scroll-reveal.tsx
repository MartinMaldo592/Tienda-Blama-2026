"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type Direction = "up" | "down" | "left" | "right" | "none"

interface ScrollRevealProps {
    children: ReactNode
    direction?: Direction
    delay?: number
    duration?: number
    className?: string
    once?: boolean
}

const directionStyles: Record<Direction, string> = {
    up: "translateY(20px)",
    down: "translateY(-20px)",
    left: "translateX(20px)",
    right: "translateX(-20px)",
    none: "none",
}

export function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 600,
    className = "",
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (once) observer.unobserve(el)
                } else if (!once) {
                    setIsVisible(false)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -40px 0px",
            }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [once])

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : directionStyles[direction],
                transition: `all ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
                willChange: "transform, opacity",
            }}
        >
            {children}
        </div>
    )
}
