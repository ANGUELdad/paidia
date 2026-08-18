"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Msg = { id: string; author: string; body: string; createdAt: string; text?: string };
type Note = { id: string; weekKey: string; title: string; body: string };

const TOPICS = [
  { id: "general", de: "Allgemein", el: "Γενικά" },
  { id: "ops", de: "Betrieb", el: "Λειτουργία" },
  { id: "handover", de: "Übergabe", el: "Παράδοση" },
  { id: "kids", de: "Kinder", el: "Παιδιά" },
] as const;

const COPY = {
  de: {
    eyebrow: "Talk",
    title: "Team-Chat",
    lead: "Nachrichten und Besprechungsnotizen der Woche.",
    topics: "Thema",
    messages: "Nachrichten",
    emptyMsg: "Noch keine Nachrichten",
    emptyHint: "Schreibe dem Team — Thema oben wechseln.",
    send: "Senden",
    sending: "Senden…",
    meeting: (w: string) => `Besprechung · ${w}`,
    noteBtn: "Notiz",
    noNotesTitle: "Keine Notizen",
    noNotesMeta: "Tippe „Notiz“ für die Wochenbesprechung.",
    noteSheet: (w: string) => `Notiz · ${w}`,
    titleLabel: "Titel",
    titlePh: "Besprechung",
    notesLabel: "Notizen",
    notesPh: "Punkte der Woche…",
    save: "Speichern",
    saving: "Speichern…",
    close: "Schließen",
    loadFail: "Talk konnte nicht geladen werden",
    sendFail: "Senden fehlgeschlagen",
    noteFail: "Notiz speichern fehlgeschlagen",
    loadingData: "Nachrichten werden geladen…",
    retry: "Erneut laden",
    emptyBody: "Nachricht leer",
  },
  el: {
    eyebrow: "Talk",
    title: "Ομαδική συνομιλία",
    lead: "Μηνύματα και σημειώσεις συνάντησης της εβδομάδας.",
    topics: "Θέμα",
    messages: "Μηνύματα",
    emptyMsg: "Δεν υπάρχουν μηνύματα",
    emptyHint: "Γράψε στην ομάδα — άλλαξε θέμα πάνω.",
    send: "Senden",
    sending: "Αποστολή…",
    meeting: (w: string) => `Συνάντηση · ${w}`,
    noteBtn: "Σημείωση",
    noNotesTitle: "Χωρίς σημειώσεις",
    noNotesMeta: "Πάτησε «Σημείωση» για την εβδομαδιαία συνάντηση.",
    noteSheet: (w: string) => `Σημείωση · ${w}`,
    titleLabel: "Τίτλος",
    titlePh: "Συνάντηση",
    notesLabel: "Σημειώσεις",
    notesPh: "Σημεία της εβδομάδας…",
    save: "Αποθήκευση",
    saving: "Αποθήκευση…",
    close: "Κλείσιμο",
    loadFail: "Το Talk δεν φορτώθηκε",
    sendFail: "Η αποστολή απέτυχε",
    noteFail: "Η σημείωση δεν αποθηκεύτηκε",
    loadingData: "Φόρτωση μηνυμάτων…",
    retry: "Ξανά φόρτωση",
    emptyBody: "Άδειο μήνυμα",
  },
} as const;

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
  const [lang] = useLang();
  const c = COPY[lang];
  const [topic, setTopic] = useState("general");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [detail, setDetail] = useState<Note | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const weekKey = isoWeekKey();
  const locale = lang === "el" ? "el-GR" : "de-DE";

  async function load(quiet = false) {
    setError("");
    if (!quiet) setLoading(true);
    try {
      const tFeed = await api<{ messages: Msg[] }>(`/api/talk?topic=${encodeURIComponent(topic)}`);
      setMessages(tFeed.messages || []);
      const m = await api<{ notes?: Note[]; note?: { weekKey?: string; title?: string; text?: string } }>(
        `/api/talk/meeting/${encodeURIComponent(weekKey)}`,
      );
      if (m.notes?.length) {
        setNotes(m.notes);
      } else if (m.note?.text) {
        setNotes([
          {
            id: m.note.weekKey || weekKey,
            weekKey,
            title: m.note.title || c.titlePh,
            body: m.note.text,
          },
        ]);
      } else {
        setNotes([]);
      }
    } catch (e) {
      setError((e as Error).message || c.loadFail);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const res = await api<{ ok?: boolean; error?: string }>("/api/talk/message", {
        method: "POST",
        body: JSON.stringify({ topic, text: body.trim(), body: body.trim() }),
      });
      if (res && res.ok === false) throw new Error(res.error === "empty" ? c.emptyBody : c.sendFail);
      setBody("");
      await load(true);
    } catch (err) {
      setError((err as Error).message || c.sendFail);
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
      const res = await api<{ ok?: boolean; error?: string }>("/api/talk/meeting", {
        method: "POST",
        body: JSON.stringify({
          weekKey,
          title: noteTitle.trim() || c.titlePh,
          body: noteBody.trim(),
          text: noteBody.trim(),
        }),
      });
      if (res && res.ok === false) throw new Error(res.error === "empty" ? c.emptyBody : c.noteFail);
      setNoteTitle("");
      setNoteBody("");
      setNoteOpen(false);
      await load(true);
    } catch (err) {
      setError((err as Error).message || c.noteFail);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading")}</main>;

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
        <div data-tour="tour-talk">
          {error && (
            <div className="warn mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="seg-bar" role="tablist" aria-label={c.topics}>
            {TOPICS.map((tp) => (
              <button
                key={tp.id}
                type="button"
                role="tab"
                aria-selected={topic === tp.id}
                className={`btn-sec ${topic === tp.id ? "ring-2 ring-[var(--brand)]" : ""}`}
                onClick={() => setTopic(tp.id)}
              >
                {lang === "el" ? tp.el : tp.de}
              </button>
            ))}
          </div>

          <section className="chat-shell mb-4" aria-label={c.messages}>
            <div className="chat-log" ref={logRef} data-testid="talk-log">
              {loading ? (
                <LoadingBlock label={c.loadingData} />
              ) : !messages.length ? (
                <EmptyState
                  title={c.emptyMsg}
                  hint={c.emptyHint}
                  action={
                    <button className="btn-sec" type="button" onClick={() => load()}>
                      {c.retry}
                    </button>
                  }
                />
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="bubble">
                    <strong>{m.author}</strong>
                    <p className="m-0 mt-1">{m.body || m.text}</p>
                    <small className="muted">{m.createdAt ? new Date(m.createdAt).toLocaleString(locale) : ""}</small>
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
                {busy ? c.sending : c.send}
              </button>
            </form>
          </section>

          <div className="list-panel">
            <div className="list-sticky">
              <span>{c.meeting(weekKey)}</span>
              <button
                type="button"
                className="btn-sec"
                style={{ minHeight: 36, fontSize: "0.75rem" }}
                onClick={() => setNoteOpen(true)}
                data-testid="talk-note-open"
              >
                {c.noteBtn}
              </button>
            </div>
            {loading && !notes.length ? (
              <div className="list-row" style={{ cursor: "default" }}>
                <div className="list-row__meta">{c.loadingData}</div>
              </div>
            ) : !notes.length ? (
              <div className="list-row" style={{ cursor: "default" }}>
                <div className="list-row__main">
                  <div className="list-row__title">{c.noNotesTitle}</div>
                  <div className="list-row__meta">{c.noNotesMeta}</div>
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
        </div>
      </PageShell>

      {noteOpen && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setNoteOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{c.noteSheet(weekKey)}</h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setNoteOpen(false)}>
                ✕
              </button>
            </header>
            <form className="stack" onSubmit={saveNote}>
              <label>
                {c.titleLabel}
                <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder={c.titlePh} />
              </label>
              <label>
                {c.notesLabel}
                <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder={c.notesPh} rows={5} required />
              </label>
              <button className="btn" type="submit" disabled={busy || !noteBody.trim()}>
                {busy ? c.saving : c.save}
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
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setDetail(null)}>
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
