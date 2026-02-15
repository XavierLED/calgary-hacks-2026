// ─── Types for analysis results ────────────────────────────────────
// These types define the shape of data returned by the backend.
// To integrate with a real API, fetch data matching these types and
// pass it to the Results page component.

export type SourceType = "paper" | "video" | "news" | "article" | "other";
export type RiskLevel = "low" | "moderate" | "high";
export type EntityType = "person" | "organization" | "government" | "funding_body";
export type ConflictSeverity = "low" | "moderate" | "high";

export interface SourceInfo {
    title: string;
    url: string;
    type: SourceType;
    authors: string[];
    publisher: string;
    publishedDate: string;
    summary: string;
}

export interface Entity {
    name: string;
    type: EntityType;
    role: string;
    affiliations: string[];
    verified: boolean;
}

export interface FundingConnection {
    funder: string;
    recipient: string;
    amount?: string;
    purpose: string;
    type: "government" | "corporate" | "nonprofit" | "private";
    date: string;
    verified: boolean;
    conflictNote?: string;
}

export interface ConflictOfInterest {
    title: string;
    description: string;
    severity: ConflictSeverity;
    entities: string[];
    sources: string[];
}

export interface Assessment {
    summary: string;
    keyFindings: string[];
    transparencyNotes: string;
    recommendation: string;
}

export interface AnalysisResult {
    source: SourceInfo;
    score: number;
    riskLevel: RiskLevel;
    analyzedAt: string;
    entities: Entity[];
    funding: FundingConnection[];
    conflicts: ConflictOfInterest[];
    assessment: Assessment;
}
