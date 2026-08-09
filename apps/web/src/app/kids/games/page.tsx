"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Screen = "lobby" | "memory" | "quiz" | "breath";

type MemCard = { id: number; emoji: string; pair: number; open: boolean; done: boolean };

const MEMORY_EMOJIS = ["🌊", "☀️", "🐚", "🐙", "🐟", "⭐", "🍋", "⛵"];

const QUIZ_BANK = [
  {
    de: { q: "In welchem Land liegt Thassos?", choices: ["Griechenland", "Frankreich", "Schweden", "Ägypten"], a: 0 },
    el: { q: "Σε ποια χώρα βρίσκεται η Θάσος;", choices: ["Ελλάδα", "Γαλλία", "Σουηδία", "Αίγυπτος"], a: 0 },
  },
  {
    de: { q: "Welches Meer umgibt die griechischen Inseln?", choices: ["Mittelmeer", "Ostsee", "Nordsee", "Kaspisches Meer"], a: 0 },
    el: { q: "Ποια θάλασσα περιβάλλει τα ελληνικά νησιά;", choices: ["Μεσόγειος", "Βαλτική", "Βόρεια θάλασσα", "Κασπία"], a: 0 },
  },
  {
    de: { q: "Was ist die Hauptstadt von Griechenland?", choices: ["Athen", "Rom", "Berlin", "Madrid"], a: 0 },
    el: { q: "Ποια είναι η πρωτεύουσα της Ελλάδας;", choices: ["Αθήνα", "Ρώμη", "Βερολίνο", "Μαδρίτη"], a: 0 },
  },
  {
    de: { q: "Was bedeutet Ruhe im Spa?", choices: ["Leise sein und entspannen", "Laut schreien", "Rennen", "Ball spielen drinnen"], a: 0 },
    el: { q: "Τι σημαίνει ησυχία στο spa;", choices: ["Να είμαστε ήσυχοι και να χαλαρώνουμε", "Να φωνάζουμε", "Να τρέχουμε", "Να παίζουμε μπάλα μέσα"], a: 0 },
  },
  {
    de: { q: "Welches Tier lebt im Meer?", choices: ["Hai", "Hund", "Katze", "Kuh"], a: 0 },
    el: { q: "Ποιο ζώο ζει στη θάλασσα;", choices: ["Καρχαρίας", "Σκύλος", "Γάτα", "Αγελάδα"], a: 0 },
  },
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function makeDeck(): MemCard[] {
  const cards = MEMORY_EMOJIS.flatMap((emoji, pair) => [
    { id: pair * 2, emoji, pair, open: false, done: false },
    { id: pair * 2 + 1, emoji, pair, open: false, done: false },
  ]);
  return shuffle(cards);
}

export default function KidsGamesPage() {
  const { ready } = useRequireMode("child");
  const [lang, setLang] = useState<Lang>("de");
  const [screen, setScreen] = useState<Screen>("lobby");
  const [msg, setMsg] = useState("");
  const [claiming, setClaiming] = useState(false);

  const [deck, setDeck] = useState<MemCard[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [memLock, setMemLock] = useState(false);
  const openRef = useRef<number[]>([]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLock, setQuizLock] = useState(false);

  const [breathLeft, setBreathLeft] = useState(30);
  const [breathScale, setBreathScale] = useState(1);
  const breathDoneRef = useRef(false);

  const quizQuestions = useMemo(() => QUIZ_BANK, []);

  const claimReward = useCallback(
    async (game: string) => {
      if (claiming) return;
      setClaiming(true);
      try {
        const r = await api<{ gained: number; state: { xp: number } }>("/api/kids/play", {
          method: "POST",
          body: JSON.stringify({ game }),
        });
        setMsg(`+${r.gained} ${t("gameXpGained", lang)} · ${r.state?.xp ?? "?"} ${t("kidsXp", lang)}`);
      } catch (e) {
        const err = e as Error & { status?: number };
        const text = err.message || "";
        setMsg(text.toLowerCase().includes("later") || err.status === 429 ? t("gameCooldown", lang) : text || t("gameLater", lang));
      } finally {
        setClaiming(false);
      }
    },
    [claiming, lang],
  );
  const claimRef = useRef(claimReward);
  claimRef.current = claimReward;

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    api("/api/kids/rewards").catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  useEffect(() => {
    if (screen !== "breath") return;
    breathDoneRef.current = false;
    setBreathLeft(30);
    setBreathScale(1);
    let left = 30;
    let inhale = true;
    const tick = window.setInterval(() => {
      left -= 1;
      setBreathLeft(left);
      if (left <= 0) {
        window.clearInterval(tick);
        if (!breathDoneRef.current) {
          breathDoneRef.current = true;
          void claimRef.current("breath");
        }
        return;
      }
      inhale = !inhale;
      setBreathScale(inhale ? 1.15 : 0.85);
    }, 1000);
    return () => window.clearInterval(tick);
  }, [screen]);

  function startMemory() {
    setDeck(makeDeck());
    setMoves(0);
    setPairs(0);
    setMemLock(false);
    openRef.current = [];
    setMsg("");
    setScreen("memory");
  }

  function startQuiz() {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizLock(false);
    setMsg("");
    setScreen("quiz");
  }

  function startBreath() {
    setMsg("");
    setScreen("breath");
  }

  function backToLobby() {
    setScreen("lobby");
    setMsg("");
  }

  function flipCard(index: number) {
    if (memLock) return;
    setDeck((prev) => {
      const card = prev[index];
      if (!card || card.done || card.open) return prev;
      const next = prev.map((c, i) => (i === index ? { ...c, open: true } : c));
      const open = [...openRef.current, index];
      openRef.current = open;
      if (open.length === 2) {
        setMemLock(true);
        setMoves((m) => m + 1);
        const [a, b] = open;
        const ca = next[a];
        const cb = next[b];
        if (ca.pair === cb.pair) {
          const matched = next.map((c, i) => (i === a || i === b ? { ...c, done: true, open: true } : c));
          openRef.current = [];
          setMemLock(false);
          setPairs((p) => {
            const newPairs = p + 1;
            if (newPairs >= MEMORY_EMOJIS.length) {
              window.setTimeout(() => void claimReward("memory"), 400);
            }
            return newPairs;
          });
          return matched;
        }
        window.setTimeout(() => {
          setDeck((cur) => cur.map((c, i) => (i === a || i === b ? { ...c, open: false } : c)));
          openRef.current = [];
          setMemLock(false);
        }, 700);
      }
      return next;
    });
  }

  function answerQuiz(choice: number) {
    if (quizLock) return;
    setQuizLock(true);
    const q = quizQuestions[quizIdx];
    const pack = lang === "el" ? q.el : q.de;
    const correct = choice === pack.a;
    const nextScore = correct ? quizScore + 1 : quizScore;
    if (correct) setQuizScore(nextScore);
    window.setTimeout(() => {
      const next = quizIdx + 1;
      if (next >= quizQuestions.length) {
        setQuizIdx(next);
        void claimReward("quiz");
      } else {
        setQuizIdx(next);
        setQuizLock(false);
      }
    }, correct ? 350 : 600);
  }

  if (!ready) return <main className="page kids">{t("loading", lang)}</main>;

  const qPack = quizQuestions[quizIdx] ? (lang === "el" ? quizQuestions[quizIdx].el : quizQuestions[quizIdx].de) : null;

  return (
    <main className="page kids" data-tour="tour-games">
      <header className="top">
        <div>
          <p className="eyebrow">{t("kidsGames", lang)}</p>
          <h1>{t("kidsGames", lang)}</h1>
        </div>
        {screen !== "lobby" && (
          <button className="btn ghost" type="button" onClick={backToLobby}>
            {t("gameBack", lang)}
          </button>
        )}
      </header>

      {screen === "lobby" && (
        <section className="panel stack">
          {msg && <p className="muted">{msg}</p>}
          <button className="btn" type="button" onClick={startMemory}>
            <strong>{t("gameMemory", lang)}</strong>
            <span className="muted text-sm block mt-1">{t("gameMemoryHint", lang)}</span>
          </button>
          <button className="btn" type="button" onClick={startQuiz}>
            <strong>{t("gameQuiz", lang)}</strong>
            <span className="muted text-sm block mt-1">{t("gameQuizHint", lang)}</span>
          </button>
          <button className="btn ghost" type="button" onClick={startBreath}>
            <strong>{t("gameCalm", lang)}</strong>
            <span className="muted text-sm block mt-1">{t("gameCalmHint", lang)}</span>
          </button>
          <Link className="btn ghost" href="/kids">
            {t("kidsToday", lang)}
          </Link>
        </section>
      )}

      {screen === "memory" && (
        <section className="panel stack">
          <p className="muted">
            {t("gameMoves", lang)}: <strong>{moves}</strong> · {t("gamePairs", lang)}:{" "}
            <strong>
              {pairs}/{MEMORY_EMOJIS.length}
            </strong>
          </p>
          {pairs >= MEMORY_EMOJIS.length && (
            <p>
              <strong>{t("gameWin", lang)}</strong>
            </p>
          )}
          {msg && <p className="muted">{msg}</p>}
          <div className="game-board">
            {deck.map((card, i) => (
              <button
                key={card.id}
                type="button"
                className={`game-card${card.open || card.done ? " flipped" : ""}`}
                onClick={() => flipCard(i)}
                disabled={card.done || memLock}
                aria-label={card.open || card.done ? card.emoji : "card"}
              >
                {card.open || card.done ? card.emoji : "🌊"}
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "quiz" && qPack && quizIdx < quizQuestions.length && (
        <section className="panel stack">
          <p className="muted">
            {t("gameQuestion", lang)} {quizIdx + 1}/{quizQuestions.length} · {t("gameScore", lang)}: {quizScore}
          </p>
          {msg && <p className="muted">{msg}</p>}
          <p>
            <strong>{qPack.q}</strong>
          </p>
          <div className="stack">
            {qPack.choices.map((choice, i) => (
              <button key={choice} className="btn ghost" type="button" disabled={quizLock} onClick={() => answerQuiz(i)}>
                {choice}
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "quiz" && quizIdx >= quizQuestions.length && (
        <section className="panel stack">
          <p>
            <strong>{t("gameWin", lang)}</strong> — {quizScore}/{quizQuestions.length}
          </p>
          {msg && <p className="muted">{msg}</p>}
          <button className="btn" type="button" onClick={backToLobby}>
            {t("gameBack", lang)}
          </button>
        </section>
      )}

      {screen === "breath" && (
        <section className="panel stack" style={{ alignItems: "center" }}>
          <p className="muted">{breathLeft}s</p>
          <div
            aria-hidden="true"
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "3px solid var(--brand)",
              background: "var(--pine-tint)",
              transform: `scale(${breathScale})`,
              transition: "transform 1s ease-in-out",
              margin: "12px auto",
            }}
          />
          <p className="muted">{t("gameCalmHint", lang)}</p>
          {breathLeft <= 0 && (
            <p>
              <strong>{t("gameWin", lang)}</strong>
            </p>
          )}
          {msg && <p className="muted">{msg}</p>}
        </section>
      )}

      <Dock mode="child" />
      <GuidedTour mode="child" />
    </main>
  );
}
