"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, saveSession, getUser } from "@/lib/store";
import KaziAnimation from "@/components/KaziAnimation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session === "candidate") {
      const user = getUser();
      router.replace(user?.capability_profile ? "/candidate/opportunities" : "/candidate/onboarding");
    } else if (session === "employer") {
      router.replace("/employer");
    }
  }, [router]);

  function enter(type: "candidate" | "employer") {
    saveSession(type);
    router.push(type === "candidate" ? "/candidate/onboarding" : "/employer");
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fcf9f8" }}>
      <div className="landing-grid">

        {/* Left: hero */}
        <div className="hero-pad">
          <div style={{ marginBottom: "4rem", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.14em", color: "#0059bb", textTransform: "uppercase" }}>
            Kazi
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 2.8vw, 3rem)", fontWeight: 300, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#1c1b1b", marginBottom: "1.5rem" }}>
            Your career shouldn&rsquo;t depend on how good you are at filling out forms.
          </h1>

          <p style={{ fontSize: "1rem", color: "#5a5755", lineHeight: 1.7, marginBottom: "3rem" }}>
            It should depend on what you&rsquo;re actually capable of. That&rsquo;s what Kazi does.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => enter("candidate")} style={{ fontSize: "0.9rem", padding: "0.85rem 1.75rem" }}>
              I&rsquo;m looking for work →
            </button>
            <button className="btn-secondary" onClick={() => enter("employer")} style={{ fontSize: "0.9rem", padding: "0.85rem 1.75rem" }}>
              I&rsquo;m hiring
            </button>
          </div>

          <p style={{ marginTop: "3.5rem", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b3b0af" }}>
            See how it works →
          </p>
        </div>

        {/* Right: animation */}
        <div style={{ padding: "3rem 3rem 3rem 0", display: "flex", alignItems: "center" }}>
          <KaziAnimation />
        </div>

      </div>
    </main>
  );
}
