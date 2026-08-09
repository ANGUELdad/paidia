"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang, type MsgKey } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

const SUGGESTIONS: MsgKey[] = ["zoaiKidsSuggest1", "zoaiKidsSuggest2", "zoaiKidsSuggest3", "zoaiKidsSuggest4"];

export default function KidsZoAiPage() {
  const { ready } = useRequireMode("child");
  const [lang, setLang] = useState<Lang>("de");
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    api("/api/auth/session").catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setStatus("…");
    try {
      const r = await api<{ reply?: string; message?: string; provider?: string }>("/api/zoai/chat", {
        method: "POST",
        body: JSON.stringify({ text, messages: [{ role: "user", content: text }] }),
      });
      setReply(r.reply || r.message || "");
      setStatus(r.provider || "ok");
    } catch (e) {
      const err = e as Error;
      setStatus(err.message || t("errorDefault", lang));
    } finally {
      setBusy(false);
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
      <section className="panel stack">
        <p className="muted text-sm">{t("zoaiKidsLead", lang)}</p>

        {!reply && !busy && (
          <EmptyState title={t("zoaiKidsWelcome", lang)} />
        )}

        <div className="chips">
          {SUGGESTIONS.map((key) => (
            <button
              key={key}
              type="button"
              className="chip"
              onClick={() => setText(t(key, lang))}
            >
              {t(key, lang)}
            </button>
          ))}
        </div>

        <form className="stack" onSubmit={ask}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={t("zoaiKidsPlaceholder", lang)}
          />
          <button className="btn" type="submit" disabled={busy || !text.trim()}>
            {t("send", lang)}
          </button>
        </form>

        {reply && (
          <article className="bubble">
            <p>{reply}</p>
            <small>{status}</small>
          </article>
        )}
        {busy && !reply && <p className="muted">{t("loading", lang)}</p>}
      </section>
      <Dock mode="child" />
      <GuidedTour mode="child" />
    </main>
  );
}
