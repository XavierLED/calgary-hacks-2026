"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface ConflictCardProps {
    title: string;
    icon: React.ReactNode;
    borderColor: string;
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

export function ConflictCard({ title, icon, borderColor, defaultExpanded = false, children }: ConflictCardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <motion.div
            className={`overflow-hidden rounded-xl border-4-1 ${borderColor} bg-white outline outline-[0.4px] -outline-offset-[0.4px]`}
            style={{ outlineColor: 'var(--color-gray-border)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex w-full cursor-pointer items-center gap-3 px-6 py-5 text-left transition-colors hover:bg-background"
            >
                <span className="text-blue-primary">{icon}</span>
                <h3 className="flex-1 font-heading text-lg font-bold text-foreground">{title}</h3>
                <ChevronDown
                    className={`h-5 w-5 text-text-warm transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
