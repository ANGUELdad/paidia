"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { LateReasonSheet } from "@/components/LateReasonSheet";
import { api } from "@/lib/api";
import { getStoredLang, setStoredLang, t, type Lang } from "@/lib/i18n";
import { sweepDueReminders } from "@/lib/reminders";

type Session = {
  authenticated: boolean;
  name?: string;
  admin?: boolean;
  profileId?: string;
  nickname?: string;
  mode?: string;
  lang?: string;
};
type Due = { kind: string; title: string; body: string; url: string };

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [due, setDue] = useState<Due[]>([]);
  const [presence, setPresence] = useState<{ pending?: boolean } | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [lateOpen, setLateOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("de");

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
        const l = (s.lang === "el" ? "el" : getStoredLang()) as Lang;
        setStoredLang(l);
        setLang(l);
        setSession(s);
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
  const displayDate = useMemo(
    () =>
      new Date(today + "T12:00:00").toLocaleDateString(lang === "el" ? "el-GR" : "de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [today, lang],
  );

  async function checkin(status: "there" | "late", reason = "") {
    if (busy) return;
    setBusy(true);
    try {
      await api("/api/presence/checkin", {
        method: "POST",
        body: JSON.stringify({ date: today, status, reason }),
      });
      setPresence({ pending: false });
      setLateOpen(false);
      setNotice(status === "there" ? "Willkommen — du bist da." : "Verspätung notiert.");
    } finally {
      setBusy(false);
    }
  }

  if (!session) return <main className="page">{t("loading", lang)}</main>;

  const pending = presence?.pending === true;
  const started = !!presence && presence.pending === false;
  const firstName = session.nickname || session.name || "";
  const lead = pending
    ? "Deine Schicht wartet. Ein Tippen, und du bist im Dienst."
    : started
      ? "Schicht läuft. Übergib sauber, wenn du gehst."
      : "Einen Moment — dein Schicht-Status wird geladen.";

  return (
    <>
      <main className="page shift-page">
        <header className="shift-hero" data-tour="tour-home">
          <div className="shift-hero-bar">
            <p className="eyebrow shift-eyebrow">Armonia · Thassos</p>
            <div className="shift-hero-links">
              <Link className="shift-hero-link" href="/profile" data-testid="link-profile">
                {t("profile", lang)}
              </Link>
              {session.admin && (
                <Link className="shift-hero-link" href="/admin/notify" data-testid="link-admin">
                  Automationen
                </Link>
              )}
            </div>
          </div>

          <p className="shift-date">{displayDate}</p>
          <h1 className="shift-title">Hallo{firstName ? `, ${firstName}` : ""}</h1>
          <p className="shift-lead">{lead}</p>

          <div className="shift-cta-row" data-tour="tour-presence" data-testid="presence-card">
            {pending ? (
              <>
                <button
                  className="shift-cta"
                  type="button"
                  disabled={busy}
                  data-testid="presence-there"
                  onClick={() => checkin("there")}
                >
                  Schicht starten
                </button>
                <button
                  className="shift-cta-ghost"
                  type="button"
                  disabled={busy}
                  data-testid="presence-late"
                  onClick={() => setLateOpen(true)}
                >
                  Zu spät melden
                </button>
              </>
            ) : started ? (
              <>
                <Link className="shift-cta" href="/handover" data-testid="cta-handover">
                  Übergabe vorbereiten
                </Link>
                <Link className="shift-cta-ghost" href="/plan">
                  Tagesplan
                </Link>
              </>
            ) : (
              <span className="shift-cta shift-cta-wait" aria-hidden>
                {t("loading", lang)}
              </span>
            )}
          </div>
        </header>

        {notice && (
          <div className="panel shift-notice" data-testid="notice">
            {notice}
          </div>
        )}

        <section className="shift-urgent" aria-label="Was jetzt zählt">
          <div className="row between shift-urgent-head">
            <h2 className="text-lg m-0">Jetzt wichtig</h2>
            {due.length > 0 && <span className="muted text-xs">{due.length} offen</span>}
          </div>

          {due.length > 0 ? (
            <div className="stack">
              {due.map((d) => (
                <Link key={d.kind} href={d.url} className="tile shift-alert" data-testid={`due-${d.kind}`}>
                  <div className="tile-main">
                    <div className="font-semibold">{d.title}</div>
                    <div className="muted">{d.body}</div>
                  </div>
                  <span className="shift-alert-go" aria-hidden>
                    →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="panel shift-calm" data-testid="all-clear">
              <strong>Alles ruhig.</strong>
              <p className="muted m-0 mt-1">Keine offenen Erinnerungen. Schönen Dienst.</p>
            </div>
          )}

          <div className="grid-even-2 mt-3">
            <Link className="tile" href="/coverage">
              <div className="tile-main">
                <div className="font-semibold">{t("coverage", lang)}</div>
                <div className="muted text-sm">Wer ist da · Lücken</div>
              </div>
            </Link>
            <Link className="tile" href="/incidents">
              <div className="tile-main">
                <div className="font-semibold">{t("incidents", lang)}</div>
                <div className="muted text-sm">Vorfall sichern</div>
              </div>
            </Link>
          </div>

          {pending && (
            <Link className="shift-quiet-link" href="/handover" data-testid="link-handover">
              Zur Übergabe →
            </Link>
          )}
        </section>
      </main>
      <Dock mode="staff" />
      <GuidedTour mode="staff" admin={!!session.admin} />
      <LateReasonSheet
        open={lateOpen}
        busy={busy}
        onClose={() => setLateOpen(false)}
        onSubmit={(reason) => checkin("late", reason)}
      />
    </>
  );
}
