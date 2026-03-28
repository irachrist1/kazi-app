"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveUser, saveMatches, getSession, saveSession } from "@/lib/store";
import { UserProfile, Match } from "@/types";
import Nav from "@/components/Nav";

const MOCK_PROFILE = {
  structured_skills: [
    "Community Engagement",
    "Program Coordination",
    "Stakeholder Communication",
    "Youth Facilitation",
    "Data Collection & Reporting",
    "Problem Solving",
  ],
  strengths: [
    "Translating complex ideas into clear, actionable steps for diverse audiences",
    "Building trust and rapport with community members quickly",
    "Delivering results under pressure in resource-constrained environments",
  ],
  career_directions: [
    "Community Development & Programs",
    "Training & Capacity Building",
    "Operations & Project Management",
  ],
  experience_summary:
    "A driven professional with hands-on experience working across community and organisational settings in Rwanda. Demonstrates strong interpersonal skills, a commitment to social impact, and a track record of delivering results in dynamic environments.",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", background: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) saveSession("candidate");
  }, []);

  const isValid = form.name.trim() && form.background.trim() && form.goal.trim();

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const profileRes = await fetch("/api/build-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, background: form.background, goal: form.goal }),
      });
      if (!profileRes.ok) throw new Error("Profile build failed");
      const capabilityProfile = await profileRes.json();

      const userId = `user_${Date.now()}`;
      const userProfile: UserProfile = {
        id: userId,
        name: form.name,
        email: "",
        raw_input: form,
        capability_profile: capabilityProfile,
      };
      saveUser(userProfile);

      const matchRes = await fetch("/api/run-matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profile: capabilityProfile }),
      });
      if (!matchRes.ok) throw new Error("Matching failed");
      const matches: Match[] = await matchRes.json();
      saveMatches(matches);

      router.push("/candidate/profile");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Use the sample data option below.");
      setLoading(false);
    }
  }

  async function handleMockDemo() {
    setLoading(true);
    const name = form.name.trim() || "Demo User";
    const userId = `user_${Date.now()}`;
    const userProfile: UserProfile = {
      id: userId,
      name,
      email: "",
      raw_input: {
        name,
        background: form.background || "Community organiser and youth trainer in Kigali",
        goal: form.goal || "Work in development programs or operations",
      },
      capability_profile: MOCK_PROFILE,
    };
    saveUser(userProfile);
    try {
      const matchRes = await fetch("/api/run-matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profile: MOCK_PROFILE }),
      });
      const matches: Match[] = matchRes.ok ? await matchRes.json() : [];
      saveMatches(matches);
    } catch { /* silent */ }
    router.push("/candidate/profile");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#fcf9f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <Nav portal="candidate" />

        <h1
          className="font-display"
          style={{
            fontSize: "2.5rem",
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Tell us about yourself.
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "3.5rem", fontSize: "0.95rem" }}>
          No CV needed. Three questions. That&rsquo;s it.
        </p>

        {/* Name */}
        <div style={{ marginBottom: "2.5rem" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
            Your name
          </label>
          <input className="input-field" type="text" placeholder="e.g. Amina Uwase"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        {/* Background */}
        <div style={{ marginBottom: "2.5rem" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
            What have you done?
          </label>
          <textarea className="input-field"
            placeholder="e.g. Ran a youth programme in Musanze for 3 years. Managed volunteers and organised community events."
            value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })}
            style={{ minHeight: "90px" }} />
        </div>

        {/* Goal */}
        <div style={{ marginBottom: "3rem" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
            What do you want to do next?
          </label>
          <textarea className="input-field"
            placeholder="e.g. I want to work in programme coordination or training and grow into a leadership role."
            value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
            style={{ minHeight: "80px" }} />
        </div>

        {error && <p style={{ color: "#c0392b", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={!isValid || loading}
            style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
            {loading ? "Building your profile…" : "Build My Profile →"}
          </button>
          <button className="btn-secondary" onClick={handleMockDemo} disabled={loading}>
            Use Sample Data
          </button>
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
          AI will extract your skills, strengths, and career directions automatically.
        </p>
      </div>
    </main>
  );
}
