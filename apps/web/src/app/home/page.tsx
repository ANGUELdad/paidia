"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { LateReasonSheet } from "@/components/LateReasonSheet";
import { RegulatorySheet, hadRegulatoryCheckToday } from "@/components/RegulatorySheet";
import { useGuideOptional } from "@/components/GuideProvider";
import { api } from "@/lib/api";
import { GUIDE_TARGETS } from "@/lib/guide-intents";
import { getStoredLang, setStoredLang, t, type Lang } from "@/lib/i18n";
import { ensureNotifPermission, scheduleLocalReminder, sweepDueReminders } from "@/lib/reminders";

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

const WEEKDAYS: Record<Lang, string[]> = {
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  el: ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"],
};

function greet(lang: Lang, name: string) {
  const h = new Date().getHours();
  const el = lang === "el";
  const base = el ? (h < 17 ? "Καλημέρα" : "Καλησπέρα") : h < 12 ? "Guten Morgen" : h < 18 ? "Guten Tag" : "Guten Abend";
  return name ? `${base}, ${name}` : base;
}

export default function HomePage() {
  const router = useRouter();
  const guide = useGuideOptional();
  const [session, setSession] = useState<Session | null>(null);
  const [due, setDue] = useState<Due[]>([]);
  const [presence, setPresence] = useState<{ pending?: boolean } | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [lateOpen, setLateOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("de");
  const [askDraft, setAskDraft] = useState("");
  const [regulatoryOpen, setRegulatoryOpen] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);

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
        const [evald, p] = await Promise.all([
          api<{ due: Due[] }>("/api/notify/evaluate"),
          api<{ pending?: boolean }>("/api/presence/active").catch(() => ({ pending: true })),
        ]);
        setDue(evald.due || []);
        setPresence(p && typeof p.pending === "boolean" ? p : { pending: true });
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.register("/sw.js").catch(() => undefined);
        }
        sweepDueReminders();
        // Open regulatory sheet if returning via notification link
        if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("regulatory") === "1") {
          setRegulatoryOpen(true);
        }
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const week = useMemo(() => {
    const base = new Date(today + "T12:00:00");
    const day = (base.getDay() + 6) % 7; // Mon=0
    return WEEKDAYS[lang].map((label, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - day + i);
      return {
        label,
        date: d.getDate(),
        iso: d.toISOString().slice(0, 10),
        active: i === day,
      };
    });
  }, [today, lang]);

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
        body: JSON.stringify({ date: today, status, reason, regulatoryChecked: true }),
      });
      setPresence({ pending: false });
      setLateOpen(false);
      setNotice(
        status === "there"
          ? lang === "el"
            ? "Καλώς ήρθες — είσαι εδώ."
            : "Willkommen — du bist da."
          : lang === "el"
            ? "Η καθυστέρηση καταγράφηκε."
            : "Verspätung notiert.",
      );
      try {
        const evald = await api<{ due: Due[] }>("/api/notify/evaluate");
        setDue((evald.due || []).filter((d) => d.kind !== "shift_start"));
      } catch {
        setDue((prev) => prev.filter((d) => d.kind !== "shift_start"));
      }
    } finally {
      setBusy(false);
    }
  }

  function handleShiftStart() {
    if (!hadRegulatoryCheckToday()) {
      setRegulatoryOpen(true);
    } else {
      checkin("there");
    }
  }

  async function onRegulatoryConfirmed() {
    setRegulatoryOpen(false);
    await checkin("there");
    // Schedule journal reminder for end of shift
    const perm = typeof window !== "undefined" ? (window.Notification?.permission ?? "default") : "default";
    if (perm === "granted") {
      const endOfShift = new Date();
      endOfShift.setHours(18, 0, 0, 0);
      if (endOfShift.getTime() < Date.now()) {
        endOfShift.setTime(Date.now() + 8 * 60 * 60 * 1000);
      }
      scheduleLocalReminder(lang === "el" ? "Σχόλιο βάρδιας" : "Schichtbuch ausfüllen", endOfShift.toISOString(), "/book").catch(() => undefined);
    }
  }

  async function activateNotifications() {
    const perm = await ensureNotifPermission();
    if (perm === "granted") setNotifDismissed(true);
  }

  function askZoAi(question?: string) {
    const q = (question || askDraft).trim();
    if (!q) {
      router.push("/zoai");
      return;
    }
    router.push(`/zoai?guideAsk=${encodeURIComponent(q)}`);
  }

  if (!session) return <main className="page">{t("loading", lang)}</main>;

  const pending = presence?.pending === true;
  const started = !!presence && presence.pending === false;
  const firstName = session.nickname || session.name || "";
  const topDue = due[0];
  const lowStock = due.find((d) => d.kind === "low_stock");
  const el = lang === "el";

  const chipLabel: Record<string, string> = {
    presence: el ? "Έναρξη βάρδιας" : "Schicht starten",
    plan: el ? "Πλάνο" : "Wochenplan",
    stock: el ? "Αποθήκη" : "Lager",
    zoai: "Zo-Ai",
  };

  return (
    <>
      <main className="page dawn-page">
        <header className="dawn-hero" data-tour="tour-home">
          <div className="dawn-hero-bar">
            <p className="dawn-brand">ARMONIA</p>
            <div className="dawn-hero-links">
              <Link className="dawn-link" href="/profile" data-testid="link-profile">
                {t("profile", lang)}
              </Link>
              {session.admin && (
                <Link className="dawn-link" href="/admin/notify" data-testid="link-admin">
                  {el ? "Διαχείριση" : "Admin"}
                </Link>
              )}
            </div>
          </div>
          <p className="dawn-date">{displayDate}</p>
          <h1 className="dawn-title">{greet(lang, firstName)}</h1>
          <p className="dawn-lead">
            {pending
              ? el
                ? "Ξεκίνα τη βάρδια — ένα πάτημα."
                : "Starte die Schicht — ein Tippen genügt."
              : started
                ? el
                  ? "Η βάρδια τρέχει. Ρώτα τη Zo-Ai."
                  : "Schicht läuft. Frag Zo-Ai oder folge der Führung."
                : t("loading", lang)}
          </p>

          <div className="dawn-cta-row" data-tour="tour-presence" data-testid="presence-card">
            {pending ? (
              <>
                <button
                  className="dawn-cta"
                  type="button"
                  disabled={busy}
                  data-testid="presence-there"
                  onClick={handleShiftStart}
                >
                  {el ? "Έναρξη βάρδιας" : "Schicht starten"}
                </button>
                <button
                  className="dawn-cta-ghost"
                  type="button"
                  disabled={busy}
                  data-testid="presence-late"
                  onClick={() => setLateOpen(true)}
                >
                  {t("lateTitle", lang)}
                </button>
              </>
            ) : started ? (
              <>
                <Link className="dawn-cta" href="/handover" data-testid="cta-handover">
                  {el ? "Παράδοση" : "Übergabe"}
                </Link>
                <Link className="dawn-cta-ghost" href="/plan">
                  {el ? "Ημερήσιο πλάνο" : "Tagesplan"}
                </Link>
              </>
            ) : (
              <span className="dawn-cta dawn-cta-wait" aria-hidden>
                {t("loading", lang)}
              </span>
            )}
          </div>

          {pending && !notifDismissed && typeof window !== "undefined" && window.Notification?.permission === "default" && (
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                className="dawn-chip"
                onClick={activateNotifications}
                data-testid="notif-prompt"
              >
                🔔 {t("notifPrompt", lang)}
              </button>
              <button
                type="button"
                className="dawn-chip-close"
                aria-label={t("cancel", lang)}
                onClick={() => setNotifDismissed(true)}
                style={{ fontSize: "0.8rem", opacity: 0.6 }}
              >
                ✕
              </button>
            </div>
          )}
        </header>

        {notice && (
          <div className="panel dawn-notice" data-testid="notice">
            {notice}
          </div>
        )}

        <div className="dawn-week" aria-label={el ? "Εβδομάδα" : "Woche"} data-tour="tour-week">
          {week.map((d) => (
            <Link
              key={d.iso}
              href={`/plan?day=${d.iso}`}
              className={`dawn-day w-full min-h-[var(--row-h)]${d.active ? " is-active" : ""}`}
              data-testid={`week-day-${d.iso}`}
              aria-current={d.active ? "date" : undefined}
              aria-label={`${d.label} ${d.iso}`}
            >
              <span>{d.label}</span>
              <strong>{d.date}</strong>
            </Link>
          ))}
        </div>

        <section className="dawn-card" data-tour="tour-now" aria-label={el ? "Τώρα" : "Jetzt"}>
          <p className="dawn-kicker">{el ? "ΤΩΡΑ" : "JETZT"}</p>
          {topDue ? (
            <Link href={topDue.url} className="dawn-now-link" data-testid={`due-${topDue.kind}`}>
              <h2 className="dawn-now-title">{topDue.title}</h2>
              <p className="dawn-now-meta">{topDue.body}</p>
            </Link>
          ) : (
            <div data-testid="all-clear">
              <h2 className="dawn-now-title">{el ? "Όλα ήσυχα" : "Alles ruhig"}</h2>
              <p className="dawn-now-meta">
                {el ? "Καμία ανοιχτή υπενθύμιση — καλά." : "Keine offenen Erinnerungen — gut so."}
              </p>
            </div>
          )}
        </section>

        <section className="dawn-section" aria-label={el ? "Σήμερα" : "Heute"}>
          <div className="row between">
            <h2 className="dawn-section-title">{el ? "ΣΗΜΕΡΑ" : "HEUTE"}</h2>
            {due.length > 1 && (
              <span className="muted text-xs">
                {due.length} {el ? "ανοιχτά" : "offen"}
              </span>
            )}
          </div>
          <div className="list-panel dawn-list">
            {due.slice(0, 4).map((d) => (
              <Link key={d.kind} href={d.url} className="list-row is-warn" data-testid={`due-row-${d.kind}`}>
                <div className="list-row__main">
                  <div className="list-row__title">{d.title}</div>
                  <div className="list-row__meta">{d.body}</div>
                </div>
                <span className="muted" aria-hidden>
                  →
                </span>
              </Link>
            ))}
            <Link href="/coverage" className="list-row">
              <div className="list-row__main">
                <div className="list-row__title">{t("coverage", lang)}</div>
                <div className="list-row__meta">{el ? "Ποιος είναι εδώ · κενά" : "Wer ist da · Lücken"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/incidents" className="list-row">
              <div className="list-row__main">
                <div className="list-row__title">{t("incidents", lang)}</div>
                <div className="list-row__meta">{el ? "Καταγραφή συμβάντος" : "Vorfall sichern"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
            <Link className="list-row" href="/handover" data-testid="link-handover">
              <div className="list-row__main">
                <div className="list-row__title">{el ? "Παράδοση" : "Übergabe"}</div>
                <div className="list-row__meta">{el ? "Προετοιμασία" : "Vorbereiten"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
            <Link className="list-row" href="/campus" data-testid="link-campus">
              <div className="list-row__main">
                <div className="list-row__title">Campus</div>
                <div className="list-row__meta">{el ? "Σημειώσεις και ενότητες" : "Notizen und Module"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <Link href="/stock" className="dawn-alert" data-tour="tour-stock-alert" data-testid="stock-alert">
          <span className="dawn-alert-label">{el ? "Αποθήκη" : "Lager"}</span>
          <div>
            <strong>{lowStock ? lowStock.title : el ? "Έλεγχος αποθέματος" : "Bestand prüfen"}</strong>
            <p>{lowStock ? lowStock.body : el ? "Μια γρήγορη ματιά αξίζει" : "Kurzer Blick lohnt sich"}</p>
          </div>
        </Link>

        <section className="dawn-card dawn-zoai" data-tour="tour-ask" aria-label={el ? "Ρώτα τη Zo-Ai" : "Zo-Ai fragen"}>
          <p className="dawn-kicker">{el ? "ZO-AI · ΕΡΩΤΗΣΕΙΣ" : "ZO-AI · FRAGEN & FÜHREN"}</p>
          <p className="dawn-zoai-lead">
            {el ? "Ρώτα πώς γίνεται κάτι — η Zo-Ai εξηγεί." : "Frag, wie etwas geht — Zo-Ai erklärt und zeigt den Bildschirm."}
          </p>
          <form
            className="dawn-ask-form"
            onSubmit={(e) => {
              e.preventDefault();
              askZoAi();
            }}
          >
            <input
              className="dawn-ask-input"
              value={askDraft}
              onChange={(e) => setAskDraft(e.target.value)}
              placeholder={el ? "π.χ. Πώς ξεκινώ τη βάρδια;" : "z.B. Wie starte ich die Schicht?"}
              data-testid="home-ask-input"
              aria-label={el ? "Ερώτηση στη Zo-Ai" : "Frage an Zo-Ai"}
            />
            <button className="dawn-cta" type="submit" data-testid="home-ask-submit">
              {el ? "Ερώτηση" : "Fragen"}
            </button>
          </form>
          <div className="dawn-chips">
            {GUIDE_TARGETS.filter((g) => {
              if (g.id === "presence" && !pending) return false;
              return ["presence", "plan", "stock", "zoai"].includes(g.id);
            }).map((g) => (
              <button
                key={g.id}
                type="button"
                className="dawn-chip"
                data-testid={`guide-chip-${g.id}`}
                onClick={() => {
                  guide?.startGuide(g, "home");
                }}
              >
                {chipLabel[g.id] || g.title}
              </button>
            ))}
            {!pending && (
              <button
                type="button"
                className="dawn-chip"
                data-testid="guide-chip-handover"
                onClick={() => router.push("/handover")}
              >
                {el ? "Παράδοση" : "Übergabe"}
              </button>
            )}
            <button
              type="button"
              className="dawn-chip dawn-chip-ai"
              data-testid="guide-chip-ask"
              onClick={() => askZoAi(el ? "Πώς χρησιμοποιώ τη Zo-Ai και την καθοδήγηση;" : "Wie nutze ich Zo-Ai und die Führung?")}
            >
              {el ? "Ρώτα τη Zo-Ai" : "Frag Zo-Ai"}
            </button>
          </div>
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
      <RegulatorySheet
        open={regulatoryOpen}
        lang={lang}
        busy={busy}
        onConfirm={onRegulatoryConfirmed}
        onClose={() => setRegulatoryOpen(false)}
      />
    </>
  );
}
