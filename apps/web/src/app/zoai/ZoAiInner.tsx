"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { EmptyState } from "@/components/EmptyState";
import { useGuideOptional } from "@/components/GuideProvider";
import { api } from "@/lib/api";
import { resolveGuideIntent } from "@/lib/guide-intents";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";
import {
  actionNeedsPin,
  actionStr,
  describeAction,
  isNavigateAction,
  type ZoAiAction,
} from "@/lib/zoai-actions";

type Msg = { role: "user" | "assistant"; text: string; meta?: string; actions?: ZoAiAction[] };
type GuidePayload = { href?: string; spotlight?: string; title?: string; body?: string };

function pinSafeStatus(raw: string) {
  if (/pin/i.test(raw)) return "PIN erforderlich";
  return raw;
}

async function applyShopFallback(action: ZoAiAction): Promise<boolean> {
  const type = action.type || "";
  const name = (actionStr(action, "name") || actionStr(action, "productQuery")).trim();
  const houseId = actionStr(action, "houseId", "h1");
  if (type === "want_bought" && name) {
    await api("/api/shop/friday/add", {
      method: "POST",
      body: JSON.stringify({ houseId, name, qty: 1 }),
    });
    return true;
  }
  if (type === "shop_remove" && name) {
    const list = await api<{ entries?: { id: string; name?: string; houseId?: string }[] }>("/api/shop/list");
    const q = name.toLowerCase();
    const hit = (list.entries || []).find((e) => {
      const n = (e.name || "").toLowerCase();
      if (!n.includes(q) && q && !q.includes(n)) return false;
      return !houseId || !e.houseId || e.houseId === houseId;
    });
    if (!hit) return false;
    await api("/api/shop/done", { method: "POST", body: JSON.stringify({ entryId: hit.id }) });
    return true;
  }
  return false;
}

export default function ZoAiInner() {
  const { session, ready } = useRequireMode("staff");
  const guide = useGuideOptional();
  const router = useRouter();
  const search = useSearchParams();
  const [lang, setLang] = useState<Lang>("de");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [actions, setActions] = useState<ZoAiAction[]>([]);
  const [listening, setListening] = useState(false);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [guideHint, setGuideHint] = useState<GuidePayload | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const autoAsked = useRef(false);

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

  function beginGuide(g: GuidePayload, navigate: boolean) {
    if (!g.href || !g.spotlight || !g.title || !g.body) return;
    if (guide) {
      guide.startGuide(
        {
          id: g.spotlight,
          href: g.href,
          spotlight: g.spotlight,
          title: g.title,
          body: g.body,
        },
        "zoai",
        { navigate },
      );
      return;
    }
    if (navigate) router.push(g.href);
  }

  async function runAsk(value: string) {
    if (!value.trim() || busy) return;
    setBusy(true);
    setStatus("…");
    setMessages((m) => [...m, { role: "user", text: value }]);
    setText("");
    setGuideHint(null);
    try {
      const r = await api<{
        reply?: string;
        message?: string;
        actions: ZoAiAction[];
        varietySeed?: string;
        provider?: string;
        guide?: GuidePayload | null;
      }>("/api/zoai/chat", {
        method: "POST",
        body: JSON.stringify({ text: value, voice: listening, messages: [{ role: "user", content: value }] }),
      });
      const reply = r.reply || r.message || "";
      const nextActions = r.actions || [];
      const localGuide = resolveGuideIntent(value);
      const g =
        r.guide ||
        (localGuide
          ? { href: localGuide.href, spotlight: localGuide.spotlight, title: localGuide.title, body: localGuide.body }
          : null);
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
      if (g?.spotlight && g.href && g.title && g.body) {
        setGuideHint(g);
        const here = window.location.pathname;
        if (g.href === here) beginGuide(g, false);
      }
    } catch (err) {
      const msg = (err as Error).message || "Fehler";
      setStatus(pinSafeStatus(msg));
      setMessages((m) => [...m, { role: "assistant", text: pinSafeStatus(msg) }]);
    } finally {
      setBusy(false);
    }
  }

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    await runAsk(text.trim());
  }

  useEffect(() => {
    if (!ready || autoAsked.current) return;
    const q = search.get("guideAsk");
    if (!q) return;
    autoAsked.current = true;
    setText(q);
    void runAsk(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, search]);

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
      void runAsk(said);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => {
      setListening(false);
      setStatus(t("speechUnavailable", lang));
    };
    setListening(true);
    rec.start();
  }

  function dropAction(action: ZoAiAction) {
    setActions((list) => list.filter((a) => a !== action));
    setPin("");
  }

  async function apply(action: ZoAiAction) {
    if (isNavigateAction(action)) {
      const card = describeAction(action);
      if (card.href) router.push(card.href);
      dropAction(action);
      setStatus("Geöffnet");
      return;
    }
    const needsPin = actionNeedsPin(action);
    try {
      const r = await api<{ ok: boolean; error?: string }>("/api/zoai/apply", {
        method: "POST",
        body: JSON.stringify({ action, actions: [action], pin: needsPin ? pin : undefined }),
      });
      if (r.ok) {
        dropAction(action);
        setStatus("Übernommen");
        return;
      }
      if (await applyShopFallback(action).catch(() => false)) {
        dropAction(action);
        setStatus("Übernommen");
        return;
      }
      setStatus(pinSafeStatus(r.error || "Fehlgeschlagen"));
    } catch (err) {
      if (await applyShopFallback(action).catch(() => false)) {
        dropAction(action);
        setStatus("Übernommen");
        return;
      }
      setStatus(pinSafeStatus((err as Error).message || "Fehlgeschlagen"));
    }
  }

  function onComposerKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void runAsk(text.trim());
    }
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
            <EmptyState title="Frag Zo-Ai" hint="Frag „wie…“ — Zo-Ai erklärt und führt dich auf dem Bildschirm." />
          )}
          {messages.map((m, i) => (
            <article key={i} className={`bubble ${m.role}`}>
              <p className="m-0">{m.text}</p>
              {m.meta && <small>{m.meta}</small>}
            </article>
          ))}
          {busy && <p className="muted text-sm">{t("loading", lang)}</p>}
        </div>

        {guideHint?.title && (
          <div className="dawn-card" data-testid="zoai-guide-hint">
            <p className="dawn-kicker">BILDSCHIRMFÜHRUNG</p>
            <p className="m-0">
              <strong>{guideHint.title}</strong> — {guideHint.body}
            </p>
            <button
              type="button"
              className="btn mt-3"
              data-testid="zoai-guide-again"
              onClick={() => beginGuide(guideHint, true)}
            >
              Zeig mir auf dem Bildschirm
            </button>
          </div>
        )}

        {actions.length > 0 && session?.mode === "staff" && (
          <div className="stack">
            <h2 className="text-base m-0">{t("confirmActions", lang)}</h2>
            {anyPinRequired && (
              <label>
                {t("pinIfNeeded", lang)}
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
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
                          {card.chips.map((c) =>
                            c.href ? (
                              <button
                                key={`${c.label}-${c.value}`}
                                type="button"
                                className="action-card-chip"
                                onClick={() => router.push(c.href!)}
                              >
                                <strong>{c.label}</strong> {c.value}
                              </button>
                            ) : (
                              <span key={`${c.label}-${c.value}`} className="action-card-chip">
                                <strong>{c.label}</strong> {c.value}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                      {needsPin && !pin && <p className="action-card-pin">PIN erforderlich</p>}
                    </div>
                    <button className="btn" type="button" disabled={needsPin && !pin.trim()} onClick={() => apply(action)}>
                      {card.navigateOnly ? (lang === "el" ? "Άνοιγμα" : "Öffnen") : t("confirm", lang)}
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
            onKeyDown={onComposerKey}
            rows={2}
            placeholder="Frag Zo-Ai…"
            data-testid="zoai-input"
          />
          <div className="row">
            <button className="btn" type="submit" disabled={busy || !text.trim()} data-testid="zoai-send">
              {busy ? "…" : t("send", lang)}
            </button>
            <button className="btn-sec" type="button" onClick={startVoice} disabled={busy}>
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
