"use client";

import Link from "next/link";

import { motion } from "motion/react";
import {
    ArrowLeft,
    FileText,
    Users,
    DollarSign,
    AlertTriangle,
    ClipboardList,
    Download,
    Share2,
    Calendar,
    ExternalLink,
    TrendingUp,
    Link as LinkIcon,
} from "lucide-react";
import { ScoreGauge } from "../components/ScoreGauge";
import { RiskBadge } from "../components/RiskBadge";
import { Tag } from "../components/Tag";
import { ConflictCard } from "../components/ConflictCard";
import { DataSource } from "../components/DataSource";

// ─── Data ──────────────────────────────────────────────────────────
// TODO: Replace with real API call
import { MOCK_RESULT } from "../lib/mockData";
import type { AnalysisResult, ConflictSeverity, SourceType } from "../lib/types";

const SOURCE_LABELS: Record<SourceType, string> = {
    paper: "Research Paper",
    video: "Video",
    news: "News Article",
    article: "Article",
    other: "Source",
};

const SEVERITY_COLORS: Record<ConflictSeverity, string> = {
    low: "text-emerald-600",
    moderate: "text-amber-600",
    high: "text-red-600",
};

const SEVERITY_BG: Record<ConflictSeverity, string> = {
    low: "bg-emerald-50 outline-emerald-200",
    moderate: "bg-amber-50 outline-amber-200",
    high: "bg-red-50 outline-red-200",
};

// ─── Component ─────────────────────────────────────────────────────
export default function Results() {
    // TODO: Replace with real data fetching
    const data: AnalysisResult = MOCK_RESULT;

    return (
        <div className="relative min-h-screen bg-background">


            <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-12">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link href="/analyze" className="inline-flex items-center gap-2 text-text-warm transition-colors hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                            <span>New Analysis</span>
                        </Link>
                    </motion.div>

                    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-text-warm outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-all hover:text-foreground">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                        </button>
                        <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-primary px-4 py-2 text-sm text-white transition-all hover:brightness-110">
                            <Download className="h-4 w-4" />
                            <span>Export PDF</span>
                        </button>
                    </motion.div>
                </div>

                {/* Main grid */}
                <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
                    {/* ── Left sidebar ── */}
                    <div className="space-y-6">
                        <motion.div
                            className="rounded-xl bg-white p-8 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Source info */}
                            <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
                                {SOURCE_LABELS[data.source.type]}
                            </span>
                            <h2 className="font-heading text-xl font-bold leading-snug text-foreground">
                                {data.source.title}
                            </h2>
                            <p className="mt-2 text-sm text-text-warm">{data.source.authors.join(", ")}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-text-warm">
                                <Calendar className="h-3 w-3" />
                                <span>{data.source.publisher} · {data.source.publishedDate}</span>
                            </div>
                            {data.source.url && (
                                <a
                                    href={data.source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-primary hover:underline"
                                >
                                    <LinkIcon className="h-3 w-3" /> View source
                                </a>
                            )}

                            {/* Score */}
                            <div className="mt-6 flex justify-center">
                                <ScoreGauge score={data.score} size={220} />
                            </div>

                            <div className="mb-4 flex justify-center">
                                <RiskBadge level={data.riskLevel} />
                            </div>

                            {/* Quick stats */}
                            <div className="space-y-3 border-t border-gray-border pt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-warm">Entities Found</span>
                                    <span className="font-semibold text-foreground">{data.entities.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-warm">Funding Connections</span>
                                    <span className="font-semibold text-foreground">{data.funding.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-warm">Conflicts Identified</span>
                                    <span className="font-semibold text-foreground">{data.conflicts.length}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Transparency disclaimer */}
                        <motion.div
                            className="rounded-lg bg-amber-50 p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-amber-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Transparency Note</p>
                                    <p className="mt-1 text-xs text-amber-800">
                                        This analysis uses publicly available data and AI inference. Always verify independently before drawing conclusions.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Right panel ── */}
                    <div className="space-y-6">
                        {/* Entities */}
                        <ConflictCard title="Entities & Affiliations" icon={<Users className="h-6 w-6" />} borderColor="border-l-cyan-500" defaultExpanded>
                            <div className="space-y-4">
                                {data.entities.map((e, i) => (
                                    <div key={i} className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-colors hover:outline-blue-primary/50">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">{e.name}</h4>
                                                <p className="text-sm text-text-warm">{e.role}</p>
                                            </div>
                                            <Tag variant={e.type === "person" ? "academic" : e.type === "organization" ? "private" : "government"}>
                                                {e.type.replace("_", " ")}
                                            </Tag>
                                        </div>
                                        {e.affiliations.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {e.affiliations.map((a, j) => (
                                                    <span key={j} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
                                                        {a}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-3 text-xs">
                                            <DataSource name={e.verified ? "Public records" : "AI-inferred"} verified={e.verified} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ConflictCard>

                        {/* Funding */}
                        <ConflictCard title="Funding & Sponsorship" icon={<DollarSign className="h-6 w-6" />} borderColor="border-l-blue-500" defaultExpanded>
                            <div className="space-y-4">
                                {data.funding.map((f, i) => (
                                    <div key={i} className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-colors hover:outline-blue-primary/50">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h4 className="font-semibold text-foreground">{f.funder}</h4>
                                                    {f.verified && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Verified" />}
                                                </div>
                                                <p className="text-sm text-text-warm">{f.purpose}</p>
                                                <p className="mt-1 text-xs text-text-warm">→ {f.recipient}</p>
                                                <div className="mt-2 flex items-center gap-3">
                                                    {f.amount && <span className="font-semibold text-blue-primary">{f.amount}</span>}
                                                    <Tag variant={f.type === "government" ? "government" : "private"}>{f.type}</Tag>
                                                </div>
                                            </div>
                                        </div>
                                        {f.conflictNote && (
                                            <div className="mt-3 rounded-md bg-amber-50 p-2.5 text-xs text-amber-800">
                                                ⚠️ {f.conflictNote}
                                            </div>
                                        )}
                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 text-text-warm">
                                                <Calendar className="h-3 w-3" /> {f.date}
                                            </span>
                                            <DataSource name="Grants database" verified={f.verified} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ConflictCard>

                        {/* Conflicts */}
                        <ConflictCard title="Conflicts of Interest" icon={<AlertTriangle className="h-6 w-6" />} borderColor="border-l-red-400" defaultExpanded>
                            <div className="space-y-4">
                                {data.conflicts.map((c, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-lg p-4 outline outline-[0.4px] -outline-offset-[0.4px] ${SEVERITY_BG[c.severity]}`}
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <h4 className="font-semibold text-foreground">{c.title}</h4>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${SEVERITY_COLORS[c.severity]}`}>
                                                {c.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/90">{c.description}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {c.entities.map((ent, j) => (
                                                <span key={j} className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-foreground outline outline-[0.4px] outline-gray-border">
                                                    {ent}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-warm">
                                            {c.sources.map((s, j) => (
                                                <DataSource key={j} name={s} verified />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ConflictCard>

                        {/* Assessment */}
                        <ConflictCard title="Assessment & Recommendations" icon={<ClipboardList className="h-6 w-6" />} borderColor="border-l-emerald-500" defaultExpanded>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Summary
                                    </h4>
                                    <p className="leading-relaxed text-foreground/90">{data.assessment.summary}</p>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold text-foreground">Key Findings</h4>
                                    <ul className="space-y-2">
                                        {data.assessment.keyFindings.map((finding, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-foreground/90">
                                                <span className="mt-1 text-amber-500">•</span>
                                                <span>{finding}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border">
                                    <h4 className="mb-2 font-semibold text-foreground">Transparency Notes</h4>
                                    <p className="text-sm leading-relaxed text-foreground/90">{data.assessment.transparencyNotes}</p>
                                </div>

                                <div className="rounded-lg bg-cyan-50 p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-cyan-300">
                                    <h4 className="mb-2 font-semibold text-cyan-700">Recommendation</h4>
                                    <p className="text-sm leading-relaxed text-cyan-800">{data.assessment.recommendation}</p>
                                </div>

                                <div className="border-t border-gray-border pt-4">
                                    <p className="flex items-center gap-2 text-xs text-text-warm">
                                        <ExternalLink className="h-3 w-3" />
                                        All findings linked to original data sources. Verify independently.
                                    </p>
                                </div>
                            </div>
                        </ConflictCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
