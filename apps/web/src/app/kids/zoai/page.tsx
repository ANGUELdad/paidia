"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang, type MsgKey } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

const SUGGESTIONS: MsgKey[] = ["zoaiKidsSuggest1", "zoaiKidsSuggest2", "zoaiKidsSuggest3", "zoaiKidsSuggest4"];

type Msg = { role: "user" | "assistant"; text: string; meta?: string };

export default function KidsZoAiPage() {
  const { ready } = useRequireMode("child");
  const [lang, setLang] = useState<Lang>("de");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
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
  }, [messages, busy]);

  async function ask(prompt?: string) {
    const value = (prompt ?? text).trim();
    if (!value || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text: value }]);
    setText("");
    try {
      const r = await api<{ reply?: string; message?: string; provider?: string; actions?: unknown[] }>("/api/zoai/chat", {
        method: "POST",
        body: JSON.stringify({ text: value, messages: [{ role: "user", content: value }] }),
      });
      // Chat only — never render or apply staff actions even if the API sends them.
      setMessages((m) => [
        ...m,
        { role: "assistant", text: r.reply || r.message || "", meta: r.provider || "ok" },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: (e as Error).message || t("errorDefault", lang) },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask();
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  if (!ready) return <main className="page kids">{t("loading", lang)}</main>;

  return (
    <main className="page kids" data-tour="tour-zoai">
      <header className="top">
        <div>
          <p className="eyebrow">Zo-Ai</p>
          <h1>{t("assistant", lang)}</h1>
        </div>
      </header>
      <section className="panel chat-shell">
        <p className="muted text-sm m-0">{t("zoaiKidsLead", lang)}</p>

        <div className="chat-log" ref={logRef} data-testid="kids-chat-log">
          {!messages.length && !busy && <EmptyState title={t("zoaiKidsWelcome", lang)} />}
          {messages.map((m, i) => (
            <article key={i} className={`bubble ${m.role}`}>
              <p className="m-0">{m.text}</p>
              {m.meta && <small>{m.meta}</small>}
            </article>
          ))}
          {busy && <p className="muted text-sm">{t("loading", lang)}</p>}
        </div>

        <div className="chips">
          {SUGGESTIONS.map((key) => (
            <button key={key} type="button" className="chip" onClick={() => ask(t(key, lang))}>
              {t(key, lang)}
            </button>
          ))}
        </div>

        <form className="chat-composer" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="kids-zoai-input">
            {t("zoaiKidsPlaceholder", lang)}
          </label>
          <textarea
            id="kids-zoai-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            rows={2}
            placeholder={t("zoaiKidsPlaceholder", lang)}
          />
          <button className="btn" type="submit" disabled={busy || !text.trim()}>
            {t("send", lang)}
          </button>
        </form>
      </section>
      <Dock mode="child" />
      <GuidedTour mode="child" />
    </main>
  );
}
