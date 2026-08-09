"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type Day = {
  date: string;
  entries: Array<{ id: string; activity: string; from: string; to: string; block: string }>;
  issues: Array<{ message: string }>;
};

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
    load().catch(console.error);
  }, [ready, start]);

  const day = useMemo(() => days.find((d) => d.date === selected) || days[0], [days, selected]);

  async function addEntry(e: FormEvent, force = false) {
    e.preventDefault();
    if (!day) return;
    setWarn("");
    try {
      await api("/api/schedule/entry", {
        method: "POST",
        body: JSON.stringify({
          date: day.date,
          block,
          activity,
          houseIds: ["h1", "h2"],
          employeeIds: ["e1"],
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
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell
        eyebrow="Plan"
        title="Wochenplan"
        lead="Tag wählen · Blöcke prüfen · Eintrag nur bei Bedarf."
        actions={
          <>
            <button className="btn-sec" type="button" data-testid="week-prev" onClick={() => setStart(mondayISO(new Date(Date.parse(start) - 7 * 86400000)))}>
              ←
            </button>
            <button className="btn-sec" type="button" data-testid="week-today" onClick={() => { const m = mondayISO(); setStart(m); setSelected(new Date().toISOString().slice(0, 10)); }}>
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
              <button
                key={d.date}
                type="button"
                role="tab"
                aria-selected={on}
                className={`day-chip ${on ? "on" : ""}`}
                onClick={() => setSelected(d.date)}
              >
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
              <span>{day.entries.length} Einträge</span>
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
              const entries = day.entries.filter((e) => e.block === b.id);
              return (
                <div key={b.id}>
                  <div className="list-sticky" style={{ top: 36, background: "var(--card)" }}>
                    <span>{b.label}</span>
                    <span>{entries.length || "—"}</span>
                  </div>
                  {entries.length ? (
                    entries.map((e) => (
                      <div key={e.id} className="list-row">
                        <div className="list-row__main">
                          <div className="list-row__title">{e.activity}</div>
                          <div className="list-row__meta">
                            {e.from}–{e.to}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="list-row">
                      <div className="list-row__meta">Frei</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="sticky-footer">
          <button className="btn w-full" type="button" onClick={() => setComposerOpen((v) => !v)}>
            {composerOpen ? "Schließen" : "Eintrag hinzufügen"}
          </button>
        </div>

        {composerOpen && day && (
          <form className="panel stack mt-3" onSubmit={(e) => addEntry(e, false)}>
            <h2 className="text-base m-0">Neuer Eintrag</h2>
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
            <input type="hidden" value={day.date} data-testid="plan-date" readOnly />
            <button className="btn" type="submit" data-testid="plan-save">
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
                <button className="btn-sec" type="button" data-testid="plan-force" onClick={(ev) => addEntry(ev as unknown as FormEvent, true)} disabled={!overrideReason.trim()}>
                  Trotzdem speichern
                </button>
              </div>
            )}
          </form>
        )}

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
                      .filter((e) => e.block === b.id)
                      .map((e) => (
                        <div key={e.id} className="mb-1 rounded bg-[var(--pine-tint)] px-1 py-0.5 text-xs">
                          {e.activity}
                        </div>
                      ))}
                    {!d.entries.filter((e) => e.block === b.id).length && <span className="muted text-xs">—</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
