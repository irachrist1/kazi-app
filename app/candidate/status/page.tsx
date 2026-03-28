"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getMatches, getSession } from "@/lib/store";
import { Match } from "@/types";
import { JOBS } from "@/data/jobs";
import Nav from "@/components/Nav";

const STATUS_LABELS: Record<Match["status"], string> = { new: "Not Applied", applied: "Applied", under_review: "Under Review", interview: "Interview Scheduled" };
const STATUS_COLORS: Record<Match["status"], string> = { new: "var(--color-text-muted)", applied: "var(--color-primary)", under_review: "var(--color-secondary)", interview: "var(--color-tertiary)" };
const STATUS_BG: Record<Match["status"], string> = { new: "rgba(28,27,27,0.05)", applied: "rgba(0,89,187,0.08)", under_review: "rgba(144,77,0,0.08)", interview: "rgba(0,104,95,0.08)" };

export default function StatusPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session === "employer") { router.replace("/employer"); return; }
    const user = getUser();
    if (!user) { router.replace("/candidate/onboarding"); return; }
    setUserName(user.name.split(" ")[0]);
    setMatches(getMatches().filter((x) => x.status !== "new" && x.tier !== "weak"));
  }, [router]);

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#fcf9f8" }}>
      <Nav portal="candidate" backLabel="Back to Matches" backHref="/candidate/opportunities" />

      <div style={{ maxWidth: "640px" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Applications</p>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "4rem" }}>
          {userName ? `${userName}'s` : "Your"} tracker.
        </h1>

        {matches.length === 0 ? (
          <div style={{ padding: "3rem", backgroundColor: "var(--color-surface-low)", textAlign: "center" }}>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>No applications yet.</p>
            <button className="btn-primary" onClick={() => router.push("/candidate/opportunities")}>View Matches →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {matches.map((match) => {
              const job = JOBS.find((j) => j.id === match.job_id);
              if (!job) return null;
              return (
                <div key={match.job_id} style={{ padding: "1.75rem 2rem", backgroundColor: "var(--color-surface-high)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", boxShadow: "0 2px 8px rgba(28,27,27,0.03)", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.25rem" }}>{job.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{job.company} · {job.location}</p>
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.35rem 0.8rem", borderRadius: "2px", color: STATUS_COLORS[match.status], backgroundColor: STATUS_BG[match.status], whiteSpace: "nowrap" }}>
                    {STATUS_LABELS[match.status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
