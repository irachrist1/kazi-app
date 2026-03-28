"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/store";

interface NavProps {
  portal: "candidate" | "employer";
  backLabel?: string;
  backHref?: string;
  rightLabel?: string;
  rightHref?: string;
}

const CANDIDATE_BRAND = "#0059bb";
const EMPLOYER_BRAND = "#0d2b4e";

export default function Nav({
  portal,
  backLabel,
  backHref,
  rightLabel,
  rightHref,
}: NavProps) {
  const router = useRouter();
  const brandColor = portal === "candidate" ? CANDIDATE_BRAND : EMPLOYER_BRAND;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "4rem",
      }}
    >
      {/* Left: back or wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {backLabel && backHref ? (
          <button
            onClick={() => router.push(backHref)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              color: "var(--color-text-muted)",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            ← {backLabel}
          </button>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontWeight: 400,
              fontSize: "1rem",
              color: "#1c1b1b",
            }}
          >
            Kazi{" "}
            {portal === "employer" && (
              <span style={{ color: "var(--color-text-muted)", fontWeight: 300, fontSize: "0.9rem" }}>
                for Employers
              </span>
            )}
          </span>
        )}
      </div>

      {/* Right: secondary nav + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
        {rightLabel && rightHref && (
          <button
            onClick={() => router.push(rightHref)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              color: "var(--color-text-muted)",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            {rightLabel}
          </button>
        )}
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.78rem",
            color: brandColor,
            fontFamily: "inherit",
            fontWeight: 600,
            letterSpacing: "0.04em",
            opacity: 0.75,
            padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.75"; }}
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
