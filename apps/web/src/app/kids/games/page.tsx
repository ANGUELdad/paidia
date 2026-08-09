"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

export default function KidsGamesPage() {
  const { ready } = useRequireMode("child");
  const [msg, setMsg] = useState("Tippe ein Spiel — XP landet in deinem Profil.");

  async function play(game: string) {
    try {
      const r = await api<{ gained: number; state: { xp: number } }>("/api/kids/play", {
        method: "POST",
        body: JSON.stringify({ game }),
      });
      setMsg(`${game}: +${r.gained} XP · total ${r.state?.xp ?? "?"}`);
    } catch (e) {
      const err = e as Error;
      setMsg(err.message || "Später nochmal");
    }
  }

  useEffect(() => {
    if (!ready) return;
    api("/api/kids/rewards").catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  if (!ready) return <main className="page kids">Laden…</main>;

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
        <button className="btn" type="button" onClick={() => play("memory")}>
          Memory Match
        </button>
        <button className="btn" type="button" onClick={() => play("quiz")}>
          Insel-Quiz
        </button>
        <button className="btn ghost" type="button" onClick={() => play("breath")}>
          Atemreise
        </button>
      </section>
      <Dock mode="child" />
    </main>
  );
}
