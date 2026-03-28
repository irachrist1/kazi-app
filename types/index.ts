export interface RawInput {
  name: string;
  background: string;
  goal: string;
}

export interface CapabilityProfile {
  structured_skills: string[];
  strengths: string[];
  career_directions: string[];
  experience_summary: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  raw_input: RawInput;
  capability_profile: CapabilityProfile;
}

export interface StructuredRequirements {
  required_skills: string[];
  preferred_skills: string[];
  experience_level: string;
  role_summary: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  raw_description: string;
  structured_requirements: StructuredRequirements;
}

export type MatchTier = "strong" | "close" | "weak";
export type MatchStatus = "new" | "applied" | "under_review" | "interview";

export interface Match {
  user_id: string;
  job_id: string;
  score: number;
  tier: MatchTier;
  explanation: string;
  status: MatchStatus;
}
