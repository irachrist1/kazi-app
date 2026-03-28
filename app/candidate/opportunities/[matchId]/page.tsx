"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUser, getMatches, updateMatchStatus, getSession } from "@/lib/store";
import { Match } from "@/types";
import { JOBS } from "@/data/jobs";
import Nav from "@/components/Nav";

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.matchId as string;
  const [match, setMatch] = useState<Match | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session === "employer") { router.replace("/employer"); return; }
    const user = getUser();
    if (!user) { router.replace("/candidate/onboarding"); return; }
    const matches = getMatches();
    const m = matches.find((x) => x.job_id === jobId);
    if (!m) { router.replace("/candidate/opportunities"); return; }
    setMatch(m);
    if (m.status !== "new") setApplied(true);
  }, [jobId, router]);

  const job = JOBS.find((j) => j.id === jobId);
  if (!match || !job) return null;

  function handleApply() {
    if (applied) { router.push("/candidate/status"); return; }
    setApplying(true);
    setTimeout(() => {
      const updated = updateMatchStatus(jobId, "applied");
      setMatch(updated.find((m) => m.job_id === jobId) || match);
      setApplied(true);
      setApplying(false);
    }, 1200);
  }

  const isStrong = match.tier === "strong";
  const tierColor = isStrong ? "var(--color-tertiary)" : "var(--color-secondary)";

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#fcf9f8" }}>
      <Nav portal="candidate" backLabel="Back" backHref="/candidate/opportunities" rightLabel="My Applications →" rightHref="/candidate/status" />

      <div className="grid-detail">
        {/* Left */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.7rem", borderRadius: "2px", backgroundColor: isStrong ? "rgba(0,104,95,0.1)" : "rgba(144,77,0,0.1)", color: tierColor }}>
              {isStrong ? "Strong Match" : "Close Match"}
            </span>
            <span className="font-display" style={{ fontSize: "1.4rem", fontWeight: 300, color: tierColor }}>{match.score}/100</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{job.title}</h1>
          <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "3.5rem" }}>{job.company} · {job.location} · {job.type}</p>

          <div style={{ backgroundColor: "var(--color-surface-low)", padding: "2rem", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Why this fits you</p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>{match.explanation}</p>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Role Overview</h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>{job.structured_requirements.role_summary}</p>
          </div>

          <div>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>What they need</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {job.structured_requirements.required_skills.map((s, i) => (
                <span key={i} style={{ fontSize: "0.82rem", padding: "0.3rem 0.8rem", backgroundColor: "var(--color-surface-low)" }}>{s}</span>
              ))}
              {job.structured_requirements.preferred_skills.map((s, i) => (
                <span key={`p${i}`} style={{ fontSize: "0.82rem", padding: "0.3rem 0.8rem", border: "1px solid rgba(28,27,27,0.15)", color: "var(--color-text-muted)" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: apply panel */}
        <div className="sticky-panel" style={{ padding: "2.5rem", backgroundColor: "var(--color-surface-high)", boxShadow: "0 10px 40px rgba(28,27,27,0.04), 0 20px 80px rgba(28,27,27,0.06)" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Apply for this role</p>
          <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "1.5rem", lineHeight: 1.2 }}>{job.title}</h3>

          {applied ? (
            <div>
              <div style={{ padding: "1rem", backgroundColor: "rgba(0,89,187,0.06)", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--color-primary)", fontWeight: 600 }}>✓ Application sent</div>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Your structured profile has been sent to {job.company}. Their AI agent is reviewing it now.</p>
              <button className="btn-secondary" onClick={() => router.push("/candidate/status")} style={{ width: "100%" }}>View Status →</button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.65, marginBottom: "2rem" }}>No CV required. Your AI-built profile is sent directly. One click.</p>
              <button className="btn-primary" onClick={handleApply} disabled={applying} style={{ width: "100%", justifyContent: "center" }}>
                {applying ? "Sending profile…" : "Apply Now →"}
              </button>
            </div>
          )}

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(28,27,27,0.08)", fontSize: "0.78rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            Match score: {match.score}/100 · {job.structured_requirements.experience_level} experience
          </div>
        </div>
      </div>
    </main>
  );
}
