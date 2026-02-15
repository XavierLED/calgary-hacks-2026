"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ANALYSIS_STEPS = [
    { text: "Extracting entities and names..." },
    { text: "Mapping known affiliations..." },
    { text: "Cross-referencing funding sources..." },
    { text: "Identifying potential conflicts..." },
];

const features = [
    {
        title: "Research Papers",
        description: "Examine academic papers for conflict of interest",
        icon: "/assets/paper.svg",
        color: "var(--color-red-accent)",
    },
    {
        title: "News Articles",
        description: "Investigate the validity of news and media coverage",
        icon: "/assets/news.svg",
        color: "var(--color-orange-accent)",
    },
];



export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [inputUrl, setInputUrl] = useState("");

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

    const submit = async () => {
        console.log(inputUrl);
        if (!inputUrl) return;
        try {
            const res = await fetch("http://127.0.0.1:8000/fetch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: inputUrl }),
            });
            const data = await res.json();
            if (data.message && data.message.startsWith("Error")) {
                // Handle error (show message, etc.)
                alert(data.message);
                return;
            }
            // Success: go to next page with data (example: /analyze?url=...)
            localStorage.setItem("analysisResult", JSON.stringify(data));
            handleAnalyze();
        } catch (err) {
            alert("Network or server error.");
        }
    };

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

                    <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Analyzing Transparency
                    </h1>
                    <p className="mt-3 text-lg text-text-warm">
                        Scanning multiple data sources for conflicts of interest
                    </p>

                    <div className="mt-10 h-2 w-full max-w-xl overflow-hidden rounded-full bg-gray-border">
                        <div
                            className="h-full rounded-full transition-all duration-300 ease-out"
                            style={{ background: "linear-gradient(217deg, #E17751 -18.39%, #E1516B 98.63%)", width: `${progress}%` }}
                        />
                    </div>

                    <p className="mt-6 text-base text-text-warm transition-all duration-500">
                        {ANALYSIS_STEPS[currentStep].text}
                    </p>
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
                    <Image src="/assets/logo.svg" alt="Trace" width={88} height={32} priority />
                </nav>

                <main className="flex flex-1 flex-col items-center justify-center gap-0.5 text-center">
                    <h1 className="font-heading max-w-2xl text-5xl leading-[1.1] font-bold tracking-normal text-foreground sm:text-6xl md:text-7xl">
                        Reveal Hidden Connections
                    </h1>

                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-warm md:text-xl">
                        A transparency tool for analyzing conflicts of interest in research, journalism, and
                        public discourse
                    </p>
                    <div className="flex flex-row w-fit gap-4  mt-4 justify-center items-center w-full max-w-2xl rounded-xl p-4">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={e => setInputUrl(e.target.value)}
                            placeholder="Paste a URL..."
                            className="mt-2 w-200 h-14 rounded-lg bg-background px-4 py-3 text-base text-foreground outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border placeholder:text-text-warm focus:outline-blue-primary"
                        />
                        <button
                            onClick={submit}
                            type="button"
                            className="mt-2 w-[50%] inline-flex items-center justify-center gap-2 rounded-lg px-2 py-3 font-heading text-xl font-medium leading-8 text-white cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                            style={{ backgroundColor: '#192BC2' }}
                        >
                            Start Analysis
                        </button>
                    </div>
                </main>

                <section className="mx-auto px-6 py-10 md:px-16">
                    <div className="inline-grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="flex flex-col items-start gap-2 overflow-hidden rounded-xl bg-white p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border"
                            >
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: f.color }}
                                >
                                    <Image src={f.icon} alt={f.title} width={28} height={28} />
                                </div>

                                <div className="flex flex-col items-start gap-0.5">
                                    <h3 className="font-heading text-xl font-bold leading-7 text-foreground">
                                        {f.title}
                                    </h3>
                                    <p className="text-base font-normal text-text-gray">
                                        {f.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="px-6 py-8 text-center md:px-16">
                    <p className="mx-auto max-w-3xl text-xs leading-relaxed text-text-warm">
                        This tool utilizes publicly available information about funding
                        sources, institutional affiliations, and political connections. For
                        informational purposes only. Please verify independently before
                        making decisions.
                    </p>
                </footer>

                <div className="pointer-events-none absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 opacity-25">
                    <Image src="/assets/effect3.png" alt="" width={6000} height={6000} />
                </div>

            </div>
        </div >
    );
}
