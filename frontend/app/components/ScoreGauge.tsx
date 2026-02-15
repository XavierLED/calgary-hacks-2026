"use client";

import { motion } from "motion/react";

interface ScoreGaugeProps {
    score: number;
    size?: number;
}

export function ScoreGauge({ score, size = 220 }: ScoreGaugeProps) {
    const radius = (size - 20) / 2;
    const circumference = Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score <= 33) return "#22c55e";
        if (score <= 66) return "#eab308";
        return "#ef4444";
    };

    return (
        <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
            <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
                {/* Background arc */}
                <path
                    d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
                    fill="none"
                    stroke="var(--color-gray-border)"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                {/* Animated arc */}
                <motion.path
                    d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center">
                <motion.span
                    className="font-heading text-4xl font-bold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {score}
                </motion.span>
                <span className="text-sm text-text-warm">/100</span>
            </div>
        </div>
    );
}
