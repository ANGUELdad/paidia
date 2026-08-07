"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";

export default function KidsGamesPage() {
  const [msg, setMsg] = useState("Tippe ein Spiel — XP landet in deinem Profil.");

  async function play(game: string, score: number) {
    const r = await api<{ gained: number; state: { xp: number } }>("/api/kids/play", {
      method: "POST",
      body: JSON.stringify({ game, score }),
    });
    setMsg(`${game}: +${r.gained} XP · total ${r.state?.xp ?? "?"}`);
  }

  useEffect(() => {
    api("/api/kids/rewards").catch(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <main className="page kids">
      <header className="top">
        <div>
          <p className="eyebrow">Spiele</p>
          <h1>Kids games</h1>
        </div>
      </header>
      <section className="panel stack">
        <p>{msg}</p>
        <button className="btn" type="button" onClick={() => play("memory", 4)}>
          Memory Match
        </button>
        <button className="btn" type="button" onClick={() => play("quiz", 3)}>
          Insel-Quiz
        </button>
        <button className="btn ghost" type="button" onClick={() => play("breath", 1)}>
          Atemreise
        </button>
      </section>
      <Dock mode="child" />
    </main>
  );
}
