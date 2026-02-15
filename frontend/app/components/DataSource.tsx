"use client";

interface DataSourceProps {
    name: string;
    verified?: boolean;
}

export function DataSource({ name, verified }: DataSourceProps) {
    return (
        <span className="inline-flex items-center text-xs text-text-warm">
            {name}
        </span>
    );
}
