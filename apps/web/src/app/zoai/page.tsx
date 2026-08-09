"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";
import { actionNeedsPin, describeAction, type ZoAiAction } from "@/lib/zoai-actions";

export default function ZoAiPage() {
  const { session, ready } = useRequireMode("staff");
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [actions, setActions] = useState<ZoAiAction[]>([]);
  const [listening, setListening] = useState(false);
  const [pin, setPin] = useState("");
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
    const r = await api<{ reply?: string; message?: string; actions: ZoAiAction[]; varietySeed?: string; provider?: string }>(
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
      setStatus("Spracherkennung nicht verfügbar");
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

  async function apply(action: ZoAiAction) {
    const needsPin = actionNeedsPin(action);
    const r = await api<{ ok: boolean; error?: string }>("/api/zoai/apply", {
      method: "POST",
      body: JSON.stringify({ action, actions: [action], pin: needsPin ? pin : undefined }),
    });
    setStatus(r.ok ? "Übernommen" : r.error || "Fehlgeschlagen");
  }

  const anyPinRequired = actions.some(actionNeedsPin);

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <main className="page">
      <header className="top">
        <div>
          <p className="eyebrow">Zo-Ai</p>
          <h1>Assistent</h1>
        </div>
      </header>
      <section className="panel stack" data-tour="tour-zoai">
        <form className="stack" onSubmit={ask}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Frag Zo-Ai…" />
          <div className="row">
            <button className="btn" type="submit">
              Senden
            </button>
            <button className="btn ghost" type="button" onClick={startVoice}>
              {listening ? "Hört zu…" : "Mikrofon"}
            </button>
          </div>
        </form>
        {reply && (
          <article className="bubble">
            <p>{reply}</p>
            <small>{status}</small>
          </article>
        )}
        {actions.length > 0 && session?.mode === "staff" && (
          <div className="stack">
            <h2>Aktionen bestätigen</h2>
            {anyPinRequired && (
              <label>
                PIN (Plan oder Broadcast)
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="6-stellige PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </label>
            )}
            {actions.map((action, i) => {
              const card = describeAction(action);
              const needsPin = card.pinRequired;
              return (
                <article key={i} className="action-card">
                  <div className="action-card-head">
                    <div>
                      <p className="action-card-kind">{card.kind}</p>
                      <p className="action-card-sentence">{card.sentence}</p>
                      {card.chips.length > 0 && (
                        <div className="action-card-chips">
                          {card.chips.map((c) => (
                            <span key={`${c.label}-${c.value}`} className="action-card-chip">
                              <strong>{c.label}</strong> {c.value}
                            </span>
                          ))}
                        </div>
                      )}
                      {needsPin && !pin && <p className="action-card-pin">PIN erforderlich</p>}
                    </div>
                    <button
                      className="btn"
                      type="button"
                      disabled={needsPin && !pin.trim()}
                      onClick={() => apply(action)}
                    >
                      Bestätigen
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <Dock mode="staff" />
      <GuidedTour mode="staff" admin={!!session?.admin} />
    </main>
  );
}
