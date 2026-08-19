"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Tab = "list" | "friday" | "supermarket" | "suggestions";
type House = { id: string; name: string };

type ListEntry = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  status?: string;
  fridayDate?: string;
  houseId?: string;
};

type ReorderItem = {
  houseId: string;
  houseName?: string;
  productId: string;
  name: string;
  qty: number;
  unit: string;
  stockQty?: number;
  parLevel?: number;
};

type OcrItem = { name: string; qty: number; unit: string };
type Suggestion = { key: string; score: number; houseId?: string };

const HOUSE_KEY = "armonia.activeHouse";

const COPY = {
  de: {
    eyebrow: "Liste",
    title: "Einkaufsliste",
    lead: "Liste, Freitag, Supermarkt, Vorschläge — Text einfügen prüfen, dann übernehmen.",
    houses: "Häuser",
    list: "Liste",
    friday: "Freitag",
    supermarket: "Im Supermarkt",
    suggestions: "Vorschläge",
    article: "Artikel",
    placeholder: "z.B. Reis",
    emptyList: "Liste leer",
    emptyFriday: "Freitagsliste leer",
    emptyMarket: "Nichts zum Einkaufen",
    emptySuggest: "Keine Vorschläge — Bestand ok.",
    hintList: "Starte mit einem Vorschlag, eigenem Eintrag oder Text einfügen.",
    hintFriday: "Artikel für den Einkauf am Freitag hinzufügen.",
    hintMarket: "Gekauft / fehlt markieren — dann erledigen.",
    modeOn: "Modus an",
    modeOff: "Modus aus",
    done: "Erledigt",
    finish: "Fertig",
    ocrTitle: "Text einfügen",
    ocrLabel: "Einkaufstext — eine Zeile pro Artikel (kein Kamera-Scan)",
    ocrHint: "Zeilen wie „Milch 2“ oder „2 kg Reis“ — erst Analysieren, dann Auf Liste übernehmen.",
    ocrParse: "Analysieren",
    ocrApply: "Auf Liste übernehmen",
    ocrEmpty: "Keine Zeilen erkannt — Text prüfen.",
    ocrNeedHouse: "Zuerst ein Haus wählen.",
    loadFail: "Liste konnte nicht geladen werden",
    addFail: "Hinzufügen fehlgeschlagen",
    noneHouse: "Kein Haus geladen.",
    fridayPrefix: "Freitag",
    stock: "Bestand",
    par: "Ziel",
    loadMore: "Mehr laden",
    showingOf: (shown: number, total: number) => `${shown} von ${total}`,
  },
  el: {
    eyebrow: "Λίστα",
    title: "Λίστα αγορών",
    lead: "Λίστα, Παρασκευή, σούπερ μάρκετ, προτάσεις — επικόλληση κειμένου, έλεγχος, εφαρμογή.",
    houses: "Σπίτια",
    list: "Λίστα",
    friday: "Παρασκευή",
    supermarket: "Στο σούπερ μάρκετ",
    suggestions: "Προτάσεις",
    article: "Είδος",
    placeholder: "π.χ. ρύζι",
    emptyList: "Άδεια λίστα",
    emptyFriday: "Άδεια λίστα Παρασκευής",
    emptyMarket: "Τίποτα για αγορά",
    emptySuggest: "Χωρίς προτάσεις — το απόθεμα είναι εντάξει.",
    hintList: "Ξεκίνα με πρόταση, δικό σου είδος ή επικόλληση κειμένου.",
    hintFriday: "Πρόσθεσε είδη για την αγορά της Παρασκευής.",
    hintMarket: "Σήμανε αγοράστηκε / λείπει — μετά ολοκλήρωση.",
    modeOn: "Λειτουργία ενεργή",
    modeOff: "Λειτουργία κλειστή",
    done: "Έγινε",
    finish: "Τέλος",
    ocrTitle: "Επικόλληση κειμένου",
    ocrLabel: "Κείμενο λίστας — μία γραμμή ανά είδος (χωρίς κάμερα)",
    ocrHint: "Γραμμές όπως «Γάλα 2» ή «2 kg ρύζι» — πρώτα Ανάλυση, μετά Στη λίστα.",
    ocrParse: "Ανάλυση",
    ocrApply: "Στη λίστα",
    ocrEmpty: "Δεν αναγνωρίστηκαν γραμμές — έλεγξε το κείμενο.",
    ocrNeedHouse: "Διάλεξε πρώτα σπίτι.",
    loadFail: "Η λίστα δεν φορτώθηκε",
    addFail: "Η προσθήκη απέτυχε",
    noneHouse: "Δεν φορτώθηκε σπίτι.",
    fridayPrefix: "Παρασκευή",
    stock: "Απόθεμα",
    par: "Στόχος",
    loadMore: "Περισσότερα",
    showingOf: (shown: number, total: number) => `${shown} από ${total}`,
  },
} as const;

const SHOP_PAGE_SIZE = 30;

function readStoredHouse(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(HOUSE_KEY) || "";
}

function writeStoredHouse(id: string) {
  if (typeof window === "undefined" || !id) return;
  sessionStorage.setItem(HOUSE_KEY, id);
}

function pickHouseId(houses: House[], prev: string) {
  const stored = readStoredHouse();
  if (stored && houses.some((h) => h.id === stored)) return stored;
  if (prev && houses.some((h) => h.id === prev)) return prev;
  return houses[0]?.id || "";
}

export default function ShopPage() {
  const { ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [tab, setTab] = useState<Tab>("list");
  const [houses, setHouses] = useState<House[]>([]);
  const [houseId, setHouseId] = useState("");
  const [entries, setEntries] = useState<ListEntry[]>([]);
  const [fridayDate, setFridayDate] = useState("");
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [name, setName] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [ocrDraft, setOcrDraft] = useState<OcrItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shopVisible, setShopVisible] = useState(SHOP_PAGE_SIZE);
  const [msg, setMsg] = useState("");
  const [supermarketMode, setSupermarketMode] = useState(false);

  const c = COPY[lang];
  const canAct = !busy;
  const houseName = (id?: string) => houses.find((h) => h.id === id)?.name || id || "";

  const tabs: { id: Tab; label: string }[] = [
    { id: "list", label: c.list },
    { id: "friday", label: c.friday },
    { id: "supermarket", label: c.supermarket },
    { id: "suggestions", label: c.suggestions },
  ];

  async function loadHouses() {
    const data = await api<{ houses: House[] }>("/api/stock/snapshot");
    const next = data.houses || [];
    setHouses(next);
    setHouseId((prev) => {
      const id = pickHouseId(next, prev);
      if (id) writeStoredHouse(id);
      return id;
    });
  }

  async function loadList() {
    const data = await api<{ entries: ListEntry[] }>("/api/shop/list");
    setEntries(data.entries || []);
    const s = await api<{ suggestions: Suggestion[] }>("/api/shop/suggestions");
    setSuggestions(s.suggestions || []);
  }

  async function loadFriday() {
    const data = await api<{ entries: ListEntry[]; fridayDate: string }>("/api/shop/friday");
    setEntries(data.entries || []);
    setFridayDate(data.fridayDate || "");
  }

  async function loadSupermarket() {
    const data = await api<{ entries: ListEntry[]; supermarketMode: boolean }>("/api/shop/supermarket");
    setEntries(data.entries || []);
    setSupermarketMode(Boolean(data.supermarketMode));
  }

  async function loadSuggestions() {
    const data = await api<{ items: ReorderItem[] }>("/api/shop/reorder-suggestions");
    setReorderItems(data.items || []);
  }

  async function load() {
    setError("");
    try {
      if (tab === "friday") await loadFriday();
      else if (tab === "supermarket") await loadSupermarket();
      else if (tab === "suggestions") await loadSuggestions();
      else await loadList();
    } catch (e) {
      setError((e as Error).message || c.loadFail);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    loadHouses().catch(() => setError(c.noneHouse));
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    setLoading(true);
    load().catch(console.error);
  }, [ready, tab]);

  function selectHouse(id: string) {
    setHouseId(id);
    writeStoredHouse(id);
  }

  async function ensureHouse(preferred?: string): Promise<string> {
    if (preferred && houses.some((h) => h.id === preferred)) return preferred;
    if (houseId && houses.some((h) => h.id === houseId)) return houseId;
    const data = await api<{ houses: House[] }>("/api/stock/snapshot");
    const next = data.houses || [];
    if (next.length) setHouses(next);
    if (preferred && next.some((h) => h.id === preferred)) {
      setHouseId(preferred);
      writeStoredHouse(preferred);
      return preferred;
    }
    const id = pickHouseId(next, houseId);
    if (id) {
      setHouseId(id);
      writeStoredHouse(id);
    }
    return id;
  }

  async function add(n?: string, friday = false, hid?: string) {
    const value = (n || name).trim();
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      const house = await ensureHouse(hid);
      if (!house) {
        setError(c.ocrNeedHouse);
        return;
      }
      const path = friday ? "/api/shop/friday/add" : "/api/shop/add";
      await api(path, { method: "POST", body: JSON.stringify({ name: value, qty: 1, houseId: house }) });
      setName("");
      await load();
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  async function done(id: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/shop/done", { method: "POST", body: JSON.stringify({ entryId: id }) });
      await load();
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: "open" | "bought" | "missing") {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/shop/status", { method: "POST", body: JSON.stringify({ entryId: id, status }) });
      await load();
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  async function toggleSupermarketMode() {
    if (busy) return;
    const next = !supermarketMode;
    setBusy(true);
    setError("");
    try {
      await api("/api/shop/supermarket/mode", {
        method: "POST",
        body: JSON.stringify({ enabled: next }),
      });
      setSupermarketMode(next);
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  async function parseOcr() {
    const text = ocrText.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const data = await api<{ items: OcrItem[] }>("/api/shop/ocr", {
        method: "POST",
        body: JSON.stringify({ text: ocrText }),
      });
      const items = data.items || [];
      setOcrDraft(items);
      if (!items.length) setError(c.ocrEmpty);
    } catch (e) {
      setOcrDraft([]);
      setError((e as Error).message || c.ocrEmpty);
    } finally {
      setBusy(false);
    }
  }

  async function applyOcr() {
    if (!ocrDraft.length || busy) return;
    setBusy(true);
    setError("");
    try {
      const house = await ensureHouse();
      if (!house) {
        setError(c.ocrNeedHouse);
        return;
      }
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({
          items: ocrDraft.map((item) => ({
            houseId: house,
            name: item.name,
            qty: item.qty,
            unit: item.unit,
          })),
        }),
      });
      setOcrText("");
      setOcrDraft([]);
      setMsg(`${ocrDraft.length} ${c.list}`);
      setTab("list");
      await loadList();
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  async function applyReorder(item: ReorderItem) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({ items: [item] }),
      });
      await loadSuggestions();
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  async function applyAllReorder() {
    if (!reorderItems.length || busy) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({ items: reorderItems }),
      });
      await loadSuggestions();
    } catch (e) {
      setError((e as Error).message || c.addFail);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
        <div data-tour="tour-shop">
          {houses.length > 0 && (
            <div className="seg-bar" aria-label={c.houses}>
              {houses.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`btn-sec ${houseId === h.id ? "ring-2 ring-[var(--brand)]" : ""}`}
                  disabled={busy}
                  onClick={() => selectHouse(h.id)}
                >
                  {h.name}
                </button>
              ))}
            </div>
          )}

          <div className="seg-bar" role="tablist" aria-label={c.title}>
            {tabs.map((tdef) => (
              <button
                key={tdef.id}
                type="button"
                role="tab"
                aria-selected={tab === tdef.id}
                className={`btn-sec ${tab === tdef.id ? "ring-2 ring-[var(--brand)]" : ""}`}
                disabled={busy}
                onClick={() => { setTab(tdef.id); setShopVisible(SHOP_PAGE_SIZE); }}
              >
                {tdef.label}
              </button>
            ))}
          </div>

          {error && (
            <p className="warn" role="alert">
              {error}
            </p>
          )}
          {msg && <p className="muted text-sm">{msg}</p>}

          {tab === "list" && suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className="btn-sec !min-h-9 text-sm"
                  disabled={!canAct}
                  onClick={() => add(s.key, false, s.houseId)}
                >
                  ＋ {s.key}
                </button>
              ))}
            </div>
          )}

          {tab !== "suggestions" && tab !== "supermarket" && (
            <div className="list-panel mt-3">
              <div className="list-row" style={{ cursor: "default", flexWrap: "wrap", gap: 8 }}>
                <input
                  className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] px-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Reis"
                  aria-label={c.article}
                  disabled={busy}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") add(undefined, tab === "friday");
                  }}
                />
                <button className="btn" type="button" disabled={busy} onClick={() => add(undefined, tab === "friday")}>
                  {t("add", lang)}
                </button>
              </div>
            </div>
          )}

          {tab === "supermarket" && (
            <div className="list-panel mt-3">
              <div className="list-sticky">
                <span>{t("supermarket", lang)}</span>
                <button
                  className="btn-sec"
                  type="button"
                  style={{ minHeight: 36, fontSize: "0.75rem" }}
                  disabled={busy}
                  onClick={toggleSupermarketMode}
                  data-testid="supermarket-mode"
                >
                  {supermarketMode ? c.modeOn : c.modeOff}
                </button>
              </div>
              <div className="list-row" style={{ cursor: "default" }}>
                <div className="list-row__meta">{c.hintMarket}</div>
              </div>
            </div>
          )}

          {tab === "list" && (
            <section className="list-panel mt-3" aria-labelledby="shop-ocr-title">
              <div className="list-sticky">
                <span id="shop-ocr-title">{c.ocrTitle}</span>
              </div>
              <div className="stack p-3">
                <label className="muted m-0 text-sm" htmlFor="shop-ocr-text">
                  {c.ocrLabel}
                </label>
                <p className="muted m-0 text-sm">{c.ocrHint}</p>
                <textarea
                  id="shop-ocr-text"
                  data-testid="shop-ocr-text"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3 py-2"
                  rows={4}
                  value={ocrText}
                  disabled={busy}
                  onChange={(e) => setOcrText(e.target.value)}
                  placeholder={"Milch 2\nReis 1 kg\n3 Eier"}
                />
                <div className="row gap-2">
                  <button
                    className="btn-sec"
                    type="button"
                    data-testid="shop-ocr-parse"
                    disabled={busy || !ocrText.trim()}
                    onClick={parseOcr}
                  >
                    {c.ocrParse}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    data-testid="shop-ocr-apply"
                    disabled={busy || !ocrDraft.length}
                    onClick={applyOcr}
                  >
                    {c.ocrApply} {ocrDraft.length ? `(${ocrDraft.length})` : ""}
                  </button>
                </div>
                {ocrDraft.length > 0 && (
                  <ul className="m-0 space-y-1 text-sm">
                    {ocrDraft.map((item, i) => (
                      <li key={`${item.name}-${i}`}>
                        {item.qty} {item.unit} — {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {tab === "friday" && fridayDate && <p className="muted mt-3 text-sm">{c.fridayPrefix}: {fridayDate}</p>}

          {tab === "suggestions" && reorderItems.length > 0 && (
            <button className="btn mt-4 w-full" type="button" disabled={busy} onClick={applyAllReorder}>
              {t("reorderAll", lang)}
            </button>
          )}

          <div className="list-panel mt-3">
            {loading ? (
              <LoadingBlock label={t("loading", lang)} />
            ) : tab === "suggestions" ? (
              reorderItems.length ? (
                reorderItems.map((item) => (
                  <div key={`${item.houseId}:${item.productId}`} className="list-row is-warn" style={{ cursor: "default" }}>
                    <div className="list-row__main">
                      <div className="list-row__title">{item.name}</div>
                      <div className="list-row__meta">
                        {item.houseName || houseName(item.houseId)} · {c.stock} {item.stockQty ?? 0} · {c.par} {item.parLevel ?? 2}
                      </div>
                    </div>
                    <div className="list-row__trail">
                      <span className="list-row__qty">{item.qty}</span>
                      <button className="btn-sec" type="button" disabled={busy} onClick={() => applyReorder(item)}>
                        {t("toList", lang)}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title={c.emptySuggest} />
              )
            ) : entries.length ? (
              <>
              {entries.length > SHOP_PAGE_SIZE && (
                <div className="list-sticky">
                  <span className="muted text-xs">{c.showingOf(Math.min(shopVisible, entries.length), entries.length)}</span>
                </div>
              )}
              {entries.slice(0, shopVisible).map((e) => (
                <div
                  key={e.id}
                  className={`list-row ${e.status === "missing" ? "is-gap" : e.status === "bought" ? "is-warn" : ""}`}
                  style={{ cursor: "default" }}
                >
                  <div className="list-row__main">
                    <div className="list-row__title">{e.name}</div>
                    <div className="list-row__meta">
                      {e.qty} {e.unit}
                      {e.houseId ? ` · ${houseName(e.houseId)}` : ""}
                      {e.status && e.status !== "open"
                        ? ` · ${e.status === "bought" ? t("bought", lang) : e.status === "missing" ? t("missing", lang) : e.status}`
                        : ""}
                    </div>
                  </div>
                  <div className="list-row__trail">
                    {tab === "supermarket" ? (
                      <>
                        <button
                          className={`btn-sec ${e.status === "bought" ? "ring-2 ring-[var(--brand)]" : ""}`}
                          type="button"
                          disabled={busy}
                          onClick={() => setStatus(e.id, "bought")}
                        >
                          {t("bought", lang)}
                        </button>
                        <button
                          className={`btn-sec ${e.status === "missing" ? "ring-2 ring-[var(--brand)]" : ""}`}
                          type="button"
                          disabled={busy}
                          onClick={() => setStatus(e.id, "missing")}
                        >
                          {t("missing", lang)}
                        </button>
                        <button className="btn-sec" type="button" disabled={busy} onClick={() => done(e.id)}>
                          {c.finish}
                        </button>
                      </>
                    ) : (
                      <button className="btn-sec" type="button" disabled={busy} onClick={() => done(e.id)}>
                        {c.done}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {shopVisible < entries.length && (
                <div className="p-3 text-center">
                  <button type="button" className="btn-sec" onClick={() => setShopVisible((n) => n + SHOP_PAGE_SIZE)}>
                    {c.loadMore} ({entries.length - shopVisible})
                  </button>
                </div>
              )}
              </>
            ) : (
              <EmptyState
                title={tab === "friday" ? c.emptyFriday : tab === "supermarket" ? c.emptyMarket : c.emptyList}
                hint={tab === "friday" ? c.hintFriday : c.hintList}
              />
            )}
          </div>
        </div>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
