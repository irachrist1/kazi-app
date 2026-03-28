import { anthropic } from "@/lib/anthropic";
import { CapabilityProfile, StructuredRequirements, Match } from "@/types";

export async function scoreMatch(
  userId: string,
  jobId: string,
  profile: CapabilityProfile,
  requirements: StructuredRequirements
): Promise<{ score: number; tier: Match["tier"]; explanation: string }> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: `You are a rigorous talent matching engine.
Score how well a candidate's capability profile matches a job's requirements.
Be honest. Do not inflate scores. Penalise missing required skills.
Return ONLY valid JSON — no prose, no markdown:
{
  "score": <number 0-100>,
  "tier": <"strong" | "close" | "weak">,
  "explanation": "<2-3 sentences in plain language explaining WHY this job fits this person specifically>"
}
Scoring guide: strong = 70+, close = 45-69, weak = below 45.`,
      messages: [
        {
          role: "user",
          content: `CANDIDATE PROFILE:
Skills: ${profile.structured_skills.join(", ")}
Strengths: ${profile.strengths.join("; ")}
Career directions: ${profile.career_directions.join(", ")}
Summary: ${profile.experience_summary}

JOB REQUIREMENTS:
Role: ${requirements.role_summary}
Required skills: ${requirements.required_skills.join(", ")}
Preferred skills: ${requirements.preferred_skills.join(", ")}
Experience level: ${requirements.experience_level}

Score this match now.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);
    return {
      score: parsed.score,
      tier: parsed.tier,
      explanation: parsed.explanation,
    };
  } catch (err) {
    console.error(`matching_service failed for job ${jobId}, using mock:`, err);
    // Return a mock based on simple keyword overlap
    const skillText = profile.structured_skills
      .join(" ")
      .toLowerCase();
    const reqText = requirements.required_skills.join(" ").toLowerCase();
    const overlap = requirements.required_skills.filter((s) =>
      skillText.includes(s.toLowerCase().split(" ")[0])
    ).length;
    const score = Math.min(
      85,
      40 + (overlap / requirements.required_skills.length) * 50
    );
    const tier: Match["tier"] =
      score >= 70 ? "strong" : score >= 45 ? "close" : "weak";
    return {
      score: Math.round(score),
      tier,
      explanation: `Your background aligns with the core demands of this role. Your skills in ${profile.structured_skills
        .slice(0, 2)
        .join(" and ")} are directly relevant to what ${requirements.role_summary.toLowerCase()}.`,
    };
  }
}
