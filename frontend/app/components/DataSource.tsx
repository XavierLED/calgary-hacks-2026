"use client";

interface DataSourceProps {
    name: string;
    verified?: boolean;
}

export function DataSource({ name, verified }: DataSourceProps) {
    return (
        <span className="inline-flex items-center gap-1 text-xs text-text-warm">
            {verified && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            {name}
        </span>
    );
}
