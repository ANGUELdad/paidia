"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type Msg = { id: string; author: string; body: string; createdAt: string; text?: string };
type Note = { id: string; weekKey: string; title: string; body: string };

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
  const weekKey = isoWeekKey();

  async function load() {
    const t = await api<{ messages: Msg[] }>(`/api/talk?topic=${encodeURIComponent(topic)}`);
    setMessages(t.messages || []);
    const m = await api<{ notes: Note[] }>(`/api/meeting-notes?weekKey=${weekKey}`);
    setNotes(m.notes || []);
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
  }, [ready, topic]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    await api("/api/talk", { method: "POST", body: JSON.stringify({ topic, body }) });
    setBody("");
    await load();
  }

  async function saveNote(e: FormEvent) {
    e.preventDefault();
    await api("/api/meeting-notes", {
      method: "POST",
      body: JSON.stringify({ weekKey, title: noteTitle || "Besprechung", body: noteBody }),
    });
    setNoteTitle("");
    setNoteBody("");
    await load();
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell eyebrow="Talk" title="Team-Chat" lead="Nachrichten und Besprechungsnotizen der Woche.">
      <div className="chips">
        {["general", "ops", "kids"].map((t) => (
          <button key={t} className={topic === t ? "chip on" : "chip"} type="button" onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>
      <section className="panel stack">
        {messages.map((m) => (
          <div key={m.id} className="bubble">
            <strong>{m.author}</strong>
            <p>{m.body || m.text}</p>
            <small>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</small>
          </div>
        ))}
        <form className="row" onSubmit={send}>
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Nachricht…" />
          <button className="btn" type="submit">
            Senden
          </button>
        </form>
      </section>
      <section className="panel stack">
        <h2>Meeting notes · {weekKey}</h2>
        {notes.map((n) => (
          <article key={n.id}>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
          </article>
        ))}
        <form className="stack" onSubmit={saveNote}>
          <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Titel" />
          <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Notizen" rows={4} />
          <button className="btn" type="submit">
            Speichern
          </button>
        </form>
      </section>
      </PageShell>
      <Dock />
    </>
  );
}
