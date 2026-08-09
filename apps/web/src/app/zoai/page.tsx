"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";
import { actionNeedsPin, describeAction, type ZoAiAction } from "@/lib/zoai-actions";

type Msg = { role: "user" | "assistant"; text: string; meta?: string; actions?: ZoAiAction[] };

export default function ZoAiPage() {
  const { session, ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [actions, setActions] = useState<ZoAiAction[]>([]);
  const [listening, setListening] = useState(false);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    api("/api/auth/session").catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, actions, busy]);

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    if (!text.trim() || busy) return;
    const value = text.trim();
    setBusy(true);
    setStatus("…");
    setMessages((m) => [...m, { role: "user", text: value }]);
    setText("");
    try {
      const r = await api<{ reply?: string; message?: string; actions: ZoAiAction[]; varietySeed?: string; provider?: string }>(
        "/api/zoai/chat",
        {
          method: "POST",
          body: JSON.stringify({ text: value, voice: listening, messages: [{ role: "user", content: value }] }),
        },
      );
      const reply = r.reply || r.message || "";
      const nextActions = r.actions || [];
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: reply,
          meta: `${r.provider || "ok"}${r.varietySeed ? ` · seed ${r.varietySeed}` : ""}`,
          actions: nextActions,
        },
      ]);
      setActions(nextActions);
      setStatus(`${r.provider || "ok"}`);
    } catch (err) {
      const msg = (err as Error).message || "Fehler";
      setStatus(msg);
      setMessages((m) => [...m, { role: "assistant", text: msg }]);
    } finally {
      setBusy(false);
    }
  }

  function startVoice() {
    type Rec = {
      lang: string;
      start: () => void;
      onresult: ((ev: { results: SpeechRecognitionResultList }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
    };
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => Rec;
      SpeechRecognition?: new () => Rec;
    };
    const SR = w.webkitSpeechRecognition || w.SpeechRecognition;
    if (!SR) {
      setStatus(t("speechUnavailable", lang));
      return;
    }
    const rec = new SR();
    rec.lang = lang === "el" ? "el-GR" : "de-DE";
    rec.onresult = (ev) => {
      const said = ev.results[0][0].transcript;
      setText(said);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => {
      setListening(false);
      setStatus(t("speechUnavailable", lang));
    };
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

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  return (
    <main className="page">
      <header className="top">
        <div>
          <p className="eyebrow">Zo-Ai</p>
          <h1>{t("assistant", lang)}</h1>
        </div>
      </header>
      <section className="panel chat-shell" data-tour="tour-zoai">
        <div className="chat-log" ref={logRef} data-testid="staff-chat-log">
          {!messages.length && !busy && (
            <EmptyState title="Frag Zo-Ai" hint="Lager, Plan, Liste — Aktionen immer bestätigen." />
          )}
          {messages.map((m, i) => (
            <article key={i} className={`bubble ${m.role}`}>
              <p className="m-0">{m.text}</p>
              {m.meta && <small>{m.meta}</small>}
            </article>
          ))}
          {busy && <p className="muted text-sm">{t("loading", lang)}</p>}
        </div>

        {actions.length > 0 && session?.mode === "staff" && (
          <div className="stack">
            <h2 className="text-base m-0">{t("confirmActions", lang)}</h2>
            {anyPinRequired && (
              <label>
                {t("pinIfNeeded", lang)}
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="PIN"
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
                    <div className="min-w-0 flex-1">
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
                    <button className="btn" type="button" disabled={needsPin && !pin.trim()} onClick={() => apply(action)}>
                      {t("confirm", lang)}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <form className="chat-composer" onSubmit={ask}>
          <label className="sr-only" htmlFor="zoai-input">
            Frag Zo-Ai
          </label>
          <textarea
            id="zoai-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Frag Zo-Ai…"
          />
          <div className="row">
            <button className="btn" type="submit" disabled={busy || !text.trim()}>
              {busy ? "…" : t("send", lang)}
            </button>
            <button className="btn-sec" type="button" onClick={startVoice}>
              {listening ? t("listening", lang) : t("mic", lang)}
            </button>
          </div>
          {status && <p className="muted text-sm m-0">{status}</p>}
        </form>
      </section>
      <Dock mode="staff" />
      <GuidedTour mode="staff" admin={!!session?.admin} />
    </main>
  );
}
