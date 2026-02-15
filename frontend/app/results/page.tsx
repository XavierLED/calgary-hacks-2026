"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    DollarSign,
    Users,
    FileText,
    Download,
    Share2,
    AlertCircle,
    ExternalLink,
    TrendingUp,
    Calendar,
} from "lucide-react";
import { ScoreGauge } from "../components/ScoreGauge";
import { RiskBadge } from "../components/RiskBadge";
import { Tag } from "../components/Tag";
import { ConflictCard } from "../components/ConflictCard";
import { DataSource } from "../components/DataSource";

const analysisData = {
    subject: "Dr. Sarah Johnson",
    type: "individual",
    score: 68,
    riskLevel: "moderate" as const,
    lastUpdated: "2026-02-14",

    institutionalAffiliations: [
        { name: "MIT Computer Science Department", role: "Professor", type: "academic", since: "2018" },
        { name: "OpenAI", role: "Advisory Board Member", type: "private", since: "2022" },
        { name: "National AI Safety Institute", role: "Research Fellow", type: "government", since: "2023" },
        { name: "AI Ethics Foundation", role: "Board Member", type: "academic", since: "2020" },
    ],

    fundingSources: [
        { source: "National Science Foundation", amount: "$2,000,000", purpose: "AI Safety Research Grant", type: "government", date: "2024", verified: true },
        { source: "Google Research", amount: "$500,000", purpose: "Machine Learning Infrastructure", type: "private", date: "2023", verified: true },
        { source: "Microsoft Research", amount: "$350,000", purpose: "AI Alignment Study", type: "private", date: "2023", verified: true },
        { source: "OpenPhilanthropy", amount: "$150,000", purpose: "General Operating Support", type: "private", date: "2024", verified: true },
    ],

    politicalConnections: [
        { type: "Campaign Contribution", recipient: "Tech Innovation PAC", amount: "$3,000", date: "2023", category: "political" },
        { type: "Congressional Testimony", event: "Senate Committee on AI Regulation", date: "March 2024", category: "political" },
        { type: "Policy Advisory", organization: "White House Office of Science and Technology", role: "Informal Consultant", date: "2023-Present", category: "government" },
    ],

    assessment: {
        summary: "Dr. Johnson has a moderate level of potential conflicts of interest. While her academic position provides independence, her advisory role at OpenAI while conducting AI safety research creates potential conflicts, particularly given the substantial corporate funding from major tech companies.",
        keyIssues: [
            "OpenAI advisory board role while researching AI safety could influence research objectivity",
            "Significant funding from companies (Google, Microsoft) that compete in AI space",
            "Congressional testimony while receiving tech industry funding may affect policy recommendations",
        ],
        disclosureStatus: "Most financial relationships are publicly disclosed through university and government filings. OpenAI advisory role disclosed on personal website.",
        fieldComparison: "Conflicts are typical for senior AI researchers. Industry collaboration is common but usually disclosed.",
    },
};

export default function Results() {
    return (
        <div className="relative min-h-screen bg-background">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] select-none opacity-20">
                <Image src="/assets/node_graph.svg" alt="" fill className="object-contain object-right-top" priority aria-hidden="true" />
            </div>

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
                    {/* Left sidebar */}
                    <div className="space-y-6">
                        <motion.div
                            className="rounded-xl bg-white p-8 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-6">
                                <h2 className="font-heading text-2xl font-bold text-foreground">{analysisData.subject}</h2>
                                <div className="mt-2 flex items-center gap-2 text-sm text-text-warm">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated {analysisData.lastUpdated}</span>
                                </div>
                            </div>

                            <div className="mb-6 flex justify-center">
                                <ScoreGauge score={analysisData.score} size={220} />
                            </div>

                            <div className="mb-6 flex justify-center">
                                <RiskBadge level={analysisData.riskLevel} />
                            </div>

                            <div className="space-y-3 border-t border-gray-border pt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-warm">Affiliations</span>
                                    <span className="font-semibold text-foreground">{analysisData.institutionalAffiliations.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-warm">Funding Sources</span>
                                    <span className="font-semibold text-foreground">{analysisData.fundingSources.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-warm">Political Connections</span>
                                    <span className="font-semibold text-foreground">{analysisData.politicalConnections.length}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Disclosure notice */}
                        <motion.div
                            className="rounded-lg bg-amber-50 p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-amber-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Transparency Note</p>
                                    <p className="mt-1 text-xs text-amber-800">
                                        This analysis uses publicly available data. Verify independently before making decisions.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right panel */}
                    <div className="space-y-6">
                        {/* Institutional Affiliations */}
                        <ConflictCard title="Institutional Affiliations" icon={<Building2 className="h-6 w-6" />} borderColor="border-l-cyan-500" defaultExpanded>
                            <div className="space-y-4">
                                {analysisData.institutionalAffiliations.map((a, i) => (
                                    <div key={i} className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-colors hover:outline-blue-primary/50">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-foreground">{a.name}</h4>
                                                <p className="text-sm text-text-warm">{a.role}</p>
                                            </div>
                                            <Tag variant={a.type as "academic" | "private" | "government"}>{a.type}</Tag>
                                        </div>
                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 text-text-warm">
                                                <Calendar className="h-3 w-3" /> Since {a.since}
                                            </span>
                                            <DataSource name="LinkedIn" verified />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ConflictCard>

                        {/* Funding Sources */}
                        <ConflictCard title="Funding Sources" icon={<DollarSign className="h-6 w-6" />} borderColor="border-l-blue-500" defaultExpanded>
                            <div className="space-y-4">
                                {analysisData.fundingSources.map((f, i) => (
                                    <div key={i} className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-colors hover:outline-blue-primary/50">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h4 className="font-semibold text-foreground">{f.source}</h4>
                                                    {f.verified && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Verified" />}
                                                </div>
                                                <p className="mb-1 text-sm text-text-warm">{f.purpose}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-blue-primary">{f.amount}</span>
                                                    <Tag variant={f.type as "government" | "private"}>{f.type}</Tag>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 text-text-warm">
                                                <Calendar className="h-3 w-3" /> {f.date}
                                            </span>
                                            <DataSource name="NSF Database" verified />
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t border-gray-border pt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-warm">Total Disclosed Funding</span>
                                        <span className="font-heading text-lg font-bold text-foreground">$3,000,000+</span>
                                    </div>
                                </div>
                            </div>
                        </ConflictCard>

                        {/* Political Connections */}
                        <ConflictCard title="Political Connections" icon={<Users className="h-6 w-6" />} borderColor="border-l-purple-500" defaultExpanded>
                            <div className="space-y-4">
                                {analysisData.politicalConnections.map((c, i) => (
                                    <div key={i} className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border transition-colors hover:outline-blue-primary/50">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <span className="text-xs font-semibold uppercase tracking-wider text-purple-500">{c.type}</span>
                                                <h4 className="mt-1 font-semibold text-foreground">
                                                    {c.recipient || c.event || c.organization}
                                                </h4>
                                                {"role" in c && c.role && <p className="text-sm text-text-warm">{c.role}</p>}
                                                {"amount" in c && c.amount && <p className="mt-1 font-semibold text-blue-primary">{c.amount}</p>}
                                            </div>
                                            <Tag variant={c.category as "political" | "government"}>{c.category}</Tag>
                                        </div>
                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 text-text-warm">
                                                <Calendar className="h-3 w-3" /> {c.date}
                                            </span>
                                            <DataSource name="OpenSecrets" verified />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ConflictCard>

                        {/* Assessment */}
                        <ConflictCard title="Assessment & Analysis" icon={<FileText className="h-6 w-6" />} borderColor="border-l-emerald-500" defaultExpanded>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Summary
                                    </h4>
                                    <p className="leading-relaxed text-foreground/90">{analysisData.assessment.summary}</p>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold text-foreground">Key Issues Identified</h4>
                                    <ul className="space-y-2">
                                        {analysisData.assessment.keyIssues.map((issue, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-foreground/90">
                                                <span className="mt-1 text-amber-500">•</span>
                                                <span>{issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-lg bg-background p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-gray-border">
                                    <h4 className="mb-2 font-semibold text-foreground">Disclosure Status</h4>
                                    <p className="text-sm leading-relaxed text-foreground/90">{analysisData.assessment.disclosureStatus}</p>
                                </div>

                                <div className="rounded-lg bg-cyan-50 p-4 outline outline-[0.4px] -outline-offset-[0.4px] outline-cyan-300">
                                    <h4 className="mb-2 font-semibold text-cyan-700">Compared to Field Norms</h4>
                                    <p className="text-sm leading-relaxed text-cyan-800">{analysisData.assessment.fieldComparison}</p>
                                </div>

                                <div className="border-t border-gray-border pt-4">
                                    <p className="flex items-center gap-2 text-xs text-text-warm">
                                        <ExternalLink className="h-3 w-3" />
                                        All findings linked to original data sources. Click to verify independently.
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
