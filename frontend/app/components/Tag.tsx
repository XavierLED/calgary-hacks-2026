"use client";

interface TagProps {
    variant: "academic" | "private" | "government" | "political";
    children: React.ReactNode;
}

const styles: Record<string, string> = {
    academic: "bg-cyan-100 text-cyan-700",
    private: "bg-violet-100 text-violet-700",
    government: "bg-blue-100 text-blue-700",
    political: "bg-purple-100 text-purple-700",
};

export function Tag({ variant, children }: TagProps) {
    return (
        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${styles[variant] ?? "bg-gray-100 text-gray-600"}`}>
            {children}
        </span>
    );
}
