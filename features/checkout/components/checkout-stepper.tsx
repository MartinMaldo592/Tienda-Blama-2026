"use client"

import { Check, ChevronRight } from "lucide-react"

interface CheckoutStepperProps {
    currentStep: 1 | 2 | 3
    onStepClick: (step: 1 | 2 | 3) => void
}

export function CheckoutStepper({ currentStep, onStepClick }: CheckoutStepperProps) {
    const steps = [
        { id: 1, label: "Datos Personales" },
        { id: 2, label: "Dirección de Envío" },
        { id: 3, label: "Envío y Pago" },
    ]

    return (
        <nav aria-label="Progreso del pedido" className="py-2">
            <ol className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-500">
                {steps.map((step, index) => {
                    const isCompleted = step.id < currentStep
                    const isActive = step.id === currentStep

                    return (
                        <li key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isCompleted) onStepClick(step.id as 1 | 2 | 3)
                                }}
                                disabled={!isCompleted && !isActive}
                                className={`flex items-center gap-1.5 transition-all ${
                                    isActive
                                        ? "text-[#FF6FA7] font-black"
                                        : isCompleted
                                        ? "text-slate-800 font-bold hover:text-[#FF6FA7] cursor-pointer"
                                        : "text-slate-400 font-medium cursor-not-allowed"
                                }`}
                            >
                                <span
                                    className={`h-6 w-6 rounded-full text-xs flex items-center justify-center font-black transition-all ${
                                        isCompleted
                                            ? "bg-emerald-500 text-white shadow-xs"
                                            : isActive
                                            ? "bg-[#FF6FA7] text-white shadow-md shadow-[#FF6FA7]/30"
                                            : "bg-slate-200 text-slate-500"
                                    }`}
                                >
                                    {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
                                </span>
                                <span className={isActive ? "underline underline-offset-4 decoration-2 decoration-[#FF6FA7]" : ""}>
                                    {step.label}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
