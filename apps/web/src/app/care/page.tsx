"use client";

import { useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type ChildProfile = { id: string; name: string; color?: string };

type CareLog = {
  id: string;
  childId: string;
  childName?: string;
  date: string;
  kind: string;
  note?: string;
  at?: number;
  by?: string;
};

const KINDS = [
  { id: "meal", label: "Mahlzeit", emoji: "🍽" },
  { id: "sleep", label: "Schlaf", emoji: "😴" },
  { id: "mood", label: "Stimmung", emoji: "🙂" },
  { id: "meds", label: "Medikamente", emoji: "💊" },
] as const;

const KIND_LABEL: Record<string, string> = Object.fromEntries(KINDS.map((k) => [k.id, k.label]));

export default function CarePage() {
  const { ready } = useRequireMode("staff");
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [childId, setChildId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [activeKind, setActiveKind] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const displayDate = useMemo(
    () => new Date(date + "T12:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }),
    [date],
  );

  async function loadChildren() {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ profiles: ChildProfile[] }>("/api/auth/profiles?mode=child");
      const list = data.profiles || [];
      setChildren(list);
      const nextId = list[0]?.id || "";
      setChildId((prev) => (prev && list.some((c) => c.id === prev) ? prev : nextId));
      if (!list.length) {
        setLogs([]);
        setLoading(false);
      }
    } catch (e) {
      setError((e as Error).message);
      setChildren([]);
      setChildId("");
      setLogs([]);
      setLoading(false);
    }
  }

  async function loadLogs(selectedChild = childId, selectedDate = date) {
    if (!selectedChild) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api<{ logs: CareLog[] }>(
        `/api/care/log?childId=${encodeURIComponent(selectedChild)}&date=${encodeURIComponent(selectedDate)}`,
      );
      setLogs(data.logs || []);
    } catch (e) {
      setError((e as Error).message || "Einträge konnten nicht geladen werden");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    loadChildren().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (!childId) {
      setLoading(false);
      return;
    }
    loadLogs(childId, date).catch(() => undefined);
  }, [ready, childId, date]);

  async function logKind(kind: string) {
    if (!childId || busy) return;
    setActiveKind(kind);
    setNote("");
  }

  async function saveLog() {
    if (!childId || !activeKind || busy) return;
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await api("/api/care/log", {
        method: "POST",
        body: JSON.stringify({ childId, date, kind: activeKind, note: note.trim() }),
      });
      setMsg(`${KIND_LABEL[activeKind] || activeKind} gespeichert.`);
      setActiveKind(null);
      setNote("");
      await loadLogs();
    } catch (e) {
      setError((e as Error).message || "Speichern fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  const selectedChild = children.find((c) => c.id === childId);

  return (
    <>
      <PageShell eyebrow="Schicht" title="Kind-Tag" lead={`Pflege-Notizen für ${displayDate}.`} back="/home">
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}
        {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

        <div className="list-panel mb-3">
          <div className="list-sticky">
            <span>{selectedChild?.name || "Kind"}</span>
            <span className="muted text-xs">{displayDate}</span>
          </div>
          <div className="list-row" style={{ cursor: "default", flexWrap: "wrap", gap: 8 }}>
            <label className="flex-1 min-w-[140px] m-0" htmlFor="care-child">
              <span className="sr-only">Kind</span>
              <select id="care-child" value={childId} onChange={(e) => setChildId(e.target.value)} data-testid="care-child">
                {!children.length && <option value="">Keine Kinder</option>}
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="m-0" htmlFor="care-date">
              <span className="sr-only">Datum</span>
              <input
                id="care-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="care-date"
              />
            </label>
          </div>
        </div>

        <section className="mb-4" aria-labelledby="care-kinds-title">
          <h2 id="care-kinds-title" className="text-sm font-semibold text-[var(--sea)] m-0 mb-2">
            Eintrag hinzufügen
          </h2>
          <div className="chips">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className={activeKind === k.id ? "chip on" : "chip"}
                onClick={() => logKind(k.id)}
                data-testid={`care-kind-${k.id}`}
              >
                <span aria-hidden>{k.emoji}</span> {k.label}
              </button>
            ))}
          </div>

          {activeKind && (
            <div className="list-panel mt-2">
              <div className="list-sticky">
                <span>
                  {KIND_LABEL[activeKind]} · {selectedChild?.name}
                </span>
              </div>
              <div className="stack p-3">
                <label htmlFor="care-note" className="m-0">
                  Kurznotiz (optional)
                  <textarea
                    id="care-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="z. B. gut gegessen, müde, fröhlich…"
                  />
                </label>
                <div className="row gap-2">
                  <button className="btn flex-1" type="button" disabled={busy} onClick={saveLog}>
                    {busy ? "Speichern…" : "Speichern"}
                  </button>
                  <button className="btn-sec !min-h-10" type="button" disabled={busy} onClick={() => setActiveKind(null)}>
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="care-logs-title">
          <h2 id="care-logs-title" className="text-sm font-semibold text-[var(--sea)] m-0 mb-2">
            Einträge
          </h2>

          {loading ? (
            <LoadingBlock label="Einträge werden geladen…" />
          ) : !logs.length ? (
            <EmptyState
              title="Noch keine Einträge"
              hint="Wähle oben Mahlzeit, Schlaf, Stimmung oder Medikamente und speichere einen Kurzeintrag."
            />
          ) : (
            <div className="list-panel">
              <div className="list-sticky">
                <span>{logs.length} Einträge</span>
              </div>
              {logs.map((log) => {
                const kind = KINDS.find((k) => k.id === log.kind);
                return (
                  <div key={log.id} className="list-row" style={{ cursor: "default" }} data-testid={`care-log-${log.id}`}>
                    <div className="list-row__main">
                      <div className="list-row__title">
                        {kind?.emoji} {KIND_LABEL[log.kind] || log.kind}
                      </div>
                      <div className="list-row__meta">
                        {log.note || "—"}
                        {log.by ? ` · ${log.by}` : ""}
                      </div>
                    </div>
                    <span className="list-row__trail muted text-xs">
                      {log.at
                        ? new Date(log.at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>
                  </div>
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
