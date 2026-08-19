"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dock } from "@/components/Dock";
import { EmptyState } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/Icon";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
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

const BLOCKS: { id: string; labelDe: string; labelEl: string }[] = [
  { id: "morning",   labelDe: "Vormittag",  labelEl: "Πρωί"       },
  { id: "afternoon", labelDe: "Nachmittag", labelEl: "Απόγευμα"   },
  { id: "evening",   labelDe: "Abend",      labelEl: "Βράδυ"      },
];

const WEEKDAYS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_EL = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σά", "Κυ"];

function mondayISO(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

function blockLabel(id: string, lang: Lang) {
  const b = BLOCKS.find((x) => x.id === id);
  if (!b) return id;
  return lang === "el" ? b.labelEl : b.labelDe;
}

export default function PlanPage() {
  const { ready } = useRequireMode("staff");
  const searchParams = useSearchParams();
  const initDate = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const [lang] = useState<Lang>(getStoredLang());
  const [start, setStart] = useState(mondayISO(new Date(initDate + "T12:00:00")));
  const [days, setDays] = useState<Day[]>([]);
  const [selected, setSelected] = useState(initDate);
  const [activity, setActivity] = useState(lang === "el" ? "Παιδαγωγική" : "Betreuung");
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
    setHouseIds((prev) =>
      prev.length ? prev.filter((id) => hs.some((h) => h.id === id)) : hs.slice(0, 1).map((h) => h.id),
    );
    setEmployeeIds((prev) =>
      prev.length ? prev.filter((id) => ps.some((p) => p.id === id)) : ps.slice(0, 1).map((p) => p.id),
    );
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
      setError((e as Error).message || (lang === "el" ? "Σφάλμα φόρτωσης" : "Plan konnte nicht geladen werden"));
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
    if (!houseIds.length) { setWarn(lang === "el" ? "Επιλέξτε τουλάχιστον ένα σπίτι." : "Mindestens ein Haus wählen."); return; }
    if (!employeeIds.length) { setWarn(lang === "el" ? "Επιλέξτε τουλάχιστον ένα άτομο." : "Mindestens eine Person wählen."); return; }
    setBusy(true);
    setWarn("");
    try {
      await api("/api/schedule/entry", {
        method: "POST",
        body: JSON.stringify({ date: day.date, block, activity, houseIds, employeeIds, force, overrideReason: force ? overrideReason || "Override" : overrideReason }),
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
      setError((e as Error).message || (lang === "el" ? "Αποτυχία ακύρωσης" : "Absagen fehlgeschlagen"));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  const houseName = (id: string) => houses.find((h) => h.id === id)?.name || id;
  const staffName = (id: string) => staff.find((p) => p.id === id)?.name || id;
  const dayLabels = lang === "el" ? WEEKDAYS_EL : WEEKDAYS_DE;

  return (
    <>
      <PageShell
        eyebrow={t("navPlan", lang)}
        title={t("planTitle", lang)}
        lead={lang === "el" ? "Επιλέξτε ημέρα · πατήστε για λεπτομέρειες" : "Tag wählen · Eintrag tippen · Absagen im Detail"}
        actions={
          <>
            <button
              className="btn-sec"
              type="button"
              data-testid="week-prev"
              aria-label={lang === "el" ? "Προηγούμενη εβδομάδα" : "Vorherige Woche"}
              onClick={() => setStart(mondayISO(new Date(Date.parse(start) - 7 * 86400000)))}
            >
              <Icon name="back" size={16} aria-hidden />
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
              {lang === "el" ? "Σήμερα" : "Heute"}
            </button>
            <button
              className="btn-sec"
              type="button"
              data-testid="week-next"
              aria-label={lang === "el" ? "Επόμενη εβδομάδα" : "Nächste Woche"}
              onClick={() => setStart(mondayISO(new Date(Date.parse(start) + 7 * 86400000)))}
            >
              <Icon name="arrow" size={16} aria-hidden />
            </button>
          </>
        }
      >
        {error && <p className="warn" role="alert">{error}</p>}

        {/* Day strip */}
        <div className="day-strip" data-tour="tour-plan" role="tablist" aria-label={lang === "el" ? "Ημέρες εβδομάδας" : "Wochentage"}>
          {days.map((d, i) => {
            const dt = new Date(d.date + "T12:00:00");
            const on = d.date === (day?.date || selected);
            const dayIdx = (dt.getDay() + 6) % 7;
            return (
              <button
                key={d.date}
                type="button"
                role="tab"
                aria-selected={on}
                aria-current={on ? "date" : undefined}
                className={`day-chip ${on ? "on" : ""}`}
                onClick={() => setSelected(d.date)}
              >
                <span>{dayLabels[dayIdx] || dayLabels[i] || ""}</span>
                <strong>{dt.getDate()}</strong>
              </button>
            );
          })}
        </div>

        {day && (
          <div className="list-panel" data-tour="tour-plan-day">
            <div className="list-sticky">
              <span>
                {new Date(day.date + "T12:00:00").toLocaleDateString(lang === "el" ? "el-GR" : "de-DE", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </span>
              <span>{day.entries.filter((e) => !e.cancelled).length} {lang === "el" ? "ενεργά" : "aktiv"}</span>
            </div>
            {day.issues?.length > 0 &&
              day.issues.map((issue, i) => (
                <div key={i} className="list-row is-warn">
                  <div className="list-row__main">
                    <div className="list-row__title">{lang === "el" ? "Σύγκρουση" : "Konflikt"}</div>
                    <div className="list-row__meta">{issue.message}</div>
                  </div>
                </div>
              ))}
            {BLOCKS.map((b) => {
              const entries = day.entries.filter((e) => e.block === b.id && !e.cancelled);
              return (
                <div key={b.id}>
                  <div className="list-sticky" style={{ top: 36, background: "var(--card)" }}>
                    <span>{blockLabel(b.id, lang)}</span>
                    <span>{entries.length || "—"}</span>
                  </div>
                  {entries.length ? (
                    entries.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        className="list-row"
                        onClick={() => setDetail(e)}
                        data-testid={`plan-entry-${e.id}`}
                      >
                        <div className="list-row__main">
                          <div className="list-row__title">{e.activity}</div>
                          <div className="list-row__meta">
                            {e.from}–{e.to}
                            {(e.houseIds || []).length ? ` · ${(e.houseIds || []).map(houseName).join(", ")}` : ""}
                            {(e.employeeIds || []).length ? ` · ${(e.employeeIds || []).map(staffName).join(", ")}` : ""}
                          </div>
                        </div>
                        <Icon name="arrow" size={16} aria-hidden />
                      </button>
                    ))
                  ) : (
                    <div className="list-row" style={{ cursor: "default" }}>
                      <div className="list-row__meta">{lang === "el" ? "Ελεύθερο" : "Frei"}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!days.length && (
          <EmptyState
            title={lang === "el" ? "Κανένα πρόγραμμα" : "Keine Woche"}
            hint={lang === "el" ? "Αναφορτώστε ή ελέγξτε την ημερομηνία." : "Woche neu laden oder Datum prüfen."}
          />
        )}

        <div className="sticky-footer">
          <button className="btn w-full" type="button" onClick={() => setComposerOpen(true)}>
            <Icon name="plus" size={16} aria-hidden />
            <span style={{ marginLeft: 6 }}>{t("planComposerTitle", lang)}</span>
          </button>
        </div>

        {/* Desktop week matrix */}
        <div className="week-scroll hidden md:block mt-4">
          <div className="week-grid">
            <div className="week-head">{lang === "el" ? "Μπλοκ" : "Block"}</div>
            {days.map((d) => {
              const dt = new Date(d.date + "T12:00:00");
              const dayIdx = (dt.getDay() + 6) % 7;
              return (
                <div key={d.date} className="week-head">
                  <div className="uppercase text-[var(--muted)]">{dayLabels[dayIdx]}</div>
                  <div className="text-sm text-[var(--sea)]">{dt.getDate()}.{dt.getMonth() + 1}.</div>
                </div>
              );
            })}
            {BLOCKS.map((b) => (
              <div key={b.id} className="contents">
                <div className="week-cell font-semibold">{blockLabel(b.id, lang)}</div>
                {days.map((d) => (
                  <div key={d.date + b.id} className="week-cell">
                    {d.entries
                      .filter((e) => e.block === b.id && !e.cancelled)
                      .map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          className="mb-1 w-full rounded bg-[var(--pine-tint)] px-1 py-0.5 text-left text-xs"
                          onClick={() => setDetail(e)}
                        >
                          {e.activity}
                        </button>
                      ))}
                    {!d.entries.filter((e) => e.block === b.id && !e.cancelled).length && (
                      <span className="muted text-xs">—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageShell>

      {/* Composer sheet */}
      {composerOpen && day && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setComposerOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{t("planComposerTitle", lang)} · {day.date}</h2>
              <button
                type="button"
                className="more-sheet-close"
                aria-label={t("cancel", lang)}
                onClick={() => setComposerOpen(false)}
              >
                <Icon name="close" size={16} aria-hidden />
              </button>
            </header>
            <form className="stack" onSubmit={(e) => addEntry(e, false)}>
              <label>
                {lang === "el" ? "Μπλοκ" : "Block"}
                <select value={block} onChange={(e) => setBlock(e.target.value)}>
                  {BLOCKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {blockLabel(b.id, lang)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("planEntry", lang)}
                <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder={t("planEntry", lang)} data-testid="plan-activity" />
              </label>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="text-sm font-semibold">{lang === "el" ? "Σπίτια" : "Häuser"}</legend>
                <div className="chips">
                  {houses.map((h) => (
                    <button key={h.id} type="button" className={houseIds.includes(h.id) ? "chip on" : "chip"} onClick={() => toggleId(houseIds, h.id, setHouseIds)} data-testid={`plan-house-${h.id}`}>
                      {h.name}
                    </button>
                  ))}
                  {!houses.length && <span className="muted text-sm">{lang === "el" ? "Κανένα σπίτι" : "Keine Häuser geladen"}</span>}
                </div>
              </fieldset>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="text-sm font-semibold">{lang === "el" ? "Προσωπικό" : "Personal"}</legend>
                <div className="chips">
                  {staff.map((p) => (
                    <button key={p.id} type="button" className={employeeIds.includes(p.id) ? "chip on" : "chip"} onClick={() => toggleId(employeeIds, p.id, setEmployeeIds)} data-testid={`plan-staff-${p.id}`}>
                      {p.name}
                    </button>
                  ))}
                  {!staff.length && <span className="muted text-sm">{lang === "el" ? "Κανένα άτομο" : "Kein Personal geladen"}</span>}
                </div>
              </fieldset>
              <input type="hidden" value={day.date} data-testid="plan-date" readOnly />
              <button className="btn" type="submit" data-testid="plan-save" disabled={busy}>
                {t("planComposerSave", lang)}
              </button>
              {warn && (
                <div className="stack" role="alert">
                  <p className="warn">{warn}</p>
                  <label>
                    {t("planOverrideReason", lang)}
                    <input
                      placeholder={lang === "el" ? "Γιατί να αποθηκεύσετε παρ' όλα αυτά;" : "Warum trotzdem speichern?"}
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      data-testid="plan-override"
                    />
                  </label>
                  <button className="btn-sec" type="button" data-testid="plan-force" onClick={(ev) => addEntry(ev as unknown as FormEvent, true)} disabled={!overrideReason.trim() || busy}>
                    {lang === "el" ? "Αποθήκευση παρ' όλα αυτά" : "Trotzdem speichern"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Detail / cancel sheet */}
      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.activity}</h2>
              <button type="button" className="more-sheet-close" aria-label={t("cancel", lang)} onClick={() => setDetail(null)}>
                <Icon name="close" size={16} aria-hidden />
              </button>
            </header>
            <p className="muted text-sm">
              {blockLabel(detail.block, lang)} · {detail.from}–{detail.to}
            </p>
            <p className="body-sm mt-2">
              {lang === "el" ? "Σπίτια" : "Häuser"}: {(detail.houseIds || []).map(houseName).join(", ") || "—"}
              <br />
              {lang === "el" ? "Προσωπικό" : "Personal"}: {(detail.employeeIds || []).map(staffName).join(", ") || "—"}
            </p>
            <label className="mt-3 block">
              {t("planCancelReason", lang)}
              <input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder={lang === "el" ? "π.χ. άρρωστος…" : "z. B. krank, umgelegt…"} data-testid="plan-cancel-reason" />
            </label>
            <button className="btn mt-3 w-full" type="button" disabled={busy} onClick={cancelEntry} data-testid="plan-cancel">
              {t("planCancel", lang)}
            </button>
          </div>
        </div>
      )}

      <Dock />
      <GuidedTour />
    </>
  );
}
