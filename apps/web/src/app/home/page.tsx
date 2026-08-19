"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { LateReasonSheet } from "@/components/LateReasonSheet";
import { useGuideOptional } from "@/components/GuideProvider";
import { api } from "@/lib/api";
import { GUIDE_TARGETS } from "@/lib/guide-intents";
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

const WEEKDAYS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_EL = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σά", "Κυ"];

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
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const week = useMemo(() => {
    const base = new Date(today + "T12:00:00");
    const day = (base.getDay() + 6) % 7; // Mon=0
    const labels = lang === "el" ? WEEKDAYS_EL : WEEKDAYS_DE;
    return labels.map((label, i) => {
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
        body: JSON.stringify({ date: today, status, reason }),
      });
      setPresence({ pending: false });
      setLateOpen(false);
      setNotice(status === "there" ? t("homeWelcomeThere", lang) : t("homeWelcomeLate", lang));
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
  // Only show the stock alert if there is an actual low-stock item in the due list
  const showStockAlert = !!lowStock;

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
                  Admin
                </Link>
              )}
            </div>
          </div>
          <p className="dawn-date">{displayDate}</p>
          <h1 className="dawn-title">
            {t("homeGreeting", lang)}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="dawn-lead">
            {pending
              ? t("homeShiftPending", lang)
              : started
                ? t("homeShiftRunning", lang)
                : t("homeStatusLoading", lang)}
          </p>

          <div className="dawn-cta-row" data-tour="tour-presence" data-testid="presence-card">
            {pending ? (
              <>
                <button
                  className="dawn-cta"
                  type="button"
                  disabled={busy}
                  data-testid="presence-there"
                  onClick={() => checkin("there")}
                >
                  {t("homeShiftStart", lang)}
                </button>
                <button
                  className="dawn-cta-ghost"
                  type="button"
                  disabled={busy}
                  data-testid="presence-late"
                  onClick={() => setLateOpen(true)}
                >
                  {t("homeShiftLate", lang)}
                </button>
              </>
            ) : started ? (
              <>
                <Link className="dawn-cta" href="/handover" data-testid="cta-handover">
                  {t("handoverTitle", lang)}
                </Link>
                <Link className="dawn-cta-ghost" href="/plan">
                  {t("homePlan", lang)}
                </Link>
              </>
            ) : (
              <span className="dawn-cta dawn-cta-wait" aria-hidden>
                {t("loading", lang)}
              </span>
            )}
          </div>
        </header>

        {notice && (
          <div className="panel dawn-notice" data-testid="notice">
            {notice}
          </div>
        )}

        {/* Week strip — clicking a day goes to /plan?date=YYYY-MM-DD */}
        <div className="dawn-week" aria-label={lang === "el" ? "Εβδομάδα" : "Woche"} data-tour="tour-week">
          {week.map((d) => (
            <Link
              key={d.iso}
              href={`/plan?date=${d.iso}`}
              className={`dawn-day${d.active ? " is-active" : ""}`}
              aria-label={`${d.label} ${d.date}`}
              aria-current={d.active ? "date" : undefined}
            >
              <span>{d.label}</span>
              <strong>{d.date}</strong>
            </Link>
          ))}
        </div>

        <section className="dawn-card" data-tour="tour-now" aria-label={t("homeJetzt", lang)}>
          <p className="dawn-kicker">{t("homeJetzt", lang)}</p>
          {topDue ? (
            <Link href={topDue.url} className="dawn-now-link" data-testid={`due-${topDue.kind}`}>
              <h2 className="dawn-now-title">{topDue.title}</h2>
              <p className="dawn-now-meta">{topDue.body}</p>
            </Link>
          ) : (
            <div data-testid="all-clear">
              <h2 className="dawn-now-title">{t("homeAllClear", lang)}</h2>
              <p className="dawn-now-meta">{t("homeAllClearMeta", lang)}</p>
            </div>
          )}
        </section>

        <section className="dawn-section" aria-label={t("homeHeute", lang)}>
          <div className="row between">
            <h2 className="dawn-section-title">{t("homeHeute", lang).toUpperCase()}</h2>
            {due.length > 1 && (
              <span className="muted text-xs">{due.length} offen</span>
            )}
          </div>
          <div className="list-panel dawn-list">
            {due.slice(0, 4).map((d) => (
              <Link
                key={d.kind}
                href={d.url}
                className="list-row is-warn"
                data-testid={`due-row-${d.kind}`}
              >
                <div className="list-row__main">
                  <div className="list-row__title">{d.title}</div>
                  <div className="list-row__meta">{d.body}</div>
                </div>
                <span className="muted" aria-hidden>→</span>
              </Link>
            ))}
            <Link href="/coverage" className="list-row">
              <div className="list-row__main">
                <div className="list-row__title">{t("coverage", lang)}</div>
                <div className="list-row__meta">{lang === "el" ? "Ποιος είναι εδώ · Κενά" : "Wer ist da · Lücken"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/incidents" className="list-row">
              <div className="list-row__main">
                <div className="list-row__title">{t("incidents", lang)}</div>
                <div className="list-row__meta">{lang === "el" ? "Περιστατικό καταγραφή" : "Vorfall sichern"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
            <Link className="list-row" href="/handover" data-testid="link-handover">
              <div className="list-row__main">
                <div className="list-row__title">{t("handoverTitle", lang)}</div>
                <div className="list-row__meta">{lang === "el" ? "Προετοιμασία" : "Vorbereiten"}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {showStockAlert && (
          <Link
            href="/stock"
            className="dawn-alert"
            data-tour="tour-stock-alert"
            data-testid="stock-alert"
          >
            <span className="dawn-alert-label">{t("homeLager", lang)}</span>
            <div>
              <strong>{lowStock!.title}</strong>
              <p>{lowStock!.body}</p>
            </div>
          </Link>
        )}

        <section className="dawn-card dawn-zoai" data-tour="tour-ask" aria-label="Zo-Ai">
          <p className="dawn-kicker">ZO-AI · {lang === "el" ? "ΕΡΩΤΉΣΕΙΣ & ΟΔΉΓΗΣΗ" : "FRAGEN & FÜHREN"}</p>
          <p className="dawn-zoai-lead">{t("homeZoAiLead", lang)}</p>
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
              placeholder={t("homeZoAiPlaceholder", lang)}
              data-testid="home-ask-input"
              aria-label={lang === "el" ? "Ερώτηση στο Zo-Ai" : "Frage an Zo-Ai"}
            />
            <button className="dawn-cta" type="submit" data-testid="home-ask-submit">
              {t("homeZoAiFragen", lang)}
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
                {g.title}
              </button>
            ))}
            {!pending && (
              <button
                type="button"
                className="dawn-chip"
                data-testid="guide-chip-handover"
                onClick={() => router.push("/handover")}
              >
                {t("navHandover", lang)}
              </button>
            )}
            <button
              type="button"
              className="dawn-chip dawn-chip-ai"
              data-testid="guide-chip-ask"
              onClick={() =>
                askZoAi(
                  lang === "el"
                    ? "Πώς να χρησιμοποιήσω το Zo-Ai;"
                    : "Wie nutze ich Zo-Ai und die Führung?",
                )
              }
            >
              {lang === "el" ? "Ρώτα Zo-Ai" : "Frag Zo-Ai"}
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
    </>
  );
}
