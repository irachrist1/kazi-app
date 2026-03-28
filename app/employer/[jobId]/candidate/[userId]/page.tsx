"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMatches, getUser, updateMatchStatus, getSession } from "@/lib/store";
import { JOBS } from "@/data/jobs";
import { Match, UserProfile } from "@/types";
import Nav from "@/components/Nav";

export default function CandidateProfilePage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const [match, setMatch] = useState<Match | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const job = JOBS.find((j) => j.id === jobId);

  useEffect(() => {
    const session = getSession();
    if (session === "candidate") { router.replace("/candidate/opportunities"); return; }
    const u = getUser();
    if (!u) return;
    setUser(u);
    const m = getMatches().find((x) => x.job_id === jobId);
    if (m) setMatch(m);
  }, [jobId, router]);

  function scheduleInterview() {
    updateMatchStatus(jobId, "interview");
    setMatch((prev) => (prev ? { ...prev, status: "interview" } : prev));
  }

  if (!user || !match || !job) return null;
  const cp = user.capability_profile;
  const isStrong = match.tier === "strong";
  const isInterview = match.status === "interview";

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      <Nav portal="employer" backLabel="Back to Applicants" backHref={`/employer/${jobId}`} />

      <div className="grid-employer-detail">
        {/* Left */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <span className="font-display" style={{ fontSize: "3rem", fontWeight: 300, lineHeight: 1, color: isStrong ? "#0059bb" : "var(--color-secondary)" }}>{match.score}</span>
            <div>
              <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.25rem 0.6rem", borderRadius: "2px", backgroundColor: isStrong ? "rgba(0,104,95,0.1)" : "rgba(144,77,0,0.1)", color: isStrong ? "var(--color-tertiary)" : "var(--color-secondary)", marginBottom: "0.25rem" }}>
                {isStrong ? "Strong Match" : "Close Match"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>for {job.title}</span>
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "2.5rem" }}>{user.name}</h1>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.75rem" }}>Summary</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, maxWidth: "560px" }}>{cp.experience_summary}</p>
          </div>

          <div style={{ backgroundColor: "#eef1f7", padding: "1.75rem 2rem", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.75rem" }}>Why they fit this role</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.75 }}>{match.explanation}</p>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {cp.structured_skills.map((skill, i) => (
                <span key={i} style={{ fontSize: "0.82rem", padding: "0.35rem 0.8rem", backgroundColor: "#e8ecf4", color: "#1c1b1b", borderRadius: "2px" }}>{skill}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1.25rem" }}>Strengths</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cp.strengths.map((s, i) => (
                <p key={i} style={{ fontSize: "0.95rem", lineHeight: 1.65, paddingLeft: "1rem", borderLeft: "2px solid #0d2b4e" }}>{s}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>Career Directions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {cp.career_directions.map((d, i) => (
                <div key={i} style={{ padding: "0.6rem 1rem", backgroundColor: "#eef1f7", fontSize: "0.9rem" }}>{d}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: action panel */}
        <div className="sticky-panel" style={{ padding: "2.5rem", backgroundColor: "#f9fafd", boxShadow: "0 10px 40px rgba(13,43,78,0.06)" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.75rem" }}>Reviewing for</p>
          <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 300, marginBottom: "0.4rem", lineHeight: 1.2 }}>{job.title}</h3>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2rem" }}>{job.company}</p>

          <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(13,43,78,0.1)" }}>
            {isInterview ? (
              <div style={{ padding: "1rem", backgroundColor: "rgba(0,104,95,0.08)", color: "var(--color-tertiary)", fontWeight: 600, fontSize: "0.9rem", textAlign: "center", borderRadius: "2px", marginBottom: "1rem" }}>✓ Interview Scheduled</div>
            ) : (
              <button className="btn-primary" onClick={scheduleInterview} style={{ width: "100%", justifyContent: "center", marginBottom: "1rem" }}>Schedule Interview →</button>
            )}
            <button className="btn-secondary" onClick={() => router.push(`/employer/${jobId}`)} style={{ width: "100%", justifyContent: "center" }}>← Back to Applicants</button>
          </div>

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(13,43,78,0.1)", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>
            Match score: {match.score}/100<br />
            {job.structured_requirements.experience_level} experience required
          </div>
        </div>
      </div>
    </main>
  );
}
