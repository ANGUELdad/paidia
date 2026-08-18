"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export type SessionMode = "staff" | "child";

export type AppSession = {
  authenticated: boolean;
  mode?: SessionMode;
  admin?: boolean;
  profileId?: string;
  name?: string;
  nickname?: string;
  role?: string;
  widgets?: string[];
};

/** Shared in-flight fetch so Dock + useRequireMode do not double-hit /api/auth/session. */
let inflight: Promise<AppSession> | null = null;

function asSession(raw: unknown): AppSession {
  if (!raw || typeof raw !== "object") return { authenticated: false };
  const s = raw as AppSession;
  return { ...s, authenticated: Boolean(s.authenticated) };
}

function loadSession(): Promise<AppSession> {
  if (inflight) return inflight;
  inflight = api<AppSession>("/api/auth/session")
    .then(asSession)
    .catch(() => ({ authenticated: false }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useSession() {
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadSession()
      .then((s) => {
        if (!cancelled) setSession(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { session, loading };
}

/** Redirect unauthenticated users to / and wrong-mode users to their home. */
export function useRequireMode(mode: SessionMode | "any" = "any") {
  const router = useRouter();
  const { session, loading } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!session?.authenticated) {
      router.replace("/");
      return;
    }
    if (mode === "any") return;
    if (session.mode === "child" && mode === "staff") {
      router.replace("/kids");
      return;
    }
    if (session.mode === "staff" && mode === "child") {
      router.replace("/home");
    }
  }, [loading, mode, router, session]);

  return { session, loading, ready: !loading && !!session?.authenticated };
}
