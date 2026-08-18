"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Product = { id: string; name: { de: string; el?: string }; unit: string; parLevel?: number };
type House = { id: string; name: string };

const DEFAULT_PAR = 2;
const HOUSE_KEY = "armonia.activeHouse";

const COPY = {
  de: {
    eyebrow: "Lager",
    title: "Lager",
    lead: "Leer & niedrig zuerst · ± Menge · Ziel im Detail · Check unten.",
    houses: "Häuser",
    all: "Alle",
    low: "Niedrig",
    empty: "leer",
    items: "Artikel",
    qty: "Menge",
    par: "Ziel",
    reorder: "nachbestellen",
    out: "Abgang",
    inn: "Zugang",
    outLong: "− Abgang",
    inLong: "＋ Zugang",
    toList: "Auf Einkaufsliste",
    parLabel: "Zielmenge (par)",
    parSave: "Ziel speichern",
    parBad: "Zielmenge ungültig",
    close: "Schließen",
    noneFilter: "Keine niedrigen Bestände — Filter auf Alle.",
    noneHouse: "Kein Haus geladen.",
    noneProducts: "Keine Artikel im Lager.",
    loadFail: "Lager konnte nicht geladen werden",
    adjustFail: "Anpassung fehlgeschlagen",
    parFail: "Ziel speichern fehlgeschlagen",
    listFail: "Liste fehlgeschlagen",
    reorderFail: "Nachbestellung fehlgeschlagen",
    checkFail: "Check fehlgeschlagen",
    checkOk: "Lager-Check gespeichert",
    onList: "auf die Liste",
    nOnList: "Artikel auf die Liste",
    signOff: "Check abschließen",
  },
  el: {
    eyebrow: "Αποθήκη",
    title: "Αποθήκη",
    lead: "Άδειο & χαμηλό πρώτα · ± ποσότητα · στόχος στη λεπτομέρεια · έλεγχος κάτω.",
    houses: "Σπίτια",
    all: "Όλα",
    low: "Χαμηλά",
    empty: "άδειο",
    items: "Είδη",
    qty: "Ποσότητα",
    par: "Στόχος",
    reorder: "παραγγελία",
    out: "Έξοδος",
    inn: "Είσοδος",
    outLong: "− Έξοδος",
    inLong: "＋ Είσοδος",
    toList: "Στη λίστα",
    parLabel: "Στόχος (par)",
    parSave: "Αποθήκευση στόχου",
    parBad: "Άκυρος στόχος",
    close: "Κλείσιμο",
    noneFilter: "Δεν υπάρχουν χαμηλά αποθέματα — φίλτρο Όλα.",
    noneHouse: "Δεν φορτώθηκε σπίτι.",
    noneProducts: "Δεν υπάρχουν είδη στην αποθήκη.",
    loadFail: "Η αποθήκη δεν φορτώθηκε",
    adjustFail: "Η προσαρμογή απέτυχε",
    parFail: "Ο στόχος δεν αποθηκεύτηκε",
    listFail: "Η λίστα απέτυχε",
    reorderFail: "Η παραγγελία απέτυχε",
    checkFail: "Ο έλεγχος απέτυχε",
    checkOk: "Ο έλεγχος αποθήκης αποθηκεύτηκε",
    onList: "στη λίστα",
    nOnList: "είδη στη λίστα",
    signOff: "Lager-Check",
  },
} as const;

function productName(p: Product, lang: Lang) {
  return (lang === "el" && p.name.el ? p.name.el : p.name.de) || p.name.de || p.id;
}

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

export default function StockPage() {
  const { ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [houses, setHouses] = useState<House[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [revision, setRevision] = useState(0);
  const [houseId, setHouseId] = useState("");
  const [filter, setFilter] = useState<"all" | "low">("all");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [parDraft, setParDraft] = useState("");

  const c = COPY[lang];

  async function load() {
    setError("");
    try {
      const data = await api<{
        houses: House[];
        products: Product[];
        stock: Record<string, number>;
        revision?: number;
      }>("/api/stock/snapshot");
      const nextHouses = data.houses || [];
      setHouses(nextHouses);
      setProducts(data.products || []);
      setStock(data.stock || {});
      setRevision(Number(data.revision || 0));
      setHouseId((prev) => {
        const next = pickHouseId(nextHouses, prev);
        if (next) writeStoredHouse(next);
        return next;
      });
    } catch (e) {
      setError((e as Error).message || c.loadFail);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    load().catch(console.error);
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", !!detailId);
    return () => document.body.classList.remove("sheet-open");
  }, [detailId]);

  const allRows = useMemo(() => {
    if (!houseId) return [];
    const locale = lang === "el" ? "el" : "de";
    return products
      .map((p) => {
        const qty = Number(stock[`${houseId}:${p.id}`] || 0);
        const par = p.parLevel ?? DEFAULT_PAR;
        return { product: p, qty, par, low: qty <= par, empty: qty <= 0 };
      })
      .sort((a, b) => {
        const rank = (r: { empty: boolean; low: boolean }) => (r.empty ? 0 : r.low ? 1 : 2);
        const d = rank(a) - rank(b);
        if (d) return d;
        return productName(a.product, lang).localeCompare(productName(b.product, lang), locale);
      });
  }, [products, stock, houseId, lang]);

  const lowItems = useMemo(() => allRows.filter((r) => r.low), [allRows]);
  const emptyCount = useMemo(() => allRows.filter((r) => r.empty).length, [allRows]);
  const rows = filter === "low" ? lowItems : allRows;
  const detail = detailId ? products.find((p) => p.id === detailId) : null;
  const detailQty = detail && houseId ? Number(stock[`${houseId}:${detail.id}`] || 0) : 0;
  const detailPar = detail ? detail.parLevel ?? DEFAULT_PAR : DEFAULT_PAR;
  const canAct = !busy;

  useEffect(() => {
    if (detail) setParDraft(String(detail.parLevel ?? DEFAULT_PAR));
  }, [detailId, detail?.parLevel]);

  function selectHouse(id: string) {
    setHouseId(id);
    writeStoredHouse(id);
    setDetailId(null);
  }

  async function ensureHouse(): Promise<string> {
    if (houseId && houses.some((h) => h.id === houseId)) return houseId;
    const data = await api<{ houses: House[] }>("/api/stock/snapshot");
    const next = data.houses || [];
    if (next.length) setHouses(next);
    const id = pickHouseId(next, houseId);
    if (id) {
      setHouseId(id);
      writeStoredHouse(id);
    }
    return id;
  }

  async function adjust(productId: string, dir: "IN" | "OUT") {
    if (busy) return;
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const hid = await ensureHouse();
      if (!hid) {
        setError(c.noneHouse);
        return;
      }
      const r = await api<{ revision?: number }>("/api/stock/adjust", {
        method: "POST",
        body: JSON.stringify({
          houseId: hid,
          productId,
          dir,
          qty: 1,
          reason: dir === "OUT" ? c.out : c.inn,
          expectedRevision: revision,
        }),
      });
      if (typeof r.revision === "number") setRevision(r.revision);
      await load();
    } catch (e) {
      const err = e as Error & { status?: number };
      setError(err.message || c.adjustFail);
      if (String(err.message).includes("parallel") || err.status === 409) await load();
    } finally {
      setBusy(false);
    }
  }

  async function savePar(e: FormEvent) {
    e.preventDefault();
    if (!detail || busy) return;
    const parLevel = Number(parDraft);
    if (!Number.isFinite(parLevel) || parLevel < 0) {
      setError(c.parBad);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await api<{ revision?: number }>("/api/stock/par", {
        method: "POST",
        body: JSON.stringify({ productId: detail.id, parLevel, expectedRevision: revision }),
      });
      if (typeof r.revision === "number") setRevision(r.revision);
      setMsg(`${productName(detail, lang)}: ${c.par} ${parLevel}`);
      await load();
    } catch (err) {
      setError((err as Error).message || c.parFail);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function addToList(product: Product, qty?: number) {
    if (busy) return;
    const hid = houseId || (await ensureHouse());
    if (!hid) {
      setError(c.noneHouse);
      return;
    }
    const par = product.parLevel ?? DEFAULT_PAR;
    const current = Number(stock[`${hid}:${product.id}`] || 0);
    const need = qty ?? Math.max(1, par - current);
    setBusy(true);
    setError("");
    try {
      await api("/api/shop/add", {
        method: "POST",
        body: JSON.stringify({
          houseId: hid,
          productId: product.id,
          name: productName(product, lang),
          qty: need,
          unit: product.unit,
        }),
      });
      setMsg(`${productName(product, lang)} ${c.onList}`);
    } catch (e) {
      setError((e as Error).message || c.listFail);
    } finally {
      setBusy(false);
    }
  }

  async function reorderAll() {
    if (busy || !lowItems.length) return;
    setBusy(true);
    setError("");
    try {
      const hid = await ensureHouse();
      if (!hid) {
        setError(c.noneHouse);
        return;
      }
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({
          items: lowItems.map(({ product, qty, par }) => ({
            houseId: hid,
            productId: product.id,
            name: productName(product, lang),
            qty: Math.max(1, par - qty),
            unit: product.unit,
          })),
        }),
      });
      setMsg(`${lowItems.length} ${c.nOnList}`);
    } catch (e) {
      setError((e as Error).message || c.reorderFail);
    } finally {
      setBusy(false);
    }
  }

  async function signOff() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const hid = await ensureHouse();
      if (!hid) {
        setError(c.noneHouse);
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const counts: Record<string, number> = {};
      products.forEach((p) => {
        counts[p.id] = Number(stock[`${hid}:${p.id}`] || 0);
      });
      await api("/api/stock/check", {
        method: "POST",
        body: JSON.stringify({ houseId: hid, date: today, notes: "Lager-Check", counts }),
      });
      setMsg(c.checkOk);
      await load();
    } catch (e) {
      setError((e as Error).message || c.checkFail);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
        <div data-tour="tour-stock">
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
          <div className="seg-bar">
            <button
              type="button"
              className={`btn-sec ${filter === "all" ? "ring-2 ring-[var(--brand)]" : ""}`}
              disabled={busy}
              onClick={() => setFilter("all")}
            >
              {c.all}
            </button>
            <button
              type="button"
              className={`btn-sec ${filter === "low" ? "ring-2 ring-[var(--brand)]" : ""}`}
              disabled={busy}
              onClick={() => setFilter("low")}
            >
              {c.low} ({lowItems.length}
              {emptyCount ? ` · ${emptyCount} ${c.empty}` : ""})
            </button>
          </div>
          {error && (
            <p className="warn" role="alert">
              {error}
            </p>
          )}
          {msg && <p className="muted text-sm">{msg}</p>}

          {loading && !products.length ? (
            <LoadingBlock label={t("loading", lang)} />
          ) : !houses.length || !houseId ? (
            <EmptyState title={c.noneHouse} hint={c.loadFail} />
          ) : !products.length ? (
            <EmptyState title={c.noneProducts} />
          ) : (
            <div className="list-panel">
              <div className="list-sticky">
                <span>
                  {c.items} · rev {revision}
                </span>
                <span>{c.qty}</span>
              </div>
              {rows.map(({ product: p, qty, par, low, empty }) => (
                <div key={p.id} className={`list-row ${empty ? "is-gap" : low ? "is-warn" : ""}`} data-testid={`stock-row-${p.id}`}>
                  <div
                    className="list-row__main"
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetailId(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDetailId(p.id);
                      }
                    }}
                  >
                    <div className="list-row__title">{productName(p, lang)}</div>
                    <div className="list-row__meta">
                      {c.par} {par} {p.unit}
                      {empty ? ` · ${c.empty}` : low ? ` · ${c.reorder}` : ""}
                    </div>
                  </div>
                  <div className="list-row__trail">
                    <button
                      className="btn-sec"
                      type="button"
                      style={{ minWidth: 44 }}
                      aria-label={c.out}
                      disabled={!canAct}
                      onClick={() => adjust(p.id, "OUT")}
                    >
                      −
                    </button>
                    <span className="list-row__qty">
                      {qty}
                      <span className="muted text-xs"> {p.unit}</span>
                    </span>
                    <button
                      className="btn"
                      type="button"
                      style={{ minWidth: 44 }}
                      disabled={busy}
                      onClick={() => adjust(p.id, "IN")}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              ))}
              {!rows.length ? (
                <EmptyState title={c.noneFilter} hint={c.lead} />
              ) : null}
            </div>
          )}

          <div className="sticky-footer">
            {lowItems.length > 0 && (
              <button className="btn-sec flex-1" type="button" disabled={!canAct} onClick={reorderAll}>
                {t("reorderAll", lang)}
              </button>
            )}
            <button
              className="btn flex-1"
              type="button"
              disabled={busy || !products.length}
              aria-label="Check abschließen / Lager-Check"
              onClick={signOff}
            >
              {c.signOff}
            </button>
          </div>
        </div>
      </PageShell>

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetailId(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{productName(detail, lang)}</h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setDetailId(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-sm m-0">
              {houses.find((h) => h.id === houseId)?.name || houseId} · {c.qty} {detailQty} {detail.unit} · {c.par} {detailPar}
            </p>
            <div className="row gap-2 mt-3">
              <button className="btn-sec flex-1" type="button" disabled={!canAct} onClick={() => adjust(detail.id, "OUT")}>
                {c.outLong}
              </button>
              <button className="btn flex-1" type="button" disabled={!canAct} onClick={() => adjust(detail.id, "IN")}>
                {c.inLong}
              </button>
            </div>
            <button className="btn-sec w-full mt-2" type="button" disabled={!canAct} onClick={() => addToList(detail)}>
              {c.toList}
            </button>
            <form className="stack mt-3" onSubmit={savePar}>
              <label>
                {c.parLabel}
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={parDraft}
                  disabled={busy}
                  onChange={(e) => setParDraft(e.target.value)}
                  data-testid="stock-par"
                />
              </label>
              <button className="btn" type="submit" disabled={!canAct}>
                {c.parSave}
              </button>
            </form>
          </div>
        </div>
      )}

      <Dock />
      <GuidedTour />
    </>
  );
}
