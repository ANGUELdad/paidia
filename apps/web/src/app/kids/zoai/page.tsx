"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

export default function KidsZoAiPage() {
  const { ready } = useRequireMode("child");
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!ready) return;
    api("/api/auth/session").catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    setStatus("…");
    const r = await api<{ reply?: string; message?: string; provider?: string }>("/api/zoai/chat", {
      method: "POST",
      body: JSON.stringify({ text, messages: [{ role: "user", content: text }] }),
    });
    setReply(r.reply || r.message || "");
    setStatus(r.provider || "ok");
  }

  if (!ready) return <main className="page kids">Laden…</main>;

  return (
    <main className="page kids">
      <header className="top">
        <div>
          <p className="eyebrow">Zo-Ai</p>
          <h1>Frag mich</h1>
        </div>
      </header>
      <section className="panel stack">
        <p className="muted text-sm">Nur Fragen — keine Änderungen an Lager, Plan oder Liste.</p>
        <form className="stack" onSubmit={ask}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Was möchtest du wissen?" />
          <button className="btn" type="submit">
            Senden
          </button>
        </form>
        {reply && (
          <article className="bubble">
            <p>{reply}</p>
            <small>{status}</small>
          </article>
        )}
      </section>
      <Dock mode="child" />
    </main>
  );
}
