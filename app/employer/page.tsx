"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMatches, getSession, saveSession } from "@/lib/store";
import { JOBS } from "@/data/jobs";
import { Match } from "@/types";
import Nav from "@/components/Nav";

interface JobSummary {
  jobId: string; title: string; company: string; location: string;
  applicantCount: number; topScore: number; topTier: "strong" | "close";
}

export default function EmployerPage() {
  const router = useRouter();
  const [jobSummaries, setJobSummaries] = useState<JobSummary[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) saveSession("employer");
    const matches: Match[] = getMatches();
    const applied = matches.filter((m) => ["applied","under_review","interview"].includes(m.status));
    const grouped: Record<string, Match[]> = {};
    for (const m of applied) { if (!grouped[m.job_id]) grouped[m.job_id] = []; grouped[m.job_id].push(m); }
    const summaries: JobSummary[] = Object.entries(grouped).map(([jobId, jobMatches]) => {
      const job = JOBS.find((j) => j.id === jobId);
      const top = [...jobMatches].sort((a, b) => b.score - a.score)[0];
      return { jobId, title: job?.title ?? "Unknown", company: job?.company ?? "", location: job?.location ?? "", applicantCount: jobMatches.length, topScore: top.score, topTier: top.tier as "strong" | "close" };
    });
    setJobSummaries(summaries.sort((a, b) => b.topScore - a.topScore));
  }, []);

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      <Nav portal="employer" />

      <div style={{ marginBottom: "5rem", maxWidth: "560px" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: "1rem" }}>Employer Portal</p>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem", color: "#1c1b1b" }}>Meet your candidates.</h1>
        <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.65 }}>Only the people the system matched. Ranked by fit.</p>
      </div>

      {jobSummaries.length === 0 ? (
        <div style={{ padding: "4rem", backgroundColor: "#eef1f7", maxWidth: "480px", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", color: "#6b7280", marginBottom: "0.5rem" }}>No applications yet.</p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Applications appear once candidates apply.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {jobSummaries.map((job) => {
            const isStrong = job.topTier === "strong";
            return (
              <div key={job.jobId} onClick={() => router.push(`/employer/${job.jobId}`)}
                style={{ padding: "2rem 2.5rem", backgroundColor: "#f9fafd", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", boxShadow: "0 2px 8px rgba(13,43,78,0.05)", transition: "box-shadow 0.2s ease", flexWrap: "wrap" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(13,43,78,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(13,43,78,0.05)"; }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h3 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "0.3rem" }}>{job.title}</h3>
                  <p style={{ fontSize: "0.88rem", color: "#6b7280" }}>{job.company} · {job.location}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.2rem" }}>Applicants</p>
                    <p className="font-display" style={{ fontSize: "1.8rem", fontWeight: 300, lineHeight: 1 }}>{job.applicantCount}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.2rem" }}>Top Score</p>
                    <p className="font-display" style={{ fontSize: "1.8rem", fontWeight: 300, lineHeight: 1, color: isStrong ? "var(--color-tertiary)" : "var(--color-secondary)" }}>{job.topScore}</p>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.7rem", borderRadius: "2px", backgroundColor: isStrong ? "rgba(0,104,95,0.1)" : "rgba(144,77,0,0.1)", color: isStrong ? "var(--color-tertiary)" : "var(--color-secondary)", whiteSpace: "nowrap" }}>
                    {isStrong ? "Strong" : "Close"}
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "#0d2b4e", fontWeight: 600 }}>View →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
