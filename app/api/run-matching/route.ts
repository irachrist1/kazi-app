import { NextRequest, NextResponse } from "next/server";
import { scoreMatch } from "@/services/ai/matching_service";
import { JOBS } from "@/data/jobs";
import { CapabilityProfile, Match } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId, profile }: { userId: string; profile: CapabilityProfile } =
      await req.json();

    const matchPromises = JOBS.map(async (job) => {
      const result = await scoreMatch(
        userId,
        job.id,
        profile,
        job.structured_requirements
      );
      const match: Match = {
        user_id: userId,
        job_id: job.id,
        score: result.score,
        tier: result.tier,
        explanation: result.explanation,
        status: "new",
      };
      return match;
    });

    const allMatches = await Promise.all(matchPromises);
    const visible = allMatches.filter((m) => m.tier !== "weak");
    const sorted = visible.sort((a, b) => b.score - a.score);

    return NextResponse.json(sorted);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
