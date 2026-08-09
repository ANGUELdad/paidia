"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type House = { id: string; name: string };

type Incident = {
  id: string;
  severity: string;
  houseId: string;
  houseName?: string;
  text: string;
  childIds?: string[];
  status?: string;
  createdAt?: number;
  createdBy?: string;
  reviewedAt?: number;
  reviewedBy?: string;
};

const SEVERITIES = [
  { id: "low", label: "Gering", hint: "Beobachtung, kein akuter Handlungsbedarf" },
  { id: "medium", label: "Mittel", hint: "Team sollte informiert werden" },
  { id: "high", label: "Hoch", hint: "Sofortige Aufmerksamkeit nötig" },
  { id: "critical", label: "Kritisch", hint: "Leitung / Admin sofort" },
] as const;

const SEVERITY_LABEL: Record<string, string> = Object.fromEntries(SEVERITIES.map((s) => [s.id, s.label]));

const STATUS_LABEL: Record<string, string> = {
  open: "Offen",
  reviewed: "Geprüft",
  closed: "Abgeschlossen",
};

export default function IncidentsPage() {
  const { session, ready } = useRequireMode("staff");
  const [houses, setHouses] = useState<House[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [composeOpen, setComposeOpen] = useState(false);
  const [detail, setDetail] = useState<Incident | null>(null);

  const [severity, setSeverity] = useState("medium");
  const [houseId, setHouseId] = useState("h1");
  const [text, setText] = useState("");
  const [childIdsRaw, setChildIdsRaw] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [list, stock] = await Promise.all([
        api<{ incidents: Incident[] }>("/api/incidents"),
        api<{ houses: House[] }>("/api/stock/snapshot").catch(() => ({ houses: [] as House[] })),
      ]);
      setIncidents(list.incidents || []);
      if (stock.houses?.length) {
        setHouses(stock.houses);
        setHouseId((prev) => (stock.houses.some((h) => h.id === prev) ? prev : stock.houses[0].id));
      }
    } catch (e) {
      setError((e as Error).message || "Vorfälle konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", composeOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [composeOpen, detail]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    setMsg("");
    const childIds = childIdsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await api("/api/incidents", {
        method: "POST",
        body: JSON.stringify({ severity, houseId, text: text.trim(), childIds }),
      });
      setText("");
      setChildIdsRaw("");
      setSeverity("medium");
      setComposeOpen(false);
      setMsg("Vorfall gesichert.");
      await load();
    } catch (err) {
      setError((err as Error).message || "Speichern fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  async function review(id: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/incidents/${id}/review`, { method: "POST", body: JSON.stringify({}) });
      setMsg("Vorfall als geprüft markiert.");
      setDetail(null);
      await load();
    } catch (err) {
      setError((err as Error).message || "Prüfung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  const isAdmin = !!session?.admin;
  const shown = incidents.filter((inc) => filter === "all" || !inc.status || inc.status === "open");

  return (
    <>
      <PageShell eyebrow="Schicht" title="Vorfälle" lead="Liste · Tippen für Details · Melden unten.">
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}
        {msg && <p className="muted text-sm mb-2">{msg}</p>}

        <div className="seg-bar">
          <button type="button" className={`btn-sec ${filter === "open" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("open")}>
            Offen
          </button>
          <button type="button" className={`btn-sec ${filter === "all" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("all")}>
            Alle
          </button>
        </div>

        {loading ? (
          <LoadingBlock label="Vorfälle werden geladen…" />
        ) : !shown.length ? (
          <EmptyState title="Noch keine Vorfälle" hint="Melde Beobachtungen — sie erscheinen hier." />
        ) : (
          <div className="list-panel" data-testid="incident-list">
            <div className="list-sticky">
              <span>{shown.length} Einträge</span>
            </div>
            {shown.map((inc) => {
              const open = !inc.status || inc.status === "open";
              const sev = SEVERITY_LABEL[inc.severity] || inc.severity;
              return (
                <button
                  key={inc.id}
                  type="button"
                  className={`list-row ${inc.severity === "high" || inc.severity === "critical" ? "is-warn" : ""}`}
                  data-testid={`incident-${inc.id}`}
                  onClick={() => setDetail(inc)}
                >
                  <div className="list-row__main">
                    <div className="list-row__title">
                      {sev} · {inc.houseName || inc.houseId}
                    </div>
                    <div className="list-row__meta">
                      {inc.text.slice(0, 72)}
                      {inc.text.length > 72 ? "…" : ""}
                    </div>
                  </div>
                  <span className="list-row__trail muted text-xs">
                    {STATUS_LABEL[inc.status || "open"]}
                    {open ? " →" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="sticky-footer">
          <button className="btn w-full" type="button" data-testid="incident-compose" onClick={() => setComposeOpen(true)}>
            Vorfall melden
          </button>
        </div>
      </PageShell>

      {composeOpen && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setComposeOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" aria-labelledby="incident-form-title" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2 id="incident-form-title">Vorfall melden</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setComposeOpen(false)}>
                ✕
              </button>
            </header>
            <form className="stack" onSubmit={submit} data-testid="incident-form">
              <fieldset className="stack">
                <legend className="font-semibold">Schweregrad</legend>
                <div className="chips">
                  {SEVERITIES.map((s) => (
                    <button key={s.id} type="button" className={severity === s.id ? "chip on" : "chip"} onClick={() => setSeverity(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="muted text-sm m-0">{SEVERITIES.find((s) => s.id === severity)?.hint}</p>
              </fieldset>
              <label htmlFor="incident-house">
                Haus
                <select id="incident-house" value={houseId} onChange={(e) => setHouseId(e.target.value)}>
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                  {!houses.length && (
                    <>
                      <option value="h1">Kalyvia</option>
                      <option value="h2">Thalassa</option>
                    </>
                  )}
                </select>
              </label>
              <label htmlFor="incident-text">
                Was ist passiert?
                <textarea
                  id="incident-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Sachlich beschreiben — wer, was, wann, wo…"
                  required
                />
              </label>
              <label htmlFor="incident-children">
                Betroffene Kinder (IDs, kommagetrennt)
                <input id="incident-children" value={childIdsRaw} onChange={(e) => setChildIdsRaw(e.target.value)} placeholder="z. B. k1, k2" />
              </label>
              <button className="btn w-full" type="submit" disabled={busy || !text.trim()}>
                {busy ? "Speichern…" : "Vorfall sichern"}
              </button>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" aria-labelledby="incident-detail-title" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2 id="incident-detail-title">
                {SEVERITY_LABEL[detail.severity] || detail.severity} · {detail.houseName || detail.houseId}
              </h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="body-sm">{detail.text}</p>
            {detail.childIds?.length ? <p className="muted text-sm">Kinder: {detail.childIds.join(", ")}</p> : null}
            {detail.createdAt ? (
              <p className="muted text-xs">
                {new Date(detail.createdAt).toLocaleString("de-DE")}
                {detail.createdBy ? ` · ${detail.createdBy}` : ""}
              </p>
            ) : null}
            {detail.reviewedAt ? (
              <p className="muted text-xs">
                Geprüft {new Date(detail.reviewedAt).toLocaleString("de-DE")}
                {detail.reviewedBy ? ` · ${detail.reviewedBy}` : ""}
              </p>
            ) : null}
            {isAdmin && (!detail.status || detail.status === "open") && (
              <button className="btn mt-3 w-full" type="button" disabled={busy} onClick={() => review(detail.id)} data-testid={`review-${detail.id}`}>
                Als geprüft markieren
              </button>
            )}
          </div>
        </div>
      )}

      <Dock />
    </>
  );
}
