"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { EmptyState } from "@/components/EmptyState";
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
        <section className="panel stack">
          <p>
            {t("kidsXp", lang)} <strong>{state.xp}</strong> · {t("kidsStreak", lang)}{" "}
            <strong>{state.streak}</strong>
          </p>
          <div className="chips">
            {(state.badges || []).map((b) => (
              <span key={b} className="chip on">
                {BADGE_LABELS[b]?.[lang] || b}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="panel stack">
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

      <section className="panel stack">
        <p className="eyebrow">{t("kidsEvents", lang)}</p>
        {events.length === 0 ? (
          <EmptyState title={t("kidsNoEvents", lang)} />
        ) : (
          <ul className="stack">
            {events.map((ev) => (
              <li key={ev.id}>
                <strong>{ev.title}</strong>
                <span className="muted text-sm block">
                  {ev.date}
                  {ev.startTime ? ` · ${ev.startTime}` : ""}
                  {ev.location ? ` · ${ev.location}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel stack" data-tour="tour-games-link">
        <Link className="btn" href="/kids/games">
          {t("kidsToGames", lang)}
        </Link>
        <p className="muted text-sm">{t("kidsReadonly", lang)}</p>
      </section>

      <Dock mode="child" />
      <GuidedTour mode="child" />
    </main>
  );
}
