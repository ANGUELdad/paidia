"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type PlanIssue = { message: string; code?: string; overrideAllowed?: boolean };
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
type Day = { date: string; entries: PlanEntry[]; issues: PlanIssue[] };
type House = { id: string; name: string };
type StaffProfile = { id: string; name: string };
type ApiErr = Error & { status?: number; data?: { detail?: { code?: string; error?: string; issues?: PlanIssue[] } } };

const BLOCKS = [
  { id: "morning", de: "Vormittag", el: "Πρωί" },
  { id: "afternoon", de: "Nachmittag", el: "Απόγευμα" },
  { id: "evening", de: "Abend", el: "Βράδυ" },
] as const;

const COPY = {
  de: {
    eyebrow: "Plan",
    title: "Wochenplan",
    lead: "Tag wählen · Eintrag tippen · Absagen im Detail.",
    today: "Heute",
    add: "Eintrag hinzufügen",
    newEntry: "Neuer Eintrag",
    block: "Block",
    activity: "Aktivität",
    houses: "Häuser",
    staff: "Personal",
    noHouses: "Keine Häuser geladen",
    noStaff: "Kein Personal geladen",
    needHouse: "Mindestens ein Haus wählen.",
    needStaff: "Mindestens eine Person wählen.",
    reason: "Grund",
    overridePh: "Warum trotzdem speichern?",
    force: "Trotzdem speichern",
    pin: "PIN",
    pinPh: "PIN falls nötig",
    free: "Frei",
    active: "aktiv",
    conflict: "Konflikt",
    cancelEntry: "Eintrag absagen",
    cancelReason: "Absage-Grund (optional)",
    cancelPh: "z. B. krank, umgelegt…",
    loadFail: "Plan konnte nicht geladen werden",
    cancelFail: "Absagen fehlgeschlagen",
    retry: "Erneut laden",
    emptyTitle: "Keine Woche",
    emptyHint: "Woche neu laden oder Datum prüfen.",
    loading: "Plan wird geladen…",
    close: "Schließen",
    weekDays: "Wochentage",
    doubleBook: "Person in überlappenden Blöcken",
    houseGap: "Nicht alle Häuser sind abgedeckt",
  },
  el: {
    eyebrow: "Πρόγραμμα",
    title: "Εβδομαδιαίο πρόγραμμα",
    lead: "Διάλεξε μέρα · πάτα καταχώριση · ακύρωση στο λεπτομέρειες.",
    today: "Σήμερα",
    add: "Προσθήκη καταχώρισης",
    newEntry: "Νέα καταχώριση",
    block: "Μπλοκ",
    activity: "Δραστηριότητα",
    houses: "Σπίτια",
    staff: "Προσωπικό",
    noHouses: "Δεν φορτώθηκαν σπίτια",
    noStaff: "Δεν φορτώθηκε προσωπικό",
    needHouse: "Διάλεξε τουλάχιστον ένα σπίτι.",
    needStaff: "Διάλεξε τουλάχιστον ένα άτομο.",
    reason: "Λόγος",
    overridePh: "Γιατί να αποθηκευτεί οπωσδήποτε;",
    force: "Αποθήκευση οπωσδήποτε",
    pin: "PIN",
    pinPh: "PIN αν χρειάζεται",
    free: "Κενό",
    active: "ενεργά",
    conflict: "Σύγκρουση",
    cancelEntry: "Ακύρωση καταχώρισης",
    cancelReason: "Λόγος ακύρωσης (προαιρετικό)",
    cancelPh: "π.χ. άρρωστος, μεταφορά…",
    loadFail: "Το πρόγραμμα δεν φορτώθηκε",
    cancelFail: "Η ακύρωση απέτυχε",
    retry: "Ξανά φόρτωση",
    emptyTitle: "Χωρίς εβδομάδα",
    emptyHint: "Φόρτωσε ξανά ή έλεγξε την ημερομηνία.",
    loading: "Το πρόγραμμα φορτώνεται…",
    close: "Κλείσιμο",
    weekDays: "Ημέρες",
    doubleBook: "Άτομο σε επικαλυπτόμενα μπλοκ",
    houseGap: "Δεν καλύπτονται όλα τα σπίτια",
  },
} as const;

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayISO() {
  return toISODate(new Date());
}

function parseISO(iso: string) {
  return new Date(`${iso}T12:00:00`);
}

function addDays(iso: string, n: number) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

function mondayOf(iso: string) {
  const d = parseISO(iso);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return toISODate(d);
}

function parseDayParam(raw: string | null) {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const d = parseISO(raw);
  return Number.isNaN(d.getTime()) ? null : raw;
}

function loc(lang: Lang) {
  return lang === "el" ? "el-GR" : "de-DE";
}

function blockLabel(id: string, lang: Lang) {
  const b = BLOCKS.find((x) => x.id === id);
  return b ? b[lang] : id;
}

function issueText(issue: PlanIssue, lang: Lang) {
  const code = issue.code || "";
  const msg = (issue.message || "").toLowerCase();
  if (code === "double_book" || msg.includes("overlapping") || msg.includes("double")) return COPY[lang].doubleBook;
  if (code === "house_gap" || msg.includes("houses have coverage") || msg.includes("house_gap")) return COPY[lang].houseGap;
  return issue.message;
}

export default function PlanPage() {
  return (
    <Suspense fallback={<main className="page">{t("loading")}</main>}>
      <PlanPageInner />
    </Suspense>
  );
}

function PlanPageInner() {
  const { ready } = useRequireMode("staff");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayParam = parseDayParam(searchParams.get("day"));
  const [lang, setLang] = useState<Lang>("de");
  const [start, setStart] = useState(() => mondayOf(dayParam || todayISO()));
  const [days, setDays] = useState<Day[]>([]);
  const [selected, setSelected] = useState(() => dayParam || todayISO());
  const [activity, setActivity] = useState("Betreuung");
  const [block, setBlock] = useState("morning");
  const [composerOpen, setComposerOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [pin, setPin] = useState("");
  const [warn, setWarn] = useState("");
  const [needPin, setNeedPin] = useState(false);
  const [error, setError] = useState("");
  const [houses, setHouses] = useState<House[]>([]);
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [houseIds, setHouseIds] = useState<string[]>([]);
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<PlanEntry | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const copy = COPY[lang];

  useEffect(() => {
    setLang(getStoredLang());
  }, []);

  useEffect(() => {
    if (!dayParam) return;
    setSelected(dayParam);
    setStart(mondayOf(dayParam));
  }, [dayParam]);

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

  async function load(weekStart = start) {
    setError("");
    try {
      const data = await api<{ days: Day[] }>(`/api/schedule/week?start=${weekStart}`);
      const next = data.days || [];
      setDays(next);
      setSelected((cur) => (next.some((d) => d.date === cur) ? cur : next[0]?.date || cur));
    } catch (e) {
      setError((e as Error).message || copy.loadFail);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    loadMeta().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    setLoading(true);
    load(start).catch(console.error);
  }, [ready, start]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", composerOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [composerOpen, detail]);

  const day = useMemo(() => days.find((d) => d.date === selected) || days[0], [days, selected]);

  function toggleId(list: string[], id: string, setter: (v: string[]) => void) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function openComposer(nextBlock?: string, nextDate?: string) {
    if (nextDate) setSelected(nextDate);
    if (nextBlock) setBlock(nextBlock);
    setWarn("");
    setNeedPin(false);
    setPin("");
    setOverrideReason("");
    setComposerOpen(true);
  }

  function closeComposer() {
    if (busy) return;
    setComposerOpen(false);
    setWarn("");
    setNeedPin(false);
    setPin("");
    setOverrideReason("");
  }

  function shiftWeek(delta: number) {
    setStart((s) => addDays(s, delta));
    setSelected((s) => addDays(s, delta));
  }

  function goToday() {
    const iso = todayISO();
    setStart(mondayOf(iso));
    setSelected(iso);
    if (dayParam) router.replace("/plan");
  }

  async function addEntry(e: FormEvent, force = false) {
    e.preventDefault();
    if (!day || busy) return;
    if (!houseIds.length) {
      setWarn(copy.needHouse);
      return;
    }
    if (!employeeIds.length) {
      setWarn(copy.needStaff);
      return;
    }
    if (needPin && !pin.trim()) {
      setWarn(copy.pinPh);
      return;
    }
    setBusy(true);
    setWarn("");
    try {
      const body: Record<string, unknown> = {
        date: day.date,
        block,
        activity,
        houseIds,
        employeeIds,
        force,
        overrideReason: overrideReason.trim(),
      };
      if (pin.trim()) body.pin = pin.trim();
      await api("/api/schedule/entry", { method: "POST", body: JSON.stringify(body) });
      setOverrideReason("");
      setPin("");
      setNeedPin(false);
      setWarn("");
      await load(start);
    } catch (err) {
      const er = err as ApiErr;
      const detail = er.data?.detail;
      const issues = detail?.issues || [];
      const code = detail?.code || "";
      if (code === "pin_required") {
        setNeedPin(true);
        setWarn(issues.map((i) => issueText(i, lang)).join(" · ") || detail?.error || copy.pinPh);
      } else {
        setWarn(issues.map((i) => issueText(i, lang)).join(" · ") || detail?.error || er.message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function cancelEntry() {
    if (!detail || busy) return;
    setBusy(true);
    setError("");
    try {
      const body: Record<string, unknown> = { entryId: detail.id, reason: cancelReason.trim() };
      if (pin.trim()) body.pin = pin.trim();
      await api("/api/schedule/cancel", { method: "POST", body: JSON.stringify(body) });
      setDetail(null);
      setCancelReason("");
      setPin("");
      await load(start);
    } catch (e) {
      const er = e as ApiErr;
      const code = er.data?.detail?.code || "";
      if (code === "pin_required") {
        setNeedPin(true);
        setError(er.data?.detail?.error || copy.pinPh);
      } else {
        setError(er.message || copy.cancelFail);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  const houseName = (id: string) => houses.find((h) => h.id === id)?.name || id;
  const staffName = (id: string) => staff.find((p) => p.id === id)?.name || id;
  const locale = loc(lang);
  const showList = days.length > 0;

  return (
    <>
      <PageShell
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        actions={
          <>
            <button className="btn-sec" type="button" data-testid="week-prev" onClick={() => shiftWeek(-7)}>
              ←
            </button>
            <button className="btn-sec" type="button" data-testid="week-today" onClick={goToday}>
              {copy.today}
            </button>
            <button className="btn-sec" type="button" data-testid="week-next" onClick={() => shiftWeek(7)}>
              →
            </button>
          </>
        }
      >
        {error && (
          <p className="warn" role="alert">
            {error}
          </p>
        )}

        {loading && !days.length && <LoadingBlock label={copy.loading} />}

        {showList && (
          <div className="day-strip" data-tour="tour-plan" role="tablist" aria-label={copy.weekDays}>
            {days.map((d) => {
              const dt = parseISO(d.date);
              const on = d.date === (day?.date || selected);
              return (
                <button
                  key={d.date}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`day-chip ${on ? "on" : ""}`}
                  data-testid={`plan-day-${d.date}`}
                  onClick={() => setSelected(d.date)}
                >
                  <span>{dt.toLocaleDateString(locale, { weekday: "short" })}</span>
                  <strong>{dt.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" })}</strong>
                </button>
              );
            })}
          </div>
        )}

        {showList && day && (
          <div className="list-panel">
            <div className="list-sticky">
              <span>
                {parseISO(day.date).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span>
                {day.entries.filter((e) => !e.cancelled).length} {copy.active}
              </span>
            </div>
            {day.issues?.length > 0 &&
              day.issues.map((issue, i) => (
                <div key={i} className="list-row is-warn">
                  <div className="list-row__main">
                    <div className="list-row__title">{copy.conflict}</div>
                    <div className="list-row__meta">{issueText(issue, lang)}</div>
                  </div>
                </div>
              ))}
            {BLOCKS.map((b) => {
              const entries = day.entries.filter((e) => e.block === b.id && !e.cancelled);
              return (
                <div key={b.id}>
                  <div className="list-sticky" style={{ top: 36, background: "var(--card)" }}>
                    <span>{b[lang]}</span>
                    <span>{entries.length || "—"}</span>
                  </div>
                  {entries.length ? (
                    entries.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        className="list-row"
                        onClick={() => {
                          setNeedPin(false);
                          setPin("");
                          setDetail(e);
                        }}
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
                        <span aria-hidden>→</span>
                      </button>
                    ))
                  ) : (
                    <button type="button" className="list-row" onClick={() => openComposer(b.id, day.date)}>
                      <div className="list-row__meta">{copy.free}</div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && !days.length && (
          <EmptyState
            title={copy.emptyTitle}
            hint={error || copy.emptyHint}
            action={
              <button className="btn-sec" type="button" onClick={() => load(start)}>
                {copy.retry}
              </button>
            }
          />
        )}

        <div className="sticky-footer">
          <button className="btn w-full" type="button" onClick={() => openComposer()} disabled={busy}>
            {copy.add}
          </button>
        </div>

        {showList && (
          <div className="week-scroll hidden md:block mt-4">
            <div className="week-grid">
              <div className="week-head">{copy.block}</div>
              {days.map((d) => {
                const dt = parseISO(d.date);
                const on = d.date === (day?.date || selected);
                return (
                  <button
                    key={d.date}
                    type="button"
                    className={`week-head w-full text-left ${on ? "on" : ""}`}
                    onClick={() => setSelected(d.date)}
                  >
                    <div className="uppercase text-[var(--muted)]">{dt.toLocaleDateString(locale, { weekday: "short" })}</div>
                    <div className="text-sm text-[var(--sea)]">
                      {dt.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </div>
                  </button>
                );
              })}
              {BLOCKS.map((b) => (
                <div key={b.id} className="contents">
                  <div className="week-cell font-semibold">{b[lang]}</div>
                  {days.map((d) => {
                    const rows = d.entries.filter((e) => e.block === b.id && !e.cancelled);
                    return (
                      <div key={d.date + b.id} className="week-cell">
                        {rows.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            className="mb-1 w-full rounded bg-[var(--pine-tint)] px-1 py-0.5 text-left text-xs"
                            onClick={() => {
                              setNeedPin(false);
                              setPin("");
                              setDetail(e);
                            }}
                          >
                            {e.activity}
                          </button>
                        ))}
                        {!rows.length && (
                          <button type="button" className="muted text-xs w-full text-left" onClick={() => openComposer(b.id, d.date)}>
                            —
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </PageShell>

      {composerOpen && day && (
        <div className="more-overlay" role="presentation" onClick={closeComposer}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>
                {copy.newEntry} · {parseISO(day.date).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })}
              </h2>
              <button type="button" className="more-sheet-close" aria-label={copy.close} onClick={closeComposer}>
                ✕
              </button>
            </header>
            <form className="stack" onSubmit={(e) => addEntry(e, false)}>
              <label>
                {copy.block}
                <select value={block} onChange={(e) => setBlock(e.target.value)}>
                  {BLOCKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b[lang]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {copy.activity}
                <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder={copy.activity} data-testid="plan-activity" />
              </label>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="text-sm font-semibold">{copy.houses}</legend>
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
                  {!houses.length && <span className="muted text-sm">{copy.noHouses}</span>}
                </div>
              </fieldset>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="text-sm font-semibold">{copy.staff}</legend>
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
                  {!staff.length && <span className="muted text-sm">{copy.noStaff}</span>}
                </div>
              </fieldset>
              <input type="hidden" value={day.date} data-testid="plan-date" readOnly />
              <button className="btn" type="submit" data-testid="plan-save" disabled={busy}>
                {t("save", lang)}
              </button>
              <button className="btn-sec" type="button" onClick={closeComposer} disabled={busy}>
                {t("cancel", lang)}
              </button>
              {warn && (
                <div className="stack">
                  <p className="warn">{warn}</p>
                  <label>
                    {copy.reason}
                    <input
                      placeholder={copy.overridePh}
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      data-testid="plan-override"
                    />
                  </label>
                  {needPin && (
                    <label>
                      {copy.pin}
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder={copy.pinPh}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        data-testid="plan-pin"
                      />
                    </label>
                  )}
                  <button
                    className="btn-sec"
                    type="button"
                    data-testid="plan-force"
                    onClick={(ev) => addEntry(ev, true)}
                    disabled={!overrideReason.trim() || (needPin && !pin.trim()) || busy}
                  >
                    {copy.force}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.activity}</h2>
              <button type="button" className="more-sheet-close" aria-label={copy.close} onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-sm">
              {blockLabel(detail.block, lang)} · {detail.from}–{detail.to}
            </p>
            <p className="body-sm mt-2">
              {copy.houses}: {(detail.houseIds || []).map(houseName).join(", ") || "—"}
              <br />
              {copy.staff}: {(detail.employeeIds || []).map(staffName).join(", ") || "—"}
            </p>
            <label className="mt-3 block">
              {copy.cancelReason}
              <input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder={copy.cancelPh} data-testid="plan-cancel-reason" />
            </label>
            {needPin && (
              <label className="mt-2 block">
                {copy.pin}
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={copy.pinPh}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </label>
            )}
            <button className="btn mt-3 w-full" type="button" disabled={busy || (needPin && !pin.trim())} onClick={cancelEntry} data-testid="plan-cancel">
              {copy.cancelEntry}
            </button>
            <button className="btn-sec mt-2 w-full" type="button" disabled={busy} onClick={() => setDetail(null)}>
              {t("cancel", lang)}
            </button>
          </div>
        </div>
      )}

      <Dock />
      <GuidedTour />
    </>
  );
}
