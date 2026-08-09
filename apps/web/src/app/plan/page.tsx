"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type PlanEntry = {
  id: string;
  activity: string;
  from: string;
  to: string;
  block: string;
  houseIds?: string[];
  employeeIds?: string[];
  cancelled?: boolean;
  cancelReason?: string;
};

type Day = {
  date: string;
  entries: PlanEntry[];
  issues: Array<{ message: string }>;
};

type House = { id: string; name: string };
type StaffProfile = { id: string; name: string };

const BLOCKS: { id: string; label: string }[] = [
  { id: "morning", label: "Vormittag" },
  { id: "afternoon", label: "Nachmittag" },
  { id: "evening", label: "Abend" },
];

function mondayISO(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

export default function PlanPage() {
  const { ready } = useRequireMode("staff");
  const [start, setStart] = useState(mondayISO());
  const [days, setDays] = useState<Day[]>([]);
  const [selected, setSelected] = useState(() => new Date().toISOString().slice(0, 10));
  const [activity, setActivity] = useState("Betreuung");
  const [block, setBlock] = useState("morning");
  const [composerOpen, setComposerOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [warn, setWarn] = useState("");
  const [error, setError] = useState("");
  const [houses, setHouses] = useState<House[]>([]);
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [houseIds, setHouseIds] = useState<string[]>([]);
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<PlanEntry | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadMeta() {
    const [stock, profiles] = await Promise.all([
      api<{ houses: House[] }>("/api/stock/snapshot").catch(() => ({ houses: [] as House[] })),
      api<{ profiles: StaffProfile[] }>("/api/auth/profiles?mode=staff").catch(() => ({ profiles: [] as StaffProfile[] })),
    ]);
    const hs = stock.houses || [];
    const ps = profiles.profiles || [];
    setHouses(hs);
    setStaff(ps);
    setHouseIds((prev) => (prev.length ? prev.filter((id) => hs.some((h) => h.id === id)) : hs.slice(0, 1).map((h) => h.id)));
    setEmployeeIds((prev) => (prev.length ? prev.filter((id) => ps.some((p) => p.id === id)) : ps.slice(0, 1).map((p) => p.id)));
  }

  async function load() {
    setError("");
    try {
      const data = await api<{ days: Day[] }>(`/api/schedule/week?start=${start}`);
      const next = data.days || [];
      setDays(next);
      if (next.length && !next.some((d) => d.date === selected)) {
        setSelected(next[0].date);
      }
    } catch (e) {
      setError((e as Error).message || "Plan konnte nicht geladen werden");
    }
  }

  useEffect(() => {
    if (!ready) return;
    loadMeta().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    load().catch(console.error);
  }, [ready, start]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", composerOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [composerOpen, detail]);

  const day = useMemo(() => days.find((d) => d.date === selected) || days[0], [days, selected]);

  function toggleId(list: string[], id: string, setter: (v: string[]) => void) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function addEntry(e: FormEvent, force = false) {
    e.preventDefault();
    if (!day || busy) return;
    if (!houseIds.length) {
      setWarn("Mindestens ein Haus wählen.");
      return;
    }
    if (!employeeIds.length) {
      setWarn("Mindestens eine Person wählen.");
      return;
    }
    setBusy(true);
    setWarn("");
    try {
      await api("/api/schedule/entry", {
        method: "POST",
        body: JSON.stringify({
          date: day.date,
          block,
          activity,
          houseIds,
          employeeIds,
          force,
          overrideReason: force ? overrideReason || "Override" : overrideReason,
        }),
      });
      setOverrideReason("");
      setComposerOpen(false);
      await load();
    } catch (err) {
      const er = err as Error & { data?: { detail?: { issues?: Array<{ message: string }> } } };
      const issues = er.data?.detail?.issues || [];
      setWarn(issues.map((i) => i.message).join(" · ") || er.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancelEntry() {
    if (!detail || busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/schedule/cancel", {
        method: "POST",
        body: JSON.stringify({ entryId: detail.id, reason: cancelReason.trim() }),
      });
      setDetail(null);
      setCancelReason("");
      await load();
    } catch (e) {
      setError((e as Error).message || "Absagen fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  const houseName = (id: string) => houses.find((h) => h.id === id)?.name || id;
  const staffName = (id: string) => staff.find((p) => p.id === id)?.name || id;

  return (
    <>
      <PageShell
        eyebrow="Plan"
        title="Wochenplan"
        lead="Tag wählen · Eintrag tippen · Absagen im Detail."
        actions={
          <>
            <button className="btn-sec" type="button" data-testid="week-prev" onClick={() => setStart(mondayISO(new Date(Date.parse(start) - 7 * 86400000)))}>
              ←
            </button>
            <button
              className="btn-sec"
              type="button"
              data-testid="week-today"
              onClick={() => {
                const m = mondayISO();
                setStart(m);
                setSelected(new Date().toISOString().slice(0, 10));
              }}
            >
              Heute
            </button>
            <button className="btn-sec" type="button" data-testid="week-next" onClick={() => setStart(mondayISO(new Date(Date.parse(start) + 7 * 86400000)))}>
              →
            </button>
          </>
        }
      >
        {error && <p className="warn">{error}</p>}

        <div className="day-strip" data-tour="tour-plan" role="tablist" aria-label="Wochentage">
          {days.map((d) => {
            const dt = new Date(d.date + "T12:00:00");
            const on = d.date === (day?.date || selected);
            return (
              <button key={d.date} type="button" role="tab" aria-selected={on} className={`day-chip ${on ? "on" : ""}`} onClick={() => setSelected(d.date)}>
                <span>{dt.toLocaleDateString("de-DE", { weekday: "short" })}</span>
                <strong>{dt.getDate()}</strong>
              </button>
            );
          })}
        </div>

        {day && (
          <div className="list-panel">
            <div className="list-sticky">
              <span>
                {new Date(day.date + "T12:00:00").toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span>{day.entries.filter((e) => !e.cancelled).length} aktiv</span>
            </div>
            {day.issues?.length > 0 &&
              day.issues.map((issue, i) => (
                <div key={i} className="list-row is-warn">
                  <div className="list-row__main">
                    <div className="list-row__title">Konflikt</div>
                    <div className="list-row__meta">{issue.message}</div>
                  </div>
                </div>
              ))}
            {BLOCKS.map((b) => {
              const entries = day.entries.filter((e) => e.block === b.id && !e.cancelled);
              return (
                <div key={b.id}>
                  <div className="list-sticky" style={{ top: 36, background: "var(--card)" }}>
                    <span>{b.label}</span>
                    <span>{entries.length || "—"}</span>
                  </div>
                  {entries.length ? (
                    entries.map((e) => (
                      <button key={e.id} type="button" className="list-row" onClick={() => setDetail(e)} data-testid={`plan-entry-${e.id}`}>
                        <div className="list-row__main">
                          <div className="list-row__title">{e.activity}</div>
                          <div className="list-row__meta">
                            {e.from}–{e.to}
                            {(e.houseIds || []).length ? ` · ${(e.houseIds || []).map(houseName).join(", ")}` : ""}
                            {(e.employeeIds || []).length ? ` · ${(e.employeeIds || []).map(staffName).join(", ")}` : ""}
                          </div>
                        </div>
                        <span aria-hidden>→</span>
                      </button>
                    ))
                  ) : (
                    <div className="list-row" style={{ cursor: "default" }}>
                      <div className="list-row__meta">Frei</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!days.length && <EmptyState title="Keine Woche" hint="Woche neu laden oder Datum prüfen." />}

        <div className="sticky-footer">
          <button className="btn w-full" type="button" onClick={() => setComposerOpen(true)}>
            Eintrag hinzufügen
          </button>
        </div>

        <div className="week-scroll hidden md:block mt-4">
          <div className="week-grid">
            <div className="week-head">Block</div>
            {days.map((d) => {
              const dt = new Date(d.date + "T12:00:00");
              return (
                <div key={d.date} className="week-head">
                  <div className="uppercase text-[var(--muted)]">{dt.toLocaleDateString("de-DE", { weekday: "short" })}</div>
                  <div className="text-sm text-[var(--sea)]">
                    {dt.getDate()}.{dt.getMonth() + 1}.
                  </div>
                </div>
              );
            })}
            {BLOCKS.map((b) => (
              <div key={b.id} className="contents">
                <div className="week-cell font-semibold">{b.label}</div>
                {days.map((d) => (
                  <div key={d.date + b.id} className="week-cell">
                    {d.entries
                      .filter((e) => e.block === b.id && !e.cancelled)
                      .map((e) => (
                        <button key={e.id} type="button" className="mb-1 w-full rounded bg-[var(--pine-tint)] px-1 py-0.5 text-left text-xs" onClick={() => setDetail(e)}>
                          {e.activity}
                        </button>
                      ))}
                    {!d.entries.filter((e) => e.block === b.id && !e.cancelled).length && <span className="muted text-xs">—</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageShell>

      {composerOpen && day && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setComposerOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>Neuer Eintrag · {day.date}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setComposerOpen(false)}>
                ✕
              </button>
            </header>
            <form className="stack" onSubmit={(e) => addEntry(e, false)}>
              <label>
                Block
                <select value={block} onChange={(e) => setBlock(e.target.value)}>
                  {BLOCKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Aktivität
                <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Aktivität" data-testid="plan-activity" />
              </label>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="text-sm font-semibold">Häuser</legend>
                <div className="chips">
                  {houses.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      className={houseIds.includes(h.id) ? "chip on" : "chip"}
                      onClick={() => toggleId(houseIds, h.id, setHouseIds)}
                      data-testid={`plan-house-${h.id}`}
                    >
                      {h.name}
                    </button>
                  ))}
                  {!houses.length && <span className="muted text-sm">Keine Häuser geladen</span>}
                </div>
              </fieldset>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="text-sm font-semibold">Personal</legend>
                <div className="chips">
                  {staff.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={employeeIds.includes(p.id) ? "chip on" : "chip"}
                      onClick={() => toggleId(employeeIds, p.id, setEmployeeIds)}
                      data-testid={`plan-staff-${p.id}`}
                    >
                      {p.name}
                    </button>
                  ))}
                  {!staff.length && <span className="muted text-sm">Kein Personal geladen</span>}
                </div>
              </fieldset>
              <input type="hidden" value={day.date} data-testid="plan-date" readOnly />
              <button className="btn" type="submit" data-testid="plan-save" disabled={busy}>
                Speichern
              </button>
              {warn && (
                <div className="stack">
                  <p className="warn">{warn}</p>
                  <label>
                    Grund
                    <input
                      placeholder="Warum trotzdem speichern?"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      data-testid="plan-override"
                    />
                  </label>
                  <button
                    className="btn-sec"
                    type="button"
                    data-testid="plan-force"
                    onClick={(ev) => addEntry(ev as unknown as FormEvent, true)}
                    disabled={!overrideReason.trim() || busy}
                  >
                    Trotzdem speichern
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.activity}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-sm">
              {BLOCKS.find((b) => b.id === detail.block)?.label || detail.block} · {detail.from}–{detail.to}
            </p>
            <p className="body-sm mt-2">
              Häuser: {(detail.houseIds || []).map(houseName).join(", ") || "—"}
              <br />
              Personal: {(detail.employeeIds || []).map(staffName).join(", ") || "—"}
            </p>
            <label className="mt-3 block">
              Absage-Grund (optional)
              <input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="z. B. krank, umgelegt…" data-testid="plan-cancel-reason" />
            </label>
            <button className="btn mt-3 w-full" type="button" disabled={busy} onClick={cancelEntry} data-testid="plan-cancel">
              Eintrag absagen
            </button>
          </div>
        </div>
      )}

      <Dock />
      <GuidedTour />
    </>
  );
}
