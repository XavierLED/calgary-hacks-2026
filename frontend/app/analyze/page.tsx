"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ANALYSIS_STEPS = [
    { icon: "🔍", text: "Extracting entities and names" },
    { icon: "🔗", text: "Mapping known affiliations" },
    { icon: "📊", text: "Cross-referencing funding sources" },
    { icon: "⚠️", text: "Identifying potential conflicts" },
];

export default function Analyze() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!loading) return;

        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 2000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 1;
            });
        }, 80);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, [loading]);

    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(() => router.push("/results"), 800);
            return () => clearTimeout(timeout);
        }
    }, [progress, router]);

    const handleAnalyze = () => {
        setLoading(true);
        setCurrentStep(0);
        setProgress(0);
    };

    if (loading) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-background">
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] select-none opacity-40 sm:opacity-60">
                    <Image
                        src="/assets/node_graph.svg"
                        alt=""
                        fill
                        className="object-contain object-right-top"
                        priority
                        aria-hidden="true"
                    />
                </div>

                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
                    {/* Spinner */}
                    <div className="absolute top-8 right-8 md:top-12 md:right-16">
                        <svg className="h-8 w-8 animate-spin text-text-warm" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>

                    <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Analyzing Transparency
                    </h1>
                    <p className="mt-3 text-lg text-text-warm">
                        Scanning multiple data sources for conflicts of interest
                    </p>

                    {/* Progress bar */}
                    <div className="mt-10 h-2 w-full max-w-xl overflow-hidden rounded-full bg-gray-border">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="mt-10 w-full max-w-xl space-y-3">
                        {ANALYSIS_STEPS.map((step, i) => (
                            <div
                                key={step.text}
                                className={`flex items-center gap-4 rounded-xl bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-all duration-500 ${i <= currentStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                            >
                                <span className="text-xl">{step.icon}</span>
                                <span className="flex-1 text-base text-foreground">{step.text}</span>
                                {i < currentStep && (
                                    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {i === currentStep && (
                                    <svg className="h-5 w-5 animate-spin text-blue-primary" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">

            <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] select-none opacity-40 sm:opacity-60">
                <Image
                    src="/assets/node_graph.svg"
                    alt=""
                    fill
                    className="object-contain object-right-top"
                    priority
                    aria-hidden="true"
                />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">

                <nav className="px-8 pt-8 md:px-16 md:pt-12">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-blue-primary" />
                        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                            Conflict Checker
                        </span>
                    </Link>
                </nav>

                <main className="flex flex-1 flex-col items-center justify-center px-6">
                    <div className="w-full max-w-2xl rounded-2xl bg-background p-8 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border">

                        <label className="font-heading text-base font-bold text-foreground">
                            Primary Information
                        </label>
                        <input
                            type="text"
                            placeholder="Paste a URL..."
                            className="mt-2 w-full rounded-lg bg-background px-4 py-3 text-base text-foreground outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border placeholder:text-text-warm focus:outline-blue-primary"
                        />

                        <label className="mt-6 block font-heading text-base font-bold text-foreground">
                            Additional Context <span className="font-normal text-text-warm">(Optional)</span>
                        </label>
                        <textarea
                            placeholder="Add any relevant background information, or context that might help the analysis..."
                            rows={5}
                            className="mt-2 w-full resize-none rounded-lg bg-background px-4 py-3 text-base text-foreground outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border placeholder:text-text-warm focus:outline-blue-primary"
                        />

                        <button
                            type="button"
                            onClick={handleAnalyze}
                            className="mt-6 w-full cursor-pointer rounded-lg bg-blue-primary py-3 font-heading text-base font-semibold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.99]"
                        >
                            Analyze Conflict
                        </button>
                    </div>
                </main>

                <div className="pointer-events-none absolute bottom-0 right-0 -z-10 translate-x-1/3 translate-y-1/3 opacity-25">
                    <Image src="/assets/effect3.png" alt="" width={4000} height={4000} />
                </div>
            </div>
        </div>
    );
}
