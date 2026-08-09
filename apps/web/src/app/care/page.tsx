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
    const data = await api<{ profiles: ChildProfile[] }>("/api/auth/profiles?mode=child");
    const list = data.profiles || [];
    setChildren(list);
    setChildId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0]?.id || ""));
  }

  async function loadLogs(selectedChild = childId, selectedDate = date) {
    if (!selectedChild) {
      setLogs([]);
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
    loadChildren().catch((e) => setError((e as Error).message));
  }, [ready]);

  useEffect(() => {
    if (!ready || !childId) return;
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
      <PageShell eyebrow="Schicht" title="Kind-Tag" lead={`Pflege-Notizen für ${displayDate}.`}>
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}
        {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

        <section className="panel stack mb-4">
          <label htmlFor="care-child">
            Kind
            <select id="care-child" value={childId} onChange={(e) => setChildId(e.target.value)} data-testid="care-child">
              {!children.length && <option value="">Keine Kinder</option>}
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="care-date">
            Datum
            <input
              id="care-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="care-date"
            />
          </label>

          {selectedChild && (
            <div className="row gap-2 items-center">
              <div
                className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: selectedChild.color || "var(--brand)" }}
              >
                {selectedChild.name.slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold">{selectedChild.name}</div>
                <div className="muted text-sm">{selectedChild.id}</div>
              </div>
            </div>
          )}
        </section>

        <section className="mb-6" aria-labelledby="care-kinds-title">
          <h2 id="care-kinds-title" className="display-sm text-[var(--sea)]">
            Eintrag hinzufügen
          </h2>
          <div className="chips mt-2">
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
            <div className="panel stack mt-3" style={{ background: "var(--pine-tint)" }}>
              <p className="m-0 font-semibold text-[var(--sea)]">
                {KIND_LABEL[activeKind]} · {selectedChild?.name}
              </p>
              <label htmlFor="care-note">
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
          )}
        </section>

        <section aria-labelledby="care-logs-title">
          <h2 id="care-logs-title" className="display-sm text-[var(--sea)]">
            Heutige Einträge
          </h2>

          {loading ? (
            <LoadingBlock label="Einträge werden geladen…" />
          ) : !logs.length ? (
            <EmptyState
              title="Noch keine Einträge"
              hint="Wähle oben Mahlzeit, Schlaf, Stimmung oder Medikamente und speichere einen Kurzeintrag."
            />
          ) : (
            <div className="grid gap-2 mt-3">
              {logs.map((log) => {
                const kind = KINDS.find((k) => k.id === log.kind);
                return (
                  <article key={log.id} className="card" style={{ background: "var(--pine-tint)" }} data-testid={`care-log-${log.id}`}>
                    <div className="row between gap-2">
                      <span className="font-semibold text-[var(--sea)]">
                        {kind?.emoji} {KIND_LABEL[log.kind] || log.kind}
                      </span>
                      {log.at ? (
                        <span className="muted text-xs">{new Date(log.at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>
                      ) : null}
                    </div>
                    {log.note && <p className="mt-2 mb-0">{log.note}</p>}
                    <p className="muted text-xs mt-2 m-0">
                      {log.childName || log.childId}
                      {log.by ? ` · ${log.by}` : ""}
                    </p>
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
