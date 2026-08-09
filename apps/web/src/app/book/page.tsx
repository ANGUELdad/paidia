"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

export default function BookPage() {
  const { ready } = useRequireMode("staff");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [audit, setAudit] = useState<Array<{ type: string; text: string; at?: number }>>([]);
  const [filter, setFilter] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    if (!ready) return;
    (async () => {
      const s = await api<{ profileId?: string }>("/api/auth/session");
      if (!s.profileId) return;
      setProfileId(s.profileId);
      const j = await api<{ note?: { text?: string } }>(`/api/book/journal/${s.profileId}?date=${today}`);
      setNote(j.note?.text || "");
      const a = await api<{ entries: typeof audit }>("/api/book/audit?range=week");
      setAudit(a.entries || []);
    })().catch(console.error);
  }, [ready, today]);

  async function save() {
    if (!text.trim()) return;
    const res = await api<{ note: { text: string } }>("/api/book/journal", {
      method: "POST",
      body: JSON.stringify({ date: today, text, mode: "append" }),
    });
    setNote(res.note.text);
    setText("");
    const a = await api<{ entries: typeof audit }>("/api/book/audit?range=week");
    setAudit(a.entries || []);
  }

  const filtered = audit.filter((e) => !filter || e.type === filter || (e.text || "").toLowerCase().includes(filter.toLowerCase()));

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6">
      <h1 className="text-3xl">Buch</h1>
      <p className="text-sm text-[var(--muted)]">Schichtbuch — muss geschrieben werden. Unten: was passiert ist.</p>
      <section className="card mt-4" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(42,107,82,0.12) 28px)", lineHeight: "28px" }}>
        <h2 className="text-lg">Schichtbuch {today}</h2>
        <pre className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink)]">{note || "Noch leer — schreib den Tag."}</pre>
        <textarea className="mt-3 w-full rounded-xl border border-[var(--line)] bg-white/90 p-3" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Was ist passiert?" />
        <button className="btn mt-3" type="button" onClick={save}>Eintrag speichern</button>
      </section>
      <section className="mt-6">
        <div className="mb-2 flex flex-wrap gap-2">
          {["", "STOCK", "SCHEDULE", "JOURNAL", "PRESENCE", "BROADCAST"].map((t) => (
            <button key={t || "all"} type="button" className={`btn-sec !min-h-9 text-xs ${filter === t ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter(t)}>{t || "Alle"}</button>
          ))}
        </div>
        <div className="grid gap-2">
          {filtered.map((e, i) => (
            <div key={i} className="card text-sm">
              <span className="mr-2 font-bold text-[var(--sea)]">{e.type}</span>
              {e.text}
            </div>
          ))}
        </div>
      </section>
      <Dock />
    </main>
  );
}
