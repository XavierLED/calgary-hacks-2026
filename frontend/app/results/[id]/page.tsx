

// TODO: Replace with real API call
import { ResultsClient } from "@/app/components/ResultsClient";
//import { MOCK_RESULT } from "../../lib/mockData";
import { AnalysisResult } from "@/app/lib/types";




async function getResult(id: string): Promise<AnalysisResult> {
    const res = await fetch(
        `http://127.0.0.1:8000/result/${id}`,
        {
            cache: "no-store", // always fetch fresh data
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch result");
    }

    return res.json();
};

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Results({ params }: Props) {
    // TODO: Replace with real data fetchings
    const { id } = await params;          // ✅ unwrap
    const data: AnalysisResult = await getResult(id);

    return <ResultsClient data={data} />;
}
