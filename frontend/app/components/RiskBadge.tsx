"use client";

interface RiskBadgeProps {
    level: "low" | "moderate" | "high";
}

const config = {
    low: { label: "Low Risk", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    moderate: { label: "Moderate Risk", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    high: { label: "High Risk", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

export function RiskBadge({ level }: RiskBadgeProps) {
    const c = config[level];
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${c.bg} ${c.text}`}>
            <span className={`h-2 w-2 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}
