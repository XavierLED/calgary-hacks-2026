"use client";

interface RiskBadgeProps {
    level: "low" | "moderate" | "high";
}

const config = {
    low: {
        label: "Low Risk",
        text: "#3FC07C",
        dot: "#26734A", 
    },
    moderate: {
        label: "Moderate Risk",
        text: "#E6C74C", 
        dot: "#C9A61C",
    },
    high: {
        label: "High Risk",
        text: "#B91C1C",
        dot: "#AE1F1E",
    },
};

export function RiskBadge({ level }: RiskBadgeProps) {
    const c = config[level];
    return (
        <span
            className="inline-flex items-center gap-2 py-1.5 text-sm font-semibold rounded-full"
            style={{ color: c.text }}
        >
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.dot }}
            />
            {c.label}
        </span>
    );
}
