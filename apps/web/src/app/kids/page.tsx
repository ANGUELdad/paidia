"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type State = { xp: number; streak: number; badges: string[]; lastPlayAt?: string };
type KidEvent = { id: string; title: string; date: string; startTime?: string; location?: string };

const MOODS = [
  { id: "sun", emoji: "☀️" },
  { id: "cloud", emoji: "⛅" },
  { id: "rain", emoji: "🌧️" },
  { id: "storm", emoji: "⛈️" },
];

const BADGE_LABELS: Record<string, { de: string; el: string }> = {
  star: { de: "Stern", el: "Αστέρι" },
  shell: { de: "Muschel", el: "Κοχύλι" },
  pine: { de: "Pinie", el: "Πεύκο" },
};

export default function KidsPage() {
  const { ready } = useRequireMode("child");
  const [lang, setLang] = useState<Lang>("de");
  const [state, setState] = useState<State | null>(null);
  const [events, setEvents] = useState<KidEvent[]>([]);
  const [mood, setMood] = useState("");
  const [moodBusy, setMoodBusy] = useState(false);
  const [moodMsg, setMoodMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await api<{ state?: State; xp?: State; events: KidEvent[] }>("/api/kids/home");
      const row = r.state || r.xp || { xp: 0, streak: 0, badges: [] };
      setState({
        xp: Number(row.xp) || 0,
        streak: Number(row.streak) || 0,
        badges: Array.isArray(row.badges) ? row.badges : [],
        lastPlayAt: row.lastPlayAt,
      });
      setEvents(Array.isArray(r.events) ? r.events : []);
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 401) {
        window.location.href = "/";
        return;
      }
      setError(err.message || t("errorDefault", lang));
      setState(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    void load();
    // load is defined in render; ready is the only gate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  async function postMood(id: string) {
    if (moodBusy) return;
    setMood(id);
    setMoodMsg("");
    setMoodBusy(true);
    try {
      await api("/api/kids/mood", { method: "POST", body: JSON.stringify({ mood: id }) });
      setMoodMsg(t("kidsMoodSaved", lang));
    } catch {
      setMoodMsg(t("kidsMoodError", lang));
    } finally {
      setMoodBusy(false);
    }
  }

  if (!ready) return <main className="page kids">{t("loading", lang)}</main>;

  return (
    <main className="page kids" data-tour="tour-kids">
      <header className="top">
        <div>
          <p className="eyebrow">{t("kidsToday", lang)}</p>
          <h1>{t("kidsPlay", lang)}</h1>
        </div>
      </header>

      {error && (
        <div className="warn mb-3" role="alert">
          <p className="m-0">{t("errorDefault", lang)}</p>
          {error !== t("errorDefault", lang) && <p className="muted text-sm m-0 mt-1">{error}</p>}
          <button className="btn ghost mt-2" type="button" onClick={() => void load()}>
            {t("kidsToday", lang)}
          </button>
        </div>
      )}

      {loading ? (
        <LoadingBlock label={t("loading", lang)} />
      ) : (
        <>
          <div className="list-panel mb-3">
            <div className="list-sticky">
              <span>
                {t("kidsXp", lang)} {state?.xp ?? 0} · {t("kidsStreak", lang)} {state?.streak ?? 0}
              </span>
              <span>{t("kidsBadges", lang)}</span>
            </div>
            {(state?.badges || []).length === 0 ? (
              <div className="list-row" style={{ cursor: "default" }}>
                <div className="list-row__main">
                  <div className="list-row__meta">{t("kidsNoBadges", lang)}</div>
                </div>
              </div>
            ) : (
              <div className="chips" style={{ padding: "10px 12px" }}>
                {(state?.badges || []).map((b) => (
                  <span key={b} className="chip on">
                    {BADGE_LABELS[b]?.[lang] || b}
                  </span>
                ))}
              </div>
            )}
          </div>

          <section className="mb-3">
            <p className="eyebrow">{t("kidsMood", lang)}</p>
            <div className="mood-orbs">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`mood-orb${mood === m.id ? " on" : ""}`}
                  onClick={() => void postMood(m.id)}
                  disabled={moodBusy}
                  aria-pressed={mood === m.id}
                  aria-label={m.id}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            {moodMsg && (
              <p className="muted" role={moodMsg === t("kidsMoodError", lang) ? "alert" : "status"}>
                {moodMsg}
              </p>
            )}
          </section>

          <div className="list-panel mb-3">
            <div className="list-sticky">
              <span>{t("kidsEvents", lang)}</span>
              <span>{events.length}</span>
            </div>
            {events.length === 0 ? (
              <div className="list-row" style={{ cursor: "default" }}>
                <div className="list-row__main">
                  <div className="list-row__meta">{t("kidsNoEvents", lang)}</div>
                </div>
              </div>
            ) : (
              events.map((ev) => (
                <div key={ev.id} className="list-row" style={{ cursor: "default" }}>
                  <div className="list-row__main">
                    <div className="list-row__title">{ev.title}</div>
                    <div className="list-row__meta">
                      {ev.date}
                      {ev.startTime ? ` · ${ev.startTime}` : ""}
                      {ev.location ? ` · ${ev.location}` : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <section className="stack mb-3" data-tour="tour-games-link">
        <Link className="btn" href="/kids/games">
          {t("kidsToGames", lang)}
        </Link>
        <p className="muted text-sm m-0">{t("kidsReadonly", lang)}</p>
      </section>

      <Dock mode="child" />
      <GuidedTour mode="child" />
    </main>
  );
}
