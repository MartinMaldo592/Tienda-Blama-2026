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
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
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
                transform: isVisible ? "translate(0, 0)" : undefined,
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            }}
        >
            <div
                style={{
                    transform: isVisible ? "none" : `${directionStyles[direction]}`.replace("translate-y-8", "translateY(2rem)").replace("-translate-y-8", "translateY(-2rem)").replace("translate-x-8", "translateX(2rem)").replace("-translate-x-8", "translateX(-2rem)") || "none",
                    transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                }}
            >
                {children}
            </div>
        </div>
    )
}
