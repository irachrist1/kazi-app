"use client";

import { UserProfile, Match } from "@/types";

const USER_KEY = "kazi_user";
const MATCHES_KEY = "kazi_matches";
const SESSION_KEY = "kazi_session";

export type SessionType = "candidate" | "employer";

export function saveSession(type: SessionType) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, type);
  }
}

export function getSession(): SessionType | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return (raw as SessionType) ?? null;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(MATCHES_KEY);
  }
}

export function saveUser(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  }
}

export function getUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(MATCHES_KEY);
  }
}

export function saveMatches(matches: Match[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  }
}

export function getMatches(): Match[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MATCHES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function updateMatchStatus(jobId: string, status: Match["status"]) {
  const matches = getMatches();
  const updated = matches.map((m) =>
    m.job_id === jobId ? { ...m, status } : m
  );
  saveMatches(updated);
  return updated;
}
