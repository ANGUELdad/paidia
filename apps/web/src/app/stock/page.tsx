"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Product = { id: string; name: { de: string; el?: string }; unit: string; parLevel?: number };
type House = { id: string; name: string };

const DEFAULT_PAR = 2;

function productName(p: Product, lang: Lang) {
  return (lang === "el" && p.name.el ? p.name.el : p.name.de) || p.name.de || p.id;
}

export default function StockPage() {
  const { ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [houses, setHouses] = useState<House[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [revision, setRevision] = useState(0);
  const [houseId, setHouseId] = useState("h1");
  const [filter, setFilter] = useState<"all" | "low">("all");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [parDraft, setParDraft] = useState("");

  async function load() {
    setError("");
    try {
      const data = await api<{
        houses: House[];
        products: Product[];
        stock: Record<string, number>;
        revision?: number;
      }>("/api/stock/snapshot");
      setHouses(data.houses);
      setProducts(data.products);
      setStock(data.stock);
      setRevision(Number(data.revision || 0));
      if (data.houses?.length) {
        setHouseId((prev) => (data.houses.some((h) => h.id === prev) ? prev : data.houses[0].id));
      }
    } catch (e) {
      setError((e as Error).message || "Lager konnte nicht geladen werden");
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

  const rows = useMemo(() => {
    return products
      .map((p) => {
        const qty = Number(stock[`${houseId}:${p.id}`] || 0);
        const par = p.parLevel ?? DEFAULT_PAR;
        return { product: p, qty, par, low: qty <= par };
      })
      .filter((row) => (filter === "low" ? row.low : true));
  }, [products, stock, houseId, filter]);

  const lowItems = useMemo(() => rows.filter((r) => r.low), [rows]);
  const detail = detailId ? products.find((p) => p.id === detailId) : null;
  const detailQty = detail ? Number(stock[`${houseId}:${detail.id}`] || 0) : 0;
  const detailPar = detail ? detail.parLevel ?? DEFAULT_PAR : DEFAULT_PAR;

  useEffect(() => {
    if (detail) setParDraft(String(detail.parLevel ?? DEFAULT_PAR));
  }, [detailId, detail?.parLevel]);

  async function adjust(productId: string, dir: "IN" | "OUT") {
    setBusy(true);
    setError("");
    try {
      const r = await api<{ revision?: number }>("/api/stock/adjust", {
        method: "POST",
        body: JSON.stringify({
          houseId,
          productId,
          dir,
          qty: 1,
          reason: dir === "OUT" ? "Verbrauch" : "Lieferung",
          expectedRevision: revision,
        }),
      });
      if (typeof r.revision === "number") setRevision(r.revision);
      await load();
    } catch (e) {
      const err = e as Error & { status?: number };
      setError(err.message || "Anpassung fehlgeschlagen");
      if (String(err.message).includes("parallel") || err.status === 409) await load();
    } finally {
      setBusy(false);
    }
  }

  async function savePar(e: FormEvent) {
    e.preventDefault();
    if (!detail) return;
    const parLevel = Number(parDraft);
    if (!Number.isFinite(parLevel) || parLevel < 0) {
      setError("Zielmenge ungültig");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api("/api/stock/par", {
        method: "POST",
        body: JSON.stringify({ productId: detail.id, parLevel, expectedRevision: revision }),
      });
      setMsg(`${productName(detail, lang)}: Ziel ${parLevel}`);
      await load();
    } catch (err) {
      setError((err as Error).message || "Ziel speichern fehlgeschlagen");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function addToList(product: Product, qty?: number) {
    const par = product.parLevel ?? DEFAULT_PAR;
    const current = Number(stock[`${houseId}:${product.id}`] || 0);
    const need = qty ?? Math.max(1, par - current);
    setBusy(true);
    try {
      await api("/api/shop/add", {
        method: "POST",
        body: JSON.stringify({
          houseId,
          productId: product.id,
          name: productName(product, lang),
          qty: need,
          unit: product.unit,
        }),
      });
      setMsg(`${productName(product, lang)} auf die Liste`);
    } catch (e) {
      setError((e as Error).message || "Liste fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  async function reorderAll() {
    if (!lowItems.length) return;
    setBusy(true);
    try {
      await api("/api/shop/reorder-apply", {
        method: "POST",
        body: JSON.stringify({
          items: lowItems.map(({ product, qty, par }) => ({
            houseId,
            productId: product.id,
            name: productName(product, lang),
            qty: Math.max(1, par - qty),
            unit: product.unit,
          })),
        }),
      });
      setMsg(`${lowItems.length} Artikel auf die Liste`);
    } catch (e) {
      setError((e as Error).message || "Nachbestellung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  async function signOff() {
    setBusy(true);
    setError("");
    try {
      const today = new Date().toISOString().slice(0, 10);
      const counts: Record<string, number> = {};
      products.forEach((p) => {
        counts[p.id] = Number(stock[`${houseId}:${p.id}`] || 0);
      });
      await api("/api/stock/check", {
        method: "POST",
        body: JSON.stringify({ houseId, date: today, notes: "Lager-Check", counts }),
      });
      setMsg("Lager-Check gespeichert");
    } catch (e) {
      setError((e as Error).message || "Check fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  return (
    <>
      <PageShell eyebrow={t("navLager", lang)} title={t("stockTitle", lang)} lead={lang === "el" ? "Αγγίξτε στοιχείο · λεπτομέρειες στο φύλλο" : "Liste tippen · Ziel & Menge im Detail · Check unten."}>
        <div data-tour="tour-stock">
          <div className="seg-bar" aria-label={lang === "el" ? "Σπίτια" : "Häuser"}>
            {houses.map((h) => (
              <button
                key={h.id}
                type="button"
                className={`btn-sec ${houseId === h.id ? "ring-2 ring-[var(--brand)]" : ""}`}
                aria-current={houseId === h.id ? "true" : undefined}
                onClick={() => setHouseId(h.id)}
              >
                {h.name}
              </button>
            ))}
          </div>
          <div className="seg-bar">
            <button type="button" className={`btn-sec ${filter === "all" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("all")}>
              {t("stockAll", lang)}
            </button>
            <button type="button" className={`btn-sec ${filter === "low" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("low")}>
              {t("stockLow", lang)} ({lowItems.length})
            </button>
          </div>
          {error && (
            <p className="warn" role="alert">
              {error}
            </p>
          )}
          {msg && <p className="muted text-sm">{msg}</p>}

          <div className="list-panel">
            <div className="list-sticky">
              <span>Artikel · rev {revision}</span>
              <span>Menge</span>
            </div>
            {rows.map(({ product: p, qty, par, low }) => (
              <button
                key={p.id}
                type="button"
                className={`list-row ${low ? "is-warn" : ""}`}
                onClick={() => setDetailId(p.id)}
                data-testid={`stock-row-${p.id}`}
              >
                <div className="list-row__main">
                  <div className="list-row__title">{productName(p, lang)}</div>
                  <div className="list-row__meta">
                    Ziel {par} {p.unit}
                    {low ? " · nachbestellen" : ""}
                  </div>
                </div>
                <div className="list-row__trail" onClick={(ev) => ev.stopPropagation()}>
                  <button
                    className="btn-sec"
                    type="button"
                    style={{ minWidth: 44 }}
                    aria-label="Abgang"
                    disabled={busy}
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
                    aria-label="Zugang"
                    disabled={busy}
                    onClick={() => adjust(p.id, "IN")}
                  >
                    ＋
                  </button>
                  <span aria-hidden className="muted">
                    →
                  </span>
                </div>
              </button>
            ))}
            {loading ? (
              <div className="list-row" style={{ cursor: "default" }} data-testid="stock-loading">
                <div className="list-row__meta">{t("loading", lang)}</div>
              </div>
            ) : !rows.length ? (
              <div className="list-row" style={{ cursor: "default" }} data-testid="stock-empty">
                <div className="list-row__meta">{lang === "el" ? "Κανένα αντικείμενο σε αυτό το φίλτρο." : "Keine Artikel in diesem Filter."}</div>
              </div>
            ) : null}
          </div>

          <div className="sticky-footer">
            {lowItems.length > 0 && (
              <button className="btn-sec flex-1" type="button" disabled={busy} onClick={reorderAll}>
                {t("reorderAll", lang)}
              </button>
            )}
            <button className="btn flex-1" type="button" disabled={busy} onClick={signOff}>
              {lang === "el" ? "Ολοκλήρωση ελέγχου" : "Check abschließen"}
            </button>
          </div>
        </div>
      </PageShell>

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetailId(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{productName(detail, lang)}</h2>
              <button type="button" className="more-sheet-close" aria-label={lang === "el" ? "Κλείσιμο" : "Schließen"} onClick={() => setDetailId(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-sm m-0">
              {houses.find((h) => h.id === houseId)?.name || houseId} · {lang === "el" ? "Απόθεμα" : "Bestand"} {detailQty} {detail.unit} · {t("stockPar", lang)} {detailPar}
            </p>
            <div className="row gap-2 mt-3">
              <button className="btn-sec flex-1" type="button" disabled={busy} onClick={() => adjust(detail.id, "OUT")}>
                − {lang === "el" ? "Εξερχόμενο" : "Abgang"}
              </button>
              <button className="btn flex-1" type="button" disabled={busy} onClick={() => adjust(detail.id, "IN")}>
                ＋ {lang === "el" ? "Εισερχόμενο" : "Zugang"}
              </button>
            </div>
            <button className="btn-sec w-full mt-2" type="button" disabled={busy} onClick={() => addToList(detail)}>
              {t("toList", lang)}
            </button>
            <form className="stack mt-3" onSubmit={savePar}>
              <label>
                {t("stockPar", lang)}
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={parDraft}
                  onChange={(e) => setParDraft(e.target.value)}
                  data-testid="stock-par"
                />
              </label>
              <button className="btn" type="submit" disabled={busy}>
                Ziel speichern
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
