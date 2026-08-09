"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell, Grid } from "@/components/PageShell";
import { api } from "@/lib/api";
import { sweepDueReminders } from "@/lib/reminders";

type Session = {
  authenticated: boolean;
  name?: string;
  admin?: boolean;
  profileId?: string;
  nickname?: string;
  mode?: string;
  widgets?: string[];
};
type Due = { kind: string; title: string; body: string; url: string };

const DEFAULT_WIDGETS = ["shift", "handover", "tasks", "stock", "journal", "meeting", "events", "calendar"];

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [due, setDue] = useState<Due[]>([]);
  const [widgets, setWidgets] = useState<string[]>(DEFAULT_WIDGETS);
  const [presence, setPresence] = useState<{ pending?: boolean } | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await api<Session>("/api/auth/session");
        if (!s.authenticated) {
          router.replace("/");
          return;
        }
        if (s.mode === "child") {
          router.replace("/kids");
          return;
        }
        setSession(s);
        if (s.widgets?.length) setWidgets(s.widgets);
        else {
          const stored = localStorage.getItem("armonia.widgets");
          if (stored) setWidgets(JSON.parse(stored));
        }
        const evald = await api<{ due: Due[] }>("/api/notify/evaluate");
        setDue(evald.due || []);
        const p = await api<{ pending?: boolean }>("/api/presence/active");
        setPresence(p);
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.register("/sw.js").catch(() => undefined);
        }
        sweepDueReminders();
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function checkin(status: "there" | "late") {
    let reason = "";
    if (status === "late") reason = prompt("Warum zu spät?") || "";
    await api("/api/presence/checkin", {
      method: "POST",
      body: JSON.stringify({ date: today, status, reason }),
    });
    setPresence({ pending: false });
    setNotice(status === "there" ? "Willkommen — du bist da." : "Verspätung notiert.");
  }

  function moveWidget(id: string, dir: -1 | 1) {
    setWidgets((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      localStorage.setItem("armonia.widgets", JSON.stringify(next));
      api("/api/auth/prefs", { method: "POST", body: JSON.stringify({ widgets: next }) }).catch(() => {});
      return next;
    });
  }

  if (!session) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell
        eyebrow="Armonia"
        title={`Hallo${session.nickname || session.name ? `, ${session.nickname || session.name}` : ""}`}
        lead="Dein Tag — nächste Schritte zuerst."
        actions={
          <>
            <Link className="btn-sec !min-h-10 text-sm" href="/profile" data-testid="link-profile">
              Profil
            </Link>
            {session.admin && (
              <Link className="btn-sec !min-h-10 text-sm" href="/admin/notify" data-testid="link-admin">
                Automationen
              </Link>
            )}
            <Link className="btn-sec !min-h-10 text-sm" href="/calendar" data-testid="link-calendar">
              Kalender
            </Link>
          </>
        }
      >
        {notice && (
          <div className="panel" data-testid="notice">
            {notice}
          </div>
        )}

        {presence?.pending && (
          <section className="panel stack" data-tour="tour-presence" data-testid="presence-card">
            <h2 className="text-xl">Schicht startet</h2>
            <p className="muted">Tippe „Ich bin da“ oder melde Verspätung.</p>
            <div className="row">
              <button className="btn flex-1" type="button" data-testid="presence-there" onClick={() => checkin("there")}>
                Ich bin da
              </button>
              <button className="btn-sec flex-1" type="button" data-testid="presence-late" onClick={() => checkin("late")}>
                Zu spät
              </button>
            </div>
          </section>
        )}

        {due.length > 0 && (
          <section className="grid-even mb-4">
            {due.map((d) => (
              <Link key={d.kind} href={d.url} className="tile" data-testid={`due-${d.kind}`}>
                <div>
                  <div className="font-semibold">{d.title}</div>
                  <div className="muted">{d.body}</div>
                </div>
              </Link>
            ))}
          </section>
        )}

        <section className="stack" data-tour="tour-home">
          <div className="row between">
            <h2 className="text-lg m-0">Widgets</h2>
            <span className="muted text-xs">↑↓ sortieren</span>
          </div>
          <Grid>
            {widgets.map((id) => (
              <article key={id} className="tile" data-testid={`widget-${id}`}>
                <div className="tile-main">
                  <h3 className="m-0 font-semibold capitalize">{label(id)}</h3>
                  <p className="muted m-0">{hint(id)}</p>
                  <Link className="mt-2 inline-block text-sm font-semibold text-[var(--sea)]" href={href(id)}>
                    Öffnen →
                  </Link>
                </div>
                <div className="stack gap-1">
                  <button className="btn-sec !min-h-8 !px-2 text-xs" type="button" onClick={() => moveWidget(id, -1)}>
                    ↑
                  </button>
                  <button className="btn-sec !min-h-8 !px-2 text-xs" type="button" onClick={() => moveWidget(id, 1)}>
                    ↓
                  </button>
                </div>
              </article>
            ))}
          </Grid>
        </section>
      </PageShell>
      <Dock mode="staff" />
      <GuidedTour mode="staff" />
    </>
  );
}

function label(id: string) {
  return (
    (
      {
        shift: "Schicht",
        handover: "Übergabe",
        tasks: "Aufgaben",
        stock: "Lager",
        journal: "Schichtbuch",
        meeting: "Besprechung",
        events: "Events",
        calendar: "Kalender",
      } as Record<string, string>
    )[id] || id
  );
}
function hint(id: string) {
  return (
    (
      {
        shift: "Präsenz & Start",
        handover: "Schicht an die nächste Person",
        tasks: "Was heute ansteht",
        stock: "Bestand & Check",
        journal: "Muss geschrieben werden",
        meeting: "Team-Notizen der Woche",
        events: "Kommende Events",
        calendar: "ICS · Google · Reminder",
      } as Record<string, string>
    )[id] || ""
  );
}
function href(id: string) {
  return (
    (
      {
        shift: "/home",
        handover: "/handover",
        tasks: "/plan",
        stock: "/stock",
        journal: "/book",
        meeting: "/talk",
        events: "/calendar",
        calendar: "/calendar",
      } as Record<string, string>
    )[id] || "/home"
  );
}
