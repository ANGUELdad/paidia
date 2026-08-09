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
      await load();
    } catch (err) {
      setError((err as Error).message || "Prüfung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  const isAdmin = !!session?.admin;

  return (
    <>
      <PageShell
        eyebrow="Schicht"
        title="Vorfälle"
        lead="Sichere Beobachtungen und Ereignisse — Admins können prüfen und abschließen."
      >
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}
        {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

        <section className="panel stack mb-6" aria-labelledby="incident-form-title">
          <h2 id="incident-form-title" className="display-sm m-0 text-[var(--sea)]">
            Vorfall melden
          </h2>
          <p className="muted m-0">Schweregrad wählen, Haus und Betroffene angeben, kurz beschreiben.</p>

          <form className="stack" onSubmit={submit} data-testid="incident-form">
            <fieldset className="stack">
              <legend className="font-semibold">Schweregrad</legend>
              <div className="chips">
                {SEVERITIES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={severity === s.id ? "chip on" : "chip"}
                    onClick={() => setSeverity(s.id)}
                    title={s.hint}
                  >
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
              <input
                id="incident-children"
                value={childIdsRaw}
                onChange={(e) => setChildIdsRaw(e.target.value)}
                placeholder="z. B. k1, k2"
              />
            </label>

            <button className="btn w-full" type="submit" disabled={busy || !text.trim()}>
              {busy ? "Speichern…" : "Vorfall sichern"}
            </button>
          </form>
        </section>

        <section aria-labelledby="incident-list-title">
          <h2 id="incident-list-title" className="display-sm text-[var(--sea)]">
            Gemeldete Vorfälle
          </h2>

          {loading ? (
            <LoadingBlock label="Vorfälle werden geladen…" />
          ) : !incidents.length ? (
            <EmptyState
              title="Noch keine Vorfälle"
              hint="Melde hier Beobachtungen — sie erscheinen in der Liste und im Audit."
            />
          ) : (
            <div className="grid gap-2 mt-3">
              {incidents.map((inc) => {
                const open = !inc.status || inc.status === "open";
                const sev = SEVERITY_LABEL[inc.severity] || inc.severity;
                const tone =
                  inc.severity === "critical" || inc.severity === "high"
                    ? "var(--amber-tint)"
                    : "var(--pine-tint)";
                return (
                  <article
                    key={inc.id}
                    className="card"
                    style={{ background: tone }}
                    data-testid={`incident-${inc.id}`}
                  >
                    <div className="row between gap-2">
                      <div>
                        <span className="font-semibold text-[var(--sea)]">{sev}</span>
                        <span className="muted text-sm"> · {inc.houseName || inc.houseId}</span>
                      </div>
                      <span className="text-xs font-bold uppercase text-[var(--muted)]">
                        {STATUS_LABEL[inc.status || "open"] || inc.status}
                      </span>
                    </div>
                    <p className="mt-2 mb-1">{inc.text}</p>
                    {inc.childIds?.length ? (
                      <p className="muted text-sm m-0">Kinder: {inc.childIds.join(", ")}</p>
                    ) : null}
                    {inc.createdAt ? (
                      <p className="muted text-xs mt-2 m-0">
                        {new Date(inc.createdAt).toLocaleString("de-DE")}
                        {inc.createdBy ? ` · ${inc.createdBy}` : ""}
                      </p>
                    ) : null}
                    {isAdmin && open && (
                      <button
                        className="btn-sec !min-h-10 mt-3"
                        type="button"
                        disabled={busy}
                        onClick={() => review(inc.id)}
                        data-testid={`review-${inc.id}`}
                      >
                        Als geprüft markieren
                      </button>
                    )}
                    {inc.reviewedAt ? (
                      <p className="muted text-xs mt-2 m-0">
                        Geprüft {new Date(inc.reviewedAt).toLocaleString("de-DE")}
                        {inc.reviewedBy ? ` · ${inc.reviewedBy}` : ""}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </PageShell>
      <Dock />
    </>
  );
}
