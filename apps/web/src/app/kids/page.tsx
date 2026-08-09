"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
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
  const [moodMsg, setMoodMsg] = useState("");

  async function load() {
    const r = await api<{ state: State; events: KidEvent[] }>("/api/kids/home");
    setState(r.state);
    setEvents(r.events || []);
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    load().catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  async function postMood(id: string) {
    setMood(id);
    setMoodMsg("");
    try {
      await api("/api/kids/mood", { method: "POST", body: JSON.stringify({ mood: id }) });
      setMoodMsg(t("kidsMoodSaved", lang));
    } catch {
      setMoodMsg(t("kidsMoodError", lang));
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

      {state && (
        <div className="list-panel mb-3">
          <div className="list-sticky">
            <span>
              {t("kidsXp", lang)} {state.xp} · {t("kidsStreak", lang)} {state.streak}
            </span>
            <span>{t("kidsBadges", lang)}</span>
          </div>
          {(state.badges || []).length === 0 ? (
            <div className="list-row" style={{ cursor: "default" }}>
              <div className="list-row__main">
                <div className="list-row__meta">{t("kidsNoBadges", lang)}</div>
              </div>
            </div>
          ) : (
            <div className="chips" style={{ padding: "10px 12px" }}>
              {(state.badges || []).map((b) => (
                <span key={b} className="chip on">
                  {BADGE_LABELS[b]?.[lang] || b}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <section className="mb-3">
        <p className="eyebrow">{t("kidsMood", lang)}</p>
        <div className="mood-orbs">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mood-orb${mood === m.id ? " on" : ""}`}
              onClick={() => postMood(m.id)}
              aria-label={m.id}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        {moodMsg && <p className="muted">{moodMsg}</p>}
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
