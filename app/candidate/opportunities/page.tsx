"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getMatches, getSession } from "@/lib/store";
import { Match } from "@/types";
import { JOBS } from "@/data/jobs";
import Nav from "@/components/Nav";

function TierBadge({ tier }: { tier: "strong" | "close" }) {
  const isStrong = tier === "strong";
  return (
    <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.7rem", borderRadius: "2px", backgroundColor: isStrong ? "rgba(0,104,95,0.1)" : "rgba(144,77,0,0.1)", color: isStrong ? "var(--color-tertiary)" : "var(--color-secondary)", whiteSpace: "nowrap" }}>
      {isStrong ? "Strong Match" : "Close Match"}
    </span>
  );
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session === "employer") { router.replace("/employer"); return; }
    const user = getUser();
    if (!user) { router.replace("/candidate/onboarding"); return; }
    setUserName(user.name.split(" ")[0]);
    setMatches(getMatches().filter((x) => x.tier !== "weak"));
  }, [router]);

  const strong = matches.filter((m) => m.tier === "strong");
  const close = matches.filter((m) => m.tier === "close");

  function MatchCard({ match }: { match: Match }) {
    const job = JOBS.find((j) => j.id === match.job_id);
    if (!job) return null;
    return (
      <div onClick={() => router.push(`/candidate/opportunities/${match.job_id}`)}
        style={{ padding: "2rem 2.5rem", backgroundColor: "var(--color-surface-high)", cursor: "pointer", boxShadow: "0 2px 8px rgba(28,27,27,0.04)", transition: "box-shadow 0.2s ease" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(28,27,27,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(28,27,27,0.04)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <div>
            <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 400, marginBottom: "0.3rem", letterSpacing: "-0.01em" }}>{job.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>{job.company} · {job.location} · {job.type}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <span className="font-display" style={{ fontSize: "2rem", fontWeight: 300, color: match.tier === "strong" ? "var(--color-tertiary)" : "var(--color-secondary)" }}>{match.score}</span>
            <TierBadge tier={match.tier as "strong" | "close"} />
          </div>
        </div>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--color-text-muted)" }}>
          {match.explanation.length > 160 ? match.explanation.slice(0, 160) + "…" : match.explanation}
        </p>
        <div style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "var(--color-primary)", fontWeight: 600 }}>View match details →</div>
      </div>
    );
  }

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#fcf9f8" }}>
      <Nav portal="candidate" rightLabel="My Applications →" rightHref="/candidate/status" />

      <div style={{ marginBottom: "5rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Matched for {userName}</p>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Your opportunities.</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>{matches.length} role{matches.length !== 1 ? "s" : ""} found. Ranked by fit, not by date posted.</p>
      </div>

      {strong.length > 0 && (
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-tertiary)", marginBottom: "1.5rem" }}>
            Strong Matches — {strong.length} role{strong.length !== 1 ? "s" : ""}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {strong.map((m) => <MatchCard key={m.job_id} match={m} />)}
          </div>
        </section>
      )}

      {close.length > 0 && (
        <section>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-secondary)", marginBottom: "1.5rem" }}>
            Close Matches — {close.length} role{close.length !== 1 ? "s" : ""}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {close.map((m) => <MatchCard key={m.job_id} match={m} />)}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>No matches yet.</p>
          <button className="btn-primary" onClick={() => router.push("/candidate/onboarding")}>Rebuild Profile →</button>
        </div>
      )}

      <div style={{ marginTop: "6rem", paddingTop: "2rem", borderTop: "1px solid rgba(28,27,27,0.06)", textAlign: "center" }}>
        <button onClick={() => router.push("/employer")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "inherit", opacity: 0.6 }}>
          Employer View →
        </button>
      </div>
    </main>
  );
}
