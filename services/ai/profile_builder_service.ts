import { anthropic } from "@/lib/anthropic";
import { RawInput, CapabilityProfile } from "@/types";

const MOCK_PROFILE: CapabilityProfile = {
  structured_skills: [
    "Community Engagement",
    "Program Coordination",
    "Communication & Facilitation",
    "Data Analysis",
    "Stakeholder Management",
    "Problem Solving",
  ],
  strengths: [
    "Translating complex ideas into clear, actionable steps",
    "Building trust with diverse groups quickly",
    "Delivering results in resource-constrained environments",
  ],
  career_directions: [
    "Community Development & Programs",
    "Training & Capacity Building",
    "Operations & Project Management",
  ],
  experience_summary:
    "A driven professional with hands-on experience working across community and organisational settings. Demonstrates strong interpersonal skills and a track record of delivering impact in dynamic environments.",
};

export async function buildProfile(
  raw: RawInput
): Promise<CapabilityProfile> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are a professional career coach and talent analyst.
Your job is to read informal background information and extract a structured capability profile.
You MUST return ONLY valid JSON with this exact structure — no prose, no markdown, no explanation:
{
  "structured_skills": ["skill1", "skill2", ...],
  "strengths": ["strength1", "strength2", "strength3"],
  "career_directions": ["direction1", "direction2", "direction3"],
  "experience_summary": "2-3 sentence professional summary"
}
Elevate informal experience into professional language. Be specific. Do not pad with generic filler.`,
      messages: [
        {
          role: "user",
          content: `Name: ${raw.name}
Background: ${raw.background}
Goal: ${raw.goal}

Build their capability profile now.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);
    return parsed as CapabilityProfile;
  } catch (err) {
    console.error("profile_builder_service failed, using mock:", err);
    return MOCK_PROFILE;
  }
}
