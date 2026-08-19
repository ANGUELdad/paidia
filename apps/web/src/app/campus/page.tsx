"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Dock } from "@/components/Dock";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, type Lang } from "@/lib/i18n";
import { GROUP_LABEL, navHint, navLabel, visibleNav } from "@/lib/nav";
import { useRequireMode } from "@/lib/session";

type Note = { id: string; title: string; body: string; at: number };

function weekKey() {
  const d = new Date();
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function loadLocal(pid: string): Note[] {
  try {
    const raw = localStorage.getItem(`armonia.campus.notes.${pid}`);
    const parsed = raw ? (JSON.parse(raw) as Note[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(pid: string, notes: Note[]) {
  localStorage.setItem(`armonia.campus.notes.${pid}`, JSON.stringify(notes.slice(0, 40)));
}

export default function CampusPage() {
  const { session, ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [meeting, setMeeting] = useState("");
  const el = lang === "el";
  const pid = session?.profileId || "staff";
  const modules = useMemo(() => visibleNav({ mode: "staff", admin: !!session?.admin }), [session?.admin]);
  const wk = useMemo(() => weekKey(), []);

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    setNotes(loadLocal(pid));
    api<{ note?: { text?: string } }>(`/api/talk/meeting/${wk}`)
      .then((r) => setMeeting(r.note?.text || ""))
      .catch(() => undefined);
  }, [ready, pid, wk]);

  function addNote(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const next = [
      { id: `${Date.now()}`, title: title.trim() || (el ? "Σημείωση" : "Notiz"), body: body.trim(), at: Date.now() },
      ...notes,
    ];
    setNotes(next);
    saveLocal(pid, next);
    setTitle("");
    setBody("");
  }

  async function saveMeeting() {
    if (!meeting.trim()) return;
    await api("/api/talk/meeting", {
      method: "POST",
      body: JSON.stringify({ weekKey: wk, title: el ? "Σύσκεψη" : "Besprechung", text: meeting }),
    });
  }

  if (!ready) return <main className="page">{el ? "Φόρτωση…" : "Laden…"}</main>;

  return (
    <>
      <PageShell
        eyebrow="Campus"
        title={el ? "Campus" : "Campus"}
        lead={
          el
            ? "Ενότητες σαν Universis — σημειώσεις, βάρδια, φροντίδα. Όλα σε μία επιφάνεια."
            : "Module wie Universis — Notizen, Schicht, Care. Alles auf einer Fläche."
        }
      >
        <div className="campus-grid">
          <section className="campus-mods">
            {(["shift", "supply", "campus", "account", "admin"] as const).map((group) => {
              const rows = modules.filter((m) => m.group === group);
              if (!rows.length) return null;
              return (
                <div key={group} className="list-panel mb-3">
                  <div className="list-sticky">
                    <span>{lang === "el" ? GROUP_LABEL[group].el : GROUP_LABEL[group].de}</span>
                    <span>{rows.length}</span>
                  </div>
                  <div className="campus-cards">
                    {rows.map((item) => (
                      <Link key={item.href} href={item.href} className="campus-card">
                        <b>{navLabel(item, lang)}</b>
                        <small>{navHint(item, lang)}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="campus-notes stack">
            <div className="list-panel">
              <div className="list-sticky">
                <span>{el ? "Γρήγορη σημείωση" : "Schnellnotiz"}</span>
                <span>{el ? "μόνο εσύ" : "nur du"}</span>
              </div>
              <form className="stack p-4" onSubmit={addNote}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={el ? "Τίτλος" : "Titel"} />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  placeholder={el ? "Τι πρέπει να θυμάσαι;" : "Was soll hängen bleiben?"}
                />
                <button className="btn" type="submit">
                  {el ? "Αποθήκευση" : "Festhalten"}
                </button>
              </form>
            </div>

            <div className="list-panel">
              <div className="list-sticky">
                <span>{el ? "Σύσκεψη" : "Besprechung"}</span>
                <span>{wk}</span>
              </div>
              <div className="stack p-4">
                <textarea
                  value={meeting}
                  onChange={(e) => setMeeting(e.target.value)}
                  rows={4}
                  placeholder={el ? "Σημεία της εβδομάδας…" : "Punkte der Woche…"}
                />
                <button className="btn-sec" type="button" onClick={() => void saveMeeting()}>
                  {el ? "Αποθήκευση ομάδας" : "Team speichern"}
                </button>
              </div>
            </div>

            <div className="list-panel">
              <div className="list-sticky">
                <span>{el ? "Οι σημειώσεις σου" : "Deine Notizen"}</span>
                <span>{notes.length}</span>
              </div>
              {notes.length === 0 ? (
                <div className="list-row" style={{ cursor: "default" }}>
                  <div className="list-row__main">
                    <div className="list-row__meta">{el ? "Άδειο — γράψε την πρώτη." : "Leer — schreib die erste."}</div>
                  </div>
                </div>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="list-row" style={{ cursor: "default" }}>
                    <div className="list-row__main">
                      <div className="list-row__title">{n.title}</div>
                      <div className="list-row__meta">{n.body}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </PageShell>
      <Dock />
    </>
  );
}
