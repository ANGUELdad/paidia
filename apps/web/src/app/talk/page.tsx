"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type Msg = { id: string; author: string; body: string; createdAt: string; text?: string };
type Note = { id: string; weekKey: string; title: string; body: string };

const TOPICS = [
  { id: "general", label: "Allgemein" },
  { id: "ops", label: "Betrieb" },
  { id: "handover", label: "Übergabe" },
  { id: "kids", label: "Kinder" },
] as const;

function isoWeekKey(d = new Date()) {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export default function TalkPage() {
  const { ready } = useRequireMode("staff");
  const [topic, setTopic] = useState("general");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [detail, setDetail] = useState<Note | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const weekKey = isoWeekKey();

  async function load() {
    setError("");
    try {
      const t = await api<{ messages: Msg[] }>(`/api/talk?topic=${encodeURIComponent(topic)}`);
      setMessages(t.messages || []);
      const m = await api<{ notes: Note[] }>(`/api/meeting-notes?weekKey=${weekKey}`);
      setNotes(m.notes || []);
    } catch (e) {
      setError((e as Error).message || "Talk konnte nicht geladen werden");
    }
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
  }, [ready, topic]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", noteOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [noteOpen, detail]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/talk", { method: "POST", body: JSON.stringify({ topic, body }) });
      setBody("");
      await load();
    } catch (err) {
      setError((err as Error).message || "Senden fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  async function saveNote(e: FormEvent) {
    e.preventDefault();
    if (!noteBody.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/meeting-notes", {
        method: "POST",
        body: JSON.stringify({ weekKey, title: noteTitle || "Besprechung", body: noteBody }),
      });
      setNoteTitle("");
      setNoteBody("");
      setNoteOpen(false);
      await load();
    } catch (err) {
      setError((err as Error).message || "Notiz speichern fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell eyebrow="Talk" title="Team-Chat" lead="Nachrichten und Besprechungsnotizen der Woche.">
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}

        <div className="seg-bar" role="tablist" aria-label="Thema">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={topic === t.id}
              className={`btn-sec ${topic === t.id ? "ring-2 ring-[var(--brand)]" : ""}`}
              onClick={() => setTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <section className="chat-shell mb-4" aria-label="Nachrichten">
          <div className="chat-log" ref={logRef} data-testid="talk-log">
            {!messages.length ? (
              <EmptyState title="Noch keine Nachrichten" hint="Schreibe dem Team — Thema oben wechseln." />
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bubble">
                  <strong>{m.author}</strong>
                  <p className="m-0 mt-1">{m.body || m.text}</p>
                  <small className="muted">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString("de-DE") : ""}
                  </small>
                </div>
              ))
            )}
          </div>
          <form className="chat-composer row" onSubmit={send}>
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Nachricht…"
              aria-label="Nachricht"
              data-testid="talk-input"
            />
            <button className="btn" type="submit" disabled={busy || !body.trim()}>
              Senden
            </button>
          </form>
        </section>

        <div className="list-panel">
          <div className="list-sticky">
            <span>Besprechung · {weekKey}</span>
            <button
              type="button"
              className="btn-sec"
              style={{ minHeight: 36, fontSize: "0.75rem" }}
              onClick={() => setNoteOpen(true)}
              data-testid="talk-note-open"
            >
              Notiz
            </button>
          </div>
          {!notes.length ? (
            <div className="list-row" style={{ cursor: "default" }}>
              <div className="list-row__main">
                <div className="list-row__title">Keine Notizen</div>
                <div className="list-row__meta">Tippe „Notiz“ für die Wochenbesprechung.</div>
              </div>
            </div>
          ) : (
            notes.map((n) => (
              <button key={n.id} type="button" className="list-row" onClick={() => setDetail(n)}>
                <div className="list-row__main">
                  <div className="list-row__title">{n.title}</div>
                  <div className="list-row__meta">
                    {(n.body || "").slice(0, 90)}
                    {(n.body || "").length > 90 ? "…" : ""}
                  </div>
                </div>
                <span aria-hidden>→</span>
              </button>
            ))
          )}
        </div>
      </PageShell>

      {noteOpen && (
        <div className="more-overlay" role="presentation" onClick={() => setNoteOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>Notiz · {weekKey}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setNoteOpen(false)}>
                ✕
              </button>
            </header>
            <form className="stack" onSubmit={saveNote}>
              <label>
                Titel
                <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Besprechung" />
              </label>
              <label>
                Notizen
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="Punkte der Woche…"
                  rows={5}
                  required
                />
              </label>
              <button className="btn" type="submit" disabled={busy || !noteBody.trim()}>
                Speichern
              </button>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.title}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-xs mb-2">{detail.weekKey}</p>
            <p className="body-sm whitespace-pre-wrap overflow-wrap-anywhere">{detail.body}</p>
          </div>
        </div>
      )}

      <Dock />
    </>
  );
}
