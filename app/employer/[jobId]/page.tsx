"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMatches, getUser, updateMatchStatus, getSession } from "@/lib/store";
import { JOBS } from "@/data/jobs";
import { Match, UserProfile } from "@/types";
import Nav from "@/components/Nav";

interface CandidateEntry { match: Match; user: UserProfile; }

export default function EmployerJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const [candidates, setCandidates] = useState<CandidateEntry[]>([]);
  const job = JOBS.find((j) => j.id === jobId);

  useEffect(() => {
    const session = getSession();
    if (session === "candidate") { router.replace("/candidate/opportunities"); return; }
    const matches = getMatches();
    const user = getUser();
    if (!user) return;
    const relevant = matches.filter((m) => m.job_id === jobId && m.tier !== "weak" && ["applied","under_review","interview"].includes(m.status));
    setCandidates(relevant.map((m) => ({ match: m, user })).sort((a, b) => b.match.score - a.match.score));
  }, [jobId, router]);

  function moveToInterview(userId: string) {
    updateMatchStatus(jobId, "interview");
    setCandidates((prev) => prev.map((c) => c.user.id === userId ? { ...c, match: { ...c.match, status: "interview" } } : c));
  }

  if (!job) return null;

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      <Nav portal="employer" backLabel="All Roles" backHref="/employer" />

      <div style={{ marginBottom: "5rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>{job.company} · {job.location}</p>
        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.75rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>{job.title}</h1>
        <p style={{ fontSize: "0.95rem", color: "#6b7280" }}>{candidates.length === 0 ? "No applicants yet." : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} — sorted by fit`}</p>
      </div>

      {candidates.length === 0 ? (
        <div style={{ padding: "4rem", backgroundColor: "#eef1f7", maxWidth: "480px", textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>No applications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {candidates.map(({ match, user }) => {
            const isStrong = match.tier === "strong";
            const isInterview = match.status === "interview";
            const topSkills = user.capability_profile.structured_skills.slice(0, 3);
            return (
              <div key={user.id} style={{ backgroundColor: "#eef1f7", padding: "2rem 2.5rem", boxShadow: "0 2px 12px rgba(13,43,78,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                      <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, letterSpacing: "-0.01em" }}>{user.name}</h2>
                      <span className="font-display" style={{ fontSize: "2rem", fontWeight: 300, lineHeight: 1, color: isStrong ? "#0059bb" : "var(--color-secondary)" }}>{match.score}</span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.25rem 0.6rem", borderRadius: "2px", backgroundColor: isStrong ? "rgba(0,104,95,0.1)" : "rgba(144,77,0,0.1)", color: isStrong ? "var(--color-tertiary)" : "var(--color-secondary)", whiteSpace: "nowrap" }}>
                        {isStrong ? "Strong Match" : "Close Match"}
                      </span>
                      {isInterview && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.25rem 0.6rem", borderRadius: "2px", backgroundColor: "rgba(0,104,95,0.1)", color: "var(--color-tertiary)", whiteSpace: "nowrap" }}>
                          ✓ Interview Scheduled
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                      {topSkills.map((skill, i) => (
                        <span key={i} style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem", backgroundColor: "#e8ecf4", color: "#1c1b1b", borderRadius: "2px" }}>{skill}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "#5a5755" }}>{match.explanation}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "180px" }}>
                    {!isInterview ? (
                      <button className="btn-primary" onClick={() => moveToInterview(user.id)} style={{ justifyContent: "center", whiteSpace: "nowrap" }}>Move to Interview →</button>
                    ) : (
                      <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(0,104,95,0.08)", color: "var(--color-tertiary)", fontSize: "0.82rem", fontWeight: 600, textAlign: "center", borderRadius: "2px" }}>✓ Interview Scheduled</div>
                    )}
                    <button className="btn-secondary" onClick={() => router.push(`/employer/${jobId}/candidate/${user.id}`)} style={{ justifyContent: "center", whiteSpace: "nowrap" }}>View Full Profile</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
