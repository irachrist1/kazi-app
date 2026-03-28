"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getSession } from "@/lib/store";
import { UserProfile } from "@/types";
import Nav from "@/components/Nav";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session === "employer") { router.replace("/employer"); return; }
    const u = getUser();
    if (!u) { router.replace("/candidate/onboarding"); return; }
    setUser(u);
  }, [router]);

  if (!user) return null;
  const cp = user.capability_profile;

  return (
    <main className="page-pad" style={{ minHeight: "100vh", backgroundColor: "#fcf9f8" }}>
      <Nav portal="candidate" rightLabel="My Applications" rightHref="/candidate/status" />

      <div style={{ marginBottom: "5rem", maxWidth: "600px" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          AI-generated profile
        </p>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
          {user.name}
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text-muted)", maxWidth: "520px" }}>
          {cp.experience_summary}
        </p>
      </div>

      <div className="grid-3col">
        <section>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Skills</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {cp.structured_skills.map((skill, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-primary)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem" }}>{skill}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Strengths</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {cp.strengths.map((s, i) => (
              <p key={i} style={{ fontSize: "0.95rem", lineHeight: 1.6, paddingLeft: "1rem", borderLeft: "2px solid var(--color-tertiary)" }}>{s}</p>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Career Directions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {cp.career_directions.map((d, i) => (
              <div key={i} style={{ padding: "0.6rem 1rem", backgroundColor: "var(--color-surface-low)", fontSize: "0.9rem" }}>{d}</div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ paddingTop: "3rem", borderTop: "1px solid rgba(28,27,27,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>Your profile is live. Matching is running in the background.</p>
        <button className="btn-primary" onClick={() => router.push("/candidate/opportunities")} style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
          See My Matches →
        </button>
      </div>
    </main>
  );
}
