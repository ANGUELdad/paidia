"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";

type Action = { type: string; payload?: Record<string, unknown> } & Record<string, unknown>;

export default function ZoAiPage() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [actions, setActions] = useState<Action[]>([]);
  const [listening, setListening] = useState(false);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    api("/api/auth/session").catch(() => {
      window.location.href = "/";
    });
  }, []);

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    setStatus("…");
    const r = await api<{ reply?: string; message?: string; actions: Action[]; varietySeed?: string; provider?: string }>(
      "/api/zoai/chat",
      {
        method: "POST",
        body: JSON.stringify({ text, voice: listening, messages: [{ role: "user", content: text }] }),
      }
    );
    setReply(r.reply || r.message || "");
    setActions(r.actions || []);
    setStatus(`${r.provider || "ok"}${r.varietySeed ? ` · seed ${r.varietySeed}` : ""}`);
  }

  function startVoice() {
    type Rec = {
      lang: string;
      start: () => void;
      onresult: ((ev: { results: SpeechRecognitionResultList }) => void) | null;
      onend: (() => void) | null;
    };
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => Rec;
      SpeechRecognition?: new () => Rec;
    };
    const SR = w.webkitSpeechRecognition || w.SpeechRecognition;
    if (!SR) {
      setStatus("Speech recognition not available");
      return;
    }
    const rec = new SR();
    rec.lang = "de-DE";
    rec.onresult = (ev) => {
      const said = ev.results[0][0].transcript;
      setText(said);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }

  async function apply(action: Action) {
    const needsPin =
      action.type.includes("schedule") || action.type.includes("template") || action.type.includes("broadcast");
    const r = await api<{ ok: boolean; error?: string }>("/api/zoai/apply", {
      method: "POST",
      body: JSON.stringify({ action, actions: [action], pin: needsPin ? pin : undefined }),
    });
    setStatus(r.ok ? "Applied" : r.error || "Failed");
  }

  return (
    <main className="page">
      <header className="top">
        <div>
          <p className="eyebrow">Zo-Ai</p>
          <h1>Assistant</h1>
        </div>
      </header>
      <section className="panel stack">
        <form className="stack" onSubmit={ask}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Frag Zo-Ai…" />
          <div className="row">
            <button className="btn" type="submit">
              Senden
            </button>
            <button className="btn ghost" type="button" onClick={startVoice}>
              {listening ? "Listening…" : "Mic"}
            </button>
          </div>
        </form>
        {reply && (
          <article className="bubble">
            <p>{reply}</p>
            <small>{status}</small>
          </article>
        )}
        {actions.length > 0 && (
          <div className="stack">
            <h2>Confirm actions</h2>
            <input
              type="password"
              inputMode="numeric"
              placeholder="PIN if needed"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            {actions.map((a, i) => (
              <div key={i} className="row between">
                <code>
                  {a.type} {JSON.stringify(a.payload || a)}
                </code>
                <button className="btn" type="button" onClick={() => apply(a)}>
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      <Dock />
    </main>
  );
}
