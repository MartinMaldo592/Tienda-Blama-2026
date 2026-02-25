"use client"

import React from "react"

export function SuccessCheckmark() {
    return (
        <div className="flex items-center justify-center">
            <style>{`
                @keyframes scaleIn {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.15); opacity: 1; }
                    80%  { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }
                @keyframes drawCircle {
                    0%   { stroke-dashoffset: 283; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes drawCheck {
                    0%   { stroke-dashoffset: 100; }
                    100% { stroke-dashoffset: 0; }
                }
                .success-circle-wrap { animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .success-ring {
                    stroke-dasharray: 283;
                    stroke-dashoffset: 283;
                    animation: drawCircle 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) forwards;
                }
                .success-check {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: drawCheck 0.5s 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
                }
            `}</style>
            <div className="success-circle-wrap">
                <svg width="130" height="130" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="70" cy="70" r="70" fill="#dcfce7" />
                    <circle
                        className="success-ring"
                        cx="70" cy="70" r="45"
                        stroke="#22c55e" strokeWidth="5"
                        strokeLinecap="round" fill="none"
                        transform="rotate(-90 70 70)"
                    />
                    <polyline
                        className="success-check"
                        points="45,72 62,90 95,52"
                        stroke="#16a34a" strokeWidth="7"
                        strokeLinecap="round" strokeLinejoin="round"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
    )
}
