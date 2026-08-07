"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { api } from "@/lib/api";

type State = { xp: number; streak: number; badges: string[]; lastPlayAt?: string };

export default function KidsPage() {
  const [state, setState] = useState<State | null>(null);
  const [gameMsg, setGameMsg] = useState("");

  async function load() {
    const r = await api<{ state: State }>("/api/kids/rewards");
    setState(r.state);
  }

  useEffect(() => {
    load().catch(() => {
      window.location.href = "/";
    });
  }, []);

  async function play(game: string, score: number) {
    const r = await api<{ state: State; gained: number }>("/api/kids/play", {
      method: "POST",
      body: JSON.stringify({ game, score }),
    });
    setState(r.state);
    setGameMsg(`+${r.gained} XP`);
  }

  return (
    <main className="page kids">
      <header className="top">
        <div>
          <p className="eyebrow">Kids</p>
          <h1>Play & rewards</h1>
        </div>
      </header>
      {state && (
        <section className="panel stack">
          <p>
            XP <strong>{state.xp}</strong> · Streak <strong>{state.streak}</strong>
          </p>
          <div className="chips">
            {(state.badges || []).map((b) => (
              <span key={b} className="chip on">
                {b}
              </span>
            ))}
          </div>
          {gameMsg && <p>{gameMsg}</p>}
          <div className="row">
            <button className="btn" type="button" onClick={() => play("memory", 3)}>
              Memory
            </button>
            <button className="btn" type="button" onClick={() => play("quiz", 2)}>
              Quiz
            </button>
            <button className="btn ghost" type="button" onClick={() => play("breath", 1)}>
              Calm
            </button>
          </div>
          <p className="muted">Zo-Ai is read-only here. Staff ops stay hidden.</p>
        </section>
      )}
      <Dock mode="child" />
      <GuidedTour mode="child" />
    </main>
  );
}
