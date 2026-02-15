import Image from "next/image";

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

                <nav className="flex items-center gap-3 px-8 pt-8 md:px-16 md:pt-12">
                    <div className="h-9 w-9 rounded-md bg-blue-primary" />
                    <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                        Conflict Checker
                    </span>
                </nav>

                <main className="flex flex-1 flex-col items-center justify-center gap-0.5 text-center">
                    <h1 className="font-heading max-w-2xl text-5xl leading-[1.1] font-bold tracking-normal text-foreground sm:text-6xl md:text-7xl">
                        Reveal Hidden Connections
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-warm md:text-xl">
                        A transparency tool for analyzing conflicts of interest in research, journalism, and
                        public discourse
                    </p>

                    <button
                        type="button"
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-primary px-10 py-3 font-heading text-xl font-medium leading-8 text-white cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    >
                        Start Analysis
                    </button>
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
                        This tool surfaces publicly available information about funding
                        sources, institutional affiliations, and political connections. For
                        informational purposes only. Please verify independently before
                        making decisions.
                    </p>
                </footer>

                <div className="pointer-events-none absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 opacity-25">
                    <Image src="/assets/effect3.png" alt="" width={6000} height={6000} />
                </div>

            </div>
        </div>
    );
}
