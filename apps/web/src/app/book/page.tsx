"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type AuditEntry = { type: string; text: string; at?: number };

const FILTERS = [
  { id: "", label: "Alle" },
  { id: "STOCK", label: "Lager" },
  { id: "SCHEDULE", label: "Plan" },
  { id: "JOURNAL", label: "Buch" },
  { id: "PRESENCE", label: "Präsenz" },
  { id: "BROADCAST", label: "Rund" },
];

export default function BookPage() {
  const { ready } = useRequireMode("staff");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [journalOpen, setJournalOpen] = useState(false);
  const [detail, setDetail] = useState<AuditEntry | null>(null);
  const [error, setError] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [profileId, setProfileId] = useState("");

  async function reloadAudit() {
    const a = await api<{ entries: AuditEntry[] }>("/api/book/audit?range=week");
    setAudit(a.entries || []);
  }

  useEffect(() => {
    if (!ready) return;
    (async () => {
      setError("");
      try {
        const s = await api<{ profileId?: string }>("/api/auth/session");
        if (!s.profileId) return;
        setProfileId(s.profileId);
        const j = await api<{ note?: { text?: string } }>(`/api/book/journal/${s.profileId}?date=${today}`);
        setNote(j.note?.text || "");
        await reloadAudit();
      } catch (e) {
        setError((e as Error).message || "Buch konnte nicht geladen werden");
      }
    })().catch(console.error);
  }, [ready, today]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", journalOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [journalOpen, detail]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await api<{ note: { text: string } }>("/api/book/journal", {
      method: "POST",
      body: JSON.stringify({ date: today, text, mode: "append" }),
    });
    setNote(res.note.text);
    setText("");
    setJournalOpen(false);
    await reloadAudit();
  }

  const filtered = useMemo(
    () => audit.filter((e) => !filter || e.type === filter || (e.text || "").toLowerCase().includes(filter.toLowerCase())),
    [audit, filter],
  );

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell eyebrow="Buch" title="Schichtbuch" lead="Kurzer Tagesstand · Audit als dichte Liste.">
        {error && <p className="warn">{error}</p>}

        <div className="list-panel mb-3">
          <div className="list-sticky">
            <span>Heute {today}</span>
            <button type="button" className="btn-sec" style={{ minHeight: 36, fontSize: "0.75rem" }} onClick={() => setJournalOpen(true)}>
              Schreiben
            </button>
          </div>
          <button type="button" className="list-row" onClick={() => setJournalOpen(true)} data-testid="journal-preview">
            <div className="list-row__main">
              <div className="list-row__title">Tagesnotiz</div>
              <div className="list-row__meta">{note ? note.slice(0, 100) + (note.length > 100 ? "…" : "") : "Noch leer — tippen zum Schreiben"}</div>
            </div>
            <span aria-hidden>→</span>
          </button>
        </div>

        <div className="seg-bar" aria-label="Audit-Filter">
          {FILTERS.map((f) => (
            <button key={f.id || "all"} type="button" className={`btn-sec ${filter === f.id ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="list-panel">
            <div className="list-sticky">
              <span>Audit Woche</span>
              <span>{filtered.length}</span>
            </div>
            {filtered.map((e, i) => (
              <button key={`${e.type}-${e.at || i}`} type="button" className="list-row" onClick={() => setDetail(e)}>
                <div className="list-row__main">
                  <div className="list-row__title">{e.type}</div>
                  <div className="list-row__meta">
                    {(e.text || "").slice(0, 80)}
                    {(e.text || "").length > 80 ? "…" : ""}
                  </div>
                </div>
                <span className="muted text-xs">
                  {e.at ? new Date(e.at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="Kein Audit" hint="Noch keine Einträge für diesen Filter." />
        )}
      </PageShell>

      {journalOpen && (
        <div className="more-overlay" role="presentation" onClick={() => setJournalOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>Schichtbuch {today}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setJournalOpen(false)}>
                ✕
              </button>
            </header>
            {note && <pre className="mb-3 whitespace-pre-wrap text-sm text-[var(--ink)]">{note}</pre>}
            <form className="stack" onSubmit={save}>
              <label>
                Neuer Eintrag
                <textarea
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white p-3"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Was ist passiert?"
                  aria-label="Was ist passiert?"
                />
              </label>
              <button className="btn" type="submit" disabled={!text.trim() || !profileId}>
                Eintrag speichern
              </button>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.type}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="body-sm overflow-wrap-anywhere">{detail.text}</p>
            {detail.at ? <p className="muted text-xs mt-2">{new Date(detail.at).toLocaleString("de-DE")}</p> : null}
          </div>
        </div>
      )}

      <Dock />
    </>
  );
}
